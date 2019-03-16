// utils
import {
  __,
  curry,
} from './curry';
import {
  visitObjectOnPath,
  deeplyMergeObject,
  getNestedProperty,
  emptyObject,
  hasNestedProperty,
  isArray,
  isCloneable,
  isEmptyKey,
} from './utils';

export {__};

/**
 * @function get
 *
 * @description
 * get the value to the object at the path requested
 *
 * @param {Array<number|string>|null|number|string} path the path to get the value at
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {*} the value requested
 */
export const get = curry((path, object) => isEmptyKey(path) ? object : getNestedProperty(path, object));

/**
 * @function has
 *
 * @description
 * does the nested path exist on the object
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {boolean} does the path exist
 */
export const has = curry((path, object) => isEmptyKey(path) ? !!object : hasNestedProperty(path, object));

/**
 * @function merge
 *
 * @description
 * merges the value (the first object) to the second object on the specified path
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} object the object to merge with
 * @param {Array<*>|Object} object the object to merge with and to
 * @returns {Array<*>|Object} the merged object
 */
export const merge = curry((path, objectToMerge, object) => {
  if (!isCloneable(object)) {
    return objectToMerge;
  }

  return isEmptyKey(path)
    ? deeplyMergeObject(object, objectToMerge)
    : visitObjectOnPath(path, object, (ref, key) => {
      ref[key] = deeplyMergeObject(ref[key], objectToMerge);
    });
});

/**
 * @function remove
 *
 * @description
 * remove the value in the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to remove the value at
 * @param {Array<*>|Object} object the object to remove the value from
 * @returns {Array<*>|Object} the object with the value removed
 */
export const remove = curry((path, object) => {
  if (isEmptyKey(path)) {
    return emptyObject(object);
  }

  return hasNestedProperty(path, object)
    ? visitObjectOnPath(path, object, (ref, key) => {
      if (isArray(ref)) {
        ref.splice(key, 1);
      } else {
        delete ref[key];
      }
    })
    : object;
});

/**
 * @function set
 *
 * @description
 * set the value in the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to set the value at
 * @param {*} value the value to set
 * @param {Array<*>|Object} object the object to set the value in
 * @returns {Array<*>|Object} the object with the value assigned
 */
export const set = curry((path, value, object) => isEmptyKey(path)
  ? value
  : visitObjectOnPath(path, object, (ref, key) => {
    ref[key] = value;
  }));

/**
 * @function add
 *
 * @description
 * add the value to the object at the path requested
 *
 * @param {Array<number|string>|null|number|string} path the path to assign the value at
 * @param {*} value the value to assign
 * @param {Array<*>|Object} object the object to assignobject the value in
 * @returns {Array<*>|Object} the object with the value added
 */
export const add = curry((path, value, object) => {
  const nestedValue = get(path, object);
  const fullPath = isArray(nestedValue) ? `${isEmptyKey(path) ? '' : path}[${nestedValue.length}]` : path;

  return set(fullPath, value, object);
});
