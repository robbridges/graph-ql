import  {GraphQLServer} from 'graphql-yoga';

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
  email: "Shescute@example.com",
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

//Type definitions
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String):[Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
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
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!');
})