/**
 * This page is more of an experiment at the time being
 */

// Type Detection (via lodash)
var get_dataTypes = function (val) {
    var type = [];
    if (_.isArguments(val)) type.push("isArguments");
    if (_.isArray(val)) type.push("isArray");
    if (_.isBoolean(val)) type.push("isBoolean");
    if (_.isDate(val)) type.push("isDate");
    if (_.isElement(val)) type.push("isElement");
    if (_.isEmpty(val)) type.push("isEmpty");
    if (_.isEqual(val)) type.push("isEqual");
    if (_.isFinite(val)) type.push("isFinite");
    if (_.isFunction(val)) type.push("isFunction");
    if (_.isNaN(val)) type.push("isNaN");
    if (_.isNull(val)) type.push("isNull");
    if (_.isNumber(val)) type.push("isNumber");
    if (_.isObject(val)) type.push("isObject");
    if (_.isPlainObject(val)) type.push("isPlainObject");
    if (_.isRegExp(val)) type.push("isRegExp");
    if (_.isString(val)) type.push("isString");
    if (_.isUndefined(val)) type.push("isUndefined");
    return type;
};

// Simple Verification
var isValid = {
    boolean  : function (val) {
        return _.isBoolean(val);
    },
    string   : function (val, regEx) {
        var regExValid = (regEx !== undefined && _.isRegExp(regEx)) ? regEx.test(val) : true;
        return (_.isString(val) && regExValid);
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
    func     : function (val) {
        return _.isFunction(val);
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

var regExs = {
    hexColor : /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i
};


var verifyData = function (schema, tests) {
    // Scan Schema for Types & Lengths
    var lengths = {},
        types = {},
        tested = {},
        type, len, p;

    for (p in schema) {
        if (schema.hasOwnProperty(p)) {

            // Collect Data Type
            type = get_dataTypes(schema[p]);
            types[p] = type;

            // Check Array Lengths
            if (typeof schema[p] === "object" && schema[p] && schema[p].length) {
                lengths[p] = schema[p].length;
            }
            // Check Object Lengths
            if (typeof schema[p] === "object" && schema[p] && Object.keys(schema[p]).length) {
                lengths[p] = Object.keys(schema[p]).length;
            }
            // Peform Custom Tests
            tested[p] = tests[p](schema[p]);

        }
    }

    return {
    types : types,
    lengths : lengths,
    tested : tested
    };
};



var schemaDefaults = {
    autokey : true,
    autofit : false,
    color_current : '#75B2E6',
    color_palette : [
        '#111', '#555', '#AAA', '#FFF', '#FEA', '#F1AB2C', '#F44', '#8C75E6', '#75B2E6', '#65BD3C'
    ],
    viewport : {
        lighttable : false,
        lighttable_pre : 1,
        lighttable_post : 1,
        displayMedia : true,
        displayKeyframes : true,
        scrubAudio : true,
        brightness : 0
    },
    brushes : {
        pencil : {
            size : 3,
            blur : 0,
            alpha : 100     
        },
        eraser : {
            size : 10,
            blur : 0,
            alpha : 100
        }
    },
    funcTest : function () {console.log("hi!");},
    floatTest : 1.3,
    intTest : 1
};




var testsExample = {
    autokey       : function (val) { return isValid.boolean(val); },
    autofit       : function (val) { return isValid.boolean(val); },
    color_current : function (val) { return isValid.string(val, regExs.hexColor); },
    color_palette : function (val) { 
                        return isValid.array(val, 10,
                            function (child) {
                                return isValid.string(child, regExs.hexColor);
                            } )
                    },
    viewport      : function (val) { return isValid.object(val, 10)},
    brushes       : function (val) {
                        return isValid.object(val, 10, 
                            function (child) { 
                                return isValid.object(child, 3, 
                                    function (child) {
                                        return isValid.int(child, 0 , 100);
                                    });
                            });
                    },
    funcTest      : function (val) { return isValid.func(val); },
    floatTest     : function (val) { return isValid.float(val); },
    intTest       : function (val) { return isValid.int(val, 0 , 10); }
};

// Test Data and Log Results
var results = verifyData(schemaDefaults, testsExample);
console.log(results);
