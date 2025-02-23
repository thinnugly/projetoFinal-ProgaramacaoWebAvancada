const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ 'auth.username': 'renatomuiambo24@admin.com' });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        const newAdmin = new User({
            name: 'Renato Madeia Muiambo',
            auth: {
                username: 'renatomuiambo24@admin.com',
                password: 'admin@admin',
                profile: 'admin',
            },
        });

        await newAdmin.save();
        console.log(`Admin user created successfully: ${newAdmin.auth.username}.`);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    }
};

module.exports = createAdminUser;
