const Buffer = require('buffer').Buffer
const crypto = require('crypto')

module.exports = class BigInteger {
  /**
   * Constructs a new BigInteger.
   * @param {Buffer} value - Buffer representation of the number.
   * @throws {TypeError}
   */
  constructor (value) {
    if (!Buffer.isBuffer(value)) throw new TypeError('Not a Buffer')
    this.buffer = value
    this._trim()
  }

  /**
   * Returns the base used for BigInteger.
   * @returns {number} Base.
   */
  static get BASE () {
    return 256
  }

  /**
   * Creates a big integer.
   * @param {Array|ArrayBuffer|Buffer} value - Representation of the number.
   * @returns {BigInteger} BigInteger with value of param value.
   */
  static from (value) {
    return new BigInteger(Buffer.from(value))
  }

  /**
   * Generates a random number with the given bit length.
   * @param {number} bitLength - Bit length of the random number.
   * @returns {BigInteger} Random big integer.
   */
  static random (bitLength) {
    // Generate random bytes
    const randomBytes = crypto.randomBytes((bitLength >> 3) + 1)
    // Mask first bit to fit bit length
    randomBytes[0] &= (1 << (bitLength & 7)) - 1
    return new BigInteger(randomBytes)
  }

  /**
   * Returns the biggest number in the array.
   * @param {Array<BigInteger>} bigIntegers - BigInteger list to search max.
   * @returns {BigInteger} Max value in list.
   */
  static max (bigIntegers) {
    return bigIntegers.reduce((acc, curr) => curr.smaller(acc) ? acc : curr)
  }

  /**
   * Returns the smallest number in the array.
   * @param {Array<BigInteger>} bigIntegers - BigInteger list to search min.
   * @returns {BigInteger} Min value in list.
   */
  static min (bigIntegers) {
    return bigIntegers.reduce((acc, curr) => curr.greater(acc) ? acc : curr)
  }

  /**
   * Trims leading zeros.
   * @returns {void} Nothing.
   * @private
   */
  _trim () {
    let i = 0
    while (this.buffer[i++] === 0) {}
    this.buffer = this.buffer.slice(i === this.buffer.length + 1 ? i - 2 : i - 1)
  }

  /**
   * Returns the length of the number (buffer length).
   * @returns {number} Length of the buffer.
   */
  get length () {
    return this.buffer.length
  }

  /**
   * Returns the bit length of the number.
   * @returns {number} Bit length.
   */
  get bitLength () {
    return (this._lastIndex << 3) + this.buffer[0].toString(2).length
  }

  /**
   * Returns the last index of the buffer (length - 1).
   * @returns {number} Last index of the buffer.
   * @private
   */
  get _lastIndex () {
    return this.length - 1
  }

  /**
   * Checks if the BigInteger is zero.
   * @returns {boolean} True if zero, otherwise false.
   */
  isZero () {
    return this.length === 1 && this.buffer[0] === 0
  }

  /**
   * Checks if the BigInteger is one.
   * @returns {boolean} True if one, otherwise false.
   */
  isOne () {
    return this.length === 1 && this.buffer[0] === 1
  }

  /**
   * Checks if the BigInteger is even.
   * @returns {boolean} True if even, otherwise false.
   */
  isEven () {
    return this.buffer[this._lastIndex] % 2 === 0
  }

  /**
   * Checks if the BigInteger is odd.
   * @returns {boolean} True if odd, otherwise false.
   */
  isOdd () {
    return this.buffer[this._lastIndex] % 2 === 1
  }

  /**
   * Bitwise and operation.
   * @param {BigInteger} bigInteger - Operand.
   * @returns {BigInteger} Result.
   */
  and (bigInteger) {
    let thisPos = this._lastIndex
    let bigIntegerPos = bigInteger._lastIndex
    const result = Buffer.allocUnsafe(Math.min(this.length, bigInteger.length))

    for (let i = result.length - 1; i >= 0; i--) result[i] = this.buffer[thisPos--] & bigInteger.buffer[bigIntegerPos--]
    return BigInteger.from(result)
  }

  /**
   * Bitwise or operation.
   * @param {BigInteger} bigInteger - Operand.
   * @returns {BigInteger} Result.
   */
  or (bigInteger) {
    let thisPos = this._lastIndex
    let bigIntegerPos = bigInteger._lastIndex
    const result = Buffer.allocUnsafe(Math.max(this.length, bigInteger.length))

    for (let i = result.length - 1; i >= 0; i--) result[i] = this.buffer[thisPos--] | bigInteger.buffer[bigIntegerPos--]
    return BigInteger.from(result)
  }

  /**
   * Bitwise xor operation.
   * @param {BigInteger} bigInteger - Operand.
   * @returns {BigInteger} Result.
   */
  xor (bigInteger) {
    let thisPos = this._lastIndex
    let bigIntegerPos = bigInteger._lastIndex
    const result = Buffer.allocUnsafe(Math.max(this.length, bigInteger.length))

    for (let i = result.length - 1; i >= 0; i--) result[i] = this.buffer[thisPos--] ^ bigInteger.buffer[bigIntegerPos--]
    return BigInteger.from(result)
  }

  /**
   * Bitwise not operation.
   * @returns {BigInteger} Result.
   */
  not () {
    const result = Buffer.allocUnsafe(this.length)

    for (let i = 0; i < result.length; i++) result[i] = ~this.buffer[i]
    return BigInteger.from(result)
  }

  /**
   * Shift left operation.
   * @param {number} number - Bits to shift.
   * @returns {BigInteger} Result.
   */
  shiftLeft (number) {
    if (number < 0) this.shiftRight(-number)

    const bits = number & 7
    const bytes = number >> 3
    const result = Buffer.alloc(this.length + bytes + 1)

    let carry = 0
    for (let i = this._lastIndex, j = result.length - bytes - 1; i >= 0; i--, j--) {
      const shifted = this.buffer[i] << bits
      result[j] = carry | shifted
      carry = (shifted & 0xFF00) >> 8
    }
    result[0] = carry
    return BigInteger.from(result)
  }

  /**
   * Shift right operation.
   * @param {number} number - Bits to shift.
   * @returns {BigInteger} Result.
   */
  shiftRight (number) {
    if (number < 0) return this.shiftLeft(-number)

    const bits = number & 7
    const bytes = number >> 3
    const result = Buffer.alloc(this.length - bytes)

    let carry = 0
    for (let i = 0, j = 0; i < this.length; i++, j++) {
      const shifted = (this.buffer[i] << 8) >> bits
      result[j] = carry | ((shifted & 0xFF00) >> 8)
      carry = shifted & 0xFF
    }
    return BigInteger.from(result)
  }

  /**
   * Addition.
   * @param {BigInteger} bigInteger - Summand.
   * @returns {BigInteger} Sum.
   */
  add (bigInteger) {
    let bigger = this
    let smaller = bigInteger
    if (this.compare(bigInteger) < 0) {
      bigger = bigInteger
      smaller = this
    }
    const result = Buffer.alloc(bigger.length + 1)

    let biggerPos = bigger._lastIndex
    let smallerPos = smaller._lastIndex
    let carry = 0

    while (biggerPos >= -1) {
      const currentResult = (bigger.buffer[biggerPos--] || 0) + (smaller.buffer[smallerPos--] || 0) + carry
      carry = (0xFF00 & currentResult) >> 8
      result[biggerPos + 2] = currentResult & 0xFF
    }
    return BigInteger.from(result)
  }

  /**
   * Subtraction.
   * @param {BigInteger} bigInteger - Subtrahend.
   * @returns {BigInteger} Difference.
   */
  subtract (bigInteger) {
    if (this.smaller(bigInteger)) throw new RangeError('this is smaller than bigInteger.')

    const result = Buffer.alloc(this.length)

    let biggerPos = this._lastIndex
    let smallerPos = bigInteger._lastIndex
    let borrow = 0

    while (biggerPos >= 0) {
      let currentResult = (this.buffer[biggerPos--] || 0) - (bigInteger.buffer[smallerPos--] || 0) - borrow
      if (currentResult < 0) {
        currentResult -= BigInteger.BASE
        borrow = 1
      } else {
        borrow = 0
      }
      result[biggerPos + 1] = currentResult
    }

    return BigInteger.from(result)
  }

  /**
   * Multiplication.
   * @param {BigInteger} bigInteger - Multiplier.
   * @returns {BigInteger} Product.
   */
  multiply (bigInteger) {
    if (this.isZero() || bigInteger.isZero()) return BigInteger.from([0])

    const result = Buffer.alloc(this.length + bigInteger.length)
    // TODO performance
    for (let i = this._lastIndex; i >= 0; i--) {
      let carry = 0
      for (let j = bigInteger._lastIndex, k = bigInteger.length + i; j >= 0; j--, k--) {
        const product = this.buffer[i] * bigInteger.buffer[j] + result[k] + carry
        carry = (0xFF00 & product) >> 8
        result[k] = product & 0xFF
      }
      result[i] = carry
    }
    return BigInteger.from(result)
  }

  /**
   * Compares two BigInteger.
   * @param {BigInteger} target - Target to compare to.
   * @returns {number} 0 if target is the same, -1 if target is greater and 1 if target is smaller than this.
   */
  compare (target) {
    return this.buffer.compare(target.buffer)
  }

  /**
   * Checks if this is equal to target.
   * @param {BigInteger} target - Target to compare to.
   * @returns {boolean} True if equal, otherwise false.
   */
  equals (target) {
    return this.compare(target) === 0
  }

  /**
   * Checks if this is greater than target.
   * @param {BigInteger} target - Target to compare to.
   * @returns {boolean} True if greater, otherwise false.
   */
  greater (target) {
    return this.compare(target) === 1
  }

  /**
   * Checks if this is greater or equal to target.
   * @param {BigInteger} target - Target to compare to.
   * @returns {boolean} True if greater or equal, otherwise false.
   */
  greaterOrEqual (target) {
    const cmp = this.compare(target)
    return cmp === 0 || cmp === 1
  }

  /**
   * Checks if this is smaller than target.
   * @param {BigInteger} target - Target to compare to.
   * @returns {boolean} True if smaller, otherwise false.
   */
  smaller (target) {
    return this.compare(target) === -1
  }

  /**
   * Checks if this is smaller or equal to target.
   * @param {BigInteger} target - Target to compare to.
   * @returns {boolean} True if smaller or equal, otherwise false.
   */
  smallerOrEqual (target) {
    const cmp = this.compare(target)
    return cmp === 0 || cmp === -1
  }
}
