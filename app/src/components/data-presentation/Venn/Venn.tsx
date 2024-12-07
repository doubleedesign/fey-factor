import { FC, useState, useMemo, useCallback } from 'react';
import { extractSets, generateCombinations, VennDiagram, ISetLike } from '@upsetjs/react';
import { StyledVenn } from './Venn.style';
import { lab, hsl } from 'd3-color';
import theme from '../../../theme';
import { saturate, tint } from 'polished';
import { ThemeColor } from '../../../types.ts';
import { useVennContext } from '../../../controllers/VennContext.tsx';

type VennSet = {
	name: string;
	sets: string[];
};

type VennProps = {
	data: VennSet[];
};

export const Venn: FC<VennProps> = ({ data }) => {
	const [selected, setSelected] = useState(null);
	const [hovered, setHovered] = useState<ISetLike<VennSet> | null>(null);
	const { minCardinality } = useVennContext();

	const handleClick = useCallback((selection: any) => {
		// TODO: Show the details in a panel next to the diagram
		console.log(selection);
		setSelected(selection);
	}, []);

	const sets= useMemo(() => {
		return extractSets(data).
			filter(set => set.cardinality >= minCardinality)
			.map((set, index) => ({
				...set,
				color: getColour(index),
			}));
	}, [data]);

	const combinations = useMemo(() => {
		return generateCombinations(sets, { mergeColors });
	}, [sets]);

	return (
		<StyledVenn>
			{/** @ts-expect-error TS2786: VennDiagram cannot be used as a JSX component. */}
			<VennDiagram
				// Euler layout. TODO: Make this a toggle because it has trouble with large sets
				//layout={createVennJSAdapter(layout)}
				sets={sets}
				combinations={combinations}
				width={900}
				height={600}
				onClick={handleClick}
				onHover={setHovered}
				selection={hovered || selected}
				exportButtons={false}
				selectionColor={theme.colors.accent}
				fontFamily={theme.fontFamily.body}
			/>
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
