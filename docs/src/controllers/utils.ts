import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { Inflectors } from 'en-inflectors';
import snakeCase from 'lodash/snakeCase';
import typeObjects from '../../../server/src/generated/typeObjects.json';
import { TypeObject } from '../types.ts';

function pascalCase(str: string) {
	return upperFirst(camelCase(str));
}

function toPlural(str: string) {
	if(str.toLowerCase() === 'work') {
		return `${str}s`;
	}
	return new Inflectors(str).toPlural();
}

function toSingular(str: string) {
	return new Inflectors(str).toSingular();
}

/**
 * Converts a singular type name to the plural format used for database table names
 * Also accounts for {Type}Container types not being directly in the database, instead returning the table their types originally came from
 * @param typeName
 *
 * @return string
 */
export function typeFormatToDbTableNameFormat(typeName: string) {
	return typeName.endsWith('Container')
		? toPlural(snakeCase(typeName.replace('Container', '')))
		: toPlural(snakeCase(typeName));
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


export function getTypeForContainerType(containerType: string) {
	return containerType.endsWith('Container')
		? containerType.replace('Container', '')
		: containerType;
}
