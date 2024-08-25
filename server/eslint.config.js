import { ESLint } from 'eslint';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import stylisticPlugin from '@stylistic/eslint-plugin-ts';

export default [
	{
		files: ['**/*.ts', '**/*.tsx'],
		ignores: ['node_modules/**'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'@stylistic': stylisticPlugin,
		},
		rules: {
			'object-curly-newline': 'off',
			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',
					prev: '*',
					next: 'return'
				},
			],
			'no-whitespace-before-property': 'error',
			'@stylistic/indent': ['error', 'tab', {
				'SwitchCase': 1,
				'FunctionExpression': {
					'parameters': 1,
					'body': 1
				},
				'MemberExpression': 1,
				'offsetTernaryExpressions': true
			}],
			'@stylistic/quotes': [
				'error',
				'single'
			],
			'@stylistic/space-in-parens': 'off',
			'@stylistic/array-bracket-spacing': 'off',
			'@stylistic/object-curly-spacing': [
				'error',
				'always'
			],
			'@stylistic/computed-property-spacing': 'off',
			'@stylistic/space-before-function-paren': 'off',
			'@stylistic/no-nested-ternary': 'off',
			'@stylistic/space-unary-ops': 'off',
			'@stylistic/semi': [
				'warn',
				'always'
			],
			'@stylistic/brace-style': [
				'warn',
				'stroustrup',
				{
					'allowSingleLine': false
				}
			],
			'max-len': [
				'warn',
				{
					'comments': 160,
					'code': 160,
					'tabWidth': 4
				}
			],
			'no-multiple-empty-lines': [
				'error',
				{
					'max': 2,
					'maxEOF': 1,
					'maxBOF': 0
				}
			],
			'block-spacing': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
		}
	},
];
