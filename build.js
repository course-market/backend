'use strict';

var _catalog, _posts, _requests;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = (0, _express2.default)();

var FALL_2015 = 'fall_2015';
var SPRING_2016 = 'spring_2016';

var catalog = (_catalog = {}, _defineProperty(_catalog, SPRING_2016, JSON.parse(_fs2.default.readFileSync('./data/catalog_spring_2016.json'))), _defineProperty(_catalog, FALL_2015, JSON.parse(_fs2.default.readFileSync('./data/catalog_fall_2015.json'))), _catalog);

var posts = (_posts = {}, _defineProperty(_posts, SPRING_2016, JSON.parse(_fs2.default.readFileSync('./data/posts_spring_2016.json'))), _defineProperty(_posts, FALL_2015, JSON.parse(_fs2.default.readFileSync('./data/posts_fall_2015.json'))), _posts);

var requests = (_requests = {}, _defineProperty(_requests, SPRING_2016, JSON.parse(_fs2.default.readFileSync('./data/requests_spring_2016.json'))), _defineProperty(_requests, FALL_2015, JSON.parse(_fs2.default.readFileSync('./data/requests_fall_2015.json'))), _requests);

var ERRORS = {
  SEMESTER_UNAVAILABLE: 'semester is not available'
};

// express middleware
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());

app.get('/catalog/semesters', function (req, res) {
  res.send([FALL_2015, SPRING_2016]);
});

app.get('/catalog/:semester', function (req, res) {
  var semester = req.params.semester;

  if (semester in catalog) {
    res.send(catalog[semester]);
  } else {
    res.status(404).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
});

app.get('/posts/:semester', function (req, res) {
  var semester = req.params.semester;

  if (semester in posts) {
    res.send(posts[semester]);
  } else {
    res.status(404).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
});

app.get('/requests/:semester', function (req, res) {
  var semester = req.params.semester;

  if (semester in requests) {
    res.send(requests[semester]);
  } else {
    res.status(404).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
});

app.post('/submit/post/:semester', function (req, res) {
  var semester = req.params.semester;

  if (semester in posts) {
    var idx = _ramda2.default.findIndex(_ramda2.default.propEq('courseId', req.body.courseId))(posts[semester]);
    if (idx === -1) {
      posts[semester].push({ courseId: req.body.courseId, emails: [req.body.email] });
    } else {
      posts[semester].emails.push(req.body.email);
    }
    res.send('ok');
  } else {
    res.status(404).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
  // write new data to disk
  _fs2.default.writeFileSync('./data/posts_' + semester + '.json', JSON.stringify(posts[semester]));
});

app.post('/submit/request/:semester', function (req, res) {
  console.log(req.body);
  var semester = req.params.semester;

  if (semester in posts) {
    var idx = _ramda2.default.findIndex(_ramda2.default.propEq('courseId', req.body.courseId))(requests[semester]);
    if (idx === -1) {
      requests[semester].push({ courseId: req.body.courseId, emails: [req.body.email] });
    } else {
      requests[semester].emails.push(req.body.email);
    }
    res.send('ok');
  } else {
    res.status(404).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
  // write new data to disk
  _fs2.default.writeFileSync('./data/requests_' + semester + '.json', JSON.stringify(requests[semester]));
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('http://' + host + ':' + port);
});
