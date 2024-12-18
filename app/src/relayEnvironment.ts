import { Environment, Network, RecordSource, Store } from 'relay-runtime';

async function fetchQuery(operation: any, variables: object) {
	try {
		const response = await fetch('http://localhost:4000/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: operation.text,
				variables,
			}),
		});

		const json = await response.json();

		if (json.errors) {
			console.error('GraphQL errors:', json.errors);
		}

		return json;
	}
	catch (error) {
		console.error('Network error:', error);
		throw error;
	}
}

const environment = new Environment({
	network: Network.create(fetchQuery),
	store: new Store(new RecordSource()),
});

export default environment;
