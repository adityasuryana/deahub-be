const { User } = require('../models');
const bcrypt = require('bcrypt');

const SAFE_USER_ATTRIBUTES = { exclude: ['password'] };

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: SAFE_USER_ATTRIBUTES });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const requester = await User.findByPk(req.user.id);
        const isAdmin = requester && (requester.role === 'Administrator' || requester.role === 'Admin');

        if (!isAdmin && Number(req.user.id) !== Number(id)) {
            return res.status(403).json({ message: 'Akses ditolak. Anda hanya dapat melihat profil sendiri.' });
        }

        const user = await User.findByPk(id, { attributes: SAFE_USER_ATTRIBUTES });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requester = await User.findByPk(req.user.id);
        const isAdmin = requester && (requester.role === 'Administrator' || requester.role === 'Admin');

        if (!isAdmin && Number(req.user.id) !== Number(id)) {
            return res.status(403).json({ message: 'Akses ditolak. Anda hanya dapat mengubah profil sendiri.' });
        }

        const { username, password, firstName, lastName, email, role, department } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only Administrator may modify role or department
        const updateData = { username, firstName, lastName, email };
        if (isAdmin) {
            if (role !== undefined) updateData.role = role;
            if (department !== undefined) updateData.department = department;
        }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await user.update(updateData);

        const safeUser = user.toJSON();
        delete safeUser.password;
        res.status(200).json(safeUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, getById, updateUser, deleteUser };
