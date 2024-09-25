// Demo typescales at https://typescale.com/
export const typeScale = 1.125;

const defaultTheme = {
	colors: {
		primary: '#0b1c72',
		secondary: '#851a77',
		accent: '#90FF00',
		subtle: '#b3a7b7',
		light: '#f8f9fa',
		dark: '#0e080e',
		success: '#00cc9b',
		error: '#bf1a3f',
		warning: '#ffc252',
		info: '#0086d6',
		background: '#ffffff',
	},
	spacing: {
		xs: '0.25rem',
		sm: '0.5rem',
		'sm-md': '0.75rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
		xxl: '3rem'
	},
	typeScale: typeScale,
	fontFamily: {
		body: '"karmina-sans", sans-serif',
		heading: '"dejanire-headline", serif',
	},
	fontWeights: {
		light: 300,
		normal: 400,
		semibold: 600,
		bold: 700
	},
	// Automatically generate font size key-value pairs using the specified type scale and starting xs font size
	fontSizes: ['md', 'lg', 'xl', 'xxl', 'display', 'display2'].reduce((result: { [key: string]: string }, size: string) => {
		const prev: string = <string>Object.values(result).pop();
		result[size] = `${parseFloat(prev.replace('rem', '')) * typeScale}rem`;

		return result;
	}, { xs: `${(1 / typeScale) / typeScale}rem`, sm: `${1 / typeScale}rem`, default: '1rem' })
};

export default defaultTheme;
