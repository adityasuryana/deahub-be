const { Notification, User } = require('../models');

const isHRGAUser = (user) => {
  if (!user) return false;
  const dept = (user.department || '').trim().toUpperCase();
  const role = (user.role || '').trim().toUpperCase();
  return dept === 'HRGA' || role.includes('HRGA');
};

const getNotifications = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(200).json({ notifications: [] });
    }

    const notifications = await Notification.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOne({
      where: { id, userId: req.user.id }
    });
    if (!notif) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan' });
    }
    notif.isRead = true;
    await notif.save();
    res.status(200).json(notif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    res.status(200).json({ message: 'Semua notifikasi ditandai sudah dibaca' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.destroy({
      where: { id, userId: req.user.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan' });
    }
    res.status(200).json({ message: 'Notifikasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  isHRGAUser,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
