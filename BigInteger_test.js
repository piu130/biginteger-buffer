const expect = require('chai').expect
const BigInteger = require('./BigInteger')

describe('BigInteger', function () {
  const ZERO = BigInteger.from([0])
  const ONE = BigInteger.from([1])
  const BIG_NUM_1 = BigInteger.from([0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x15])
  const BIG_NUM_2 = BigInteger.from([0x7A, 0xCB, 0x5C, 0x38, 0xAC, 0x6D, 0xAE, 0xAA])

  it('should auto trim', function () {
    expect(BigInteger.from([0])).to.deep.equal(ZERO)
    expect(BigInteger.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).to.deep.equal(ZERO)
    expect(ONE).to.deep.equal(ONE)
    expect(BigInteger.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])).to.deep.equal(ONE)
  })

  it('isZero', function () {
    expect(ZERO.isZero()).to.equal(true)
    expect(ONE.isZero()).to.equal(false)
    expect(BigInteger.from([0, 0, 0, 0, 0, 0, 0, 0, 1, 0]).isZero()).to.equal(false)
    expect(BigInteger.from([1, 2, 3, 0xF4, 5, 6, 7, 8, 9]).isZero()).to.equal(false)
  })

  it('isOne', function () {
    expect(ZERO.isOne()).to.equal(false)
    expect(ONE.isOne()).to.equal(true)
    expect(BigInteger.from([0, 0, 0, 0, 0, 0, 0, 0, 1, 0]).isOne()).to.equal(false)
    expect(BigInteger.from([1, 2, 3, 0xF4, 5, 6, 7, 8, 9]).isOne()).to.equal(false)
    expect(BigInteger.from([0, 0, 0, 0, 1, 1]).isOne()).to.equal(false)
  })

  it('isEven', function () {
    expect(ZERO.isEven()).to.equal(true)
    expect(ONE.isEven()).to.equal(false)
    expect(BIG_NUM_1.isEven()).to.equal(false)
    expect(BIG_NUM_2.isEven()).to.equal(true)
  })

  it('isOdd', function () {
    expect(ZERO.isOdd()).to.equal(false)
    expect(ONE.isOdd()).to.equal(true)
    expect(BIG_NUM_1.isOdd()).to.equal(true)
    expect(BIG_NUM_2.isOdd()).to.equal(false)
  })

  it('add', function () {
    expect(ZERO.add(ZERO)).to.deep.equal(ZERO)
    expect(ZERO.add(ONE)).to.deep.equal(ONE)
    expect(BIG_NUM_1.add(BIG_NUM_2)).to.deep.equal(BigInteger.from([0x80, 0x7A, 0xCB, 0x5C, 0x38, 0xAC, 0x6D, 0xAD, 0xBF]))
  })

  it('and', function () {
    expect(ZERO.and(ZERO)).to.deep.equal(ZERO)
    expect(ZERO.and(ONE)).to.deep.equal(ZERO)
    expect(ONE.and(ONE)).to.deep.equal(ONE)
    expect(BIG_NUM_1.and(BIG_NUM_2)).to.deep.equal(BigInteger.from([0x7A, 0xCB, 0x5C, 0x38, 0xAC, 0x6D, 0xAE, 0x00]))
  })

  it('or', function () {
    expect(ZERO.or(ZERO)).to.deep.equal(ZERO)
    expect(ZERO.or(ONE)).to.deep.equal(ONE)
    expect(ONE.or(ONE)).to.deep.equal(ONE)
    expect(BIG_NUM_1.or(BIG_NUM_2)).to.deep.equal(BigInteger.from([0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xBF]))
  })

  it('xor', function () {
    expect(ZERO.xor(ZERO)).to.deep.equal(ZERO)
    expect(ZERO.xor(ONE)).to.deep.equal(ONE)
    expect(ONE.xor(ONE)).to.deep.equal(ZERO)
    expect(BIG_NUM_1.xor(BIG_NUM_2)).to.deep.equal(BigInteger.from([0x7F, 0x85, 0x34, 0xA3, 0xC7, 0x53, 0x92, 0x51, 0xBF]))
  })

  it('not', function () {
    expect(ZERO.not()).to.deep.equal(BigInteger.from([0xFF]))
    expect(ONE.not()).to.deep.equal(BigInteger.from([0xFE]))
    expect(BIG_NUM_1.not()).to.deep.equal(BigInteger.from([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xEA]))
  })

  it('compare', function () {
    expect(ZERO.compare(ZERO)).to.equal(0)
    expect(ONE.compare(ZERO)).to.equal(1)
    expect(BIG_NUM_1.compare(BIG_NUM_1)).to.equal(0)
    expect(BIG_NUM_2.compare(BIG_NUM_1)).to.equal(-1)
    expect(BIG_NUM_1.compare(BIG_NUM_2)).to.equal(1)
  })

  it('equals', function () {
    expect(ZERO.equals(ZERO)).to.equal(true)
    expect(ONE.equals(ZERO)).to.equal(false)
    expect(BIG_NUM_1.equals(BIG_NUM_1)).to.equal(true)
    expect(BIG_NUM_2.equals(BIG_NUM_1)).to.equal(false)
    expect(BIG_NUM_1.equals(BIG_NUM_2)).to.equal(false)
  })

  it('greater', function () {
    expect(ZERO.greater(ZERO)).to.equal(false)
    expect(ONE.greater(ZERO)).to.equal(true)
    expect(BIG_NUM_1.greater(BIG_NUM_1)).to.equal(false)
    expect(BIG_NUM_2.greater(BIG_NUM_1)).to.equal(false)
    expect(BIG_NUM_1.greater(BIG_NUM_2)).to.equal(true)
  })

  it('greaterOrEqual', function () {
    expect(ZERO.greaterOrEqual(ZERO)).to.equal(true)
    expect(ONE.greaterOrEqual(ZERO)).to.equal(true)
    expect(BIG_NUM_1.greaterOrEqual(BIG_NUM_1)).to.equal(true)
    expect(BIG_NUM_2.greaterOrEqual(BIG_NUM_1)).to.equal(false)
    expect(BIG_NUM_1.greaterOrEqual(BIG_NUM_2)).to.equal(true)
  })

  it('smaller', function () {
    expect(ZERO.smaller(ZERO)).to.equal(false)
    expect(ONE.smaller(ZERO)).to.equal(false)
    expect(BIG_NUM_1.smaller(BIG_NUM_1)).to.equal(false)
    expect(BIG_NUM_2.smaller(BIG_NUM_1)).to.equal(true)
    expect(BIG_NUM_1.smaller(BIG_NUM_2)).to.equal(false)
  })

  it('smallerOrEqual', function () {
    expect(ZERO.smallerOrEqual(ZERO)).to.equal(true)
    expect(ONE.smallerOrEqual(ZERO)).to.equal(false)
    expect(BIG_NUM_1.smallerOrEqual(BIG_NUM_1)).to.equal(true)
    expect(BIG_NUM_2.smallerOrEqual(BIG_NUM_1)).to.equal(true)
    expect(BIG_NUM_1.smallerOrEqual(BIG_NUM_2)).to.equal(false)
  })

  it('max', function () {
    expect(BigInteger.max([ZERO])).to.deep.equal(ZERO)
    expect(BigInteger.max([ZERO, BIG_NUM_2, BIG_NUM_1])).to.deep.equal(BIG_NUM_1)
    expect(BigInteger.max([BIG_NUM_1, BIG_NUM_2])).to.deep.equal(BIG_NUM_1)
  })

  it('min', function () {
    expect(BigInteger.min([ZERO])).to.deep.equal(ZERO)
    expect(BigInteger.min([ZERO, BIG_NUM_2, BIG_NUM_1])).to.deep.equal(ZERO)
    expect(BigInteger.min([BIG_NUM_1, BIG_NUM_2])).to.deep.equal(BIG_NUM_2)
  })
})
