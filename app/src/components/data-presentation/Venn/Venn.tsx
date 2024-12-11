import { FC, lazy, useState, useMemo, useCallback, useEffect, ChangeEvent, useRef } from 'react';
import {
	extractSets,
	generateCombinations,
	VennDiagram,
	ISetLike,
	ISets, ISet, ISetIntersection
} from '@upsetjs/react';
import { NumberPicker, Toggle, CheckboxGroup, RadioGroup } from '../../inputs';
import { FinePrint, TooltippedElement } from '../../typography';
import theme from '../../../theme';
import { lab, hsl } from 'd3-color';
import { saturate, tint } from 'polished';
import { ThemeColor, VennSet } from '../../../types.ts';
import { StyledVenn, StyledVennControls, StyledVennFigure } from './Venn.style';
import { StyledSelectLabel } from '../../inputs/common.ts';
import { DetailPanel } from '../../layout/DetailPanel/DetailPanel.tsx';
import { VennPositionHandler } from './VennPositionHandler/VennPositionHandler.tsx';
import snakeCase from 'lodash/snakeCase';
import { VennResultDetail } from './VennResultDetail/VennResultDetail.tsx';
import { VennResultAccordion } from './VennResultAccordion/VennResultAccordion.tsx';
import { useResizeObserver } from '../../../hooks';

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
	const [limit, setLimit] = useState(7);
	const [selectedSets, setSelectedSets] = useState<ISets<VennSet>>([]);
	const [selectedShape, setSelectedShape] = useState<ISetLike | null>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const { height } = useResizeObserver(wrapperRef, [], 300, 'scroll');

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

	// Handle change of limit from the number picker
	const handleLimitChange = useCallback((value: number) => {
		setLimit(value);
		setSelectedSets(rawSets.slice(0, value));
		setSelectedShape(null); // close open detail panel when the data changes
	}, [rawSets]);

	// Update the selected sets when the data or limit changes from elsewhere
	useEffect(() => {
		handleLimitChange(limit);
	}, [handleLimitChange, limit, rawSets]);

	// Generate the combinations of the selected sets
	const combinations = useMemo(() => {
		return generateCombinations(selectedSets, { mergeColors });
	}, [selectedSets]);


	// Handle the checkbox group (enables customisation of the visible sets)
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


	// Handle the radio group (lists the visible sets and highlights on click)
	const radioGroupOptions = useMemo(() => {
		return combinations.map(set => ({
			value: snakeCase(set.name),
			label: set.name,
		}));
	}, [combinations]);

	const selectedRadioOption = useMemo(() => {
		if(selectedShape?.name) {
			return {
				value: snakeCase(selectedShape.name),
				label: selectedShape.name,
			};
		}

		return null;
	}, [selectedShape]);

	const handleSetHighlight = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		if(!event.target.checked) {
			setSelectedShape(null);
		}
		else {
			setSelectedShape([...selectedSets, ...combinations].find(set => {
				return snakeCase(set.name) === event.target.value;
			}) as ISet | ISetIntersection || null);
		}
	}, [selectedSets, combinations]);


	// Handle layout toggle
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

	return selectedSets.length > 0 ? (
		<StyledVenn data-testid="VennDiagram" ref={wrapperRef}>
			<DetailPanel height={height}>
				<StyledVennControls data-testid="VennControls">
					<Toggle
						label={
							<TooltippedElement
								id="eulerToggle"
								tooltip="Euler layout shows proportions better, but can be slower to render for complex data"
								position="bottom"
							>
								<StyledSelectLabel>
									Euler
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
									Max. sets:
									<i className="fa-duotone fa-solid fa-circle-question"></i>
								</StyledSelectLabel>
							</TooltippedElement>
						}
						value={limit}
						defaultValue={7}
						options={[3, 5, 7]}
						onChange={handleLimitChange}
						disabled={!eulerLayout}
					/>
				</StyledVennControls>
				<VennResultAccordion defaultOpen="Query results" itemMaxHeight={480}>
					<CheckboxGroup
						label="Query results"
						options={checkboxOptions}
						selectedOptions={selectedCheckboxOptions}
						onChange={handleSetSelection}
						maxSelections={limit}
					/>
					<RadioGroup
						label="Diagram results"
						options={radioGroupOptions}
						selectedOption={selectedRadioOption}
						onChange={handleSetHighlight}
					/>
				</VennResultAccordion>
				{eulerLayout &&
					<FinePrint>
						<i className="fa-solid fa-triangle-exclamation"></i>
						Euler layout may not show all intersections, especially for large datasets.
						Default layout limits itself automatically.
					</FinePrint>
				}
			</DetailPanel >
			<StyledVennFigure data-testid="VennFigure">
				<VennPositionHandler>
					{({ width, height }) => (
						<>
							{eulerLayout ? (
								<LazyEulerVenn
									sets={selectedSets}
									combinations={combinations}
									width={width}
									height={height}
									onClick={setSelectedShape}
									selection={selectedShape}
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
									height={height}
									onClick={setSelectedShape}
									selection={selectedShape}
									exportButtons={false}
									tooltips={true}
									selectionColor={theme.colors.accent}
									fontFamily={theme.fontFamily.body}
								/>
							)}
						</>
					)}
				</VennPositionHandler>
			</StyledVennFigure>
			<DetailPanel height={height}>
				{selectedShape && (
					<VennResultDetail data-testid="VennSelectionDetail" selection={selectedShape} onClose={() => setSelectedShape(null)} />
				)}
				<FinePrint>
					<i className="fa-solid fa-circle-info"></i>
					{/* eslint-disable-next-line max-len */}
					An individual person's degree includes appearances in <em>Saturday Night Live</em> while Tina Fey was involved, but SNL itself is excluded from these results.
				</FinePrint>
			</DetailPanel>
		</StyledVenn>
	) : null;
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
