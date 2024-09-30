import { FC, useState, useEffect, useCallback, } from 'react';
import { StyledBarChart, StyledBarChartTitle } from './BarChart.style';
import { BarList, BarListSeries } from 'reaviz';
import { ChartShallowDataShape } from 'reaviz/dist/common';
import { omit, uniq } from 'lodash';

type BarChartProps = {
	title: string;
	data: ChartShallowDataShape[];
	lists?: Record<string, string[]>;
};

export const BarChart: FC<BarChartProps> = ({ title, data, lists }) => {
	const [consolidatedData, setConsolidatedData] = useState<ChartShallowDataShape[]>(data);
	const [consolidatedLists, setConsolidatedLists] = useState<Record<string, string[]>>(lists ?? {});

	useEffect(() => {
		if(lists) {
			const allAppleShows: string[] = uniq([...lists?.['Apple TV'], ...lists?.['Apple TV Plus']]);

			setConsolidatedData((prev) => {
				const sansApple = prev.filter((item) => {
					// We need to remove the two real ones AND the added one or else the added one can get added twice and I don't know why
					return !['Apple TV', 'Apple TV Plus', 'Apple TV or Apple TV Plus'].includes(item.key as string);
				});

				return [...sansApple, { key: 'Apple TV or Apple TV Plus', data: allAppleShows.length }];
			});

			setConsolidatedLists((prev) => {
				return { ...omit(prev, ['Apple TV', 'Apple TV Plus']), 'Apple TV or Apple TV Plus': allAppleShows };
			});
		}
	}, [data, lists]);

	const handleClick = useCallback((item: ChartShallowDataShape) => {
		console.log(item.key);
		console.log(consolidatedLists[item.key as string]);
		// TODO: Open a modal listing the shows
	}, [consolidatedLists]);

	return (
		<StyledBarChart data-testid="BarChart">
			<StyledBarChartTitle>{title}</StyledBarChartTitle>
			<BarList data={consolidatedData} series={<BarListSeries onItemClick={handleClick} valuePosition="end" />} />
		</StyledBarChart>
	);
};
