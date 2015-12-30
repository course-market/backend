# WM Classified Backend
---

Server for [WM Classified](http://course-market.github.io/).

#API Endpoints

### `/catalog/semesters`

example:
```js
fetch(URL + '/catalog/semesters')
```

Response: an array of available semesters
example:
```js
[ 'fall_2015', spring_2016 ]
```

### `/catalog/:semester`

example:
```js
fetch(URL + '/catalog/spring_2016')
```

Response: an array of all courses for the given semester
example:
```js
[
  {
    status: "OPEN",
    attr: "  ",
    creditHours: "3",
    courseId: "MATH 311 01 ",
    meetTimes: "1300-1350",
    title: "Elementary Analysis",
    meetDays: "MWF ",
    currEnr: "23",
    instructor: "Humber, Cary",
    crn: "20232",
    seatsAvail: "2"
  },
  {
    status: "OPEN",
    attr: "MATO",
    creditHours: "3",
    courseId: "MATH 323 01 ",
    meetTimes: "0930-1050",
    title: "Intro Operations Research I",
    meetDays: "TR ",
    currEnr: "23",
    instructor: "Ninh, Anh",
    crn: "24060",
    seatsAvail: "12*"
  }
]
```

### `/posts/:semester`

Example:
```js
fetch(URL + '/posts/spring_2016')
```

Response: an array of posts for a given semester
example
```js
[
  {
    "courseId":"ANTH 150 01 ",
    "emails":[
      "d@wm.edu"
    ]
  },
  {
    "courseId":"APSC 401 01 ",
    "emails":[
      "d@wm.edu"
    ]
  }
]
```

### `/requests/:semester`

Example:
```js
fetch(URL + '/requests/spring_2016')
```

Response: an array of requests for a given semester
```js
[
  {
    "courseId":"ANTH 150 01 ",
    "emails":[
      "d@wm.edu"
    ]
  },
  {
    "courseId":"APSC 401 01 ",
    "emails":[
      "d@wm.edu"
    ]
  }
]
```

### `/submit/post/:semester`


### `/submit/request/:semester`



## Developing
Depends on a global install of [babel-cli](https://www.npmjs.com/package/babel-cli)
```
npm i -g babel-cli
```

For development, run:
```
npm install
npm start 
```
The server will be listening on port `8080`