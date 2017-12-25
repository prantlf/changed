# changed

[![NPM version](https://badge.fury.io/js/changed.png)](http://badge.fury.io/js/changed)
[![Build Status](https://travis-ci.org/prantlf/changed.png)](https://travis-ci.org/prantlf/changed)
[![dependencies Status](https://david-dm.org/prantlf/changed/status.svg)](https://david-dm.org/prantlf/changed)
[![devDependencies Status](https://david-dm.org/prantlf/changed/dev-status.svg)](https://david-dm.org/prantlf/changed?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/prantlf/changed.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM Downloads](https://nodei.co/npm/changed.png?downloads=true&stars=true)](https://www.npmjs.com/package/changed)

A tiny (~1.5kb minified+gzipped) and [fast](https://github.com/prantlf/changed/blob/master/benchmark_results.csv), library for updating JavaScript objects and arrays directly.

Supports nested key paths via path arrays or [dot-bracket syntax](https://github.com/planttheidea/pathington), and all methods are curriable (with placeholder support) for composability. Can support typical changes of view-model attributes by methods `has`, `get`, `set`, `remove`, `add` and `merge` with a small footprint.

## Table of contents

* [Motivation](#motivation)
* [Usage](#usage)
* [Methods](#methods)
  * [has](#has)
  * [get](#get)
  * [set](#set)
  * [remove](#remove)
  * [add](#add)
  * [merge](#merge)
* [Development](#development)

## Motivation

Objects with nested properties and arrays are used to store application state. Libraries like [Backbone](backbonejs.org) provide functions for inspecting and manipulating the state as methods of specialized objects like [`Backbone.Model`](http://backbonejs.org/#Model). This library provides only such methods without having to include the rest of the functionality of a bigger library. You can use other libraries to make your application complete; for example [*on-change*](https://github.com/prantlf/on-change) for property change notifications.

This library has been inspired by [*unchanged*](https://github.com/planttheidea/unchanged), which has been used for the initial design and imnplementation. On the contrary to the immutable *unchanged*, this library supports mutable application states.

## Usage

```javascript
import {has, get, set, remove, add, merge} from 'changed';

const object = {
  foo: 'foo',
  bar: [
    {
      baz: 'quz'
    }
  ]
};

// handle standard properties
const foo = get('foo', object);

// or nested properties
const baz = set('bar[0].baz', 'not quz', object);

// all methods are curriable
const removeBaz = remove('bar[0].baz');
const sansBaz = removeBaz(object);
```

NOTE: There is no `default` export, so if you want to import all methods to a single namespace you should use the `import *` syntax:

```javascript
import * as c from 'changed';
```

## Methods

#### has

`has(path: (Array<number|string>|number|string), object: (Array<any>|Object)): any`

Checks if there is a property defined on the `object` passed and on the `path` specified.

```javascript
const object = {
  foo: [
    {
      bar: 'baz'
    }
  ]
};

console.log(get('foo[0].bar', object)); // baz
console.log(get(['foo', 0, 'bar'], object)); // baz
```

#### get

`get(path: (Array<number|string>|number|string), object: (Array<any>|Object)): any`

Getter function for properties on the `object` passed and on the `path` specified.

```javascript
const object = {
  foo: [
    {
      bar: 'baz'
    }
  ]
};

console.log(get('foo[0].bar', object)); // baz
console.log(get(['foo', 0, 'bar'], object)); // baz
```

#### set

`set(path: (Array<number|string>|number|string), value: any, object: (Array<any>|object)): (Array<any>|Object)`

Returns the `object` passed, with the `value` assigned to the final key on the `path` specified.

```javascript
const object = {
  foo: [
    {
      bar: 'baz'
    }
  ]
};

console.log(set('foo[0].bar', 'quz', object)); // {foo: [{bar: 'quz'}]}
console.log(set(['foo', 0, 'bar'], 'quz', object)); // {foo: [{bar: 'quz'}]}
```

#### remove

`remove(path: (Array<number|string>|number|string), object: (Array<any>|object)): (Array<any>|Object)`

Returns a new clone of the `object` passed, with the final key on the `path` removed if it exists.

```javascript
const object = {
  foo: [
    {
      bar: 'baz'
    }
  ]
};

console.log(remove('foo[0].bar', object)); // {foo: [{}]}
console.log(remove(['foo', 0, 'bar'], object)); // {foo: [{}]}
```

#### add

`add(path: (Array<number|string>|number|string), value: any, object: (Array<any>|object)): (Array<any>|Object)`

Returns the `object` passed, with the `value` added at the `path` specified. This can have different behavior depending on whether the item is an `Object` or an `Array`.

```javascript
const object = {
  foo: [
    {
      bar: 'baz'
    }
  ]
};

// object
console.log(add('foo', 'added value' object)); // {foo: [{bar: 'baz'}, 'added value']}
console.log(add(['foo'], 'added value', object)); // {foo: [{bar: 'baz'}, 'added value']}

// array
console.log(add('foo[0].quz', 'added value' object)); // {foo: [{bar: 'baz', quz: 'added value'}]}
console.log(add(['foo', 0, 'quz'], 'added value', object)); // {foo: [{bar: 'baz', quz: 'added value'}]}
```

Notice that the `Object` usage is idential to the `set` method, where a key needs to be specified for assignment. In the case of an `Array`, however, the value is pushed to the array at that key.

NOTE: If you want to add an item to a top-level array, pass `null` as the key:

```javascript
const object = ['foo'];

console.log(add(null, 'bar', object)); // ['foo', 'bar']
```

#### merge

`merge(path: (Array<number|string>|number|string), value: any, object: (Array<any>|object)): (Array<any>|Object)`

Returns the `object` passed, after performing a deep merge with the `value` (an object) at the `path` specified.

```javascript
const object1 = {
  oneSpecific: 'value',
  object: {
    one: 'value1',
    two: 'value2'
  }
};
const object2 = {
  one: 'new value',
  three: 'value3'
};

console.log(merge('object', object2, object1)); // {oneSpecific: 'value', object: {one: 'new value', two: 'value1', three: 'value3'}}
```

NOTE: If you want to merge the entirety of both objects, pass `null` as the key:

```javascript
const object1 = {
  oneSpecific: 'value',
  object: {
    one: 'value1',
    two: 'value2'
  }
};
const object2 = {
  one: 'new value',
  three: 'value3'
};

console.log(merge(null, object2, object1)); // {one: 'new value', oneSpecific: 'value', object: {one: 'value1', two: 'value1'}, three: 'value3'}
```

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

* `build` => run webpack to build development `dist` file with NODE_ENV=development
* `build:minified` => run webpack to build production `dist` file with NODE_ENV=production
* `dev` => run webpack dev server to run example app / playground
* `dist` => runs `build` and `build-minified`
* `lint` => run ESLint against all files in the `src` folder
* `prepublish` => runs `compile-for-publish`
* `prepublish:compile` => run `lint`, `test:coverage`, `transpile:es`, `transpile:lib`, `dist`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:coverage` => run `test` but with `nyc` for coverage checker
* `test:watch` => run `test`, but with persistent watcher
* `transpile:lib` => run babel against all files in `src` to create files in `lib`
* `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
  [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
