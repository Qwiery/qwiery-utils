import {describe, test, it, expect} from 'vitest'
import {Colors} from "../src/colors";

describe("Colors", function () {
    it("should fetch a random color name", function () {
        expect(Colors.randomKnownColor().length).toBeGreaterThan(0);
    });

    it("should convert between hex/hsl/rgb", function () {
        const hex = Colors.randomKnownColor(true).toLowerCase();
        const name = Colors.getKnownColorFromHex(hex);
        const rgb = Colors.hex2rgb(hex);
        const hex2 = Colors.rgb2hex(rgb);
        expect(Colors.getKnownColorFromHex(hex2)).toEqual(name);
        let hsl = Colors.rgb2hsl(rgb);
        expect(Colors.hsl2rgb(hsl)).toEqual(rgb);
        expect(Colors.getKnownColorFromHsl(hsl)).toEqual(name);
        expect(Colors.getKnownColorFromRgb(rgb)).toEqual(name);
        expect(Colors.hsl2hex(Colors.hex2hsl("#f3f2f1"))).toEqual("#f3f2f1");
        expect(Colors.hsl2hex(Colors.hex2hsl(hex))).toEqual(hex);

    });
});
