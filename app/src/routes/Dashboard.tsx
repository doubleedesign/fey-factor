import { FC, Suspense } from 'react';
import { PageWrapper } from '../components/layout';
import { WatchProviderChart } from '../page-content/Dashboard/WatchProviderChart.tsx';

export const Dashboard: FC = () => {
	return (
		<PageWrapper>
			<Suspense>
				<WatchProviderChart />
			</Suspense>
		</PageWrapper>
	);
};
