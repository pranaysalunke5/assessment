const authResolvers = require('./auth');
const fileResolvers = require('./file');
const documentResolvers = require('./document');

module.exports = {
  Query: {
    ...authResolvers.Query,
    ...documentResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...fileResolvers.Mutation,
    ...documentResolvers.Mutation
  }
};
