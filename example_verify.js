/*jslint
browser: true, devel: true, plusplus: true, unparam: true, todo: true, vars: true, white: true, nomen: true
*/

/*global _, isValid, StoreFront */

/**
 * This page is more of an experiment at the time being
 */
"use strict";

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


/*
This example shows how multiple levels can be tested using nested
callback-style approach

    _Using validation.js methods_

    boolean  : function (val)
    string   : function (val, regEx)
    func     : function (val)
    int      : function (val, min, max)
    float    : function (val, min, max)
    array    : function (val, length, validateChildren)
    object   : function (val, length, validateChildren)
 */
var testsExample = {
    autokey       : function (val) { return isValid.boolean(val); },
    autofit       : function (val) { return isValid.boolean(val); },
    color_current : function (val) { return isValid.string(val, /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i); },
    color_palette : function (val) { 
                        return isValid.array(val, 10,
                            function (child) {
                                return isValid.string(child, /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i);
                            });
                    },
    viewport      : function (val) { return isValid.object(val, 10); },
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
var sf = new StoreFront(schemaDefaults, testsExample);
var results = sf.verify('autokey', 2);
console.log(results);
