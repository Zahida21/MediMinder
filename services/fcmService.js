// Placeholder for FCM push notification logic
const admin = require('firebase-admin');
// admin.initializeApp({ credential: admin.credential.cert(require('../config/fcmServiceAccount.json')) });

exports.sendReminder = async (user, medicineName, timeStr) => {
  // TODO: Implement FCM push logic
  console.log(`[FCM] Would send push to ${user.name} for ${medicineName} at ${timeStr}`);
};
