const { initializeApp, cert } = require("firebase-admin/app");

const serviceAccount = require("./serviceAccountKey.json");

const adminApp = initializeApp({
  credential: cert(serviceAccount),
});

module.exports = adminApp; 