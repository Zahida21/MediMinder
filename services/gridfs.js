const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

// Call this after mongoose connection is open
function initGridFS(conn) {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
}

function getGFS() {
  if (!gfs) throw new Error('GridFS not initialized');
  return gfs;
}

module.exports = { initGridFS, getGFS };
