import _ from "lodash";
import { Strings } from "./strings.js";

/**
 * Predefined CSS colors.
 */
const NamedColor = {
	aliceblue: "#F0F8FF",
	antiquewhite: "#FAEBD7",
	aqua: "#00FFFF",
	aquamarine: "#7FFFD4",
	azure: "#F0FFFF",
	beige: "#F5F5DC",
	bisque: "#FFE4C4",
	black: "#000000",
	blanchedalmond: "#FFEBCD",
	blue: "#0000FF",
	blueviolet: "#8A2BE2",
	brown: "#A52A2A",
	burlywood: "#DEB887",
	cadetblue: "#5F9EA0",
	chartreuse: "#7FFF00",
	chocolate: "#D2691E",
	coral: "#FF7F50",
	cornflowerblue: "#6495ED",
	cornsilk: "#FFF8DC",
	crimson: "#DC143C",
	cyan: "#00FFFF",
	darkblue: "#00008B",
	darkcyan: "#008B8B",
	darkgoldenrod: "#B8860B",
	darkgray: "#A9A9A9",
	darkgreen: "#006400",
	darkgrey: "#A9A9A9",
	darkkhaki: "#BDB76B",
	darkmagenta: "#8B008B",
	darkolivegreen: "#556B2F",
	darkorange: "#FF8C00",
	darkorchid: "#9932CC",
	darkred: "#8B0000",
	darksalmon: "#E9967A",
	darkseagreen: "#8FBC8F",
	darkslateblue: "#483D8B",
	darkslategray: "#2F4F4F",
	darkslategrey: "#2F4F4F",
	darkturquoise: "#00CED1",
	darkviolet: "#9400D3",
	deeppink: "#FF1493",
	deepskyblue: "#00BFFF",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1E90FF",
	firebrick: "#B22222",
	floralwhite: "#FFFAF0",
	forestgreen: "#228B22",
	fuchsia: "#FF00FF",
	gainsboro: "#DCDCDC",
	ghostwhite: "#F8F8FF",
	gold: "#FFD700",
	goldenrod: "#DAA520",
	gray: "#808080",
	green: "#008000",
	greenyellow: "#ADFF2F",
	grey: "#808080",
	honeydew: "#F0FFF0",
	hotpink: "#FF69B4",
	indianred: "#CD5C5C",
	indigo: "#4B0082",
	ivory: "#FFFFF0",
	khaki: "#F0E68C",
	lavender: "#E6E6FA",
	lavenderblush: "#FFF0F5",
	lawngreen: "#7CFC00",
	lemonchiffon: "#FFFACD",
	lightblue: "#ADD8E6",
	lightcoral: "#F08080",
	lightcyan: "#E0FFFF",
	lightgoldenrodyellow: "#FAFAD2",
	lightgray: "#D3D3D3",
	lightgreen: "#90EE90",
	lightgrey: "#D3D3D3",
	lightpink: "#FFB6C1",
	lightsalmon: "#FFA07A",
	lightseagreen: "#20B2AA",
	lightskyblue: "#87CEFA",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#B0C4DE",
	lightyellow: "#FFFFE0",
	lime: "#00FF00",
	limegreen: "#32CD32",
	linen: "#FAF0E6",
	magenta: "#FF00FF",
	maroon: "#800000",
	mediumaquamarine: "#66CDAA",
	mediumblue: "#0000CD",
	mediumorchid: "#BA55D3",
	mediumpurple: "#9370DB",
	mediumseagreen: "#3CB371",
	mediumslateblue: "#7B68EE",
	mediumspringgreen: "#00FA9A",
	mediumturquoise: "#48D1CC",
	mediumvioletred: "#C71585",
	midnightblue: "#191970",
	mintcream: "#F5FFFA",
	mistyrose: "#FFE4E1",
	moccasin: "#FFE4B5",
	navajowhite: "#FFDEAD",
	navy: "#000080",
	oldlace: "#FDF5E6",
	olive: "#808000",
	olivedrab: "#6B8E23",
	orange: "#FFA500",
	orangered: "#FF4500",
	orchid: "#DA70D6",
	palegoldenrod: "#EEE8AA",
	palegreen: "#98FB98",
	paleturquoise: "#AFEEEE",
	palevioletred: "#DB7093",
	papayawhip: "#FFEFD5",
	peachpuff: "#FFDAB9",
	peru: "#CD853F",
	pink: "#FFC0CB",
	plum: "#DDA0DD",
	powderblue: "#B0E0E6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#FF0000",
	rosybrown: "#BC8F8F",
	royalblue: "#4169E1",
	saddlebrown: "#8B4513",
	salmon: "#FA8072",
	sandybrown: "#F4A460",
	seagreen: "#2E8B57",
	seashell: "#FFF5EE",
	sienna: "#A0522D",
	silver: "#C0C0C0",
	skyblue: "#87CEEB",
	slateblue: "#6A5ACD",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#FFFAFA",
	springgreen: "#00FF7F",
	steelblue: "#4682B4",
	tan: "#D2B48C",
	teal: "#008080",
	thistle: "#D8BFD8",
	tomato: "#FF6347",
	turquoise: "#40E0D0",
	violet: "#EE82EE",
	wheat: "#F5DEB3",
	white: "#FFFFFF",
	whitesmoke: "#F5F5F5",
	yellow: "#FFFF00",
	yellowgreen: "#9ACD32",
};

