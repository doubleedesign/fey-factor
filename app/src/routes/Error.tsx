import { FC } from 'react';
import { Container } from '../components/common.ts';

export const ErrorPage: FC = () => {

	return (
		<Container>
			<h1>Blerg!</h1>
			<p>Something went wrong.</p>
		</Container>
	);
};
