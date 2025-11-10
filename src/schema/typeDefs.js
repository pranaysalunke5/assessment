const { gql } = require('apollo-server');

module.exports = gql`
  scalar Upload
  scalar JSON

  type User {
    id: ID!
    email: String!
    role: String!
    createdAt: String!
  }

  type FileMeta {
    id: ID!
    filename: String!
    url: String!
    mimeType: String
    size: Int
    uploadedBy: Int
    createdAt: String!
  }

  type Document {
    id: ID!
    title: String!
    html: String!
    pdfUrl: String
    ownerId: Int!
    createdAt: String!
  }

  type Query {
    me: User
    document(id: ID!): Document
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    register(email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!

    uploadFile(file: Upload!): FileMeta!
    createDocument(title: String!, templateData: JSON!): Document!
    sendDocumentByEmail(documentId: Int!, to: String!): Boolean!
  }
`;

