# The Fey Factor

A funsies project inspired by [Six Degrees of Kevin Bacon](https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon) but for finding and assessing live-action, scripted American<sup>1</sup> comedies based on their proximity and strength of connections to Tina Fey<sup>2</sup>.

The project is made up of three parts:

| Step/layer         | Summary                                                                                                                                               | Docs                                       |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| 1. Data builder    | Scripts to set up the database and collect the essential data.                                                                                        | [./builder/README.md](./builder/README.md) |
| 2. Back-end server | GraphQL server to be the intermediary between the database and front-end, as well as third-party APIs and the front-end for fetching additional data. | [./server/README.md](./server/README.md)   |
| 3. Front-end app   | React app to display the data and insights.                                                                                                           | [./app/README.md](./app/README.md)         |

Please see the README for each individual layer for more information about the tools and libraries used.

<sup>1</sup>Currently only TV shows are filtered by origin country, not movies.

<sup>2</sup>It can actually be run with anyone as your start person, you just need their TMDB ID. You may also need to adjust the code, e.g., I am planning an Australian drama version for which I will need to adjust the country filter.

---

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" alt="TMDB logo" width="250"/>

This product uses the TMDB API but is not endorsed or certified by TMDB.

Watch provider data is provided by [JustWatch](https://www.justwatch.com/) via TMDB.
