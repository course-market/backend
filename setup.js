import sqlite3 from 'sqlite3';

const DB_NAME = 'wm_classified.db';

var db = new sqlite3.Database(DB_NAME);

[
  'posts_spring_2016',
  'requests_spring_2016',
  'posts_fall_2015',
  'requests_fall_2015'
].forEach(l => {
  db.run(`CREATE TABLE ${l} (courseId text not null, emails text not null)`);
});
