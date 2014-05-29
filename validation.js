/*jslint
browser: true, devel: true, plusplus: true, unparam: true, todo: true, vars: true, white: true, nomen: true
*/

/*global _ */

/**
 * Simple Verification Methods (leveraging lodash)
 * 'val' is required. All other arguments are optional.
 * @type {Object}
 */
var isValid = (function () { "use strict";
    return {
        boolean  : function (val) {
            return _.isBoolean(val);
        },
        string   : function (val, regEx) {
            var regExValid = (regEx !== undefined && _.isRegExp(regEx)) ? regEx.test(val) : true;
            return (_.isString(val) && regExValid);
        },
        func     : function (val) {
            return _.isFunction(val);
        },
        int      : function (val, min, max) {
            var minValid = (min !== undefined && _.isNumber(min)) ? (val >= min) : true;
            var maxValid = (max !== undefined && _.isNumber(max)) ? (val <= max) : true;
            return (_.isNumber(val) && val % 1 === 0 && minValid && maxValid);
        },
        float    : function (val, min, max) {
            var minValid = (min !== undefined && _.isNumber(min)) ? (val >= min) : true;
            var maxValid = (max !== undefined && _.isNumber(max)) ? (val <= max) : true;
            return (_.isNumber(val) && val % 1 !== 0 && minValid && maxValid);
        },
        array    : function (val, length, validateChildren) {
            var parValid = (_.isArray(val) && val.length <= length),
                childenValid = true,
                i;
            if (typeof validateChildren === "function") {
                for (i = 0; i < val.length; i++) {
                    if (!validateChildren(val[i])) {
                        console.log('invalid item match: ' + i + " : " + val[i]);
                        childenValid = false;
                        break;
                    }
                }
            }
            return (parValid && childenValid);
        },
        object   : function (val, length, validateChildren) {
            var parValid = (_.isPlainObject(val) && Object.keys(val).length <= length),
                childenValid = true,
                p;
            if (typeof validateChildren === "function") {
                for (p in val) {
                    if (val.hasOwnProperty(p) && !validateChildren(val[p])) {
                        console.log('invalid prop match: ' + p + ' : ' + val[p]);
                        childenValid = false;
                        break;
                    }
                }
            }    
            return (parValid && childenValid);
        }
    };
}());
