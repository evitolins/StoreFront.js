// StoreFront.js example usage

// Define your defaults during instantiation.
// StoreFront will detect and update your store-js data to reflect your current "schema"
// Currently, only changes to the first layer will be detected
var defaults = {
    userName : "Bob",
    enableTooltips : true,
    enableEditing: false,
    fgColor : [3,56,233],
    bgColor : [255,255,225],
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
    }
};

// Instantiate
var options = new StoreFront(defaults);

// List Current Options
var all = options.getAll();
console.log(all);

// Update an option's value
options.set('fgColor', [123,24,26]);

// Setting properties which are not within the 'defaults' object will work, but will not be stored.
options.set('userPhone', '555-5555');

var fgColor = options.get('fgColor');
var pencil = options.get('brushes').pencil;
var eraserSize = options.getAll().brushes.eraser.size;
var phone = options.get('userPhone');

console.log(fgColor, pencil, eraserSize, phone);
