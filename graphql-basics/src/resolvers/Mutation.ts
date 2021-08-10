import { v4 as uuidv4 } from 'uuid'

const Mutation = {
  createUser(parent, args, {db}, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) {
      throw new Error('Email is taken');
    }
    
    const user = {
      id: uuidv4(),
      ...args.data
    }
    
    db.users.push(user);

    return user;
  },
  deleteUser(parent,args,{db},info) {
    const userIndex = db.users.findIndex((user) => {
      return user.id === args.id;
    });
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUser = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match =post.author === args.id

      if (match) {
        db.comments = db.comments.filter((comment) => {
          return comment.post !== post.id;
        });
      }

      return !match
    });

    db.comments = db.comments.filter((comment) => comment.author !== args.id)

    return deletedUser[0];

  },
  updateUser(parent,args,{db}, info) {
    const user = db.users.find((user) => user.id === args.id);

    if (!user) {
      throw new Error('user not found');
    }

    if (typeof args.data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === args.data.email) 
      
      if (emailTaken) {
         throw new Error('Email is taken');
      }
      
      user.email = args.data.email;
    }

    if (typeof args.data.name === 'string') {
      user.name = args.data.name;
    }

    if (typeof args.data.age !== 'undefined') {
      user.age = args.data.age;
    }

    return user;
  },
  createPost(parent, args, {db}, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User does not exist');
    }

    const post = {
      id: uuidv4(),
      ...args.data
    }

    db.posts.push(post);

    return post;
  },
  deletePost(parent, args, {db}, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id );

    if (postIndex === -1) {
      throw new Error('Post does not exist');
    }

    const deletedPost = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id)

    return deletedPost[0];
  },
  updatePost(parent, args, {db}, info) {
    const post = db.posts.find((post) => post.id === args.id);

    if (!post) {
      throw new Error('This post does not seem to exist..');
    }
    if (typeof args.data.title === 'string') {
      post.title = args.data.title;
    }
    if (typeof args.data.body === 'string') {
      post.body = args.data.body;
    }
    if (typeof args.data.published === 'boolean') {
      post.published = args.data.published;
    }

    return post;

  },
  createComment(parent, args, {db}, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some((post) => post.id === args.data.post && post.published );
    

    if (!userExists || !postExists) {
      throw new Error('Either user or post cannot be found, bad request');
    }
    

    const comment = {
      id: uuidv4(),
      ...args.data
    }

    db.comments.push(comment);
    return comment;
  },
  deleteComment(parent, args, {db}, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);
    
    const deletedComment = db.comments.splice(commentIndex, 1);

    db.comments = db.comments.filter((comment) => comment.id !== args.id)

    return deletedComment[0];
  },
  updateComment(parent, args, {db}, info) {
    const comment = db.comments.find((comment) => comment.id = args.id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof args.data.textField === 'string') {
      comment.textField = args.data.textField;
    }

    return comment;
  }
}

export default Mutation;