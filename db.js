import sqlite3 from 'sqlite3';
import R from 'ramda';

const DB_NAME = 'wm_classified.db';

/**
 * sqlite database wrapper
 */
export default class DB {

  constructor() {
    this.db = new sqlite3.Database(DB_NAME);
  }

  /**
   * @param {String} semester
   * @param {String} list - `posts` or `requests`
   */
  get(semester, list) {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM ${list}_${semester}`, [], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.map(r => {
            r.emails = JSON.parse(r.emails);
            return r;
          }));
        }
      });
    });
  }

  /**
   * @param {String} semester
   */
  getPosts(semester) {
    return this.get(semester, 'posts');
  }

  /**
   * @param {String} semester
   */
  getRequests(semester) {
    return this.get(semester, 'requests');
  }

  /**
   * @param opts
   * @param {String} opts.semester
   * @param {String} opts.courseId
   * @param {String} opts.email
   * @param {String} list - `posts` or `requests`
   */
  add(opts, list) {
    let { semester, courseId, email } = opts;
    return new Promise((resolve, reject) => {
      const tableName = `${list}_${semester}`;
      this.db.get(`SELECT * FROM ${tableName} WHERE courseId = '${courseId}'`, [], (err, data) => {
        if (err) {
          reject(err);
        }
        if (data) { // course is not already posted
          let emails = JSON.parse(data.emails);
          emails.push(email); // TO DO: check for duplicates
          emails = JSON.stringify(emails);
          this.db.run(`UPDATE ${tableName} SET emails = '${emails}' WHERE courseId = '${courseId}'`, [], (e) => {
            if (e) {
              reject(e);
            } else {
              resolve();
            }
          });
        } else {
          let emails = JSON.stringify([ email ]);
          this.db.run(`INSERT INTO ${tableName} VALUES ('${courseId}', '${emails}')`, [], (e) => {
            if (e) {
              reject.log(e);
            } else {
              resolve();
            }
          });
        }
      });
    });
  }

  /**
   * @param opts
   * @param {String} opts.semester
   * @param {String} opts.courseId
   * @param {String} opts.email
   */
  addPost(opts) {
    return this.add(opts, 'posts');
  }

  /**
   * @param opts
   * @param {String} opts.semester
   * @param {String} opts.courseId
   * @param {String} opts.email
   */
  addRequest(opts) {
    return this.add(opts, 'requests');
  }

  /**
   * @param opts
   * @param {String} opts.semester
   * @param {String} opts.courseId
   * @param {String} opts.email
   * @param {String} list - `posts` or `requests`
   */
  destroy(opts, list) {
    let { semester, courseId, email } = opts;
    return new Promise((resolve, reject) => {
      const tableName = `${list}_${semester}`;
      this.db.get(`SELECT * FROM ${tableName} WHERE courseId = '${courseId}'`, [], (err, data) => {
        if (err) {
          return reject(err);
        }
        let emails = JSON.parse(data.emails);
        if (emails.length === 1) {
          this.db.run(`DELETE FROM ${tableName} WHERE courseId = '${courseId}'`, [], (e) => {
            if (e) { reject(e); } else { resolve(); }
          });
        } else {
          emails = JSON.stringify(R.without([email], emails));
          this.db.run(`UPDATE ${tableName} SET emails = '${emails}' WHERE courseId = '${courseId}'`, [], (e) => {
            if (e) { reject(e); } else { resolve(); }
          });
        }
      });
    });
  }

  /**
   * @param opts
   * @param {String} opts.semester
   * @param {String} opts.courseId
   * @param {String} opts.email
   */
  deletePost(opts) {
    return this.destroy(opts, 'posts');
  }

  /**
   * @param opts
   * @param {String} opts.semester
   * @param {String} opts.courseId
   * @param {String} opts.email
   */
  deleteRequest(opts) {
    return this.destroy(opts, 'requests');
  }
}
