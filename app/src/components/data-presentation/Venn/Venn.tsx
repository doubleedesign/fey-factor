import { FC, lazy, useState, useMemo, useCallback, useEffect, useRef, ChangeEvent } from 'react';
import {
	extractSets,
	generateCombinations,
	VennDiagram,
	ISetLike,
	ISets,
} from '@upsetjs/react';
import { Toggle } from '../../inputs/Toggle/Toggle.tsx';
import { NumberPicker, SelectionInputs } from '../../inputs';
import { TooltippedElement } from '../../typography';
import theme from '../../../theme';
import { lab, hsl } from 'd3-color';
import { saturate, tint } from 'polished';
import { ThemeColor, VennSet } from '../../../types.ts';
import { StyledVenn, StyledVennControls, StyledVennFigure, StyledVennWrapper } from './Venn.style';
import { StyledSelectLabel } from '../../inputs/common.ts';
import { VennDetailPanel } from './VennDetailPanel/VennDetailPanel.tsx';
import { useResizeObserver } from '../../../hooks';
import { VennPositionHandler } from './VennPositionHandler/VennPositionHandler.tsx';
import { CheckboxGroup } from '../../inputs/CheckboxGroup/CheckboxGroup.tsx';
import snakeCase from 'lodash/snakeCase';
import { VennResultList } from './VennResultList/VennResultList.tsx';

type VennProps = {
	data: VennSet[];
};


// Wrapper to lazy load the VennEuler layout so that an error can be thrown if it doesn't load in a few seconds
const LazyEulerVenn = lazy(() => {
	return new Promise((resolve, reject) => {
		// Throw an error if the component doesn't load in time
		const timeout = setTimeout(() => {
			reject(new Error('Cannot render VennEuler layout. Try adjusting the options to reduce complexity, or revert to the default layout.'));
		}, 3000);

		import('./VennEuler/VennEuler.tsx')
			.then((module) => {
				clearTimeout(timeout);
				// @ts-ignore
				resolve(module);
			})
			.catch((error) => {
				clearTimeout(timeout);
				reject(error);
			});
	});
});


