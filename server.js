import fs from 'fs';
import R from 'ramda';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
var app = express();

const FALL_2015 = 'fall_2015';
const SPRING_2016 = 'spring_2016';

const catalog = {
  [SPRING_2016]: JSON.parse(fs.readFileSync('./data/catalog_spring_2016.json')),
  [FALL_2015]: JSON.parse(fs.readFileSync('./data/catalog_fall_2015.json'))
};

var posts = {
  [SPRING_2016]: JSON.parse(fs.readFileSync('./data/posts_spring_2016.json')),
  [FALL_2015]: JSON.parse(fs.readFileSync('./data/posts_fall_2015.json'))
};

var requests = {
  [SPRING_2016]: JSON.parse(fs.readFileSync('./data/requests_spring_2016.json')),
  [FALL_2015]: JSON.parse(fs.readFileSync('./data/requests_fall_2015.json'))
};

const ERRORS = {
  SEMESTER_UNAVAILABLE: 'semester is not available'
};

// express middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/catalog/semesters', (req, res) => {
  res.send([ FALL_2015, SPRING_2016 ]);
});

app.get('/catalog/:semester', (req, res) => {
  let { semester } = req.params;
  if (semester in catalog) {
    res.send(catalog[semester]);
  } else {
    res.status(400).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
});

app.get('/posts/:semester', (req, res) => {
  let { semester } = req.params;
  if (semester in posts) {
    res.send(posts[semester]);
  } else {
    res.status(400).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
});

app.get('/requests/:semester', (req, res) => {
  let { semester } = req.params;
  if (semester in requests) {
    res.send(requests[semester]);
  } else {
    res.status(400).send(ERRORS.SEMESTER_UNAVAILABLE);
  }

});

app.post('/submit/post/:semester', (req, res) => {
  let { semester } = req.params;
  if (semester in posts) {
    var idx = R.findIndex(R.propEq('courseId', req.body.courseId))(posts[semester]);
    if (idx === -1) {
      posts[semester].push({ courseId: req.body.courseId, emails: [req.body.email] });
    } else {
      posts[semester].emails.push(req.body.email);
    }
    res.send('ok');
  } else {
    res.status(400).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
  // write new data to disk
  fs.writeFileSync(`./data/posts_${semester}.json`, JSON.stringify(posts[semester]));
});

app.post('/submit/request/:semester', (req, res) => {
  let { semester } = req.params;
  if (semester in posts) {
    var idx = R.findIndex(R.propEq('courseId', req.body.courseId))(requests[semester]);
    if (idx === -1) {
      requests[semester].push({ courseId: req.body.courseId, emails: [req.body.email] });
    } else {
      requests[semester].emails.push(req.body.email);
    }
    res.send('ok');
  } else {
    res.status(400).send(ERRORS.SEMESTER_UNAVAILABLE);
  }
  // write new data to disk
  fs.writeFileSync(`./data/requests_${semester}.json`, JSON.stringify(requests[semester]));
});


var server = app.listen(8080, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`http://${host}:${port}`);
});
