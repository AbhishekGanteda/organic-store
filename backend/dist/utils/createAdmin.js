import User from '../models/User.js';
const createAdminUser = async () => {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        return;
    }
    const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
        return;
    }
    await User.create({
        name: 'Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
    });
    console.log('Admin user created');
};
export default createAdminUser;
//# sourceMappingURL=createAdmin.js.map