import { graphql, useLazyLoadQuery } from 'react-relay';
import { useState } from 'react';
import { App_RankedShowsQuery } from './__generated__/App_RankedShowsQuery.graphql.ts';

function App() {
	const [limit, setLimit] = useState<number>(20);

	const data = useLazyLoadQuery<App_RankedShowsQuery>(
		graphql`
            query App_RankedShowsQuery($limit: Int!) {
                TvShows(limit: $limit) {
                    ...on TvShowWithRankingData {
                        id
                        title
                        total_connections
                        average_degree
                        weighted_score
                    }
                }
            }
		`,
		{ limit }
	);

	console.log(data);

	return (
		<> 
			Stuff
		</>
	);
}

export default App;
