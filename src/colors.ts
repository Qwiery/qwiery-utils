import _ from 'lodash';
import { Strings } from './strings.js';

/**
 * Predefined CSS colors.
 */
const NamedColor = {
    black: '#000000',
    silver: '#C0C0C0',
    gray: '#808080',
    grey: '#808080',
    white: '#FFFFFF',
    maroon: '#800000',
    red: '#FF0000',
    purple: '#800080',
    fuchsia: '#FF00FF',
    green: '#008000',
    lime: '#00FF00',
    olive: '#808000',
    yellow: '#FFFF00',
    navy: '#000080',
    blue: '#0000FF',
    teal: '#008080',
    aqua: '#00FFFF',
    darkblue: '#00008B',
    mediumblue: '#0000CD',
    darkgreen: '#006400',
    darkcyan: '#008B8B',
    deepskyblue: '#00BFFF',
    darkturquoise: '#00CED1',
    mediumspringgreen: '#00FA9A',
    springgreen: '#00FF7F',
    cyan: '#00FFFF',
    midnightblue: '#191970',
    dodgerblue: '#1E90FF',
    lightseagreen: '#20B2AA',
    forestgreen: '#228B22',
    seagreen: '#2E8B57',
    darkslategray: '#2F4F4F',
    darkslategrey: '#2F4F4F',
    limegreen: '#32CD32',
    mediumseagreen: '#3CB371',
    turquoise: '#40E0D0',
    royalblue: '#4169E1',
    steelblue: '#4682B4',
    darkslateblue: '#483D8B',
    mediumturquoise: '#48D1CC',
    indigo: '#4B0082',
    darkolivegreen: '#556B2F',
    cadetblue: '#5F9EA0',
    cornflowerblue: '#6495ED',
    rebeccapurple: '#663399',
    mediumaquamarine: '#66CDAA',
    dimgray: '#696969',
    dimgrey: '#696969',
    slateblue: '#6A5ACD',
    olivedrab: '#6B8E23',
    slategray: '#708090',
    slategrey: '#708090',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    mediumslateblue: '#7B68EE',
    lawngreen: '#7CFC00',
    chartreuse: '#7FFF00',
    aquamarine: '#7FFFD4',
    skyblue: '#87CEEB',
    lightskyblue: '#87CEFA',
    blueviolet: '#8A2BE2',
    darkred: '#8B0000',
    darkmagenta: '#8B008B',
    saddlebrown: '#8B4513',
    darkseagreen: '#8FBC8F',
    lightgreen: '#90EE90',
    mediumpurple: '#9370DB',
    darkviolet: '#9400D3',
    palegreen: '#98FB98',
    darkorchid: '#9932CC',
    yellowgreen: '#9ACD32',
    sienna: '#A0522D',
    brown: '#A52A2A',
    darkgray: '#A9A9A9',
    darkgrey: '#A9A9A9',
    lightblue: '#ADD8E6',
    greenyellow: '#ADFF2F',
    paleturquoise: '#AFEEEE',
    lightsteelblue: '#B0C4DE',
    powderblue: '#B0E0E6',
    firebrick: '#B22222',
    darkgoldenrod: '#B8860B',
    mediumorchid: '#BA55D3',
    rosybrown: '#BC8F8F',
    darkkhaki: '#BDB76B',
    mediumvioletred: '#C71585',
    indianred: '#CD5C5C',
    peru: '#CD853F',
    chocolate: '#D2691E',
    tan: '#D2B48C',
    lightgray: '#D3D3D3',
    lightgrey: '#D3D3D3',
    thistle: '#D8BFD8',
    orchid: '#DA70D6',
    goldenrod: '#DAA520',
    palevioletred: '#DB7093',
    crimson: '#DC143C',
    gainsboro: '#DCDCDC',
    plum: '#DDA0DD',
    burlywood: '#DEB887',
    lightcyan: '#E0FFFF',
    lavender: '#E6E6FA',
    darksalmon: '#E9967A',
    violet: '#EE82EE',
    palegoldenrod: '#EEE8AA',
    lightcoral: '#F08080',
    khaki: '#F0E68C',
    aliceblue: '#F0F8FF',
    honeydew: '#F0FFF0',
    azure: '#F0FFFF',
    sandybrown: '#F4A460',
    wheat: '#F5DEB3',
    beige: '#F5F5DC',
    whitesmoke: '#F5F5F5',
    mintcream: '#F5FFFA',
    ghostwhite: '#F8F8FF',
    salmon: '#FA8072',
    antiquewhite: '#FAEBD7',
    linen: '#FAF0E6',
    lightgoldenrodyellow: '#FAFAD2',
    oldlace: '#FDF5E6',
    magenta: '#FF00FF',
    deeppink: '#FF1493',
    orangered: '#FF4500',
    tomato: '#FF6347',
    hotpink: '#FF69B4',
    coral: '#FF7F50',
    darkorange: '#FF8C00',
    lightsalmon: '#FFA07A',
    orange: '#FFA500',
    lightpink: '#FFB6C1',
    pink: '#FFC0CB',
    gold: '#FFD700',
    peachpuff: '#FFDAB9',
    navajowhite: '#FFDEAD',
    moccasin: '#FFE4B5',
    bisque: '#FFE4C4',
    mistyrose: '#FFE4E1',
    blanchedalmond: '#FFEBCD',
    papayawhip: '#FFEFD5',
    lavenderblush: '#FFF0F5',
    seashell: '#FFF5EE',
    cornsilk: '#FFF8DC',
    lemonchiffon: '#FFFACD',
    floralwhite: '#FFFAF0',
    snow: '#FFFAFA',
    lightyellow: '#FFFFE0',
    ivory: '#FFFFF0',
};

/*
 * Color utilities.
 * */
export class Colors {
    /**
     * Returns a random color name from the {@link NamedColor} set.
     * @returns {*}
     */
    static randomKnownColor(hexValue = false) {
        const name = _.sample(_.keys(NamedColor));
        return hexValue ? NamedColor[name] : name;
    }

    /**
     * Returns the name of the given hex value if it matches a named color.
     * @param hex {string} An hex color.
     * @returns {string|null}
     */
    static getKnownColorFromHex(hex) {
        return _.findKey(NamedColor, (hx) => hx.toLowerCase() === hex.toLowerCase()) || null;
    }

    static getKnownColorFromHsl(hsl) {
        const hex = Colors.rgb2hex(Colors.hsl2rgb(hsl));
        return _.findKey(NamedColor, (hx) => hx.toLowerCase() === hex.toLowerCase()) || null;
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
            return hex.length === 1 ? '0' + hex : hex;
        }

        const [r, g, b] = Colors.#toTriple(args);
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    /**
     * Attempts to convert the given arguments to a color triple (HSL or RGB).
     * @param args
     * @returns {*[]|*}
     */
    static #toTriple(args) {
        if (args.length === 0) {
            throw new Error(Strings.IsNil('color triple'));
        } else if (args.length === 1) {
            const given = args[0];
            if (_.isArray(given) && given.length === 3) {
                const [r, g, b] = given;
                return [r, g, b];
            }
            throw new Error('Colors.rgb2hex should be an array with three values representing the RGB values.');
        } else if (args.length === 3) {
            return args;
        } else {
            throw new Error('Color as RGB or HSL should be an array with three values.');
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

