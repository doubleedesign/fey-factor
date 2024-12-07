import { FC, useCallback } from 'react';
import { VennDiagram } from '../page-content';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, TooltippedElement } from '../components/typography';
import { SelectionInputs, NumberPicker } from '../components/inputs';
import { RelayComponentWrapper } from '../components/wrappers/RelayComponentWrapper/RelayComponentWrapper.tsx';
import { useVennContext } from '../controllers/VennContext.tsx';
import { RolePicker } from '../components/inputs/RolePicker/RolePicker.tsx';

export const Venn: FC = () => {
	const { setMaxAverageDegree, setMinConnections } = useVennContext();

	const handleDegreeChange = useCallback((newDegree: number) => {
		setMaxAverageDegree(newDegree);
	}, [setMaxAverageDegree]);

	const handleConnectionCountChange = useCallback((newConnectionCount: number) => {
		setMinConnections(newConnectionCount);
	}, [setMinConnections]);

	return (
		<PageWrapper>
			<ControlBar>
				<div>
					<Heading level="h1">Venn Diagram</Heading>
				</div>
				<SelectionInputs>
					<NumberPicker
						label={
							<TooltippedElement id="maxAvgDegree"
								tooltip="Maximum average degree of a show's connections for it to be included (role selection does not affect this)"
								position="bottom"
							>
								Max. avg. degree:
								<i className="fa-duotone fa-solid fa-circle-question"></i>
							</TooltippedElement>}
						defaultValue={1.5} options={[1, 1.25, 1.5, 1.75, 2]}
						onChange={handleDegreeChange}
					/>
					<NumberPicker
						label={
							<TooltippedElement id="minConnections"
								tooltip="Minimum number of connections a show must have to be included (role selection does not affect this)"
								position="bottom"
							>
								Min. connections:
								<i className="fa-duotone fa-solid fa-circle-question"></i>
							</TooltippedElement>
						}
						defaultValue={5} options={[2, 3, 5, 10, 20]}
						onChange={handleConnectionCountChange}
					/>
					<RelayComponentWrapper>
						<RolePicker
							label={
								<TooltippedElement id="rolePicker"
									tooltip="Which roles of the connections to include in the diagram"
									position="bottom"
								>
									Include roles:
									<i className="fa-duotone fa-solid fa-circle-question"></i>
								</TooltippedElement>}
						/>
					</RelayComponentWrapper>
				</SelectionInputs>
			</ControlBar>
			<RelayComponentWrapper>
				<VennDiagram />
			</RelayComponentWrapper>
		</PageWrapper>
	);
};
