/**
 * This page is more of an experiment at the time being
 */

/**
 * Simple Verification Methods (leveraging lodash)
 * 'val' is required. All other arguments are optional.
 * @type {Object}
 */
var isValid = {
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


var verifyData = function (schema, tests) {
    // Scan Schema for Types & Lengths
    var tested = {},
        p;

    if (tests) {
        for (p in schema) {
            if (schema.hasOwnProperty(p)) {
                tested[p] = tests[p](schema[p]);
            }
        }
    }

    return tested;
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


var regExs = {
    hexColor : /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i
};


/*
This example shows how multiple levels can be tested using nested
callback-style approach
 */

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
