import _ from "lodash";
import {Nullable, Utils} from "~/utils";

// ===================================================================
// Consolidated error message templates.
// ===================================================================


export const Strings = {
    /**
     * Truncates the given string to the specified length if longer and adds dots.
     * @param str
     * @param maxLength
     * @returns {string|*}
     */
    truncateLongString(str, maxLength = 50) {
        if (_.isNil(str)) {
            return null;
        }
        if (_.isNil(maxLength)) {
            throw new Error(this.IsNil("maxLength", "string.truncateLongString"));
        }
        if (!_.isNumber(maxLength)) {
            throw new Error(this.ShouldBeType("maxLength", "number", "string.truncateLongString"));
        }
        if (maxLength <= 0) {
            throw new Error("The maximum length should be a positive integer.");
        }
        str = str.trim();
        return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
    },
    InterfaceMethod: () => `This method is part of an interface and should not be called directly.`,
    InvalidSchemaType: (typeName, propertyName, entityType) => `Type '${typeName}' in property '${propertyName}' of '${entityType}' is not valid.`,
    InvalidSchemaMissing: (memberName, entityType) => `Member '${memberName}' in '${entityType}' is missing.`,
    InvalidValueType: (typeName) => `Type '${typeName}' is not a valid value type.`,
    SettingsError: (e) => `Settings error: ${e}`,
    ShouldBeArray: (what) => `The value of '${what}' should be an array.`,
    /**
     * A value is null or undefined.
     * @example
     *  // The value of 'amount' is nil in 'addStuff'.
     * @constructor
     */
    IsNil: (what, where: string | null = null) => {
        if (_.isNil(where)) {
            return `The value of '${what}' is nil.`;
        } else {
            return `The value of '${what}' is nil in '${where}'.`;
        }
    },
    // istanbul ignore next
    NotImplementedAbstract: () => "This method has not been implemented by the inheritor.",
    // istanbul ignore next
    NotImplementedMethod: (methodName = null, objName = null) => {
        if (_.isNil(methodName)) {
            return "This method is not implemented yet.";
        }
        if (_.isNil(objName)) {
            return `The method '${methodName}' is not implemented.`;
        } else {
            return `The method '${methodName}' is not implemented by'${objName}' .`;
        }
    },
    // istanbul ignore next
    Invalid: (what, where = null) => {
        if (_.isNil(where)) {
            return `The value '${what}' is not valid.`;
        } else {
            return `The value '${what}' in '${where}' is not valid.`;
        }
    },
    // istanbul ignore next
    ExpectedPlainObject: (where = null) => {
        if (_.isNil(where)) {
            return "Expected a plain object.";
        } else {
            return `Expected a plain object in ${where}.`;
        }
    },
    // istanbul ignore next
    TypeConstraint: (types) => "The specified type should be one of the following: ${types.join(', '}",
    // istanbul ignore next
    TypeDoesNotExist: (typeName) => `The type '${typeName}' does not exist.`,
    // istanbul ignore next
    MemberDoesNotExist: (memberName, typeName) => `The member '${memberName}' does not exist on type '${typeName}'.`,
    // istanbul ignore next
    SealedEntity: () => `The entity has no schema and can't be altered. `,
    // istanbul ignore next
    PathDoesNotExist: (path, position = null, where = null) => {
        if (_.isNil(position)) {
            if (where) {
                return `The path '${path}' in '${where}' does not exist.`;
            } else {
                return `The path '${path}' does not exist.`;
            }
        } else {
            if (where) {
                return `The path '${path}' in '${where}' at position ${position} does not exist.`;
            } else {
                return `The path '${path}' at position ${position} does not exist.`;
            }
        }
    },
    // istanbul ignore next
    AbstractClass: (className) => `Class '${className}' is an abstract class and can't be instantiated.`,
    // istanbul ignore next
    ExistsAlready: (what, where = null) => {
        if (_.isNil(what)) {
            return `'${what}' already exists.`;
        } else {
            return `'${what}' already exists in '${where}'.`;
        }
    },
    // istanbul ignore next
    WrongDeserializationType: (given, expected) => `Wrong deserialization type, '${given}' was given but should be '${expected}'.`,
    // istanbul ignore next
    ForInheritors: () => "This should be implemented by inheritors.",
    // istanbul ignore next
    NoReturn: (methodName) => `Nothing was returned by method '${methodName}'.`,
    // istanbul ignore next
    ShouldBeType: (name, type, where: Nullable<string> = null) => {
        if (_.isNil(where)) {
            return `Value of '${name}' should be a '${type}'.`;
        } else {
            return `Value of '${name}' in '${where}' should be a '${type}'.`;
        }
    },
    // istanbul ignore next
    WrongArguments: (where) => `Wrong arguments passed to '${where}'.`,
    // istanbul ignore next
    WrongArgument: (name, given, expected, where) => `Wrong argument passed to '${name}' in ${where}', was given type '${given}' but expected '${expected}'.`,
    // istanbul ignore next
    NotSupported: (typeName, where = null) => {
        if (_.isNil(where)) {
            return `Type '${typeName}' is not supported.`;
        } else {
            return `Type '${typeName}' is not supported in '${where}'.`;
        }
    },
    // istanbul ignore next
    ServiceNotPresent: (serviceName) => `The service '${serviceName}' has not been registered.`,
    // istanbul ignore next
    AppDoesNotExist: () => "The application you tried to contact does not exist.",

    // istanbul ignore next
    MissingPackage: (packageName) => `Package '${packageName}' is not installed.`,
    // istanbul ignore next
    FailedPackageLoading: (packageName) => `Failed to load package '${packageName}'.`,

    randomLetters(length = 10, mixedCase = true) {
        return Utils.randomLetters(length, mixedCase);
    },
    camelToTitle(str) {
        return Utils.camelTypeToTitle(str);
    },
    /**
     * Splits the given string to an array.
     * @param s {string} A string representing an array
     * @param separator {string} The separator, by default ','.
     * @param ignoreEmpty {boolean} Whether the empty array entries should be remove from the result. Default is true.
     * @return {any[] | string[]}
     */
    stringToStringArray(s, separator = ",", ignoreEmpty = true) {
        if (Utils.isEmpty(s)) {
            return [];
        }
        const array = s
            .toString()
            .trim()
            .replace(/(\[|\])/gi, "")
            .split(separator)
            .map((p) => p.trim()); //?
        return ignoreEmpty ? array.filter((p) => p.length > 0) : array;
    },
    /**
     * Splits the given string to an array.
     * @param s {string} A string representing an array
     * @param separator {string} The separator, by default ','.
     * @param ignoreEmpty {boolean} Whether the empty array entries should be remove from the result. Default is true.
     * @return {any[] | string[]}
     */
    stringToNumberArray(s, separator = ",", ignoreEmpty = true) {
        if (Utils.isEmpty(s)) {
            return [];
        }
        const array = s
            .toString()
            .trim()
            .replace(/(\[|\])/gi, "")
            .split(separator)
            .map((p) => p.trim());
        return ignoreEmpty
            ? array //?
                .filter((p) => p.length > 0)
                .map((p) => parseFloat(p))
                .filter((f) => !isNaN(f))
            : array;
    },
    /**
     * Converts the given string into an array of JSON objects.
     * The CSV contained in the string has to have headers otherwise there are no object properties.
     * @param s {string} A string containing CSV records.
     * @param lineSeparator {string} How lines are split, by default via newlines '\n'.
     * @param recordSeparator {string} How records are split, by default ','.
     */
    csvToJson(s, lineSeparator = "\n", recordSeparator = ",") {
        const lines = s.split(lineSeparator);
        const headers = lines
            .shift()
            .split(recordSeparator)
            .map((x) => clean(x));

        function clean(r) {
            if (_.isNil(r)) {
                return "";
            }
            if (_.isString(r)) {
                return r.trim().replace(/\\r/gi, "");
            }
            return r;
        }

        const json:any[] = [];
        for (let i = 0; i < lines.length; i++) {
            const row = lines[i].split(recordSeparator).map((x) => clean(x));
            const blob = _.zipObject(headers, row);
            json.push(blob);
        }
        return json;
    },
};

