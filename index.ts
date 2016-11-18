import * as express from 'express';
import * as session from 'express-session';
import * as graphqlHTTP from 'express-graphql';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import {
    GraphQLSchema,
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLBoolean, 
    GraphQLNullableType, 
    GraphQLInputObjectType,
    GraphQLList
} from 'graphql';
import UserService from './src/service/user-service';
import RepoService from './src/service/repo-service';




mongoose.connect('mongodb://localhost/what-changed');
(<any>mongoose).Promise = bluebird

const app = express();

const RepoType = new GraphQLObjectType({
    name: 'repo',
    fields: {
        title: {
            type: GraphQLString
        },
        url: {
            type: GraphQLString
        },
        tags: {
            type: new GraphQLList(GraphQLString)
        },
        useDefault: {
            type: GraphQLBoolean
        },
        alternativeChangelog: {
            type: GraphQLString
        },
        changelog: {
            type: GraphQLString,
            resolve: (value) => {
                return RepoService.getChangeLog(value)
            }
        }
    }
});

const UserType = new GraphQLObjectType({
    name: 'user',
    fields: {
        username: {
            type: GraphQLString
        },
        useStarredRepo: {
            type: GraphQLBoolean
        },
        email: {
            type: GraphQLString
        },
        created: {
            type: GraphQLString
        },
        updated: {
            type: GraphQLString
        },
        repos: {
            type: new GraphQLList(RepoType)
        }
    }
});



const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
        username: {
            type: GraphQLString,
        },
        useStarredRepo: {
            type: GraphQLBoolean
        },
        email: {
            type: GraphQLString
        },
        created: {
            type: GraphQLString
        },
        updated: {
            type: GraphQLString
        }
    })
});

const MutationType = new GraphQLObjectType({
    name: 'mutations',
    description: 'What Change Mutations',
    fields: () => ({
        createUser: {
            type: UserType,
            description: 'Create a new user',
            args: {
                user: { type: UserInputType }
            },
            resolve: (value, {user}) => {
                return UserService
                    .createUser(user.username);
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            users: {
                type: new GraphQLList(UserType),
                resolve: function() {
                    return UserService.findUsers();
                }
            }
        }
    }),
    mutation: MutationType
});

app.use(session({ secret: 'what-changed', cookie: { maxAge: 6000 } }));


// app.get('/', function (req, res) {
//     github.activity.getStarredRepos({ per_page: 100 }, function (err, data) {
//         res.json(data);
//     });
// });

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

app.listen(3000);