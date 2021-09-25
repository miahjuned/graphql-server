const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');

require('dotenv').config()

const graphQlSchema = require('./graphql/schema/schemaIndex');
const graphQlResolvers = require('./graphql/resolvers/resolversIndex');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

/************************ Mongoose uri credential *************************/
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7tcxm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log("uri", uri)

mongoose.connect(uri)
.then(() => {
    console.log('database connected');
})
.catch(err => {
    console.log(err)
})


const port = process.env.PORT || 5000
app.listen(port, err => err ? console.log("Filed to Listen on Port" , port) : console.log("Listing for Port" , port));