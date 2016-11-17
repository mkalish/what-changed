import * as express from 'express';
import * as session from 'express-session';
import * as graphqlHTTP from 'express-graphql';
import * as mongoose from 'mongoose';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
const GitHubApi = require('github');

const githubApiToken = '5c2397ab5bd2184a0b4667ae8928ecb63543cb31';



const github = new GitHubApi({});
github.authenticate({
    type: 'token',
    token: githubApiToken
});

mongoose.connect('mongodb://localhost/what-changed');

const app = express();


const test = new GraphQLObjectType({
    name: 'test',
    fields: {
        id: {
            type: GraphQLString
        }
    }
})

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            test: {
                type: test,
                resolve: function() {
                    return {
                        id: '123'
                    };
                }
            }
        }
    })
});

app.use(session({secret: 'what-changed', cookie: {maxAge: 6000}}));


app.get('/', function (req, res) {
    github.activity.getStarredRepos({ per_page: 100}, function(err, data) {
        res.json(data);
    });
});

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

app.listen(3000);