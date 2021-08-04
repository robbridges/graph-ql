import  {GraphQLServer} from 'graphql-yoga';

//Type definitions
const typeDefs = `
  type Query {
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
  }
`

//Resolvers
const resolvers = {
  Query: {
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
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!');
})