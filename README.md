# The Fey Factor

A funsies project inspired by [Six Degrees of Kevin Bacon](https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon) but for finding and assessing live-action, scripted American[^1] comedies based on their proximity and strength of connections to Tina Fey[^2].

## Background

My partner and I are frequently looking for new (to us) TV comedies to watch. Trying to choose from streaming services often left us paralysed by choice, and of those shows we did like we started noticing a pattern of the faces and names that were becoming more familiar, especially those appearing together. He started proposing certain shows based on "a promising Venn diagram" or describing a show as "Feyjacent". I started developing a vague hypothesis that “All good American TV comedy made in the last X years exists within Y degrees of Tina Fey”[^3] (actual numbers to be decided), and also thought, what if I could build the Venn diagram?[^4]

## Implementation

The project is made up of three parts:

| Step/layer         | Summary                                                                                                                                               | Docs                                       |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| 1. Data builder    | Scripts to set up the database and collect the essential data.                                                                                        | [./builder/README.md](./builder/README.md) |
| 2. Back-end server | GraphQL server to be the intermediary between the database and front-end, as well as third-party APIs and the front-end for fetching additional data. | [./server/README.md](./server/README.md)   |
| 3. Front-end app   | React app to display the data and insights.                                                                                                           | [./app/README.md](./app/README.md)         |

Please see the README for each individual layer for more information about the tools and libraries used.

[^1]: Currently only TV shows are filtered by origin country, not movies.
[^2]: It can actually be run with anyone as your start person, you just need their TMDB ID. You may also need to adjust the code because of some of the arbitrary values I've selected and bits that might not be relevant to your use case (e.g., special handling for _Saturday Night Live_, filtering by production country).
[^3]: I am prepared to concede that the true centre of the Venn diagram may actually be Michael Schur.
[^4]: We've ended up using the list more than the actual diagram for choosing shows, but a version of the diagram is available. It is somewhat limited due to the complexity of the data and limitations of the graphing library I used, but it is fun to look at!


---

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" alt="TMDB logo" width="250"/>

This product uses the TMDB API but is not endorsed or certified by TMDB.

Watch provider data is provided by [JustWatch](https://www.justwatch.com/) via TMDB.


