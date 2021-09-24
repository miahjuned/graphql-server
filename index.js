const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.use(bodyParser.json());

// Graphql start 
app.use('/graphql', graphqlHTTP({
   
    schema: buildSchema(`
        type RootQuery {
            events: [String!]! 
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['test', 'again tester juned', 'first graphql', '2021']
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        },
    },
    graphiql: true
}))


app.get('/', (req, res, next) => {
    res.send("welcome backend again juned");
})

const port = process.env.PORT || 5000
app.listen(port, err => err ? console.log("Filed to Listen on Port" , port) : console.log("Listing for Port" , port));