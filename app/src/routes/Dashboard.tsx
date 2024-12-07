import { FC } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { WatchProviderChart } from '../page-content/Dashboard/WatchProviderChart.tsx';
import { Heading, LeadParagraph } from '../components/typography';
import { Grid, GridColumn } from '../components/common.ts';
import { BarChartSkeleton } from '../components/states/loading';
import { RelayComponentWrapper } from '../components/wrappers/RelayComponentWrapper/RelayComponentWrapper.tsx';

export const Dashboard: FC = () => {
	return (
		<PageWrapper>
			<ControlBar>
				<div>
					<Heading level="h1">Dashboard</Heading>
					<LeadParagraph>Miscellaneous insights</LeadParagraph>
				</div>
			</ControlBar>
			<Grid $maxCols={2}>
				<GridColumn>
					<RelayComponentWrapper loadingFallback={<BarChartSkeleton rows={10} title="Top 10 streaming providers for top 100 shows" />}>
						<WatchProviderChart />
					</RelayComponentWrapper>
				</GridColumn>
			</Grid>
		</PageWrapper>
	);
};
