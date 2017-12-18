// test
import test from 'ava';

// src
import * as utils from 'src/utils';

test('if curry will make a function curriable', (t) => {
  const method = (a, b) => {
    return [a, b];
  };

  const curriedMethod = utils.curry(method);

  t.is(typeof curriedMethod, 'function');

  const a = 'a';
  const b = 'b';

  const curriedResult = curriedMethod(a);

  t.is(typeof curriedMethod, 'function');

  const result = curriedResult(b);

  t.deepEqual(result, [a, b]);
});

test('if isKeyForArrayType returns true when the key should be for an array', (t) => {
  const key = 1;

  t.true(utils.isKeyForArrayType(key));
});

test('if isKeyForArrayType returns false when the key should be for an object', (t) => {
  const key = 'foo';

  t.false(utils.isKeyForArrayType(key));
});

test('if getFunctionName will return no match when the value is not a function', (t) => {
  const fn = {};

  const result = utils.getFunctionName(fn);

  t.is(result, '__NO_CONSTRUCTOR_FOUND__');
});

test('if getFunctionName will return the function name when the value is a function', (t) => {
  const fn = function named() {};

  const result = utils.getFunctionName(fn);

  t.is(result, fn.name);
});

test('if getFunctionName will return the parsed function name when the value is a function but the name property does not exist', (t) => {
  const fn = function named() {};

  delete fn.name;

  const result = utils.getFunctionName(fn);

  t.is(result, 'named');
});

test('if getShallowClone shallowly clones the object when it is an array', (t) => {
  const object = ['array'];

  const result = utils.getShallowClone(object);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if getShallowClone shallowly clones the object when it is a plain object', (t) => {
  const object = {array: true};

  const result = utils.getShallowClone(object);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if getShallowClone shallowly clones the object into a plain object when it is a standard object type', (t) => {
  const object = function someFunction() {};

  const result = utils.getShallowClone(object);

  t.not(result, object);
  t.deepEqual(result, {...object});
});

test('if getShallowClone shallowly clones the object with its prototype when it is not a standard object type', (t) => {
  const Foo = function Foo(value) {
    this.value = value;
  };

  const object = new Foo('foo');

  const result = utils.getShallowClone(object);

  t.not(result, object);
  t.true(result instanceof Foo);
  t.deepEqual(result, new Foo('foo'));
});

test('if getNewEmptyChild will return an array when the key should produce an array type', (t) => {
  const key = 1;

  const result = utils.getNewEmptyChild(key);

  t.deepEqual(result, []);
});

test('if getNewEmptyChild will return an object when the key should not produce an array type', (t) => {
  const key = 'foo';

  const result = utils.getNewEmptyChild(key);

  t.deepEqual(result, {});
});

test('if getNewChildClone will get a shallow clone of the object when it is an array and the key type should be an array', (t) => {
  const object = ['array'];
  const nextKey = 0;

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if getNewChildClone will get a new object when it is an object and the key type should be an array', (t) => {
  const object = {array: true};
  const nextKey = 0;

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, []);
});

test('if getNewChildClone will get a shallow clone of the object when it is an object and the key type should be an object', (t) => {
  const object = {array: true};
  const nextKey = 'key';

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if getNewChildClone will get a new object when it is an array and the key type should be an object', (t) => {
  const object = ['array'];
  const nextKey = 'key';

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, {});
});

test('if getNewChildClone will get a new object when the object doe not exist and the key type should be an object', (t) => {
  const object = undefined;
  const nextKey = 'key';

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, {});
});

test('if getNewChildClone will get a new array when the object doe not exist and the key type should be an array', (t) => {
  const object = undefined;
  const nextKey = 0;

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, []);
});

test.todo('onMatchAtPath');

test('if getNestedProperty will get the nested value in the object', (t) => {
  const object = {
    deeply: {
      nested: 'value'
    }
  };
  const path = 'deeply.nested';

  const result = utils.getNestedProperty(path, object);

  t.is(result, object.deeply.nested);
});

test('if getDeepClone will create a deep clone on the object at the path specified', (t) => {
  const value = 'value';

  const object = {
    untouched: {
      existing: 'values'
    }
  };
  const path = 'deeply[0].nested';
  const callback = (ref, key) => {
    t.deepEqual(ref, {});
    t.is(key, path.split('.')[1]);

    ref[key] = value;
  };

  const result = utils.getDeepClone(path, object, callback);

  t.deepEqual(result, {
    ...object,
    deeply: [
      {
        nested: value
      }
    ]
  });
});

test('if getDeepClone will create a deep clone on a new object if it does not exist at the path specified', (t) => {
  const value = 'value';

  const object = null;
  const path = 'deeply[0].nested';
  const callback = (ref, key) => {
    t.deepEqual(ref, {});
    t.is(key, path.split('.')[1]);

    ref[key] = value;
  };

  const result = utils.getDeepClone(path, object, callback);

  t.deepEqual(result, {
    deeply: [
      {
        nested: value
      }
    ]
  });
});

test('if hasNestedProperty will return true if the nested property exists on the object', (t) => {
  const object = {
    deeply: [
      {
        nested: 'value'
      }
    ]
  };
  const path = 'deeply[0].nested';

  t.true(utils.hasNestedProperty(path, object));
});

test('if hasNestedProperty will return false if the nested property does not exist on the object', (t) => {
  const object = {
    deeply: [
      {
        nested: 'value'
      }
    ]
  };
  const path = 'deeply[1].nested';

  t.false(utils.hasNestedProperty(path, object));
});

test('if hasNestedProperty will return false if the object does not exist', (t) => {
  const object = null;
  const path = 'deeply[1].nested';

  t.false(utils.hasNestedProperty(path, object));
});

test('if isEmptyKey will return true when undefined', (t) => {
  const object = undefined;

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return true when null', (t) => {
  const object = null;

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return true when an empty string', (t) => {
  const object = '';

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return true when an empty array', (t) => {
  const object = [];

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return false when a populated string', (t) => {
  const object = 'populated';

  t.false(utils.isEmptyKey(object));
});

test('if isEmptyKey will return false when a populated array', (t) => {
  const object = ['populated'];

  t.false(utils.isEmptyKey(object));
});

test('if isEmptyKey will return false when a number', (t) => {
  const object = 0;

  t.false(utils.isEmptyKey(object));
});