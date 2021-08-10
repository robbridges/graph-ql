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
}

export default Mutation;