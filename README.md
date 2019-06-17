### Introduction

This project is a basic project that can be used to demonstrate how GraphQL asyncronously performs CRUD against a RESTful API backend, similar to what you may find if you have a GraphQL proxy as the entry point to your microservice backend. It has also been structured to be useful for testing a multi-project CICD deployment from the monorepo.

### Project Structure

The project is split based on functionality and use case. Currently, the demo consists of two servers, a GraphQL Express server and a mock REST API server (Via JSON-Server). The GraphQL server is the main entry point via GraphiQL or other clients of your choice, allowing for direct CRUD operations against the REST server. The REST server acts as the data access layer with mock data provided via the db.json file. In it's current configuration, the REST server contains data that would relate to an employee inventory system.

### Running the demo

You can start the GraphQL server by simply running `$ npm run start` within the graphql-server folder. To start the REST server, simply run `$ json-server --watch db.json` within the rest-server folder. To use GraphiQL, if you're running locally, navigate to `http://localhost:4000/graphql` to see a web view of the tool.

### What you can do

Keeping in mind the goal of the project is to demo how GraphQL functions as a data query language (and testing a monorepo deployment) the functionality should not be overly complex or vast. As such, currently, you are able to perform simple CRUD operations against the REST server for people but not companies. This can be accomplished either, via the built in GraphiQL tool or any GraphQL enabled client you wish.
