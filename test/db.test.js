import Db from '../db';

var DB = new Db();

DB.addPost({
  semester: 'spring_2016',
  courseId: 'abc123',
  email: 'k@wm.edu'
});

DB.getPosts('spring_2016')
  .then(d => console.log(d))
  .catch(e => console.log(e));

