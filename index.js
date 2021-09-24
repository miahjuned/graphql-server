const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express(); 

app.use(bodyParser.json());


let schema = buildSchema(`
    type Query {
        hello: String
        juned: String
    },
`);


let root ={
    hello: () => {
        return 'Hello this is test juned';
    },
    juned: () => {
        return 'Juned';
    },
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql:true,
}));






app.get('/', (req, res, next) => {
    res.send("welcome backend juned");
})

const port = process.env.PORT || 5000
app.listen(port, err => err ? console.log("Filed to Listen on Port" , port) : console.log("Listing for Port" , port));