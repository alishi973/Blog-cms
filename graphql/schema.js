const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String
        content: String
        slug:String
        images: [String]
        likes: mutual
        view: mutual
        comments : [Comment]
        creator: User
        createdAt: String
        updatedAt: String
    }

    type mutualAction {
        mutual:Boolean
        result:Boolean!
        count:Int
    }
    type mutual {
        mutual:Boolean
        count:Int
    }

    type Comment {
        _id:ID!
        user:String
        text:String
        date:String
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


    input UserInputData {
        email:String!
        password:String!
        name:String!
        status:String
    }

    input PostInputData {
        title:String!
        content:String!
        images:[String]
    }

    input CommentInputData{
        text: String!
        onPost: ID!
        name: String
        refer_to: ID
    }

    input FindPost {
        slug:String
        id:ID
    }

    type RootQuery {
        login(email:String!  password:String!): AuthData!
        posts(page:Int): PostData!     
        post(search:FindPost): Post!
    }

    type RootMutation {
        signUp(user: UserInputData!): User!
        addPost(post: PostInputData): Post!
        likePost(id:String!): mutualAction!
        dislikePost(id:String!): mutualAction!
        addComment(comment: CommentInputData!): Boolean
        deleteComment(commentId:ID! onPost:ID!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

/* post(id:ID!): Post! */
