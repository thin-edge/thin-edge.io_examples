[![Build Status](https://travis-ci.org/kaelzhang/node-math-array.svg?branch=master)](https://travis-ci.org/kaelzhang/node-math-array)
[![Coverage](https://codecov.io/gh/kaelzhang/node-math-array/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/node-math-array)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-math-array?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-math-array)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/math-array.svg)](http://badge.fury.io/js/math-array)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/math-array.svg)](https://www.npmjs.org/package/math-array)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-math-array.svg)](https://david-dm.org/kaelzhang/node-math-array)
-->

# math-array

Math utility to calculate with two arrays.

## Install

```sh
$ npm install math-array
```

## Usage

```js
import {
  add,
  sub,
  mul,
  div
} from 'math-array'

// Add 2 items
add([1, 2], [3, 4])   // [4, 6]
add([1, 2], 3)        // [4, 5]
add(3, [1, 2])        // [4, 5]
add(1, 2)             // Error, at least one array is required

// Sub 2 items
sub(1, [1, 2])        // Error, the first argument must be an array
sub([1, 2], 1)        // [0, 1]
sub([1, 2], [1, 2])   // [0, 0]

// Multiply 2 items
mul([1, 2], [1, 2])   // [1, 4]

// Divide 2 items
div([1, 2], [0, 1])   // Error, divide by zero
```

## `<method>(a, b, ensureNumber)`

- **a** `Array.<Number>`
- **b** `Array.<Number>`
- **ensureNumber** `Boolean=false` `math-array` manipulate arrays by simply adding, multiplying items. If `true`, the returned value will be cleaned, and every item which is not a number will be removed.

```js
mul([1, 2], [1, undefined])         // [1, NaN]
mul([1, 2], [1, undefined], true)   // [1, <1 empty item>]
```

## License

MIT
