'use strict';

var test = require('tape'),
    parser = require('../');

test('testing parser::getAttributes', function(t) {
    var attributes = parser.getAttributes(['foo="bar"']);
    // test out some of the properties of new element
    t.equals(attributes.foo, 'bar', 'object contains correct key and value');
    t.end();
});

test('testing parser::getTagIndex', function(t) {
    var tags = [{
            tagName: 'line'
        },{
            tagName: 'polygon'
        }],
        index = parser.getTagIndex('line', tags);

    // test out some of the properties of new element
    t.equals(index, 0, 'the correct index is returned');

    tags.push({
        tagName: 'line'
    });

    index = parser.getTagIndex('line', tags);
    t.equals(index, 2, 'the correct index is returned of the last tag');

    index = parser.getTagIndex('svg', tags);
    t.equals(index, -1, 'negative -1 is given when tag is not in array');

    t.end();
});


test('testing parser::getLastOpenTag', function(t) {
    var tags = [{
        },{
            closed: true
        }],
        index = parser.getLastOpenTag(tags);

    // test out some of the properties of new element
    t.equals(index, 0, 'the correct index is returned');
    tags[0].closed = true;
    index = parser.getLastOpenTag(tags);
    t.equals(index, -1, 'negative -1 is given when closed tag is not in array');

    t.end();
});

test('testing parser::createTree', function(t) {
    var tags = [{
            position: [0],
            children:[],
            foo: 'bar'
        },{
            position: [0,0],
            children:[],
            baz: 'qux'
        },{
            position: [1],
            bar: 'baz'
        }],
        tree = parser.createTree(tags);

    // test out some of the properties of new element
    t.equals(tree[0].foo, 'bar', 'the root tag is correct');
    t.equals(tree[0].children[0].baz, 'qux', 'the nested tag is correct');
    t.equals(tree[1].bar, 'baz', 'the sibling tag is correct');

    t.end();
});

test('testing parser::parse', function(t) {
    var svg = '<svg foo:bar="baz" ><line foo="bar"></line><polygon /><g><line /></g><svg:line></svg:line><g></g></svg>',
        groups = '<g></g><text>foo</text>',
        tree = parser.parse(svg),
        groupTree = parser.parse(groups);

    // test out some of the properties of new element
    t.equals(Array.isArray(tree), true, 'an array is returned');
    t.equals(tree[0].tagName, 'svg', 'the root tag is correct');
    t.equals(tree[0].attributes['foo:bar'], 'baz', 'the root tag\'s attributes foo:baz is parsed correctly');
    t.equals(tree[0].children[0].tagName, 'line', 'the nested tag is correct');
    t.equals(tree[0].children[0].attributes.foo, 'bar', 'the nested tag attributes are correct');
    t.equals(tree[0].children[1].tagName, 'polygon', 'the nested self closing tag is correct');
    t.equals(tree[0].children[2].children[0].tagName, 'line', 'the nested, nest self closing tag is correct');
    t.equals(tree[0].children[3].tagName, 'svg:line', 'the addition of a colon to the tagname parses correctly');
    t.equals(tree[0].children[3].children.length, 0, 'the addition of a colon to the tagname does not mistakenly next sibling elements into it');

    // testing some same level elements
    t.equals(groupTree.length, 2, 'There is the correct amount of elements in the groupTree array');
    t.equals(groupTree[0].tagName, 'g', 'The first element in the groupTree is a g tag');
    t.equals(groupTree[1].tagName, 'text', 'The second element in the groupTree is a text tag');
    t.equals(groupTree[1].children.length, 1, 'The text element has one child');
    t.equals(groupTree[1].children[0].text, 'foo', 'The first element in the text node is "foo"');

    // errors
    t.throws(parser.parse.bind(parser, '<<foo>>'), /Failed to parse SVG/, 'If parse fails to parse svg an error is thrown');

    t.end();
});

test('testing parser svg doc, comments tags', function(t) {
    var svg = '<?xml version="1.0" encoding="utf-8"?><!-- foobar --><svg><circle></circle></svg>',
        tree = parser.parse(svg);

    t.equals(Array.isArray(tree), true, 'return from parser is an array');
    t.equals(tree.length, 1, 'there is only one root element in the svg');
    t.equals(tree[0].tagName, 'svg', 'first tag is a svg');
    t.equals(tree[0].children.length, 1, 'first tag has the correct amount of children');
    t.end();
});
