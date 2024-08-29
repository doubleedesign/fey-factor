/**
 * TODO: This is copied over from the docs folder, de-duplicate it
 */

import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { Inflectors } from 'en-inflectors';
import snakeCase from 'lodash/snakeCase';
import typeObjects from '../src/generated/typeObjects.json' assert { type: 'json' };

export type TypeObject = {
	fields: { fieldName: string, fieldType: any, required: boolean }[];
	isSubtypeOf?: string;
	isInterface?: boolean;
};

export function pascalCase(str: string) {
	if(str.toLowerCase() === 'tvshows') {
		return 'TvShows';
	}

	return upperFirst(camelCase(str));
}

export function toPlural(str: string) {
	if(str.toLowerCase() === 'work') {
		return `${str}s`;
	}
	if(str === 'tvshows') {
		return 'TvShows';
	}

	return new Inflectors(str).toPlural();
}

function toSingular(str: string) {
	return new Inflectors(str).toSingular();
}

/**
 * Converts a singular type name to the plural format used for database table names
` * @param typeName
 *
 * @return string
 */
export function typeFormatToDbTableNameFormat(typeName: string) {
	return toPlural(snakeCase(typeName));
}

/**
 * Converts a database table name to the singular format used for type names
 * @param tableName
 *
 * @return string
 */
export function dbTableNameFormatToTypeFormat(tableName: string) {
	if(tableName.toLowerCase() === 'movies') {
		return 'Movie';
	}

	return pascalCase(toSingular(tableName));
}


export function getSupertypeOfSubtype(subtypeName: string) {
	const subtype = Object.entries(typeObjects as Record<string, TypeObject>).find(([key]) => {
		return key === subtypeName;
	});

	return subtype ? subtype[1]?.isSubtypeOf : false;
}


export function getSubtypesOfSupertype(supertypeName: string) {
	return Object.entries(typeObjects as Record<string, TypeObject>).filter(([key, value]) => {
		return value.isSubtypeOf === supertypeName;
	}).map(([key]) => key);
}
