#!/usr/bin/env node
// Node.js fallback wrapper for gunicorn command when deployed in Node environment
const path = require('path');
const fs = require('fs');

const cwdServer = path.join(process.cwd(), 'server.js');
const relServer = path.join(__dirname, '..', 'server.js');

if (fs.existsSync(cwdServer)) {
  require(cwdServer);
} else if (fs.existsSync(relServer)) {
  require(relServer);
} else {
  console.error('Could not locate server.js at', cwdServer);
  process.exit(1);
}
