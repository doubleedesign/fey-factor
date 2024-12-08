import { FC, lazy, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { extractSets, generateCombinations, VennDiagram, ISetLike, createVennJSAdapter } from '@upsetjs/react';
import { layout } from '@upsetjs/venn.js';
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
import { useResizeObserver } from '../../../hooks/use-resize-observer.ts';
import { VennPositionHandler } from './VennPositionHandler/VennPositionHandler.tsx';

type VennProps = {
	data: VennSet[];
	defaultEuler?: boolean;
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


export const Venn: FC<VennProps> = ({ data, defaultEuler = true }) => {
	const [selected, setSelected] = useState(null);
	const [hovered, setHovered] = useState<ISetLike<VennSet> | null>(null);
	const [limit, setLimit] = useState(7);
	const [eulerLayout, setEulerLayout] = useState(defaultEuler);
	const figureRef = useRef<HTMLElement>(null);
	const { width } = useResizeObserver(figureRef, [data, eulerLayout], 300);

	const handleClick = useCallback((selection: any) => {
		// TODO: Show the details in a panel next to the diagram
		console.log(selection);
		setSelected(selection);
	}, []);

	const sets= useMemo(() => {
		return extractSets(data)
			.map((set, index) => ({
				...set,
				color: getColour(index),
			}))
			// @ts-ignore
			.sort((a, b) => {
				return a.cardinality < b.cardinality;
			})
			.slice(0, limit);
	}, [data, limit]);

	const combinations = useMemo(() => {
		return generateCombinations(sets, { mergeColors });
	}, [sets]);

	const handleLimitChange = useCallback((value: number) => {
		setLimit(value);
	}, []);

	const handleLayoutToggle = useCallback((value: boolean) => {
		// Somehow, this makes sure the CSS transition works both ways
		setTimeout(() => {
			setEulerLayout(value);
			if(value) setLimit(7);
		}, 0);
	}, []);

	useEffect(() => {
		if(!eulerLayout) {
			setLimit(5);
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
								tooltip="Standard layout auto-limits itself. If the Euler layout is crashing, try selecting a smaller limit. 7 seems to be the sweet spot."
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
								layout={createVennJSAdapter(layout)}
								sets={sets}
								combinations={combinations}
								width={width}
								height={width}
								onClick={handleClick}
								onHover={setHovered}
								selection={hovered || selected}
								exportButtons={false}
								tooltips={true}
								selectionColor={theme.colors.accent}
								fontFamily={theme.fontFamily.body}
							/>
						) : (
						// @ts-expect-error TS2786: VennDiagram cannot be used as a JSX component
							<VennDiagram
								sets={sets}
								combinations={combinations}
								width={width}
								height={width}
								onClick={handleClick}
								onHover={setHovered}
								selection={hovered || selected}
								exportButtons={false}
								tooltips={true}
								selectionColor={theme.colors.accent}
								fontFamily={theme.fontFamily.body}
							/>
						)}
					</VennPositionHandler>
					{eulerLayout &&
						<small>Warning: Euler layout may not show all intersections, especially for large datasets. All query results are shown in the
							panel.</small>
					}
				</StyledVennFigure>
				<VennDetailPanel data={selected}/>
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
