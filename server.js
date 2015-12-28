import fs from 'fs';
import express from 'express';
import cors from 'cors';
var app = express();

app.use(cors());

app.get('/data', (req, res) => {
  fs.readFile('./data/spring.json', function(err, data) {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});

var server = app.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`http://${host}:${port}`);
});
