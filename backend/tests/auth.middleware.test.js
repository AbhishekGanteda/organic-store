jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../models/User', () => ({
  findById: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth.middleware');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('auth.middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = createRes();
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('protect', () => {
    it('returns 401 when authorization header is missing', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Not authorized, token missing');
    });

    it('returns 401 when token verification fails', async () => {
      req.headers.authorization = 'Bearer bad-token';
      jwt.verify.mockImplementation(() => {
        throw new Error('bad token');
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Not authorized, token failed');
    });

    it('returns 401 when user is not found', async () => {
      req.headers.authorization = 'Bearer ok-token';
      jwt.verify.mockReturnValue({ id: 'u1' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Not authorized, user not found');
    });

    it('attaches user and calls next for valid token', async () => {
      const user = { _id: 'u1', role: 'admin' };
      req.headers.authorization = 'Bearer ok-token';
      jwt.verify.mockReturnValue({ id: 'u1' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      });

      await protect(req, res, next);

      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalledWith(401);
    });
  });

  describe('admin', () => {
    it('allows request when user is admin', () => {
      req.user = { _id: 'u1', role: 'admin' };

      admin(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('returns 403 when user is not admin', () => {
      req.user = { _id: 'u1', role: 'user' };

      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Admin access required');
    });
  });
});
