# vsvg-parser ( virtual SVG parser )  [![Build Status](https://travis-ci.org/jcblw/vsvg.svg?branch=master)](https://travis-ci.org/jcblw/vsvg)

vsvg-parser is a small lib that allow you to parser svg's server side or client side. Its still in early devlopment so expect bug and file issues. Primarly used in [vsvg]( https://github.com/jcblw/vsvg ).

## Install

    $ npm install vsvg-parser

You can also use it with your [Browserify](http://browserify.org) bundles.

## Usage

```javascript
var parser = require( 'vsvg-parser' );

console.log( parser.parse( '<svg><line /></svg>' ) );
/*

[ { tagName: 'svg',
    attributes: {},
    children: 
     [ { tagName: 'line',
         attributes: {},
         children: [],
         text: null,
         inside: 0,
         closed: true,
         position: [ 0, 0 ] } ],
    text: null,
    inside: -1,
    closed: true,
    position: [ 0 ] } ]

*/ 
```