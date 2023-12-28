import {faker} from "@faker-js/faker";

import _ from "lodash";
import {Strings} from "./strings";
import {Durations} from "./durations";
import fs from "fs";
import os from "os";
import path from "path";
// import Durations from "./durations.js";
// import Errors from "./errors.js";
// from here https://emailregex.com/
const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;
export const Utils = {
    /**
     * Common validation rules.
     * @example
     * // If you use Vue
     * <v-text-field :rules="validationRules.required"
     *             label="First name"></v-text-field>
     */
    validationRules: {
        // istanbul ignore next
        required: (value) => !!value || "This attribute is required.",
        // istanbul ignore next
        notEmpty: (value) =>
            (value && value.toString().trim().length > 0) ||
            "This attribute is required.",
        // istanbul ignore next
        counter: (value) => (value && value.length >= 5) || "Min 5 characters",
        // istanbul ignore next
        coherent: (value) =>
            /^[a-zA-Z]+$/gi.test(value) ||
            "Only upper and lower case letters are allowed for the name.",
        // istanbul ignore next
        alphaNumeric: (value) =>
            /^\w+$/gi.test(value) || "Only letters and numbers are allowed here.",
        // istanbul ignore next
        text: (value) =>
            /^[a-zA-Z\s]*$/gi.test(value) ||
            "Only letters and white space are allowed for the name.",
        // istanbul ignore next
        email: (value) => emailRegex.test(value) || "Not a valid email address",
    },

    isAlphaNumeric(s) {
        if (Utils.isEmpty(s)) {
            return false;
        }
        return /^\w+$/gi.test(s);
    },

    isPropertyName(s) {
        if (!Utils.isAlphaNumeric(s)) {
            return false;
        }
        if (!/\d/.test(s.substring(0, 1))) {
            return false;
        }
        return true;
    },
    /**
     * Proper formatting of money amount.
     * If cannot be converted to a proper format an empty string will be returned.
     * @param amount {any} Likely a number
     * @param [currency=USD] {string} The currency to append (e.g. EUR, JPY, USD...)
     * @return {string}
     */
    amountToMoneyFormat(amount, currency = "USD") {
        if (_.isNil(amount) || _.isNaN(amount)) {
            return "";
        }
        if (_.isNil(currency) || currency.toString().trim().length === 0) {
            currency = "USD";
        }
        try {
            // const symbol = (_.find(currencyList, { text: currency }) || {}).symbol || "";
            let num = parseFloat(amount.toString());
            if (_.isNaN(num)) {
                return "";
            }
            const formatted = new Intl.NumberFormat("en-UK", {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
            }).format(num); // adds comma and two decimals

            return `${formatted}`;
        } catch (e: any) {
            console.warn(e.toString());
            return "";
        }
    },

    /**
     * Turns the given value into 'Yes' or 'No'.
     * @param b {any} Anything
     * @returns {string} Yes or No
     */
    boolToYesNo(b) {
        try {
            if (_.isNil(b)) {
                return "No";
            }
            b = b.toString().trim().toLowerCase();
            if (_.includes(["yes", "y", "yep", "yah", "duh", "si", "sure"], b)) {
                return "Yes";
            }
            if (_.includes(["no", "n", "nah", "nope", "never"], b)) {
                return "No";
            }

            if (b === "false") {
                return "No";
            }
            if (b === "true") {
                return "Yes";
            }
            return !!b ? "Yes" : "No";
        } catch (e) {
            return "No";
        }
    },

    /**
     * Turns a camel-type string into a title.
     * @param name {string} Typically, a variable like e.g. "groupName".
     * @returns {string}
     */
    camelTypeToTitle(name) {
        if (this.isEmpty(name)) {
            return "";
        }
        const tp = name.replace(/([a-z])([A-Z])/g, "$1 $2");
        return tp.charAt(0).toUpperCase() + tp.slice(1);
    },

    /**
     * Returns the sub-folder for the given level.
     * @param paths {string[]}
     * @param current
     * @returns {*[]|*}
     *
     * @example
     * // returns ["a","b"]
     * getSubFolders(["/A/a", "/A/b"], "/A")
     *
     * // returns ["a"]
     * getSubFolders(["/a/b"])
     */
    getSubFolders(paths, current = "/") {
        if (this.isEmpty(paths)) {
            return [];
        }
        let items = paths;
        if (current === "/") {
            return _.uniq(
                items
                    .map((p) => p.split("/"))
                    .map((p) => p[1])
                    .filter((p) => p.length > 0),
            );
        }
        items = items.filter((p) => p.startsWith(current));
        items = items.map((p) => p.slice(current.length));
        items = items.map((p) => p.split("/"));
        items = items.filter((a) => a.length > 1);

        items = items.map((a) => a[1]);
        return _.uniq(items);
    },

    /**
     * Returns a more human-readable file size from a raw amount.
     * @param size {number} The raw files size.
     * @returns {string}
     *
     * @example
     *
     * formatFileSize(1e10 ) // 9.31GB
     */
    formatFileSize(size) {
        if (size > 1024 * 1024 * 1024 * 1024) {
            return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + "TB";
        } else if (size > 1024 * 1024 * 1024) {
            return (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
        } else if (size > 1024 * 1024) {
            return (size / 1024 / 1024).toFixed(2) + "MB";
        } else if (size > 1024) {
            return (size / 1024).toFixed(0) + "KB";
        }
        return size.toString() + "B";
    },

    /**
     * Generic testing for diverse data types.
     * @param obj {*} Anything really.
     * @returns {boolean}
     */
    isEmpty(obj: any): boolean {
        if (_.isNil(obj)) {
            return true;
        }
        if (_.isString(obj)) {
            return obj.toString().trim().length === 0;
        } else if (_.isArray(obj)) {
            return obj.length === 0;
        } else if (_.isNumber(obj)) {
            return _.isNaN(obj);
        } else if (_.isPlainObject(obj)) {
            return _.keys(obj).length === 0;
        } else if (_.isBoolean(obj)) {
            return false;
        } else {
            return false;
        }
    },

    /**
     * The negation of {@link isEmpty}.
     * @param obj {*} Anything
     * @returns {boolean}
     */
    isDefined(obj: any): boolean {
        return !this.isEmpty(obj);
    },

    /**
     * An alias for {@link isEmpty}.
     * @param obj {*} Anything.
     * @returns {boolean}
     */
    isUndefined(obj): any {
        return this.isEmpty(obj);
    },

    /**
     * Returns a globally unique identifier (UUID v4).
     * @returns {string}
     * @example
     *
     * console.log(require("@graphminer/utils").id());
     * // 3ee5946e-9105-4270-b0ba-75bb3a434bf0
     */
    id() {
        return faker.string.uuid();
    },

    /**
     * Turn the given string to title-case. If the given string is camel-cased is will be split * e.g. 'aBird' becomes 'A Bird'.
     * @param str {string} A (camel-cased) string.
     * @return {string}
     */
    titleCase(str) {
        let upper = true;
        let newStr = "";
        for (let i = 0, l = str.length; i < l; i++) {
            // Note that you can also check for all kinds of spaces  with
            // str[i].match(/\s/)
            if (str[i] === " ") {
                upper = true;
                newStr += str[i];
                continue;
            }
            newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
            upper = false;
        }
        return newStr;
    },

    /***
     * Returns the property in the json from specified path.
     * @param d {object} A JSON object.
     * @param path {string} Path in the form "a.b.c".
     * @example
     * // using this object
     * {a:[1,2], b:{c:5}}
     * // you can access things via: a.1 or b.c
     *
     */
    getJsonPart(d: any, path: Nullable<string> = null) {
        if (Utils.isEmpty(d)) {
            return null
        }
        if (Utils.isEmpty(path)) {
            return d
        }
        if (path === ".") {
            return d;
        }
        let res;
        if (this.isDefined(d)) {
            if (this.isDefined(path)) {
                if (path.indexOf(".") > 0) {
                    const split = path.split(".");
                    while (split.length > 0) {
                        d = d[split.shift()];
                        if (!d) {
                            break;
                        }
                    }
                    res = d;
                } else {
                    res = d[path];
                }
            } else {
                res = d;
            }
        } else {
            res = "[?]";
        }
        return res || null;
    },

    /**
     * Creates the JSON path if not present.
     * @param obj {any} A plain object
     * @param path {string} A path definition (e.g. 'a.b.c').
     * @param value? {*} Optional value to set. If none given the empty object ('{}') will be set.
     * @returns {*}
     */
    ensureJsonPath: function (obj, path, value = undefined) {
        obj = obj || {};
        if (path === ".") {
            return obj;
        }
        let res = obj;
        let parent = res;
        let parentName = null;
        if (obj) {
            if (this.isDefined(path)) {
                if (path.indexOf(".") > 0) {
                    const split = path.split(".");

                    while (split.length > 0) {
                        const name = split.shift();
                        if (!_.isPlainObject(res)) {
                            parent[parentName] = {};
                            res = parent[parentName];
                        }
                        if (!res[name]) {
                            res[name] = value ?? {};
                        }
                        parent = res;
                        parentName = name;
                        res = res[name];
                    }
                    if (value !== undefined) {
                        parent[parentName] = value;
                    }
                } else {
                    res[path] = {};
                }
            }
        } else {
            res = {};
        }

        return obj;
    },
    /***
     * Replaces in object d the property path with obj.
     * If the path does not exist the value will not be created.
     @example
     const obj = {
     a: {
     b: 4,
     c: {r: "T"}
     }
     }
     deepReplace(obj, "s", "a") // give {a: "s"}

     * @param rootObject {Object} The object in which to replace at the given path.
     * @param path {String} Something like 'a.b.c'.
     * @param substitute {Object} The object which replaces the value.
     *

     */
    deepReplace(rootObject, substitute, path) {
        if (path === undefined) {
            path = "/";
        }
        if (path === "." || path === "/") {
            rootObject = substitute;
            return substitute;
        }
        if (this.isDefined(rootObject)) {
            if (this.isDefined(path)) {
                let walker = rootObject;
                if (path.indexOf(".") > 0) {
                    const split = path.split(".");
                    while (split.length > 1) {
                        walker = walker[split.shift()];
                    }
                    const lastProperty = split.shift();
                    if (walker.hasOwnProperty(lastProperty)) {
                        // if path exists
                        walker[lastProperty] = substitute;
                    }
                } else {
                    if (rootObject.hasOwnProperty(path)) {
                        rootObject[path] = substitute;
                    }
                }
            } else {
                rootObject = substitute;
            }
        } else {
            throw new Error("No object given to replace parts of.");
        }
        return rootObject;
    },

    /**
     * Returns an OS-specific, temporary file path.
     * @param [fileName=null] {string} If not given a random name will be generated.
     * @param [extension="tmp"] {string} The extension to use.
     * @returns {string}
     */
    getTempFilePath(fileName = null, extension = "tmp") {
        const tempDir = os.tmpdir();
        if (this.isEmpty(fileName)) {
            fileName = this.randomId();
        }
        return path.join(tempDir, `${fileName}.${extension}`);
    },

    /**
     * Creates a zero-size temporary file and returns the path.
     * See also {@link getTempFilePath}.
     * @param [fileName=null] {string} If not given a random name will be generated.
     * @param [extension="tmp"] {string} The extension to use.
     * @returns {string}
     */
    createTempFile(fileName = null, extension = "tmp") {
        const filePath = this.getTempFilePath();
        fs.closeSync(fs.openSync(filePath, "w"));
        return filePath;
    },

    /**
     * Deletes the specified file or directory.
     * @param filePath {string} Path representing a file or a directory.
     */
    deleteFileOrDirectory(filePath) {
        if (this.isEmpty(filePath)) {
            return;
        }
        if (fs.existsSync(filePath)) {
            if (this.isDirectory(filePath)) {
                fs.rmSync(filePath, {recursive: true, force: true});
            } else {
                fs.rmSync(filePath);
            }
        }
    },

    /**
     * Returns whether the given path is a directory.
     * @param somePath {string} Path to something.
     * @returns {boolean}
     */
    isDirectory(somePath) {
        if (this.isEmpty(somePath)) {
            return false;
        }
        return fs.lstatSync(somePath).isDirectory();
    },
    /**
     * Generates a random identifier with default length 10.
     * @param length {Number} The length of the identifier to be generated.
     * @param onlyLetters {boolean} if true will use only letters, otherwise letters and numbers are used.
     * @returns {string} The id in string format.
     * @see {@link id}
     */

    randomId(length = 10, onlyLetters = false) {
        if (this.isEmpty(length)) {
            length = 10;
        } else {
            if (!_.isNumber(length)) {
                throw new Error(
                    "Length specification in 'randomId' needs to be a number.",
                );
            }
            length = parseInt(length.toString());
            if (_.isNaN(length)) {
                throw new Error(
                    "Length specification in 'randomId' needs to be a number.",
                );
            }
            if (length < 1) {
                throw new Error(
                    "Cannot generate a randomId with length less than one.",
                );
            }
        }
        // old version return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
        let result = "";
        const chars = onlyLetters
            ? "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = length; i > 0; --i) {
            result += chars.charAt(Math.round(Math.random() * (chars.length - 1)));
        }
        return result;
    },

    /**
     * Generates a random integer with the given boundary values included.
     * @param [from=0] {number} The start of the interval.
     * @param [to=1e10] {number} The end of the interval.
     * @returns {number}
     */
    randomInteger(from = 0, to = 1e10) {
        if (to - from < 1) {
            throw new Error(
                "The bounds should be integers and differ by at least one.",
            );
        }
        return Math.round(from + (to - from) * Math.random());
    },

    /**
     * Returns a random letter.
     * @return {string}
     * @param mixedCase? {boolean} Whether the letter can be either upper or lower cased. Defaults to true.
     */
    randomLetter(mixedCase = true) {
        const upper = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const lower = upper.toLowerCase();
        if (mixedCase) {
            return Math.random() < 0.5 ? upper : lower;
        } else {
            return lower;
        }
    },

    /**
     * Returns a string of random letters with the specified length.
     * @param length? {number} The length of the output, defaults to 10.
     * @param mixedCase? {boolean} Whether the letter can be either upper or lower cased. Defaults to true.
     * @return {any}
     */
    randomLetters(length = 10, mixedCase = true) {
        length = Math.max(1, Math.min(500, length));
        return _.range(length)
            .map((i) => this.randomLetter(mixedCase))
            .join("");
    },

    randomImageUrl() {
        // return faker.image.imageUrl(640, 480, "nature", true)
        return `https://picsum.photos/seed/${Utils.randomId()}/300/300`;
    },
    randomImageData() {
        return faker.image.dataUri();
    },
    /**
     * Throws an error if the given JSON does not have the correct attribute "typeName".
     *
     * @param json {*} Some serialized entity.
     * @param typeName {string} The expected serialized type.
     */
    validateJsonIsForType(json, typeName) {
        if (_.isPlainObject(json)) {
            if (this.isEmpty(json.typeName) && this.isEmpty(json.name)) {
                throw new Error(Strings.IsNil("json.typeName", `${typeName}.fromJSON`));
            }
            const name = json.typeName || json.name;
            if (name !== typeName) {
                throw new Error(Strings.Invalid(json.typeName, `${typeName}.fromJSON`));
            }
        } else {
            throw new Error(Strings.ExpectedPlainObject(`${typeName}.fromJSON`));
        }
        return null;
    },

    /**
     * Returns variable arguments in a format which can be more easily handled by downstream handlers.
     * @param options {any[]} the array of options
     * @returns {[number, any[]]} [length of options, array of options]
     *
     * @example
     * // gives [2,[6,"a"]]
     * console.log(getArguments(6,"a"))
     */
    getArguments(options) {
        if (_.isNil(options)) {
            return [0, []];
        }
        return [
            options.length,
            _.reduce(
                options,
                function (total, item) {
                    total.push(item);
                    return total;
                },
                [],
            ),
        ];
    },
    /**
     * An alias for {@link getFloat}.
     * @param d {any} Something like a number.
     * @return {number}
     */
    getNumber(d) {
        return Utils.getFloat(d);
    },

    /**
     * Attempts to get the number out of the given object.
     * @param d {any} Something like a number.
     * @return {number}
     */
    getInteger(d) {
        const num = Utils.getNumber(d);
        if (_.isNaN(num)) {
            return NaN;
        }
        return Math.round(num);
    },

    /**
     * Attempts to get a string out of the given object.
     * @param obj
     * @returns {*|string|null}
     */
    getString(obj) {
        if (_.isNil(obj)) {
            return null;
        }
        if (_.isFunction(obj)) {
            return this.getString(obj());
        }
        if (_.isString(obj)) {
            return obj.toString().trim();
        }
        if (_.isNumber(obj)) {
            return obj.toString();
        }
        return null;
    },

    getId(obj) {
        if (_.isNil(obj)) {
            return null;
        }
        if (_.isFunction(obj)) {
            return this.getString(obj());
        }
        if (_.isPlainObject(obj) || _.isObjectLike(obj)) {
            return this.getString(obj["id"]);
        }
        return obj.toString().trim();
    },

    /**
     * Attempts to get the number out of the given object.
     * @param d {any} Something like a number.
     * @return {number}
     */
    getFloat(d) {
        if (_.isNil(d)) {
            return NaN;
        }
        if (_.isNumber(d)) {
            return d;
        }
        if (_.isDate(d)) {
            return d.getTime();
        }
        // const durations = import("./durations");

        const num = Durations.durationToDays(d);
        if (_.isNaN(num)) {
            return NaN;
        }
        return num;
    },
    isInteger(i) {
        return this.getInteger(i) === i;
    },
    isPositiveInteger(i, allowZero = false) {
        if (allowZero) {
            return this.getInteger(i) === i && i >= 0;
        } else {
            return this.getInteger(i) === i && i > 0;
        }
    },

    /**
     * Tests for integers within the specified interval.
     * @param i {number}
     * @param a
     * @param b
     * @param inclusiveEnd
     * @param allowZero
     * @returns {boolean}
     */
    positiveNumberBetween(i, a, b, inclusiveEnd = true, allowZero = false) {
        if (!_.isNumber(i)) {
            throw new Error("Expected a number to test for.");
        }
        if (!_.isNumber(a)) {
            throw new Error("Expected a number for the start of the interval.");
        }
        if (!_.isNumber(b)) {
            throw new Error("Expected a number for the end of the interval.");
        }
        if (a >= b) {
            throw new Error(
                "The start of the interval should be smaller than its end.",
            );
        }
        if (allowZero && i === 0) {
            return true;
        }
        if (this.isPositiveInteger(i, allowZero)) {
            if (inclusiveEnd) {
                return a <= i && i <= b;
            } else {
                return a <= i && i < b;
            }
        }
        return false;
    },
    isStringOrNumber(u, allowNil = false) {
        if (!allowNil && _.isNil(u)) {
            return false;
        }
        return _.isString(u) || _.isNumber(u);
    },
    /**
     * Returns the histogram of the given data for the amount of bins specified.
     * @param data
     * @param bins
     * @returns {*[]|*}
     */
    histogram(data, bins = 10) {
        if (bins === 1) {
            return [data.length];
        }
        const bin_width = (_.max(data) - _.min(data)) / (bins - 1);
        let min = Infinity;
        let max = -Infinity;

        for (const item of data) {
            if (item < min) min = item;
            else if (item > max) max = item;
        }

        // const bins = Math.ceil((max - min + 1) / bin_width);
        const histogram = new Array(bins).fill(0);

        for (const item of data) {
            histogram[Math.floor((item - min) / bin_width)]++;
        }
        const coll = [];
        for (let i = 0; i < histogram.length; i++) {
            coll.push({
                from: min + i * bin_width,
                to: min + (i + 1) * bin_width,
                height: histogram[i],
            });
        }
        return coll;
    },
    /**
     * Checks that the given string can act as a simple (variable) name.
     * Only alphanumeric and should not start with a number.
     * @param s {string} Any string.
     * @returns {boolean}
     */
    isSimpleString(s) {
        if (Utils.isEmpty(s)) {
            return false;
        }
        if (!_.isString(s)) {
            return false;
        }
        return /^[a-zA-Z]([a-zA-Z0-9])*$/gi.test(s);
    },
    /**
     * Safe evaluation of the given code in the specified context.
     * @param code
     * @param thisContext
     * @returns {any}
     */
    eval(code, thisContext) {
        let output;
        {
            let window = null;

            // global = null
            output = function () {
                try {
                    const f = new Function(code);
                    f.call(thisContext);
                    return null;
                } catch (e) {
                    return "Error: " + e.message;
                }
            }.call(thisContext);
        }
        return output;
    },
    /**
     * Replaces the {{placeholder}} patterns in the given string mustache style.
     * @param template {string} A string possibly containing mustache-like slots.
     * @param  data {*} A plain object with the slot replacements.
     *
     * @example
     *
     * Utils.mustache("It is {{num}}:34pm.",{num: 2})
     */
    mustache(template, data) {
        return faker.helpers.mustache(template, data);
    },
    shuffle(ar) {
        if (!_.isArray(ar)) {
            throw new Error(Strings.ShouldBeType("ar", "Array", "Utils.shuffle"));
        }

        return faker.helpers.shuffle(ar);
    },

    /**
     * Inserts the given value at the specified position.
     * Note that this method will NOT extend the array.
     * @param coll
     * @param item
     * @param index
     * @returns {*}
     */
    insertAt(coll, item, index) {
        coll.splice(index, 0, item);
        return coll;
    },
    replaceAt(coll, item, index) {
        coll.splice(index, 1, item);
        return coll;
    },
    getStringArray(obj) {
        if (_.isNil(obj)) {
            return [];
        }
        if (_.isArray(obj)) {
            return obj.map((item) => this.getString(item));
        }
        if (_.isString(obj)) {
            return obj
                .toString()
                .trim()
                .split(",")
                .map((s) => s.toString().trim())
                .filter((s) => s.length > 0);
        }
        if (_.isPlainObject(obj)) {
            return _.keys(obj);
        }
        return [];
    },

    /**
     * Returns the payload from the given parameters.
     *
     * @param data {*|function} Plain object or a function returning one.
     * @param id ?{string|function} An id or a function returning one.
     * @param labels? {string|string[]|function} A label, multiple labels or a function returning this.
     * @returns {*|null}
     */
    getDataFromSpecs(data, id = null, labels = null) {
        if (_.isNil(data)) {
            return null;
        }
        if (_.isFunction(data)) {
            return this.getDataFromSpecs(data());
        }
        if (_.isPlainObject(data)) {
            if (Utils.isEmpty(data)) {
                return null;
            }
            const d = _.clone(data);
            delete d.id;
            delete d.labels;
            return d;
        }
        return null;
    },

    /**
     * Returns the labels specified in the given parameters.
     * @param data {*|function} Plain object or a function returning one.
     * @param id? {string|function} An id or a function returning one.
     * @param labels? {string|string[]|function} A label, multiple labels or a function returning this.
     * @returns {*|null}
     */
    getLabelsFromSpecs(data = null, id = null, labels = null) {
        if (!_.isNil(labels)) {
            if (_.isArray(labels)) {
                return _.uniq(
                    labels
                        .filter((l) => !_.isNil(l))
                        .filter((l) => _.isString(l))
                        .map((l) => l.toString().trim()),
                );
            }
            // even if there are labels in the data, we prioritize the explicit ones
            return Utils.getStringArray(labels);
        } else {
            if (data && data.labels) {
                if (_.isArray(data.labels)) {
                    return data.labels.map((l) => l.toString().trim());
                }
                return Utils.getStringArray(data.labels);
            } else if (data && data.label) {
                return Utils.getStringArray(data.label);
            }
            return [];
        }
    },
    /**
     * Returns the id specified in the given parameters.
     * @param data {*|function} Plain object or a function returning one.
     * @param id? {string|function} An id or a function returning one.
     * @param labels? {string|string[]|function} A label, multiple labels or a function returning this.
     * @returns {string|null}
     */
    getIdFromSpecs(data = null, id = null, labels = null) {
        if (_.isString(data) || _.isNumber(data) || _.isBoolean(data)) {
            return data.toString().trim();
        }
        id = Utils.getString(id);
        if (Utils.isEmpty(id)) {
            if (Utils.isEmpty(data)) {
                // empty id and data
                return null;
            } else {
                // empty id but with data
                return Utils.getString(data.id);
            }
        } else {
            return id;
        }
    },
    /**
     * Merges the two arrays considered as sets (thus removing potential duplicates).
     * @param ar1 {*[]} An array.
     * @param ar2 {*[]} An array.
     * @returns {any[]}
     */
    mergeArrays(ar1, ar2) {
        if (_.isNil(ar1)) {
            throw new Error(Strings.IsNil("ar1", "Utils.mergeArrays"));
        }
        if (_.isNil(ar2)) {
            throw new Error(Strings.IsNil("ar2", "Utils.mergeArrays"));
        }
        const s = new Set(ar1);
        ar2.forEach((v) => s.add(v));
        return Array.from(s);
    },

    /**
     * Returns a copy of the given object without the excluded members specified.
     * @param obj {*} A plain object.
     * @param exclude {string[]|string} The members to exclude.
     * @returns {{}|*}
     */
    getReducedPlainObject(obj, exclude = []) {
        if (_.isNil(obj)) {
            return {};
        }
        if (_.isString(exclude)) {
            exclude = [exclude];
        }
        if (_.isPlainObject(obj)) {
            const pl = {};
            _.forEach(obj, (v, k) => {
                if (Utils.isSimpleValue(v) && !_.includes(exclude, k)) {
                    pl[k] = v;
                }
            });
            return pl;
        }
        return pl;
    },
    /**
     * Returns whether the given value is a value type (simple data type),
     * meaning it should be a string, boolean or number.
     * As an edge case, if nil is given this will return false.
     * This tests effectively checks that the given thing can be the value of a Cypher property.
     * @param value {*} Anything.
     * @returns {boolean}
     */
    isSimpleValue(value) {
        if (_.isNil(value)) {
            return false;
        }
        const allowed = [_.isNumber, _.isNil, _.isString, _.isArray, _.isBoolean];
        if (
            !_.some(
                allowed.map((a) => a(value)),
                (u) => u === true,
            )
        ) {
            return false;
        }
        // go down the tree
        if (_.isArray(value)) {
            for (const u of value) {
                if (!Utils.isSimpleValue(u)) {
                    return false;
                }
            }
        }
        return true;
    },
    /**
     * Returns true if this script runs in the browser.
     * @returns {boolean}
     */
    isBrowser() {
        return typeof window !== "undefined";
    },
    /**
     * Returns true if this script runs in NodeJs.
     * @returns {boolean}
     */
    isNodeJs() {
        return typeof process === "object";
    },
    /**
     * Returns the necessary specs to create/update an edge.
     * Note that things like the id can also be a function or a plain object etc.
     *
     * @param sourceId {string|*} The id of the source node.
     * @param targetId {string|null} The id of the target node.
     * @param data? {*} The payload.
     * @param id? {string} The id.
     * @param labels? {string[]} The labels.
     */
    getEdgeSpecs(
        sourceId,
        targetId = null,
        data = null,
        id = null,
        labels = null,
    ) {
        // edge definition via object
        if (_.isPlainObject(sourceId)) {
            // if second is nil the whole lot sits in the first argument
            if (Utils.isEmpty(targetId)) {
                // normalize, in case the source is given instead of sourceId
                if (sourceId.source) {
                    sourceId.sourceId = sourceId.source.id;
                    delete sourceId.source;
                }
                if (sourceId.target) {
                    sourceId.targetId = sourceId.target.id;
                    delete sourceId.target;
                }

                let obj = _.assign(
                    {
                        sourceId: null,
                        targetId: null,
                        data: null,
                        labels: [],
                        id: null,
                    },
                    sourceId,
                );
                const id = obj["id"];
                if (Utils.isEmpty(id)) {
                    const fromId = Utils.getId(obj["sourceId"]);
                    if (Utils.isEmpty(fromId)) {
                        throw new Error(Errors.sourceIdMissing());
                    }
                    const toId = Utils.getId(obj["targetId"]);
                    if (Utils.isEmpty(toId)) {
                        throw new Error(Errors.targetIdMissing());
                    }
                }

                // even if there is an explicit data param we ignore it here
                obj.data = Utils.getReducedPlainObject(sourceId, [
                    "id",
                    "labels",
                    "sourceId",
                    "targetId",
                ]);
                return obj;
            } else {
                // in this case the source and target are node specs
                const fromId = Utils.getId(sourceId);
                if (Utils.isEmpty(fromId)) {
                    throw new Error(Errors.sourceIdMissing());
                }
                const toId = Utils.getId(targetId);
                if (Utils.isEmpty(toId)) {
                    throw new Error(Errors.targetIdMissing());
                }
                const obj = {
                    sourceId: fromId,
                    targetId: toId,
                    data: Utils.getDataFromSpecs(data, id, labels),
                    labels: Utils.getLabelsFromSpecs(data, id, labels),
                    id: Utils.getIdFromSpecs(data, id, labels),
                };
                return obj;
            }
        } else {
            const fromId = Utils.getString(sourceId);
            const toId = Utils.getString(targetId);

            // if only the first is given we assume it's an edge id

            if (Utils.isEmpty(toId) && !Utils.isEmpty(fromId)) {
                return {
                    sourceId: null,
                    targetId: null,
                    data: null,
                    labels: null,
                    id: fromId,
                };
            } else {
                if (Utils.isEmpty(id) && Utils.isEmpty(data?.id)) {
                    if (Utils.isEmpty(fromId)) {
                        throw new Error(Errors.sourceIdMissing());
                    }
                    if (Utils.isEmpty(toId)) {
                        throw new Error(Errors.targetIdMissing());
                    }
                }
                const obj = {
                    sourceId: fromId,
                    targetId: toId,
                    data: Utils.getDataFromSpecs(data, id, labels),
                    labels: Utils.getLabelsFromSpecs(data, id, labels),
                    id: Utils.getIdFromSpecs(data, id, labels),
                };

                return obj;
            }
        }
    },
    /**
     * Attempts to interprete the given arguments as an SPO triple.
     * @param s {string|string[]} A subject or an SPO triple.
     * @param p {string} A predicate.
     * @param o {string} An object.
     * @returns string[]
     */
    getTripleSpecs(s, p, o) {
        if (_.isNil(s)) {
            throw new Error("A triple can't have a nil subject.");
        }
        if (_.isArray(s)) {
            if (s.length === 3) {
                return Utils.getTripleSpecs(s[0], s[1], s[2]);
            } else {
                throw new Error(
                    "Triple specification should be an array of length 3 or as SPO arguments.",
                );
            }
        }
        s = s.toString().trim();
        if (!_.isNil(p)) {
            p = p.toString().trim();
        } else {
            p = "*";
        }
        if (o === undefined) {
            o = "*";
        } else if (o === null) {
            o = "null";
        } else {
            o = o.toString().trim();
        }
        return [s, p, o];
    },

    /**
     * Returns the necessary specs to create/update a node.
     * Note that things like the id can also be a function or a plain object etc.
     *
     *
     * @param data? {*} The payload.
     * @param id? {string} The id.
     * @param labels? {string[]} The labels.
     * @returns {{id: string, data: *, labels: string[]}|null} The parsed elements to create a node from. The labels will be an empty array if no labels were specified.
     */
    getNodeSpecs(data = null, id = null, labels = null) {
        // special case: first param is a number considered as an id
        if (_.isNumber(data)) {
            data = data.toString();
        }
        // special case: first param returns a string is considered an id
        const foundId = Utils.getString(data);
        if (!Utils.isEmpty(foundId)) {
            return {
                id: foundId,
                data: null,
                labels: Utils.getLabelsFromSpecs(data, id, labels) || [],
            };
        }

        const specs = {
            id: Utils.getIdFromSpecs(data, id, labels),
            data: Utils.getDataFromSpecs(data, id, labels),
            labels: Utils.getLabelsFromSpecs(data, id, labels) || [],
        };
        if (_.isNil(id)) {
            if (_.isNil(specs.data)) {
                return null;
            } else {
                return specs;
            }
        } else {
            // if id is present in two places we prioritize the id
            if (specs.data?.id) {
                specs.data.id = specs.id;
            }
            return specs;
        }
    },

    mergeNodeSpecs(data = null, id = null, labels = null) {
        const specs = Utils.getNodeSpecs(data, id, labels);
        const node = specs.data || {};
        _.assign(node, {id: specs.id});
        _.assign(node, {labels: specs.labels});
        return _.clone(node);
    },
    isGraphLike(obj: any) {
        if (_.isNil(obj)) {
            return false;
        }
        if (_.isPlainObject(obj)) {
            if (!Utils.isEmpty(obj)) {
                if (obj.hasOwnProperty("nodes") && _.isArray(obj.nodes)) {
                    for (const node of obj.nodes) {
                        if(!Utils.isQwieryNode(node)){
                            return false;
                        }
                    }
                    if (obj.hasOwnProperty("edges") && _.isArray(obj.edges)) {
                        for (const edge of obj.edges) {
                            if(!Utils.isQwieryEdge(edge)){
                                return false;
                            }
                        }
                        return true;
                    }
                    return true;
                }
            }
        }
        return false;
    },
    isQwieryNode(obj: any) {
        if (_.isNil(obj)) {
            return false;
        }
        if (_.isPlainObject(obj)) {
            if (!Utils.isEmpty(obj)) {
                if (obj.hasOwnProperty("id") && Utils.isSimpleValue(obj.id) && !Utils.isEmpty(obj.id)) {
                    return true;
                }
            }
        }
        return false;
    },
    isQwieryEdge(obj: any) {
        if (_.isNil(obj)) {
            return false;
        }
        if (_.isPlainObject(obj)) {
            if (!Utils.isEmpty(obj)) {
                if (obj.hasOwnProperty("sourceId") && Utils.isSimpleValue(obj.sourceId) && !Utils.isEmpty(obj.sourceId) && obj.hasOwnProperty("targetId") && Utils.isSimpleValue(obj.targetId) && !Utils.isEmpty(obj.targetId)) {
                    return true;
                }
            }
        }
        return false;
    }
};
/**
 * A type alias for a nullable value.
 */
export type Nullable<T> = T | null;
