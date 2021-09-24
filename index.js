const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// Global events for graphql
const events = [];
app.use(bodyParser.json());

//================= Graphql start =======================
app.use('/graphql', graphqlHTTP({
   
    schema: buildSchema(`
        
        type Event {
            _id: ID
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]! 
        }

        type RootMutation {
            createEvent(evenInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.evenInput.title,
                description: args.evenInput.description,
                price: +args.evenInput.price,
                date: args.evenInput.date
            };
            events.push(event);
            return event
            
        },
    },
    graphiql: true
}))


app.get('/', (req, res, next) => {
    res.send("welcome backend again juned");
})

const port = process.env.PORT || 5000
app.listen(port, err => err ? console.log("Filed to Listen on Port" , port) : console.log("Listing for Port" , port));