const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const app = express();

app.get('/link', async (req, res) => {
  const { link, apn, isi } = req.query;

  // トラッキングデータを保存
  await db.collection('clicks').add({
    link,
    userAgent: req.headers['user-agent'],
    timestamp: new Date()
  });

  // リダイレクト処理
  if (req.headers['user-agent'].includes('Android') && apn) {
    res.redirect(`intent://${link}#Intent;package=${apn};end`);
  } else if (req.headers['user-agent'].includes('iPhone') && isi) {
    res.redirect(`https://apps.apple.com/app/id${isi}`);
  } else {
    res.redirect(link);
  }
});

// Firebase Functionsとしてエクスポート
exports.redirectServer = functions.https.onRequest(app);
