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

To come.

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
