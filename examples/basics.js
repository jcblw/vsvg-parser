var parser = require( '../' ),
    inspect = require( 'util' ).inspect;

console.log( inspect( parser.parse( '<svg><line /></svg>'), { depth: Infinity, color: true } ) );