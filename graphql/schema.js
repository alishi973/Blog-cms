const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        images: [String]!
        likes:[String]!
        comments : [Comment]!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type Comment {
        _id:ID!
        user:String!
        text:String!
        date:String!
        refer_to:ID
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
    }

    type AuthData {
        token: String!
        userId: String!
    }


    type UserInputData {
        email:String!
        password:String!
        name:String!
        status:Strign!
    }

    type PostInputData {
        title:String!
        content:String!
        images:[String!]!
    }

    type Query {
        login(email:String! ,password:String!): AuthData!
        posts(page:Int): PostData!
        post(id:ID!) Post
    }

    type Mutation {
        createNewUser(userInput: UserInputData!): User!
        createNewPost(postInput: PostInputData!): Post!
    }

    schema {
        query: Query
        mutation: Mutation
    }
`);
