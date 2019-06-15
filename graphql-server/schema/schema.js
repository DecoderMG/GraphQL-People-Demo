const graphql = require('graphql');
const axios = require('axios');

const restServerUrl = process.env.REST_API_URL ? process.env.REST_API_URL : 'http://localhost';
const restServerPort = process.env.REST_API_PORT ? process.env.REST_API_PORT : '3000';
const restUrl = `${restServerUrl}:${restServerPort}`;

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`${restUrl}/companies/${parentValue.id}/users`).then(
                    resp => resp.data
                );
            }
        }
    })
});

const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        profession: { type: GraphQLString },
        company: { 
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`${restUrl}/companies/${parentValue.companyId}`).then(
                    resp => resp.data
                )
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        person: {
            type: PersonType,
            args: { id: { type: GraphQLInt } },
            resolve(parentValue, args) {
                return axios.get(`${restUrl}/persons/${args.id}`).then(
                    resp => resp.data
                )
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLInt } },
            resolve(parentValue, args) {
                return axios.get(`${restUrl}/companies/${args.id}`).then(
                    resp => resp.data
                )
            }
        }
    }
});