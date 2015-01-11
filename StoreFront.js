/*jslint
browser: true, devel: true, plusplus: true, unparam: true, todo: true, vars: true, white: true, nomen: true
*/

/*global store */

var StoreFront = function (defaults, tests) { "use strict";
    var store = window.store || {},
        _local = {},
        _defaults = defaults || {},
        _tests = tests || {},
        

        // Test Data Against Test Schema for Types & Lengths
        _verify = function (prop, value) {
            var tested = {},
                result = false;
            if (_tests && _tests.hasOwnProperty(prop)) {
                 result = _tests[prop](value);
            } else {
                console.error(prop + " does not have a test available.");
                result = true;
            }

            return result;
        },
        _verifyAll = function () {
            var tested = {},
                prop;
            if (_tests) {
                for (prop in _local) {
                    if (_local.hasOwnProperty(prop)) {
                        tested[prop] = _tests[prop](_local[prop]);
                    }
                }
            }
            return tested;
        },

        // Store.js v1.3.16 method wrappers
        _set = function (prop, value) {
            if (_verify(prop, value)) {
                _local[prop] = value;
                if (store.enabled && _defaults.hasOwnProperty(prop)) {
                    store.set(prop, value);
                }
            }
        },

        _get = function (prop) {
            return _local[prop];
        },

        _getAll = function () {
            return _local;
        },

        _remove = function (prop) {
            delete _local.prop;
            if (store.enabled) {
                store.remove(prop);
            }
        },

        _clear = function (prop) {
            _local = {};
            if (store.enabled) {
                store.clear();
            }
        },

        _forEach = function (callback) {
            var prop;
            for(prop in _local) {
                if(_local.hasOwnProperty(prop)) {
                    callback(prop, _local[prop]);
                }
            }
        },

        // StoreFront Methods
        _reset = function () {
            var prop;
            for(prop in _defaults) {
                if(_defaults.hasOwnProperty(prop)) {
                    _set(prop, _defaults[prop]);
                }
            }
        },

        _init = function () {
            var prop;

            if (!store.enabled) {
                console.log('Store.js not found.  Session options will not be saved.');
                _local = JSON.parse(JSON.stringify(_defaults));
            } else {
                // Sync
                _local = store.getAll();

                // Store new default property
                // Note: only first layer properties are detected)
                for(prop in _defaults) {
                    if (_defaults.hasOwnProperty(prop) && !_local.hasOwnProperty(prop)) {
                        console.log('New property: ', prop);
                        _set(prop, _defaults[prop]);
                    }
                }
                // Remove depreciated defaults
                // Note: only first layer properties are detected)
                for(prop in _local) {
                    if(_local.hasOwnProperty(prop) && !_defaults.hasOwnProperty(prop)) {
                        console.log('Depreciated property: ', prop);
                        _remove(prop);
                    }
                }

                // Sync Again after changes
                _local = store.getAll();
            }
        };

    _init();

    return {
        set : _set,
        get : _get,
        getAll : _getAll,
        remove : _remove,
        clear : _clear,
        forEach : _forEach,
        reset : _reset,
        verify : _verify,
        verifyAll : _verifyAll
    };
};
