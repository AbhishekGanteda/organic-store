import { validationResult } from 'express-validator';
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        return res.json({ errors: errors.array() });
    }
    next();
};
export default validateRequest;
//# sourceMappingURL=validate.middleware.js.map