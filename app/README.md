# The Fey Factor front-end app

This is a [React](https://react.dev/) app with [Relay](https://relay.dev/) for GraphQL queries, because that's what I use at my day job and thus want to  practice with. Built using [Vite](https://vitejs.dev/), with thanks to Oscar Beaumont for [vite-plugin-relay](https://github.com/oscartbeaumont/vite-plugin-relay).

The custom select elements are made possible by [React Select](https://react-select.com/home). Other UI components are largely home-made, using [Styled Components](https://styled-components.com/) and [Polished](https://polished.js.org/), with thanks to Armin Broubakarian for [generate-react-cli](https://www.npmjs.com/package/generate-react-cli) which I use to bootstrap my components.

The Venn diagram is made possible by [UpSet.js](https://upset.js.org/docs/getting-started/venndiagram/).

---
- [Running locally](#running-locally)
- [Component hierarchy for Relay-driven content](#component-hierarchy-for-relay-driven-content)

---
## Running locally

Install dependencies:
```bash
npm install
```

Combine the generated schema from the server, run the Relay compiler, and run the Vite dev server in one step with:
```bash
npm run dev
```

---
## Component hierarchy for Relay-driven content

| File/directory                         | Example              | Description                                                                                                                                                                                                                                                                                        |
|----------------------------------------|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `./src/main.tsx`                       |                      | Wraps everything in the Relay environment provider, Styled Components theme provider, custom context providers, and the router. Renders the route components.                                                                                                                                      |
| `./src/routes/*`                       | `Rankings.tsx`       | Renders the components for the content of that route, including `RelayComponentWrapper`[^1] for those that contain Relay queries.                                                                                                                                                                  |
| `./src/page-content/*`                 | `TvShowRankings.tsx` | Contains the Relay query for the data for this page (or section of the page) and passes it down to the display component(s). These can't be put in the route component because Relay components need to be wrapped in `Suspense` and have their query hook used at the top level of the component. |
| `./src/components/data-presentation/*` | `RankingTable.tsx`   | The display components for the data. Standalone components for reusability and separation of concerns.                                                                                                                                                                                             |

[^1]: `RelayComponentWrapper` is a common wrapper containing the `Suspense` and `ErrorBoundary` wrappers for Relay-driven content.