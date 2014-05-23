StoreFront.js
=============

A store.js extension adding a basic data schema, value defaults, and input validation.

> NOTE: This project is currently in alpha.  Features may not yet work as advertised.

## What?
StoreFront allows users to set a schema/default values for store.js.

StoreFront also acts as a buffer between store.js and your application.  All your '''get()''' queries access a synced object instead of constantly utilizing the browser's storage API.  In theory, this should speed up performance when data is accessed frequently.


## Why?
StoreFront allows users to easily store and retrieve key pair values, while store-js maintains and restores the data for later sessions.  If store-js is not found, StoreFront functions the same, but without leveraging the browser's local storage features.

Defining 'defaults' object also defines a psedo-schema.  Upon instantiation, StoreFront detects changes to this schema and removes any depreciated keys stored locally.  This allows store.js' data to stay clean, as you alter your softwares "schema" in later versions.

## Dependencies
[store.js](https://github.com/marcuswestin/store.js)

## How?
> See 'example.js'
