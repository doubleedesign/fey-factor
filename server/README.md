# The Fey Factor back-end data layer

The back-end is a GraphQL server built with [Yoga](https://the-guild.dev/graphql/yoga-server) because I need more practice with GraphQL. ¯\\_(ツ)_/¯

- [Development notes](#development)
  - [Generating schema and types](#generating-schema-and-types)
  - [Adding fields](#adding-fields)
  - [Generating resolver skeletons](#generating-resolver-skeletons)
  - [Troubleshooting](#troubleshooting)
- [Miscellaneous notes](#miscellaneous-notes)

---
## Running locally

Install dependencies:
```bash
npm install
```

Run dev mode (uses [Nodemon](https://www.npmjs.com/package/nodemon) to watch for changes):
```bash
npm run dev
```

Check that the GraphQL playground is running at http://localhost:4000/graphql and run a test query such as:
```graphql
query TestQuery {
  Person(id: 56323) {
    name
    degree
  }
}
```

To automatically launch the GraphQL playground upon server launch, comment out the line for it in `index.ts`. (Word of warning: This will relaunch in a new tab every time Nodemon detects a change as it has no way of knowing it's already open.)

---
## Development

### Generating schema and types

I have created a script to generate TypeScript types and GraphQL schema from the database which should be run on fresh installs or if the database schema is changed.
```bash
npm run generate:schema
```
Under the hood, this:
1. uses [pg-to-ts](https://www.npmjs.com/package/pg-to-ts) to do an initial generation of TypeScript interfaces from the database schema,
2. does a manual find-and-replace for some known table name to entity name discrepancies (largely around the database tables being named as plurals like "people" and "roles" but because the code will refer to individual items, I want the types to be "person" and "role"), and
3. does some manual processing of the types to create the matching definitions for GraphQL schema, and writes them to a separate file.
    - This includes assessing foreign keys in the database tables and adding fields to the GraphQL schema to allow for querying related data.

The generated files can then be found in `./src/generated`.

Fields not included in the database schema should be added in the `src/types.ts` file to be included in the generated schema.

### Adding fields

As mentioned [above](#1-data-builder), the database schema is intentionally minimal, with a focus on raw data and low redundancy. What is not included in the database (whether explicitly or at all) includes:

- fields that are calculated or derived from the data in the database
- fields for data that is fetched from an external source (e.g., TMDB API).

To add a field to the GraphQL schema that doesn't belong in the database, add it to the `src/types.ts` file and re-run the generator.

### Generating resolver skeletons

I have also created a script to generate skeletons/templates for resolvers based on the generated schema and likely function names.

It skips any types that already have a resolver file, so it can be run when adding new types without overwriting existing resolvers.

**Note:** It also intentionally skips types from a manually set list - see `generate-resolver-skeleton.ts` to see and adjust this list if needed.

```bash
npm run generate:resolvers
```

### Troubleshooting

#### `Exception thrown about Punycode when running scripts on Node 21.`
- Change Node version to 20 LTS (`nvm use lts/iron`).

#### After deleting resolver files to re-create them, the script says it's created them and `existsSync` returns `true`, but the files aren't actually there. `unlinkSync` throws an error.
- Try killing all Node processes, restarting WSL, and/or restarting computer.

#### GraphQL errors on the front-end, but auth tokens/keys are correct
e.g., Requests to TMDB work in Postman with the same key.
- Go to http://localhost:4000/graphql. If Apollo appears instead of Yoga, proceed to the below step.

#### Apollo is running on port 4000 instead of Yoga and you don't know WTF is running Apollo

This one is very specific to me: It's probably Local by Flywheel running it. Close Local and try again.

You can check this in CMD. To get what's using the port:
```cmd
netstat -ano | findstr :4000
```
The numbers at the end of each result line are PIDs which you can trace them like so:
```cmd
tasklist | findstr <PID>
```
If a result is just `node`, try the next one. At the time of writing, the one listed for `0.0.0.0:4000` returns `node` but the one for `127.0.0.1:4000` returns `Local.exe`.

---
## Miscellaneous notes

- Watch provider data is automatically filtered for Australia before it's returned to the GraphQL client.
