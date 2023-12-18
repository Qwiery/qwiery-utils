import { describe, test, it, expect } from "vitest";

import _ from "lodash";

import { Utils } from "../src/utils";
const getNumber = Utils.getNumber;
const getFloat = Utils.getFloat;
const isEmpty = Utils.isEmpty;
const getInteger = Utils.getInteger;

describe("Utils", function () {
	it("should resolve numbers", function () {
		expect(getNumber("44d")).toEqual(44);
		expect(getNumber("414")).toEqual(414);
		expect(getNumber(-3)).toEqual(-3);
		expect(getNumber("")).toEqual(0);
		expect(getNumber("d")).toEqual(0);
		expect(getNumber("-23d")).toEqual(-23);
		expect(getNumber(null)).toEqual(NaN);

		expect(getInteger(null)).toEqual(NaN);
		expect(getInteger(2.3)).toEqual(2);
		expect(getInteger("3.4")).toEqual(3);
		// expect(getInteger(new Date())).toEqual(Date.now());
	});
	it("should title case things", function () {
		let s = "this is it!";
		expect(Utils.titleCase(s)).toEqual("This Is It!");
		s = "wonderTime";
		expect(Utils.titleCase(s)).toEqual("Wondertime");
	});
	it("should test for empty", function () {
		expect(isEmpty(0)).toBeFalsy();
		expect(isEmpty(1)).toBeFalsy();
		expect(isEmpty(true)).toBeFalsy();
		expect(isEmpty(false)).toBeFalsy();
		expect(isEmpty({ x: 4 })).toBeFalsy();
		expect(isEmpty({})).toBeTruthy();
		expect(isEmpty("   ")).toBeTruthy();
		expect(isEmpty(2.3)).toBeFalsy();
		expect(isEmpty(0.04)).toBeFalsy();
		expect(isEmpty(null)).toBeTruthy();
		expect(isEmpty(NaN)).toBeTruthy();
		expect(isEmpty([])).toBeTruthy();
		expect(isEmpty([1, 3])).not.toBeTruthy();
	});

	it("should get floats", function () {
		expect(getFloat("2d")).toEqual(2);
		expect(getFloat("2w")).toEqual(14);
		expect(getFloat("1.5m")).toEqual(45);
	});
	it("should render currency", function () {
		// weird thing here: Wallaby vs jest is not the same: one expects US$ and the other only $... no idea why
		// expect(Utils.amountToMoneyFormat(12)).toEqual("US$12.00");
		expect(Utils.amountToMoneyFormat(1, "EUR")).toEqual("€1.00");
		expect(Utils.amountToMoneyFormat(10)).toEqual("US$10.00");
		expect(Utils.amountToMoneyFormat(null, "EUR")).toEqual("");
		expect(Utils.amountToMoneyFormat("a", "EUR")).toEqual("");
		expect(Utils.amountToMoneyFormat(true, "EUR")).toEqual("");
		expect(Utils.amountToMoneyFormat(2.3, "USD")).toEqual("US$2.30");
		expect(Utils.amountToMoneyFormat(2.3, "P")).toEqual("");
		expect(Utils.amountToMoneyFormat(2.3, "  ")).toEqual("US$2.30");
	});
	it("should render yes or no", function () {
		expect(Utils.boolToYesNo("y")).toEqual("Yes");
		expect(Utils.boolToYesNo("yep")).toEqual("Yes");
		expect(Utils.boolToYesNo("nope")).toEqual("No");
		expect(Utils.boolToYesNo(false)).toEqual("No");
		expect(Utils.boolToYesNo(true)).toEqual("Yes");
		expect(Utils.boolToYesNo(0.1)).toEqual("Yes");
		expect(Utils.boolToYesNo(null)).toEqual("No");
		expect(Utils.boolToYesNo(undefined)).toEqual("No");
	});
	it("should title-ize variables", function () {
		expect(Utils.camelTypeToTitle("itWorks")).toEqual("It Works");
		expect(Utils.camelTypeToTitle("v10")).toEqual("V10");
		expect(Utils.camelTypeToTitle("WhatNot")).toEqual("What Not");
	});
	it("should get subfolder", function () {
		expect(Utils.getSubFolders(["/a/b"], "/a")).toEqual(["b"]);
		expect(Utils.getSubFolders(["/a/b"])).toEqual(["a"]);
		expect(Utils.getSubFolders(["/A/a", "/A/b"], "/A")).toEqual(["a", "b"]);
	});
	it("should format files sizes", function () {
		expect(Utils.formatFileSize(1025)).toEqual("1KB");
		expect(Utils.formatFileSize(1e10)).toEqual("9.31GB");
	});

	it("should get a JSON part", function () {
		expect(Utils.getJsonPart({ a: { b: 2 } }, "a.b")).toEqual(2);
		expect(Utils.getJsonPart({ a: { b: 2 } })).toEqual({ a: { b: 2 } });
		expect(Utils.getJsonPart({ a: { b: 2 } }, "a.b.c")).toBeNull();
	});

	it("should ensure a JSON part", function () {
		expect(Utils.ensureJsonPath({ a: 3 }, "a.b")).toEqual({ a: { b: {} } });
		expect(Utils.ensureJsonPath({ a: { b: { c: 3 } } }, "a.b")).toEqual({ a: { b: { c: 3 } } });
		expect(Utils.ensureJsonPath(null, "a.b")).toEqual({ a: { b: {} } });
		expect(Utils.ensureJsonPath({}, "attributes.text.content")).toEqual({ attributes: { text: { content: {} } } });
		expect(Utils.ensureJsonPath({}, "attributes.text.content", 123)).toEqual({ attributes: { text: { content: 123 } } });
	});

	it("should deep replace", function () {
		let obj = {
			a: {
				b: 4,
				c: { r: "T" },
			},
		};
		expect(Utils.deepReplace(obj, "s", "a")).toEqual({ a: "s" });
		obj = {
			a: {
				b: 4,
				c: { r: "T" },
			},
		};
		expect(Utils.deepReplace(obj, "s", "a.c")).toEqual({ a: { b: 4, c: "s" } });
	});
	it("should get temp paths", function () {
		expect(Utils.getTempFilePath().slice(-3)).toEqual("tmp");
		expect(Utils.getTempFilePath(null, "abc").slice(-3)).toEqual("abc");
	});
	it("should test for integers", function () {
		expect(Utils.isInteger(3)).toBeTruthy();
		expect(Utils.isInteger(3.0)).toBeTruthy();
		expect(Utils.isInteger(3.03)).not.toBeTruthy();
		expect(Utils.isInteger(-4)).toBeTruthy();
		expect(Utils.isPositiveInteger(-4)).toBeFalsy();
		expect(Utils.isPositiveInteger(0)).toBeFalsy();
		expect(Utils.isPositiveInteger(0, true)).not.toBeFalsy();
		expect(Utils.isPositiveInteger(5)).toBeTruthy();

		expect(Utils.positiveNumberBetween(7, 0, 10)).toBeTruthy();
		expect(Utils.positiveNumberBetween(7, 0, 10, false)).toBeTruthy();
		expect(Utils.positiveNumberBetween(10, 0, 10, false)).not.toBeTruthy();
		expect(Utils.positiveNumberBetween(0, 0, 10, false, true)).toBeTruthy();
		expect(Utils.positiveNumberBetween(0, -30, -10, false, true)).toBeTruthy();
	});
	it("should create a histogram", function () {
		let a = [1, 1, 2, 3, 4, 5];
		expect(Utils.histogram(a, 5).map((v) => v.height)).toEqual([2, 1, 1, 1, 1]);
		expect(Utils.histogram(a, 2).map((v) => v.height)).toEqual([5, 1]);
	});
	it("should test for simple strings", function () {
		expect(Utils.isSimpleString("adfadf")).toBeTruthy();
		expect(Utils.isSimpleString("A")).toBeTruthy();
		expect(Utils.isSimpleString("g")).toBeTruthy();
		expect(Utils.isSimpleString("Aad423fadf")).toBeTruthy();
		expect(Utils.isSimpleString(null)).not.toBeTruthy();
		expect(Utils.isSimpleString(2342)).not.toBeTruthy();
		expect(Utils.isSimpleString(() => {})).not.toBeTruthy();
		expect(Utils.isSimpleString("")).not.toBeTruthy();
		expect(Utils.isSimpleString("s$df")).not.toBeTruthy();
		expect(Utils.isSimpleString("s_df")).not.toBeTruthy();
		expect(Utils.isSimpleString("1asdfAdf")).not.toBeTruthy();
		expect(Utils.isSimpleString("s-df")).not.toBeTruthy();
		expect(Utils.isSimpleString("s df")).not.toBeTruthy();
		expect(
			Utils.isSimpleString(`
		asfasd
		s
		`),
		).not.toBeTruthy();
	});
	it("should eval", function () {
		let ctx = { a: 4 };

		class Car {
			static s = 4;
		}

		global.Car = Car;
		Utils.eval("Car.s=9", ctx);
		expect(Car.s).toEqual(9);
		expect(Utils.eval("this.a", ctx)).toBeNull();
		Utils.eval("this.b=66", ctx);
		expect(ctx.b).toEqual(66);
	});
	it("should render mustache strings", function () {
		expect(Utils.mustache("It is {{num}}:34pm.", { num: 2 })).toEqual("It is 2:34pm.");
	});

	it("should insert at an index", function () {
		expect(Utils.insertAt([1, 2, 3], 4, 1)).toEqual([1, 4, 2, 3]);
		expect(Utils.insertAt([1, 2, 3], 4, -1)).toEqual([1, 2, 4, 3]);
	});

	it("should replace at an index", function () {
		expect(Utils.replaceAt(["a", "b", "c"], "r", 1)).toEqual(["a", "r", "c"]);
		expect(Utils.replaceAt(["a", "b", "c"], "r", 0)).toEqual(["r", "b", "c"]);
		expect(Utils.replaceAt(["a", "b", "c"], "r", 5)).toEqual(["a", "b", "c", "r"]);
	});

	it("should detect simple values", function () {
		expect(Utils.isSimpleValue(4)).toBeTruthy();
		expect(Utils.isSimpleValue(true)).toBeTruthy();
		expect(Utils.isSimpleValue("a")).toBeTruthy();
		expect(Utils.isSimpleValue(22.56)).toBeTruthy();
		expect(Utils.isSimpleValue([])).toBeTruthy();
		expect(Utils.isSimpleValue([1, 2])).toBeTruthy();
		expect(Utils.isSimpleValue(["t"])).toBeTruthy();
		expect(Utils.isSimpleValue(null)).toBeFalsy();
		expect(Utils.isSimpleValue(undefined)).toBeFalsy();
		expect(Utils.isSimpleValue({})).toBeFalsy();
		expect(Utils.isSimpleValue({ a: 4 })).toBeFalsy();
		expect(Utils.isSimpleValue([{ a: 5 }])).toBeFalsy();
		const fun = () => true;
		expect(Utils.isSimpleValue(fun)).toBeFalsy();
	});

	it("should reduce a plain object", function () {
		expect(Utils.getReducedPlainObject({ a: 4, b: 6 })).toEqual({ a: 4, b: 6 });
		expect(Utils.getReducedPlainObject({ a: 4, b: 6 }, ["b"])).toEqual({ a: 4 });
		expect(Utils.getReducedPlainObject({ a: 4, b: 6 }, "b")).toEqual({ a: 4 });
		expect(Utils.getReducedPlainObject({ a: 4, b: 6 }, ["b", "a"])).toEqual({});
	});

	it("should get labels from specs", function () {
		expect(Utils.getLabelsFromSpecs(null, null, null)).toEqual([]);
		expect(Utils.getLabelsFromSpecs(null, null, [null])).toEqual([]);
		expect(Utils.getLabelsFromSpecs(null, null, [2])).toEqual([]);
		expect(Utils.getLabelsFromSpecs(null, null, [true])).toEqual([]);
		expect(Utils.getLabelsFromSpecs(null, null, [{ g: 6 }])).toEqual([]);
		expect(Utils.getLabelsFromSpecs(null, null, ["g"])).toEqual(["g"]);
		expect(Utils.getLabelsFromSpecs(null, null, ["a", "a"])).toEqual(["a"]);
		expect(Utils.getLabelsFromSpecs({}, "h", ["a", "a"])).toEqual(["a"]);
		// explicit label param has priority
		expect(Utils.getLabelsFromSpecs({ labels: ["r"] }, "h", ["a", "a"])).toEqual(["a"]);
		expect(Utils.getLabelsFromSpecs({ labels: ["r"] }, "h", [])).toEqual([]);
		expect(Utils.getLabelsFromSpecs({ labels: ["r"] }, "h", null)).toEqual(["r"]);
		expect(Utils.getLabelsFromSpecs({ labels: ["r", "s"] }, "h", null)).toEqual(["r", "s"]);
		expect(Utils.getLabelsFromSpecs({ labels: "f" }, "h", null)).toEqual(["f"]);
		// singular
		expect(Utils.getLabelsFromSpecs({ label: "f" }, "h", null)).toEqual(["f"]);
	});

	it("should get the id from specs", function () {
		expect(Utils.getIdFromSpecs()).toBeNull();
		expect(Utils.getIdFromSpecs("a")).toEqual("a");
		expect(Utils.getIdFromSpecs("a")).toEqual("a");
		expect(Utils.getIdFromSpecs(true)).toEqual("true");
		expect(Utils.getIdFromSpecs(2.3)).toEqual("2.3");
		expect(Utils.getIdFromSpecs({ id: 3 })).toEqual("3");
		// explicit param has priority
		expect(Utils.getIdFromSpecs({ id: 3 }, 5)).toEqual("5");
		expect(Utils.getIdFromSpecs({ id: 3 }, 5, ["f"])).toEqual("5");
		// dubious case but well
		expect(Utils.getIdFromSpecs("g", 5, ["f"])).toEqual("g");
	});

	it("should check the typeName", function () {
		expect(() => Utils.validateJsonIsForType({}, "a")).toThrow(Error);
		expect(() => Utils.validateJsonIsForType({ typeName: "b" }, "a")).toThrow(Error);
		expect(Utils.validateJsonIsForType({ typeName: "a" }, "a")).toBeNull();
	});

	it("should get arguments", function () {
		expect(Utils.getArguments([4, 5])).toEqual([2, [4, 5]]);
		expect(Utils.getArguments([])).toEqual([0, []]);
		expect(Utils.getArguments(null)).toEqual([0, []]);
		expect(Utils.getArguments(undefined)).toEqual([0, []]);
		expect(Utils.getArguments([4, 5, "a"])).toEqual([3, [4, 5, "a"]]);
	});

	it("should get the id", function () {
		expect(Utils.getId({})).toBeNull();
		expect(Utils.getId([])).toBeNull();
		expect(Utils.getId("a")).toEqual("a");
		expect(Utils.getId({ id: "a" })).toEqual("a");
	});
	it("should check for string or number", function () {
		expect(Utils.isStringOrNumber(3)).toBeTruthy();
		expect(Utils.isStringOrNumber(3.3)).toBeTruthy();
		expect(Utils.isStringOrNumber("")).toBeTruthy();
		expect(Utils.isStringOrNumber(true)).not.toBeTruthy();
		expect(Utils.isStringOrNumber({})).not.toBeTruthy();
		expect(Utils.isStringOrNumber([])).not.toBeTruthy();
	});

	it("should get data from specs", function () {
		expect(Utils.getDataFromSpecs({})).toEqual(null);
		expect(Utils.getDataFromSpecs({ x: 5 })).toEqual({ x: 5 });
		expect(Utils.getDataFromSpecs([])).toEqual(null);
		expect(Utils.getDataFromSpecs({ id: "s", u: 90 })).toEqual({ u: 90 });
	});

	it("should merge arrays", function () {
		expect(Utils.mergeArrays([2, 3], [2, 3])).toEqual([2, 3]);
		expect(Utils.mergeArrays([2, 3], [4])).toEqual([2, 3, 4]);
		expect(() => Utils.mergeArrays([2, 3], null)).toThrow(Error);
	});

	it("should generate random integers", function () {
		const sample = _.range(1000).map((u) => Utils.randomInteger(1, 4));
		expect(_.every(sample, (i) => i >= 1 && i <= 4)).toBeTruthy();
	});
	it("should get the triple arguments", function () {
		expect(Utils.getTripleSpecs(1)).toEqual(["1", "*", "*"]);
		expect(Utils.getTripleSpecs("a", "b", "c")).toEqual(["a", "b", "c"]);
		expect(Utils.getTripleSpecs(["a", "b", "c"])).toEqual(["a", "b", "c"]);
		expect(Utils.getTripleSpecs("a", "b")).toEqual(["a", "b", "*"]);
		expect(Utils.getTripleSpecs("a", null, "c")).toEqual(["a", "*", "c"]);
		expect(() => Utils.getTripleSpecs(null)).toThrow(Error);
		expect(() => Utils.getTripleSpecs([1, 2, 3, 4])).toThrow(Error);
	});

	it('should test for alphanumeric', () => {
		expect(Utils.isAlphaNumeric("abc")).toBeTruthy()
		expect(Utils.isAlphaNumeric("ab3cA")).toBeTruthy()
		expect(Utils.isAlphaNumeric("4ab3cA")).toBeTruthy()

		expect(Utils.isAlphaNumeric("4#ab3cA")).not.toBeTruthy()
		expect(Utils.isAlphaNumeric("65465 sdf")).not.toBeTruthy()
		expect(Utils.isAlphaNumeric("  ")).not.toBeTruthy()

	});
});
