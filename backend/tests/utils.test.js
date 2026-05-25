jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const createAdminUser = require('../utils/createAdmin');

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('token.generateToken', () => {
    it('signs jwt with expected payload and expiry', () => {
      process.env.JWT_SECRET = 'secret';
      jwt.sign.mockReturnValue('signed-token');

      const token = generateToken('u1');

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'u1' },
        'secret',
        { expiresIn: '7d' }
      );
      expect(token).toBe('signed-token');
    });
  });

  describe('createAdminUser', () => {
    it('returns without creating when admin env is missing', async () => {
      delete process.env.ADMIN_EMAIL;
      delete process.env.ADMIN_PASSWORD;

      await createAdminUser();

      expect(User.findOne).not.toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
    });

    it('creates admin when user does not exist', async () => {
      process.env.ADMIN_EMAIL = 'Admin@Gmail.com';
      process.env.ADMIN_PASSWORD = 'admin1234';
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: 'u1' });

      await createAdminUser();

      expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@gmail.com' });
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'admin@gmail.com',
        role: 'admin',
      }));
    });
  });
});
