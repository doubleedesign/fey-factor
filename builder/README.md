# The Fey Factor data builder

This package contains a bunch of code that ultimately culminates in a collection of Node scripts run from a single console app to collect data from [The Movie Database API](https://developer.themoviedb.org/) starting from Tina Fey (or a person of your choice) and collecting TV shows, movies, and people to the specified "degree of separation." **This is currently focused primarily on TV shows** - movies are limited to degree 1 (even that collects thousands) and movie data is not topped up after initial population; options only exist to top-up TV show data.

The raw data is saved locally as JSON files in the `datasources/cache` folder. If a file is found, that data will be used instead of making an API request to TMDB, to keep API calls to a minimum. (However, these cached files are excluded from version control.)

The inclusion criteria are basic, so this should be considered a beta proof-of-concept. (Including every single person and continuing the tree results in too many people and works to be practical, but the current criteria are very arbitrary. I somewhat work around this using the scripts that "top up" data for a specified number of shows and for degree 2 people who would be degree 1 under looser criteria, but this is not a perfect solution.)

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
  - [Result](#result)

---
## Prerequisites
- [Node](https://nodejs.org)
- Postgres database server (the database itself is created by the script)
- [TMDB API key](https://developer.themoviedb.org/docs/getting-started)

---
## Setup
```bash
cd builder
npm install
```
- Postgres settings in `src/database/DatabaseConnection.ts``
- TMDB API key as `TMDB_AUTH_TOKEN` in `.env`.

---
## Usage
Ensure Postgres is running, and then run the interactive console script:
```bash
npm run start
```
For first run, arrow down to the "danger zone" and choose the "Initialise empty database" option. After that, the prompts are designed to be fairly self-explanatory and show the intended order of data population steps.

### Result

The resultant database schema is intentionally minimal, with a focus on raw data, low redundancy, and primarily storing data that is unlikely to change* and project-specific custom data (e.g., degree of separation, show ratings). Calculations, derived data, and fetching time-sensitive data (such as watch providers) are handled at the GraphQL layer.

![Database schema diagram](../database.png)

**Note:** Work/TV show/Movie IDs are actually `varchar`s now - I just haven't updated the diagram. See [A note about work IDs](#a-note-about-work-ids) below for more information.

| Table name  | Inherits from | Unique fields                                     | Foreign keys                |
|-------------|---------------|---------------------------------------------------|-----------------------------|
| connections | -             | id (PK), episode_count                            | person_id, work_id, role_id |
| people      | -             | id (PK), name, degree                             |                             |
| roles       | -             | id (PK), name                                     |                             |
| works       | -             | id (PK), title                                    |                             |
| tv_shows    | works         | start_year, end_year, season_count, episode_count |                             |
| movies      | works         | release_year                                      |                             |


*The database does need to be updated periodically or else the data will go out of date, just in terms of shows still airing at the time of last update, new shows that should be added, etc. We don't need to fetch the episode count of _30 Rock_ from TMDB every time it appears in the app, for example - so we store that; but where we can watch it may change relatively frequently, so we don't store that.

### A note about work IDs

TMDB IDs are used as the primary key for works (TV shows and movies) in the database. I discovered after I designed this that they are not unique - a TV show and a movie can have the same ID, which as you can imagine, is an absolute pain. My solution is to append the ID with `_T` for TV show or `_F` for film, which I'm aware is a dirty hack but I was too invested in my database design by the time I discovered this to implement an objectively better solution.

My way of doing this as cleanly as possible is to:
- handle this suffix centrally in the database class only, not in the data population scripts
- include a check constraint in the database to enforce correctly suffixed IDs (i.e., no missing, doubled-up, other letters).

Caveats this introduces:
- When an episode count is not available for a TV show connection, 0 must be used instead of `null`, because `null` is my shortcut way of differentiating that a work is a movie.

