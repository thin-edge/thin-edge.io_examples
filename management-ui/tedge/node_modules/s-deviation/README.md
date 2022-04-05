[![Build Status](https://travis-ci.org/kaelzhang/s-deviation.svg?branch=master)](https://travis-ci.org/kaelzhang/s-deviation)
[![Coverage](https://codecov.io/gh/kaelzhang/s-deviation/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/s-deviation)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/s-deviation?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/s-deviation)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/s-deviation.svg)](http://badge.fury.io/js/s-deviation)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/s-deviation.svg)](https://www.npmjs.org/package/s-deviation)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/s-deviation.svg)](https://david-dm.org/kaelzhang/s-deviation)
-->

# WARNING

This module is lack of maintainance.

If you are familiar with python programming maybe you could check [**stock-pandas**](https://github.com/kaelzhang/stock-pandas) which provides powerful statistic indicators support, and is backed by [`numpy`](https://numpy.org/) and [`pandas`](https://pandas.pydata.org/).

The performance of [**stock-pandas**](https://github.com/kaelzhang/stock-pandas) is many times higher than JavaScript libraries, and can be directly used by machine learning programs.

****

# s-deviation

Math utility to calculate [standard deviations](https://en.wikipedia.org/wiki/Standard_deviation), especially for fintech.

## Install

```sh
$ npm install s-deviation
```

## Usage

```js
import sd from 's-deviation'

sd([1, 2, 4, 8], 2)         // [<1 empty item>, 0.5, 1, 2]

sd([1, 2, 3, 4, 5, 6], 4)
// [
//   <3 empty items>,
//   1.118033988749895,
//   1.118033988749895,
//   1.118033988749895
// ]
```

## sd(datum, size)

- **datum** `Array.<Number>` the collection of data
- **size** `Number` the sample size of

Returns `Array.<Number>` the array of standard deviations.

## Related Modules

- [bollinger-bands](https://www.npmjs.com/package/bollinger-bands): Fintach math utility to calculate bollinger bands.
- [s-deviation](https://www.npmjs.com/package/s-deviation): Math utility to calculate standard deviations.
- [moving-averages](https://www.npmjs.com/package/moving-averages): The complete collection of utility methods for [Moving average](https://en.wikipedia.org/wiki/Moving_average).

## License

MIT
