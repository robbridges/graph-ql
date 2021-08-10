import  {GraphQLServer} from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid'

//Demo user Data
let users = [{
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

let posts = [{
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

let comments = [{
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

//Type definitions
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String):[Post!]!
    comments:[Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    textField: String!
    author: ID!
    post: ID!
  }

  

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    textField: String!
    author: User!
    post: Post!
  }
`

//Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        return (post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
      })
    },
    comments(parent, args, ctx, info) {
      return comments;
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
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comments)=> {
        return comments.post === parent.id;
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post)=> {
        return post.author === parent.id
      });
    },
    
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post
      });
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error('Email is taken');
      }
      
      const user = {
        id: uuidv4(),
        ...args.data
      }
      
      users.push(user);

      return user;
    },
    deleteUser(parent,args,ctx,info) {
      const userIndex = users.findIndex((user) => {
        return user.id === args.id;
      });
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUser = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match =post.author === args.id

        if (match) {
          comments = comments.filter((comment) => {
            return comment.post !== post.id;
          });
        }

        return !match
      });

      comments = comments.filter((comment) => comment.author !== args.id)

      return deletedUser[0];

    },

    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User does not exist');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      }

      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id );

      if (postIndex === -1) {
        throw new Error('Post does not exist');
      }

      const deletedPost = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id)

      return deletedPost[0];



    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some((post) => post.id === args.data.post && post.published );
      

      if (!userExists || !postExists) {
        throw new Error('Either user or post cannot be found, bad request');
      }
      

      const comment = {
        id: uuidv4(),
        ...args.data
      }

      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex((comment) => comment.id === args.id);
      
      const deletedComment = comments.splice(commentIndex, 1);

      comments = comments.filter((comment) => comment.id !== args.id)

      return deletedComment[0];
    },
       
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!!');
})