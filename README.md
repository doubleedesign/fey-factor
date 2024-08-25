# The Fey Factor

A funsies project inspired by [Six Degrees of Kevin Bacon](https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon) but for finding and assessing live-action, scripted American<sup>1</sup> comedies based on their proximity and strength of connections to Tina Fey<sup>2</sup>.

## 1. Data Builder
This package contains a bunch of code that ultimately culminates in a collection of Node scripts run from a single console app to collect data from [The Movie Database API](https://developer.themoviedb.org/) starting from Tina Fey and collecting TV shows, movies, and people to the specified "degree of separation." **This is currently focused primarily on TV shows** - movies are limited to degree 1 (even that collects thousands) and movie data is not topped up after initial population; options only exist to top-up TV show data. 

The raw data is saved locally as JSON files in the `datasources/cache` folder. If a file is found, that data will be used instead of making an API request to TMDB, to keep API calls to a minimum. (However, these cached files are excluded from version control.)

This is fairly well tested in terms of functionality<sup>3</sup>, but the inclusion criteria are basic and so this should be considered a beta proof-of-concept. (Including every single person and continuing the tree results in too many people and works to be practical, but the current criteria are very arbitrary. I somewhat work around this using the scripts that "top up" data for a specified number of shows and for degree 2 people who would be degree 1 under looser criteria, but this is not a perfect solution.)

### Prerequisites
- [Node](https://nodejs.org)
- Postgres database server (the database itself is created by the script)
- [TMDB API key](https://developer.themoviedb.org/docs/getting-started)

### Setup
```bash
cd builder
npm install
```
- Postgres settings in `src/database/DatabaseConnection.ts`
- Custom logger speed in `src/common.ts`
- TMDB API key as `TMDB_AUTH_TOKEN` in `.env`.

### Usage
Ensure Postgres is running, and then run the interactive console script:
```bash
npm run start
```
For first run, arrow down to the "danger zone" and choose the "Initialise empty database" option. After that, the prompts are designed to be fairly self-explanatory and show the intended order of data population steps.

## 2. Back-end server

The back-end is a GraphQL server built with [Yoga](https://the-guild.dev/graphql/yoga-server) because I need more practice with GraphQL. ¯\\_(ツ)_/¯

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

I have also created a script to generate skeletons of resolvers for the GraphQL server based on the generated schema and likely function names. (**Note:** This overwrites any existing resolvers in the `./src/resolvers` folder.)
```bash
npm run generate:resolvers
```

### Troubleshooting

Exception thrown about Punycode when running scripts on Node 21.
: Change Node version to 20 LTS (`nvm use lts/iron`).

After deleting resolver files to re-create them, the script says it's created them and `existsSync` returns `true`, but the files aren't actually there. `unlinkSync` throws an error.
: Try killing all Node processes, restarting WSL, and/or restarting computer.

## 3. Front-end app

To come.

---

## Credits

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" alt="TMDB logo" width="250"/>

This product uses the TMDB API but is not endorsed or certified by TMDB.



## Footnotes 
<sup>1</sup>Currently only TV shows are filtered by origin country, not movies. 

<sup>2</sup>It can actually be run with anyone as your start person, you just need their TMDB ID.

<sup>3</sup>Except some of the custom console logging. That's still a bit messy.
