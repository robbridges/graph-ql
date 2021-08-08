import  {GraphQLServer} from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid'

//Demo user Data
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
    createUser(name: String!, email: String!, age: Int): User!
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
      const emailTaken = users.some((user) => user.email === args.email);
      if (emailTaken) {
        throw new Error('Email is taken');
      }
      
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age
      }
      
      users.push(user);

      return user;
    },
       
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!');
})