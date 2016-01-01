import fs from 'fs';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Db from './db';
import errors from './errors';

var DB = new Db();
var app = express();

const FALL_2015 = 'fall_2015';
const SPRING_2016 = 'spring_2016';

const catalog = {
  [SPRING_2016]: JSON.parse(fs.readFileSync('./data/catalog_spring_2016.json')),
  [FALL_2015]: JSON.parse(fs.readFileSync('./data/catalog_fall_2015.json'))
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
    res.status(400).send(errors.SEMESTER_UNAVAILABLE);
  }
});

app.get('/posts/:semester', (req, res) => {
  DB.getPosts(req.params.semester)
    .then(data => res.send(data))
    .catch(e => res.status(400).send(e));
});

app.get('/requests/:semester', (req, res) => {
  DB.getRequests(req.params.semester)
    .then(data => res.send(data))
    .catch(e => res.status(400).send(e));
});

app.post('/post/submit/:semester', (req, res) => {
  let { semester } = req.params;
  let { courseId, email } = req.body;
  DB.addPost({ semester, courseId, email })
    .then(() => res.send('ok'))
    .catch(e => res.status(400).send(e));
});

app.post('/request/submit/:semester', (req, res) => {
  let { semester } = req.params;
  let { courseId, email } = req.body;
  DB.addRequest({ semester, courseId, email })
    .then(() => res.send('ok'))
    .catch(e => res.status(400).send(e));
});

app.delete('/post/delete/:semester/:courseId/:email', (req, res) => {
  DB.deletePost({ semester, courseId, email }) // eslint-disable-line no-undef
    .then(() => res.send('ok'))
    .catch(e => res.status(400).send(e));
});

app.delete('/request/delete/:semester/:courseId/:email', (req, res) => {
  DB.deleteRequest({ semester, courseId, email }) // eslint-disable-line no-undef
    .then(() => res.send('ok'))
    .catch(e => res.status(400).send(e));
});

var server = app.listen(8080, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`http://${host}:${port}`);
});
