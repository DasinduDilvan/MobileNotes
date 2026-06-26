const express = require('express');
const path = require('path');
const fs = require('fs');
const serverless = require('serverless-http');

const app = express();

const subjectFolderMap = {
  dbms: 'DBMS',
  'discrete-maths': 'discrete-maths',
  management: 'management',
  'fundamentals-of-management': 'management',
  'operating-systems': 'operating-systems',
  linux: 'linux',
  'system-programming-linux': 'linux',
  'web-development': 'web-development',
  web: 'web-development'
};

const subjectPageMap = {
  dbms: 'DBMS.html',
  'discrete-maths': 'discrete-maths.html',
  management: 'fundamentals-of-management.html',
  'fundamentals-of-management': 'fundamentals-of-management.html',
  'operating-systems': 'operating-systems.html',
  linux: 'system-programming-linux.html',
  'system-programming-linux': 'system-programming-linux.html',
  'web-development': 'web-develpment.html',
  web: 'web-develpment.html'
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express server is running' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'L1S2', 'index.html'));
});

app.get('/:subject', (req, res, next) => {
  const subject = req.params.subject.toLowerCase();
  const pageFile = subjectPageMap[subject];

  if (pageFile) {
    return res.sendFile(path.join(__dirname, '..', 'L1S2', pageFile));
  }

  next();
});

app.get('/:subject/:lesson', (req, res, next) => {
  const subject = req.params.subject.toLowerCase();
  const lessonParam = (req.params.lesson || '').replace(/\.html$/i, '');
  const lesson = lessonParam.toUpperCase();
  const folder = subjectFolderMap[subject];

  if (!folder) {
    return next();
  }

  const filePath = path.join(__dirname, '..', 'L1S2', folder, `${lesson}.html`);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  next();
});

app.use(express.static(path.join(__dirname, '..')));

app.use((req, res) => {
  res.status(404).send('Page not found');
});

module.exports = serverless(app);
module.exports.handler = serverless(app);
