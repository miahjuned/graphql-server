const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event')

require('dotenv').config()
const app = express();
app.use(bodyParser.json());


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
            return Event.find()
                    .then(events => {
                        return events.map(event => {
                            return{...event._doc };
                        })
                    })
                    .catch(err => {
                        throw err;
                    })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.evenInput.title,
                description: args.evenInput.description,
                price: +args.evenInput.price,
                date: new Date(args.evenInput.date)
            });
            return event.save()
                .then(result => {
                    console.log(result);
                    return {...result._doc };
                }).catch(err => {
                    console.log(err);
                    throw err;
                });
            
        },
    },
    graphiql: true
}))


app.get('/', (req, res, next) => {
    res.send("welcome backend again juned");
})


const port = process.env.PORT || 5000
app.listen(port, err => err ? console.log("Filed to Listen on Port" , port) : console.log("Listing for Port" , port));