/*
 * Color utilities.
 * */
export class Colors {
	/**
	 * Returns a random color name from the {@link NamedColor} set.
	 * @param hexValue {boolean} If true, returns the hex value instead of the name.
	 * @returns {string}
	 */
	static randomKnownColor(hexValue: boolean = false): string {
		const name = _.sample(_.keys(NamedColor));
		return hexValue ? NamedColor[name] : name;
	}

	/**
	 * Returns a random set of color names from the {@link NamedColor} set.
	 * @param count {number} The number of colors to return.
	 * @param hexValue {boolean} If true, returns the hex value instead of the name.
	 * @return {string[]}
	 */
	static randomKnownColors(count: number = 10, hexValue: boolean = false): string[] {
		const names = _.keys(NamedColor);
		const result: string[] = [];
		for (let i = 0; i < count; i++) {
			const name = _.sample(names);
			result.push(hexValue ? NamedColor[name] : name);
		}
		return result;
	}

	/**
	 * Returns the name of the given hex value if it matches a named color.
	 * @param hex {string} An hex color.
	 * @returns {string|null}
	 */
	static getKnownColorFromHex(hex: string): any {
		return _.findKey(NamedColor, (hx: string) => hx.toLowerCase() === hex.toLowerCase()) || null;
	}

	static getKnownColorFromHsl(hsl) {
		const hex = Colors.rgb2hex(Colors.hsl2rgb(hsl));
		return _.findKey(NamedColor, (hx: string) => hx.toLowerCase() === hex.toLowerCase()) || null;
	}

	static getKnownColorFromRgb(rgb) {
		const hex = Colors.rgb2hex(rgb);
		return _.findKey(NamedColor, (hx) => hx.toLowerCase() === hex.toLowerCase()) || null;
	}

	/**
	 * Converts the hex color to rgb (as a 3-array).
	 * @param hex {string} A hex color.
	 * @returns {number[]|null}
	 */
	static hex2rgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
	}

	/**
	 * Converts the given RGB to a hex color.
	 * @param args {number[]} A 3-array representing RGB.
	 * @returns {string}
	 */
	static rgb2hex(...args) {
		function componentToHex(c) {
			const hex = c.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		}

		const [r, g, b] = Colors.#toTriple(args);
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	/**
	 * Attempts to convert the given arguments to a color triple (HSL or RGB).
	 * @param args
	 * @returns {*[]|*}
	 */
	static #toTriple(args) {
		if (args.length === 0) {
			throw new Error(Strings.IsNil("color triple"));
		} else if (args.length === 1) {
			const given = args[0];
			if (_.isArray(given) && given.length === 3) {
				const [r, g, b] = given;
				return [r, g, b];
			}
			throw new Error("Colors.rgb2hex should be an array with three values representing the RGB values.");
		} else if (args.length === 3) {
			return args;
		} else {
			throw new Error("Color as RGB or HSL should be an array with three values.");
		}
	}

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and l in the set [0, 1].
	 */
	static rgb2hsl(...args) {
		let [r, g, b] = Colors.#toTriple(args);
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h,
			s,
			l = (max + min) / 2;
		if (max === min) {
			h = s = 0; // achromatic
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return [h, s, l];
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 */
	static hsl2rgb(...args) {
		let r, g, b;
		const [h, s, l] = Colors.#toTriple(args);
		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const hue2rgb = function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	static hex2hsl(hex) {
		return Colors.rgb2hsl(Colors.hex2rgb(hex));
	}

	static hsl2hex(...args) {
		const rgb = Colors.hsl2rgb(...args);
		return Colors.rgb2hex(rgb);
	}
}

