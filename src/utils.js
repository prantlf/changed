// external dependencies
import {parse} from 'pathington';

/**
 * @function isArray
 */
export const isArray = Array.isArray;

/**
 * @function isCloneable
 *
 * @description
 * can the object be merged
 *
 * @param {*} object the object to test
 * @returns {boolean} can the object be merged
 */
export const isCloneable = (object) => {
  return (
    !!object &&
    typeof object === 'object' &&
    !(object instanceof Date || object instanceof RegExp)
  );
};

/**
 * @function getNewEmptyChild
 *
 * @description
 * get a new empty child for the type of key provided
 *
 * @param {number|string} key the key to test
 * @returns {Array|Object} the empty child
 */
export const getNewEmptyChild = (key) => {
  return typeof key === 'number' ? [] : {};
};

/**
 * @function emptyObject
 *
 * @description
 * empties object of the type of key provided
 *
 * @param {Array|Object} object the object to empty
 * @returns {Array|Object} the empty object
 */
export const emptyObject = (object) => {
  if (isArray(object)) {
    object.length = 0;
  } else if (typeof object === 'object') {
    for (const property in object) {
      if (object.hasOwnProperty(property)) {
        delete object[property];
      }
    }
  } else {
    return {};
  }

  return object;
};

/**
 * @function getEnsuredChild
 *
 * @description
 * gets a child of the correct type, although there is none actual
 *
 * @param {Array<*>|Object} object child object to return if the type is right
 * @param {number|string} nextKey the key pointing to the child
 * @returns {Array<*>|Object} the child object
 */
export const getEnsuredChild = (object, nextKey) => {
  const emptyChild = getNewEmptyChild(nextKey);

  return isCloneable(object) && isArray(object) === isArray(emptyChild) ? object : emptyChild;
};

/**
 * @function onMatchAtPath
 *
 * @description
 * when there is a match for the path requested, call onMatch, else return the noMatchValue
 *
 * @param {Array<number|string>} path the path to find a match at
 * @param {Array<*>|Object} object the object to find the path in
 * @param {function} onMatch when a match is found, call this method
 * @param {boolean} shouldModify should the object be modified
 * @param {*} noMatchValue when no match is found, return this value
 * @param {number} [index=0] the index of the key to process
 * @returns {*} either the return from onMatch or the noMatchValue
 */
export const onMatchAtPath = (path, object, onMatch, shouldModify, noMatchValue, index = 0) => {
  const key = path[index];
  const nextIndex = index + 1;

  if (nextIndex === path.length) {
    const result = object || shouldModify ? onMatch(object, key) : noMatchValue;

    return shouldModify ? object : result;
  }

  if (shouldModify) {
    object[key] = onMatchAtPath(
      path,
      getEnsuredChild(object[key], path[nextIndex]),
      onMatch,
      shouldModify,
      noMatchValue,
      nextIndex
    );

    return object;
  }

  return object && object[key]
    ? onMatchAtPath(path, object[key], onMatch, shouldModify, noMatchValue, nextIndex)
    : noMatchValue;
};

/**
 * @function deeplyMergeObject
 *
 * @description
 * merges the second to the first object
 *
 * @param {Array<*>|Object} object1 the object to merge into
 * @param {Array<*>|Object} object2 the object to merge
 * @returns {Array<*>|Object} the merged object
 */
export const deeplyMergeObject = (object1, object2) => {
  const isObject1Array = isArray(object1);

  if (isObject1Array !== isArray(object2)) {
    return object2;
  }

  if (isObject1Array) {
    Array.prototype.push.apply(object1, object2);

    return object1;
  }

  const target = isCloneable(object1) ? object1 : {};

  Object.keys(object2).forEach((key) => {
    target[key] = isCloneable(object2[key]) ? deeplyMergeObject(object1[key], object2[key]) : object2[key];
  });

  return target;
};

/**
 * @function getParsedPath
 *
 * @description
 * get the path array, either as-is if already an array, or parsed by pathington
 *
 * @param {Array<number|string>|number|string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */
export const getParsedPath = (path) => {
  return isArray(path) ? path : parse(path);
};

/**
 * @function getNestedProperty
 *
 * @description
 * parse the path passed and get the nested property at that path
 *
 * @param {Array<number|string>|number|string} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {*} the retrieved values
 */
export const getNestedProperty = (path, object) => {
  const parsedPath = getParsedPath(path);

  if (parsedPath.length === 1) {
    return object ? object[parsedPath[0]] : undefined;
  }

  return onMatchAtPath(parsedPath, object, (ref, key) => {
    return ref[key];
  });
};

/**
 * @function visitObjectOnPath
 *
 * @description
 * parse the path passed and clone the object at that path
 *
 * @param {Array<number|string>|number|string} path the path to deeply modify the object on
 * @param {Array<*>|Object} object the objeisCurrentKeyArrayct to modify
 * @param {function} onMatch the callback to execute
 * @returns {Array<*>|Object} the clone object
 */
export const visitObjectOnPath = (path, object, onMatch) => {
  const parsedPath = getParsedPath(path);
  const topLevelObject = isCloneable(object) ? object : getNewEmptyChild(parsedPath[0]);

  if (parsedPath.length === 1) {
    onMatch(topLevelObject, parsedPath[0]);

    return topLevelObject;
  }

  return onMatchAtPath(parsedPath, topLevelObject, onMatch, true);
};

/**
 * @function hasNestedProperty
 *
 * @description
 * parse the path passed and determine if a value at the path exists
 *
 * @param {Array<number|string>|number|string} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {boolean} does the nested path exist
 */
export const hasNestedProperty = (path, object) => {
  const parsedPath = getParsedPath(path);

  if (parsedPath.length === 1) {
    return object ? object[parsedPath[0]] !== void 0 : false;
  }

  return onMatchAtPath(
    parsedPath,
    object,
    (ref, key) => {
      return !!ref && ref[key] !== void 0;
    },
    false,
    false
  );
};

/**
 * @function isEmptyKey
 *
 * @description
 * is the object passed an empty key value
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object an empty key value
 */
export const isEmptyKey = (object) => {
  return object === void 0 || object === null || (isArray(object) && !object.length);
};
