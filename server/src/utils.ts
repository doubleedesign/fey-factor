export function convertIdToInteger(id: number | string) {
	if(typeof id === 'number') {
		return id;
	}
	try {
		return parseInt(id);
	}
	catch {
		return parseInt(id.replace('_T', '').replace('_F', ''));
	}
}

export function convertIdToString(id: number | string, type: 'T' | 'F') {
	if(id.toString().endsWith('_T') || id.toString().endsWith('_F')) {
		return id.toString();
	}

	return `${id}_${type}`;
}