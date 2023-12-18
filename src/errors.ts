/*
 * Runtime error messages.
 * istanbul ignore file
 * */
export const Errors = {
	isNil(name, where = null) {
		return where ? `Parameter '${name}' of '${where}' is nil.` : `Parameter '${name}' is nil.`;
	},
	invalidPlugin: () => "A plugin should be a function or a plain object.",
	abstractClass: (name) => `The class '${name}' is abstract and can't be instantiated.`,
	notImplemented: (name) => (name ? `The method '${name}' has not been implemented yet.` : "The method has not been implemented yet."),
	expectedType: (name, type, where) => `Expected '${name}' to be of type '${type}' in '${where}'.`,
	emptyString: (name, where) => `Received empty string for '${name}' in '${where}'.`,
	invalidNumber: (name, where) => `Value of '${name}' in '${where}' should be a positive integer.`,
	insufficientNodeSpecs: () => "Insufficient specs to create or update a node.",
	insufficientEdgeSpecs: () => "Insufficient specs to create or update an edge.",
	nodeExistsAlready: (id) => `Node with id '${id}' exists already.`,
	nodeDoesNotExist: (id) => `Node with id '${id}' does not exists.`,
	edgeDoesNotExist: (id) => `Edge with id '${id}' does not exists.`,
	sourceDoesNotExist: (id) => `Source node with id '${id}' does not exists.`,
	targetDoesNotExist: (id) => `Target node with id '${id}' does not exists.`,
	sourceIdMissing: () => "Source id is not specified in edge definition.",
	targetIdMissing: () => "Target id is not specified in edge definition.",
};
