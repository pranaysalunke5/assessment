const express = require('express');
const path = require('path');

function createStaticServer(app) {
  const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(UPLOAD_DIR));
}

module.exports = { createStaticServer };
