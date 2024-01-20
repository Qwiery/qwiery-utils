/**
 * A JSON graph structure
 */
export interface GraphLike {
	/** The nodes of the graph. A node needs at least a unique id.*/
	nodes: IQwieryNode[],
	/** The edges of the graph. An edge needs at least a unique id and sourceId/targetId.*/
	edges?: any[],
	/** Optional: the id of the graph.*/
	id?: string,
	/** Optional: the description of the graph.*/
	description?: string,
	/** Optional: the name of the graph.*/
	name?: string
}

/**
 * Anything with an identifier.
 */
export interface IId {
	/**
	 * The unique identifier of the entity.
	 */
	id: string;
}

/*
 * Common denominator across the various clients and backends.
 * A node is something with at least an identifier.
 * @see IEntityNode
 * */
export interface IQwieryNode extends IId {

}

/*
 * Common denominator across the various clients and backends.
 * @see IEntityEdge
 * */
export interface IQwieryEdge extends IId {
	/**
	 * The identifier of the source node.
	 */
	sourceId: string;
	/**
	 * The identifier of the target node.
	 */
	targetId: string;
}

/**
 * Defines a knowledge graph entity.
 */
export interface IEntityNode {
	/** The unique identifier of the entity. This is optional since one will be assigned if not supplied. */
	id?: string;
	/** The data payload of the entity. */
	data?: any;
	/** The labels of the entity. */
	labels?: string[];
}

/*
 * Defines a knowledge graph edge.
 * */
export interface IEntityEdge {
	/** The unique identifier of the entity. This is optional since one will be assigned if not supplied. */
	id?: string;
	/** The data payload of the entity. */
	data?: any;
	/** The labels of the entity. */
	labels?: string[];
	/** The identifier of the source node. */
	sourceId: string;
	/** The identifier of the target node. */
	targetId: string;
}

/**
 * The interface of a graph viewer (visualization, rendering).
 * Out of the box you get an implementation based on Cytoscape (https://js.cytoscape.org).

 * ---
 * We have commercial alternatives based on
 * - yFiles by yWorks (https://www.yworks.com)
 * - Ogma by Linkurious (https://linkurious.com/ogma/)
 * - GoJs by Northwoods Software (https://gojs.net/latest/index.html)
 *
 * For more info, {@link info@orbifold.net|contact us} or visit [Qwiery.com](https://qwiery.com).
 *
 * ---
 *
 * General principle:
 * - the actual implementation uses underneath different types of node or edge structure
 * - nodes/edges go in and out as plain objects, DO NOT return vendor specific objects
 * - a nodes/edges have an id
 * - in addition, an edge has sourceId/targetId
 * - all the rest is optional (labels, name, position...)
 */
export interface IGraphView {
	/**
	 * Adds a new node to the graph.
	 * @param n {IEntityNode} The raw data defining the node.
	 * @returns {string} The id of the node.
	 */
	addNode: (n: IQwieryNode) => string;

	/**
	 * Adds a new edge to the graph.
	 * @param edge {IEntityEdge} The raw data defining the edge.
	 * @returns {string} The id of the edge.
	 */
	addEdge: (edge: IQwieryEdge) => string;

	/**
	 * Load the given graph in the viewer.
	 * @param g {GraphLike} A (JSON) graph.
	 * @param replace {boolean} Whether it should replace the current view or increment it.
	 */
	loadGraph: (g: GraphLike | any, replace?: boolean) => void;

	/**
	 * Clear the view (remove all nodes and edges).
	 */
	clear: () => void;

	/**
	 * Apply the given style.
	 * @param styleName {string} The style name.
	 */
	setStyle: (styleName: string) => void;

	/**
	 * Apply the layout with the name and options.
	 * @param layoutName {string} The name of the layout.
	 * @param [options] {any} Options specific to the layout.
	 */
	layout: (layoutName?: string, options?: any) => void;

	/**
	 * Pan the graph to the centre of a collection.
	 * @param [fit] {boolean} Resize to fit the canvas.
	 */
	center: (fit?: boolean) => void;

	/**
	 * Fit the graph in the canvas.
	 * @param [padding] {number} The margin around the graph (in pixels).
	 */
	fit: (padding?: number) => void;

	/**
	 * Zoom into the diagram.
	 * @param [amount] {number} A value >1 magnifies while <1 zooms out. If nothing is given the current value is returned.
	 */
	zoom: (amount?: number) => number;

	/**
	 * Removes the node with the given id.
	 * @param id {string|any} A node or the id of a node.
	 */
	removeNode: (id: string | any) => void;

	/**
	 * Removes the edge with the given id.
	 * @param id {string|any} An edge or the id of an edge.
	 */
	removeEdge: (id: string | any) => void;

	/**
	 * Returns the nodes of the graph or the ones satisfying the given predicate.
	 */
	getNodes: (predicate?: Function) => any[];

	/**
	 * Returns the edges of the graph or the ones satisfying the given predicate.
	 */
	getEdges: (predicate?: Function) => any[];

	/**
	 * Removes the nodes with degree zero.
	 */
	removeIsolatedNodes: () => void;

	/**
	 * Enables or disables the interactive edge creation.
	 * @param [enabled] {boolean} Whether it should be enabled.
	 */
	edgeCreation: (enabled: boolean) => void;

	/**
	 * Enables or disables the interactive node creation.
	 * @param [enabled] {boolean} Whether it should be enabled.
	 */
	nodeCreation: (enabled: boolean) => void;

	/**
	 * Centers the given node.
	 * @param node {any} A node.
	 */
	centerNode: (node: any) => void;

	/**
	 * Returns the selected nodes.
	 */
	selectedNodes: () => any[];

	/**
	 * Returns the position of the pointer on canvas.
	 */
	getPosition: () => {
		x: number;
		y: number;
	};

	/**
	 * Removes whatever is selected.
	 */
	removeSelection: () => void;

	/**
	 * returns the node with the specified id.
	 * @param id {string} An identifier.
	 */
	getNode: (id: string) => any;

	/*
	 * Sets the data (payload) on a node.
	 * */
	setNodeProperty: (id, name, value) => void;

	/**
	 * Sets multiple properties in one go.
	 */
	setNodeProperties: (id: string, data: any) => void;

	/*
	 * Refreshes the style on the graph.
	 * */
	refreshStyle: () => void;

	/*
	 * Lets the diagram know that dimensions have changed and it should refresh accordingly.
	 * */
	forceResize: () => void;

	/*
	 * Adds the given (sub)graph to the current one.
	 * */
	augment: (g: GraphLike) => void;

	/*
	 * Returns the underlying native graph visualization object.
	 */
	native: () => any;

	/**
	 * Hides the nodes satisfying the predicate.
	 * @param predicate {Function} A predicate.
	 */
	hideNodes: (predicate?: Function) => void;

	/*
	 * Shows the nodes satisfying the predicate.
	 * @param predicate {Function} A predicate.
	 */
	showNodes: (predicate?: Function) => void;

	/**
	 * Hides the edges satisfying the predicate.
	 * @param predicate {Function} A predicate.
	 */
	hideEdges: (predicate?: Function) => void;

	/*
	 * Shows the edges satisfying the predicate.
	 * @param predicate {Function} A predicate.
	 */
	showEdges: (predicate?: Function) => void;
}
