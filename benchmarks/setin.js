/* eslint no-unused-vars: 0 */
const _ = require('lodash/fp');
const {assocPath} = require('ramda');
const {set} = require('../lib');

/**
 * Data
 */

const value = Math.random();
const array = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

module.exports = {
  // objects
  objectSetInNative(cycles) {
    const obj = {
      data: {value}
    };

    for (let i = 0; i < cycles; i++) {
      Object.assign(obj, {
        data: Object.assign(obj.data, {
          value: Math.random()
        })
      });
    }
  },
  objectSetInLodashFp(cycles) {
    const obj = {
      data: {value}
    };

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      _.set(['data', 'value'], newValue, obj);
    }
  },
  objectSetInLodashFpDotty(cycles) {
    const obj = {
      data: {value}
    };

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      _.set('data.value', newValue, obj);
    }
  },
  objectSetInRamda(cycles) {
    const obj = {
      data: {value}
    };

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      assocPath(['data', 'value'], newValue, obj);
    }
  },
  objectSetInUnchanged(cycles) {
    const obj = {
      data: {value}
    };

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      set(['data', 'value'], newValue, obj);
    }
  },
  objectSetInUnchangedDotty(cycles) {
    const obj = {
      data: {value}
    };

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      set('data.value', newValue, obj);
    }
  },

  // arrays
  arraySetInNative(cycles) {
    const arr = [array];
    const maxIndex = arr[0].length - 1;

    let index;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      arr[0][index] = Math.random();
    }
  },
  arraySetInLodashFp(cycles) {
    const arr = [array];
    const maxIndex = arr[0].length - 1;

    let index;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);

      _.set([0, index], Math.random(), arr);
    }
  },
  arraySetInLodashFpDotty(cycles) {
    const arr = [array];
    const maxIndex = arr[0].length - 1;

    let index;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);

      _.set('[0][${index}]', Math.random(), arr);
    }
  },
  arraySetInRamda(cycles) {
    const arr = [array];
    const maxIndex = arr[0].length - 1;

    let index;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);

      assocPath([0, index], Math.random(), arr);
    }
  },
  arraySetInUnchanged(cycles) {
    const arr = array;
    const maxIndex = arr.length - 1;

    let index, newVal;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);

      set([0, index], Math.random(), arr);
    }
  },
  arraySetInUnchangedDotty(cycles) {
    const arr = array;
    const maxIndex = arr.length - 1;

    let index, newVal;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);

      set(`[0][${index}]`, Math.random(), arr);
    }
  }
};
