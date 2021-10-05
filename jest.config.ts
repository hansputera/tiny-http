export default {
	clearMocks: true,
	roots: [
		'./lib'
	],
	testMatch: [
		'**/tests/**/*.+(ts)'
	],
	transform: {
		'^.+\\.(ts)$': 'ts-jest',
	},
	testEnvironment: 'node',
};