// test
import test from 'ava';
import * as pathington from 'pathington';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';


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

test('if emptyObject will return an array when the object passed is an array', (t) => {
  const object = ['some', 'array'];

  const result = utils.emptyObject(object);

  t.is(result, object);
  t.deepEqual(result, []);
});

test('if emptyObject will return an object when the object passed is not an array', (t) => {
  const object = 'foo';

  const result = utils.emptyObject(object);

  t.deepEqual(result, {});
});

test('if getEnsuredChild will get a shallow clone of the object when it is an array and the key type should be an array', (t) => {
  const object = ['array'];
  const nextKey = 0;

  const result = utils.getEnsuredChild(object, nextKey);

  t.is(result, object);
});

test('if getEnsuredChild will get a new object when it is an object and the key type should be an array', (t) => {
  const object = {array: true};
  const nextKey = 0;

  const result = utils.getEnsuredChild(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, []);
});

test('if getEnsuredChild will get a shallow clone of the object when it is an object and the key type should be an object', (t) => {
  const object = {array: true};
  const nextKey = 'key';

  const result = utils.getEnsuredChild(object, nextKey);

  t.is(result, object);
});

test('if getEnsuredChild will get a new object when it is an array and the key type should be an object', (t) => {
  const object = ['array'];
  const nextKey = 'key';

  const result = utils.getEnsuredChild(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, {});
});

test('if getEnsuredChild will get a new object when the object doe not exist and the key type should be an object', (t) => {
  const object = undefined;
  const nextKey = 'key';

  const result = utils.getEnsuredChild(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, {});
});

test('if getEnsuredChild will get a new array when the object doe not exist and the key type should be an array', (t) => {
  const object = undefined;
  const nextKey = 0;

  const result = utils.getEnsuredChild(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, []);
});

test('if onMatchAtPath calls onMatch and returns its result if the object exists and returns the result', (t) => {
  const path = ['key'];
  const object = {
    [path[0]]: 'value'
  };
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.calledOnce);
  t.true(onMatch.calledWith(object, path[0]));

  t.is(result, path[0]);
});

test('if onMatchAtPath calls onMatch and returns the original object if the object exists and returns the object if it should be cloned', (t) => {
  const path = ['key'];
  const object = {
    [path[0]]: 'value'
  };
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = true;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.calledOnce);
  t.true(onMatch.calledWith(object, path[0]));

  t.is(result, object);
});

test('if onMatchAtPath returns noMatchValue if the object does not exist and it should not be cloned', (t) => {
  const path = ['key'];
  const object = null;
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.notCalled);

  t.is(result, noMatchValue);
});

test('if onMatchAtPath calls itself if the path has more than one value and the next key exists', (t) => {
  const path = ['key', 'otherKey'];
  const object = {
    [path[0]]: {
      [path[1]]: 'value'
    }
  };
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.calledOnce);
  t.true(onMatch.calledWith(object[path[0]], path[1]));

  t.is(result, path[1]);
});

test('if onMatchAtPath does not call itself if the path has more than one value but the next object does not exist', (t) => {
  const path = ['key', 'otherKey'];
  const object = null;
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.notCalled);

  t.is(result, noMatchValue);
});

test('if onMatchAtPath does not call itself if the path has more than one value but the next key does not exist', (t) => {
  const path = ['key', 'otherKey'];
  const object = {};
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.notCalled);

  t.is(result, noMatchValue);
});

test('if onMatchAtPath calls itself with a new clone if the path has more than one value and returns the object', (t) => {
  const path = ['key', 'otherKey'];
  const object = {};
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = true;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.calledOnce);
  t.true(onMatch.calledWith(object[path[0]], path[1]));

  t.is(result, object);
});

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

test('if getNestedProperty will return the top-level value when the length ofthe path is 1', (t) => {
  const path = 'path';
  const object = {
    [path]: 'value'
  };

  const result = utils.getNestedProperty(path, object);

  t.is(result, object[path]);
});

test('if getNestedProperty will return undefined when the object does not exist and the length ofthe path is 1', (t) => {
  const path = 'path';
  const object = null;

  const result = utils.getNestedProperty(path, object);

  t.is(result, undefined);
});

test('if deeplyMergeObject will clone object2 if the objects are different types', (t) => {
  const object1 = {key: 'value'};
  const object2 = ['key', 'value'];

  const result = utils.deeplyMergeObject(object1, object2);

  t.is(result, object2);
});

test('if deeplyMergeObject will merge the arrays if the objects are both array types', (t) => {
  const object1 = ['one'];
  const object2 = ['two'];

  const result = utils.deeplyMergeObject(object1, object2);

  t.is(result, object1);
  t.deepEqual(result, ['one', 'two']);
});

test('if deeplyMergeObject will merge the objects if the objects are both object types', (t) => {
  const date = new Date();
  const object1 = {date: {willBe: 'overwritten'}, deep: {key: 'value'}};
  const object2 = {date: date, deep: {otherKey: 'otherValue'}, untouched: 'value'};

  const result = utils.deeplyMergeObject(object1, object2);

  t.is(result, object1);
  t.deepEqual(result, {
    date: date,
    deep: {
      key: 'value',
      otherKey: 'otherValue'
    },
    untouched: 'value'
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

test('if hasNestedProperty will return the top-level value when the length ofthe path is 1', (t) => {
  const path = 'path';
  const object = {
    [path]: 'value'
  };

  t.true(utils.hasNestedProperty(path, object));
});

test('if hasNestedProperty will return undefined when the object does not exist and the length ofthe path is 1', (t) => {
  const path = 'path';
  const object = null;

  t.false(utils.hasNestedProperty(path, object));
});

test('if isCloneable returns false if null', (t) => {
  const object = null;

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns false if not an object', (t) => {
  const object = 123;

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns false if a date', (t) => {
  const object = new Date();

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns false if a regexp', (t) => {
  const object = /foo/;

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns true otherwise', (t) => {
  const object = {
    valid: true
  };

  t.true(utils.isCloneable(object));
});

test('if isEmptyKey will return true when undefined', (t) => {
  const object = undefined;

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return true when null', (t) => {
  const object = null;

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return false when an empty string', (t) => {
  const object = '';

  t.false(utils.isEmptyKey(object));
});

test('if isEmptyKey will true false when an empty array', (t) => {
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

test('if getParsedPath will return the path if it is an array', (t) => {
  const path = ['path'];

  const result = utils.getParsedPath(path);

  t.is(result, path);
});

test('if getParsedPath will parse the path with pathington if not an array', (t) => {
  const path = 'path';

  const spy = sinon.spy(pathington, 'parse');

  const result = utils.getParsedPath(path);

  t.true(spy.calledOnce);
  t.true(spy.calledWith(path));

  t.deepEqual(result, [path]);
});
