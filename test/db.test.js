import Db from '../db';

var DB = new Db();

DB.getPosts('spring_2016')
  .then(d => console.log(d))
  .catch(e => console.log(e));

DB.addPost({
  semester: 'spring_2016',
  courseId: 'abc123',
  email: 'k@wm.edu'
})
  .catch(e => console.log(e));

DB.deletePost({
  semester: 'spring_2016',
  courseId: 'AMST 100 02 ',
  email: 'fasdfas@wm.edu'
})
  .catch(e => console.log(e));