export const Venn: FC<VennProps> = ({ data }) => {
	const [eulerLayout, setEulerLayout] = useState(true);
	const figureRef = useRef<HTMLElement>(null);
	const { width } = useResizeObserver(figureRef, [data, eulerLayout], 300);
	const [limit, setLimit] = useState(7);

	// Data handling
	const rawSets = useMemo(() => {
		return extractSets(data)
			.map((set, index) => ({
				...set,
				color: getColour(index),
			}))
			// @ts-ignore
			.sort((a, b) => {
				return a.cardinality < b.cardinality;
			});
	}, [data]);
	// Initially set the selectedShape sets according to the chosen limit
	const [selectedSets, setSelectedSets] = useState<ISets<VennSet>>(rawSets.slice(0, limit));
	// Generate the combinations of the selected sets
	const combinations = useMemo(() => {
		return generateCombinations(selectedSets, { mergeColors });
	}, [selectedSets]);

	// Handle the checkbox group
	const checkboxOptions = useMemo(() => {
		return rawSets.map(set => ({
			value: snakeCase(set.name),
			label: set.name,
		}));
	}, [rawSets]);

	const selectedCheckboxOptions = useMemo(() => {
		return selectedSets.map(set => ({
			value: snakeCase(set.name),
			label: set.name,
		}));
	}, [selectedSets]);

	// Handle change of limit from the number picker
	const handleLimitChange = useCallback((value: number) => {
		setLimit(value);
		setSelectedSets(rawSets.slice(0, value));
	}, [rawSets]);

	// Handle change of sets from the checkbox group
	const handleSetSelection = useCallback((event: ChangeEvent <HTMLInputElement>) => {
		const matchingSet = rawSets.find(set => snakeCase(set.name) === event.target.value);
		if (!matchingSet) return;

		if (event.target.checked) {
			setSelectedSets([...selectedSets, matchingSet]);
		}
		else {
			setSelectedSets(selectedSets.filter(set => set.name !== matchingSet.name));
		}
	}, [rawSets, selectedSets]);


	// Diagram circle/intersection handling after render
	const [selectedShape, setSelectedShape] = useState(null);
	const [hoveredShape, setHoveredShape] = useState<ISetLike<VennSet> | null>(null);

	const handleShapeClick = useCallback((selection) => {
		// TODO: Show the details in a panel next to the diagram
		console.log(selection);
		setSelectedShape(selection);
	}, []);

	const handleResultClick = useCallback((selection) => {
		console.log(selection);
		setSelectedShape(selection);
	}, []);

	const handleLayoutToggle = useCallback((value: boolean) => {
		// Somehow, the timeout makes sure the CSS transition works both ways
		setTimeout(() => {
			setEulerLayout(value);
			if(value) setLimit(7);
		}, 0);
	}, []);

	useEffect(() => {
		if(!eulerLayout) {
			setLimit(5); // the default layout automatically limits itself to 5 so make the number picker reflect this
		}
	}, [eulerLayout]);

	return (
		<StyledVenn>
			<StyledVennControls data-test-id="VennControls">
				<SelectionInputs>
					<Toggle
						label={
							<TooltippedElement
								id="eulerToggle"
								tooltip="Euler layout shows proportions better, but can be slow to render with many sets"
								position="bottom"
							>
								<StyledSelectLabel>
									Euler layout
									<i className="fa-duotone fa-solid fa-circle-question"></i>
								</StyledSelectLabel>
							</TooltippedElement>
						}
						value={eulerLayout}
						onChange={handleLayoutToggle}
					/>
					<NumberPicker
						label={
							<TooltippedElement
								id="limitPicker"
								tooltip="If the Euler layout is crashing, try selecting a smaller limit."
								position="bottom"
							>
								<StyledSelectLabel>
									Limit to top:
									<i className="fa-duotone fa-solid fa-circle-question"></i>
								</StyledSelectLabel>
							</TooltippedElement>
						}
						value={limit}
						defaultValue={7}
						options={[3, 5, 7, 10]}
						onChange={handleLimitChange}
						disabled={!eulerLayout}
					/>
				</SelectionInputs>
			</StyledVennControls>
			<StyledVennWrapper>
				<StyledVennFigure ref={figureRef} data-test-id="VennFigure">
					<VennPositionHandler>
						{eulerLayout ? (
							<LazyEulerVenn
								sets={selectedSets}
								combinations={combinations}
								width={width}
								height={width}
								onClick={handleShapeClick}
								onHover={setHoveredShape}
								selection={hoveredShape || selectedShape}
								exportButtons={false}
								tooltips={true}
								selectionColor={theme.colors.accent}
								fontFamily={theme.fontFamily.body}
							/>
						) : (
						// @ts-expect-error TS2786: VennDiagram cannot be used as a JSX component
							<VennDiagram
								sets={selectedSets}
								combinations={combinations}
								width={width}
								height={width}
								onClick={handleShapeClick}
								onHover={setHoveredShape}
								selection={hoveredShape || selectedShape}
								exportButtons={false}
								tooltips={true}
								selectionColor={theme.colors.accent}
								fontFamily={theme.fontFamily.body}
							/>
						)}
					</VennPositionHandler>
				</StyledVennFigure>
				<VennDetailPanel defaultOpen="Diagram results">
					<CheckboxGroup
						label="Query results"
						options={checkboxOptions}
						selectedOptions={selectedCheckboxOptions}
						onChange={handleSetSelection}
						maxSelections={limit}
					/>
					<VennResultList
						label="Diagram results"
						data={[...selectedSets, ...combinations]}
						onItemClick={handleResultClick}
					/>
					{eulerLayout &&
						<small>
							<i className="fa-solid fa-triangle-exclamation"></i>
							Euler layout may not show all intersections, especially for large datasets.
							Default layout limits itself automatically.
						</small>
					}
				</VennDetailPanel>
			</StyledVennWrapper>
		</StyledVenn>
	);
};


/**
 * Generate colours for the sets starting from a lightened version of the theme colours
 * @param index
 */
function getColour(index: number) {
	const filteredThemeColours = Object.keys(theme.colors).filter(name => !['background', 'light', 'dark'].includes(name));
	const startColorName = filteredThemeColours[index % filteredThemeColours.length];
	const startColor = theme.colors[startColorName as ThemeColor];
	const baseHSL = hsl(saturate(0.4, (tint(0.8, startColor))));
	const hueStep = (filteredThemeColours.length / 360);

	// Calculate the new hue by adding the step * index
	const newHue = (baseHSL.h + index * hueStep) % 360; // Ensure hue stays within 0-360

	// Create a new HSL color with the adjusted hue, but make it subtler
	const newColor = hsl(newHue, baseHSL.s, baseHSL.l);

	return newColor.toString(); // Convert to CSS-compatible string
}

/**
 * Merge colours for intersections by averaging their LAB values
 * @param colors
 */
function mergeColors(colors: readonly (string | undefined)[]) {
	if (colors.length === 0) {
		return undefined;
	}
	if (colors.length === 1) {
		return colors[0];
	}
	const cc = colors.reduce(
		(acc, d) => {
			const c = lab(d || 'transparent');

			return {
				l: acc.l + c.l,
				a: acc.a + c.a,
				b: acc.b + c.b,
			};
		},
		{ l: 0, a: 0, b: 0 }
	);

	return lab(cc.l / colors.length, cc.a / colors.length, cc.b / colors.length).toString();
}
