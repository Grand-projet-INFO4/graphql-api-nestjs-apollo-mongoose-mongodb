# GraphQL directory

This `graphql` directory is a special one because **it is not a NestJS module** but still we decided to group all the GraphQL related configuration and global pieces of code that sets up the GraphQL API.

Let's run through the responsibilities of each file inside this directory:

- `gql-config.service.ts`: This file contains a class that registers all the configuration values that NestJS's GraphQL driver needs to set up the GraphQL API. It takes **_the dataloader module_** as a dependancy in order to pass the dataloaders to the context.
- `generate-typings.ts`: This is a typescript file that serves as script that tells Node.js to watch and all the **_GraphQL schema files_** within the entire codebase and update **the exposed GraphQL schema** as well as **the generated typescript definitions from that schema**.
- `global.graphql`: This GraphQL schema file contains global GraphQL types and directives that should be included in the exposed schema. These are typically **_custom directives_** or **_custom scalars_** that we need to declare ahead of time so that the other GraphQL schema files can refer to them later.
- `schema.d.ts`: This typescript definitions file is where we output **the generated typescript definitions from the exposed GraphQL schema**. This file **MUST NOT BE EDITED**.
- `context.d.ts`: This typescript definitions file holds **the type definition of the GraphQL context**. It is very useful to isolate that type definition into its own file so that all resolvers can refer to it and provide a nice intellicense in the context parameter.
