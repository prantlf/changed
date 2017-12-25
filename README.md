# unchanged

[![Greenkeeper badge](https://badges.greenkeeper.io/prantlf/changed.svg)](https://greenkeeper.io/)

A tiny (~2kb minified+gzipped), [fast](https://github.com/planttheidea/unchanged/blob/master/benchmark_results.csv), unopinionated handler for updating JS objects and arrays immutably.

Supports nested key paths via path arrays or [dot-bracket syntax](https://github.com/planttheidea/pathington), and all methods are curriable (with placeholder support) for composability. Can be a drop-in replacement for the `lodash/fp` methods `get`, `set`, `merge`, and `omit` with a 90% smaller footprint.

## Table of contents

* [Usage](#usage)
* [Methods](#methods)
  * [get](#get)
  * [set](#set)
  * [remove](#remove)
  * [add](#add)
  * [merge](#merge)
* [Additional objects](#additional-objects)
  * [\_\_](#__)
* [Differences with other libraries](#differences-with-other-libraries)
  * [lodash](#lodash)
  * [ramda](#ramda)
  * [Other immutability libraries](#other-immutability-libraries)
* [Browser support](#browser-support)
* [Development](#development)

## Usage

```javascript
import {__, add, get, merge, remove, set} from 'unchanged';

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
import * as uc from 'unchanged';
```

## Methods

#### get

`get(path: (Array<number|string>|number|string), object: (Array<any>|Object)): any`

Getter function for properties on the `object` passed.

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

Returns a new clone of the `object` passed, with the `value` assigned to the final key on the `path` specified.

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

Returns a new clone of the `object` passed, with the `value` added at the `path` specified. This can have different behavior depending on whether the item is an `Object` or an `Array`.

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

`add(path: (Array<number|string>|number|string), value: any, object: (Array<any>|object)): (Array<any>|Object)`

Returns a new object that is a deep merge of the two `object`s passed at the `path` specified.

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

## Additional objects

#### \_\_

A placeholder value used to identify "gaps" in a curried function, allowing for earlier application of arguments later in the argument order.

```javascript
import {__, set} from 'unchanged';

const thing = {
  foo: 'foo';
};

const setFoo = set('foo', __, thing);

setFooOnThing('bar');
```

## Differences from other libraries

#### lodash

[`lodash/fp`](https://lodash.com/) (the functional programming implementation of `lodash`) is identical in implementation to `unchanged`'s methods, just with a _10.5x_ larger footprint. These methods should map directly:

* `curry.placeholder` => `__`
* `get` => `get`
* `merge` => `merge`
* `omit` => `remove`
* `set` => `set` (also maps to `add` for objects only)

NOTE: There is no direct parallel for the `add` method in `lodash/fp`; the closest is `concat` but that is array-specific and does not support nested keys.

#### ramda

[`ramda`](http://ramdajs.com/) is similar in its implementation, however the first big difference is that dot-bracket syntax is not supported by `ramda`, only path arrays. Another difference is that the `ramda` methods that clone objects (`assocPath`, for example) only work with objects; arrays are implicitly converted into objects, which can make updating collections challenging.

The last main difference is the way that objects are copied, example:

```javascript
function Foo(value) {
  this.value = value;
}

Foo.prototype.getValue = function() {
  return this.value;
};

const foo = new Foo('foo');

// in ramda, both own properties and prototypical methods are copied to the new object as own properties
const ramdaResult = assoc('bar', 'baz', foo);

console.log(ramdaResult); // {value: 'foo', bar: 'baz', getValue: function getValue() { return this.value; }}
console.log(ramdaResult instanceof Foo); // false

// in unchanged, the prototype of the original object is maintained, and only own properties are copied as own properties
const unchangedResult = set('bar', 'baz', foo);

console.log(unchangedResult); // {value: 'foo', bar: 'baz'}
console.log(unchangedResult instanceof Foo); // true
```

This can make `ramda` more performant in certain scenarios, but at the cost of having potentially unexpected behavior.

#### Other immutability libraries

This includes popular solutions like [Immutable.js](https://facebook.github.io/immutable-js/), [seamless-immutable](https://github.com/rtfeldman/seamless-immutable), [mori](http://swannodette.github.io/mori/), etc. These solutions all work well, but with one caveat: _you need to buy completely into their system_. Each of these libraries redefines how the objects are stored internally, and require that you learn a new, highly specific API to use these custom objects. `unchanged` is unopinionated, accepting standard JS objects and returning standard JS objects, no transformation or learning curve required.

## Browser support

* Chrome (all versions)
* Firefox (all versions)
* Edge (all versions)
* Opera 15+
* IE 9+
* Safari 6+
* iOS 8+
* Android 4+

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
