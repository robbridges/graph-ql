const users = [{
  id: '1',
  name: "Rob",
  email: "Rob@example.com",
  age: 33
}, {
  id: '2',
  name: "Yamyam",
  email: "TotallyNotYamYam@example.com",
  
}, {
  id: '3',
  name: 'Ryann',
  email: "Ryan@example.com",
  age: 21
}];

const posts = [{
  id: '1',
  title: 'my first post',
  body: 'This is my first post',
  published: true,
  author: '3'
}, {
  id: '2',
  title: 'GraphQl basics',
  body: 'GraphQL is taking over.. here\'s why',
  published: true,
  author: '2'
  
}, {
  id: '3',
  title: 'GraphQL intermediate',
  body: 'After many hours, I\'ve learned that..',
  published: true,
  author: '1'
}]

const comments = [{
  id: '1',
  textField: 'this was a great post',
  author: '2',
  post: '1'
}, {
  id: '2',
  textField: 'Great work, this is interesting',
  author: '1',
  post: '1'
  
}, {
  id: '3',
  textField: 'Wow! I can\'t believe this',
  author: '2',
  post: '2',
}, {
  id: '4',
  textField: 'Great work man',
  author: '3',
  post: '3'
}]

const db = {
  users,
  posts,
  comments,
}

export default db;