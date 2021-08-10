
const Query = {
  users(parent, args, {db}, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    })
  },
  posts(parent, args, {db}, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      return (post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
    })
  },
  comments(parent, args, {db}, info) {
    return db.comments;
  },
  me() {
    return {
      id: '123098',
      name: 'Rob',
      email: 'Rob@admin.com',
      age: 33,
    }
  },
  post() {
    return {
      id: '241',
      title: 'My first post',
      body: 'This is my first post',
      published: true,
      
    }
  }
}

export default Query;