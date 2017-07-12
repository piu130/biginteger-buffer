# biginteger-buffer [WIP]

[![Build Status](https://travis-ci.org/piu130/biginteger-buffer.svg?branch=master)](https://travis-ci.org/piu130/biginteger-buffer)
[![codecov](https://codecov.io/gh/piu130/biginteger-buffer/branch/master/graph/badge.svg)](https://codecov.io/gh/piu130/biginteger-buffer)
[![dependencies Status](https://david-dm.org/piu130/biginteger-buffer/status.svg)](https://david-dm.org/piu130/biginteger-buffer)
[![devDependencies Status](https://david-dm.org/piu130/biginteger-buffer/dev-status.svg)](https://david-dm.org/piu130/biginteger-buffer?type=dev)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

Simple calculation with Buffer/Array/ArrayBuffer.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
  * [Class methods](#class-methods)
  * [Instance variables](#instance-variables)
  * [Arithmetic operations](#arithmetic-operations)
  * [Comparison](#comparison)
  * [Bitwise operations](#bitwise-operations)
* [Contributing](#contributing)


## Installation

Install with npm:

```js
npm install --save biginteger-buffer
```

Then include it:

```js
const BigInteger = require('biginteger-buffer')
```

## Usage

Every function returns a `new BigInteger` object. The big integer is `auto trimmed` (remove leading zeros) after every operation.

### Class methods

#### `BigInteger.from(array|arrayBuffer|buffer)`

Create a big integer with this function.

Examples:

```js
const zero = BigInteger.from([0x00])
const number = BigInteger.from(Buffer.from([0xFF, 0xAB, 0x01]))
```

#### `BigInteger.max(bigIntegers)`

Returns the biggest number in the array.

#### `BigInteger.min(bigIntegers)`

Returns the smallest number in the array.

### Instance variables

#### `buffer`

Returns the buffer representation of the number.

#### `length`

Returns the length of the number.

#### `bitLength`

Returns the bit length of the number.

### Arithmetic operations

#### `add(bigInteger)`

Performs addition.

#### `subtract(bigInteger)`

Performs subtraction.

#### `multiply(bigInteger)`

Performs multiplication.

### Comparison

#### `compare(target)`

Compares two big integers. Returns 0 if target is the same, 1 if target is greater and -1 if target is smaller than `this`.

#### `isZero()`

Checks if the number is zero.

#### `isOne()`

Checks if the number is one.

#### `isEven()`

Checks if the number is even.

#### `isOdd()`

Checks if the number is odd.

#### `equals(target)`

Checks if this is equal to target.

#### `greater(target)`

Checks if this is greater than target.

#### `greaterOrEqual(target)`

Checks if this is greater or equal to target.

#### `smaller(target)`

Checks if this is smaller than target.

#### `smallerOrEqual(target)`

Checks if this is smaller or equal to target.

### Bitwise operations

#### `and(bigInteger)`

AND operation.

#### `not()`

NOT operation

#### `or(bigInteger)`

OR operation

#### `xor(bigInteger)`

XOR operation

#### `shiftLeft(number)`

Shift left operation

## Contributing

Anyone can help make this project better. Please provide tests and document new features.
