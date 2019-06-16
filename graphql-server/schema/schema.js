const graphql = require('graphql');
const axios = require('axios');

const restServerUrl = process.env.REST_API_URL ? process.env.REST_API_URL : 'http://localhost';
const restServerPort = process.env.REST_API_PORT ? process.env.REST_API_PORT : '3000';
const restUrl = `${restServerUrl}:${restServerPort}`;

const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
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
        people: {
            type: new GraphQLList(PersonType),
            resolve(parentValue, args) {
                return axios.get(`${restUrl}/companies/${parentValue.id}/people`).then(
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
                return axios.get(`${restUrl}/people/${args.id}`).then(
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

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPerson: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                profession: { type: GraphQLString },
                companyId: { type: GraphQLInt }
            },
            resolve(parentValue, { firstName, lastName }) {
                return axios.post(`${restUrl}/people`, { firstName, lastName }).then(
                    resp => resp.data
                );
            }
        },
        deletePerson: {
            type: PersonType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`${restUrl}/people/${id}`).then(
                    resp => resp.data
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
