import { FC, ReactNode, useCallback, useState, } from 'react';
import { StyledBarChart, StyledBarChartDescription, StyledBarChartTitle } from './BarChart.style';
import { BarList, BarListSeries } from 'reaviz';
import { ChartShallowDataShape } from 'reaviz/dist/common';
import { ModalDialog } from '../../layout/ModalDialog/ModalDialog.tsx';

type BarChartProps = {
	title: string;
	description?: string;
	data: ChartShallowDataShape[];
	lists?: Record<string, ReactNode[]>;
};

export const BarChart: FC<BarChartProps> = ({ title, description, data, lists }) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalTitle, setModalTitle] = useState<string>('');
	const [modalItems, setModalItems] = useState<ReactNode[]>([]);

	const handleModalOpen = useCallback((item: ChartShallowDataShape) => {
		if(!lists) return;

		setModalOpen(true);
		setModalTitle(`Available to stream on ${item.key as string}`);
		setModalItems(lists[item.key as string]);
	}, [lists]);


	const handleModalClose = useCallback(() => {
		setModalOpen(false);
		setModalTitle('');
		setModalItems([]);
	}, []);

	return (
		<StyledBarChart data-testid="BarChart">
			<StyledBarChartTitle>{title}</StyledBarChartTitle>
			{lists ? (
				<BarList data={data} series={<BarListSeries onItemClick={handleModalOpen} valuePosition="end" />} />
			) : (
				<BarList data={data} />
			)}
			{description && <StyledBarChartDescription>{description}</StyledBarChartDescription>}

			<ModalDialog
				open={modalOpen}
				title={modalTitle}
				onClose={handleModalClose}
				isList={true}
				batchSize={5}
			>
				{modalItems}
			</ModalDialog>
		</StyledBarChart>
	);
};
