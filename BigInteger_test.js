const expect = require('chai').expect
const BigInteger = require('./BigInteger')

describe('BigInteger', function () {
  const ZERO = BigInteger.from([0])
  const ONE = BigInteger.from([1])
  // 0x7FFFFFFFFFFFFFFF15
  const BIG_NUM_1 = BigInteger.from([0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x15])
  // 0x7ACB5C38AC6DAEAA
  const BIG_NUM_2 = BigInteger.from([0x7A, 0xCB, 0x5C, 0x38, 0xAC, 0x6D, 0xAE, 0xAA])

  it('should auto trim', function () {
    expect(BigInteger.from([0])).to.deep.equal(ZERO)
    expect(BigInteger.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).to.deep.equal(ZERO)
    expect(ONE).to.deep.equal(ONE)
    expect(BigInteger.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])).to.deep.equal(ONE)
  })

  it('random', function () {
    for (let i = 0; i <= 100; i++) expect(BigInteger.random(9).bitLength).to.be.below(10)
    for (let i = 0; i <= 100; i++) expect(BigInteger.random(512).bitLength).to.be.below(513)
  })

  it('bit length', function () {
    expect(ZERO.bitLength).to.equal(1)
    expect(ONE.bitLength).to.equal(1)
    expect(BIG_NUM_1.bitLength).to.equal(71)
    expect(BIG_NUM_2.bitLength).to.equal(63)
  })

  it('msb length', function () {
    expect(ZERO.msbLength).to.equal(1)
    expect(ONE.msbLength).to.equal(1)
    expect(BIG_NUM_1.msbLength).to.equal(7)
    expect(BIG_NUM_2.msbLength).to.equal(7)
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
    expect(BIG_NUM_2.add(BIG_NUM_1)).to.deep.equal(BigInteger.from([0x80, 0x7A, 0xCB, 0x5C, 0x38, 0xAC, 0x6D, 0xAD, 0xBF]))
  })

  it('subtract', function () {
    expect(ZERO.subtract(ZERO)).to.deep.equal(ZERO)
    expect(ONE.subtract(ZERO)).to.deep.equal(ONE)
    expect(BIG_NUM_1.subtract(BIG_NUM_2)).to.deep.equal(BigInteger.from([0x7F, 0x85, 0x34, 0xA3, 0xC7, 0x53, 0x92, 0x50, 0x6B]))
  })

  it('multiply', function () {
    expect(ZERO.multiply(ZERO)).to.deep.equal(ZERO)
    expect(ONE.multiply(ZERO)).to.deep.equal(ZERO)
    expect(BIG_NUM_1.multiply(BIG_NUM_2)).to.deep.equal(BigInteger.from([0x3D, 0x65, 0xAE, 0x1C, 0x56, 0x36, 0xD7, 0x54, 0x8F, 0x47, 0x52, 0x57, 0xF9, 0xB7, 0x50, 0xA9, 0xF2]))
    expect(BIG_NUM_2.multiply(BIG_NUM_1)).to.deep.equal(BigInteger.from([0x3D, 0x65, 0xAE, 0x1C, 0x56, 0x36, 0xD7, 0x54, 0x8F, 0x47, 0x52, 0x57, 0xF9, 0xB7, 0x50, 0xA9, 0xF2]))
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

  it('shiftLeft', function () {
    expect(ZERO.shiftLeft(5)).to.deep.equal(BigInteger.from([0x00]))
    expect(ONE.shiftLeft(3)).to.deep.equal(BigInteger.from([0x08]))
    expect(BIG_NUM_1.shiftLeft(0)).to.deep.equal(BIG_NUM_1)
    expect(BIG_NUM_1.shiftLeft(5)).to.deep.equal(BigInteger.from([0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xE2, 0xA0]))
    expect(BIG_NUM_1.shiftLeft(11)).to.deep.equal(BigInteger.from([0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8, 0xA8, 0x00]))
    expect(BIG_NUM_2.shiftLeft(11)).to.deep.equal(BigInteger.from([0x03, 0xD6, 0x5A, 0xE1, 0xC5, 0x63, 0x6D, 0x75, 0x50, 0x00]))
    expect(BIG_NUM_2.shiftLeft(31)).to.deep.equal(BigInteger.from([0x3D, 0x65, 0xAE, 0x1C, 0x56, 0x36, 0xd7, 0x55, 0x00, 0x00, 0x00, 0x00]))
    expect(BIG_NUM_1.shiftLeft(-11)).to.deep.equal(BigInteger.from([0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]))
  })

  it('shiftRight', function () {
    expect(ZERO.shiftRight(5)).to.deep.equal(BigInteger.from([0x00]))
    expect(ONE.shiftRight(3)).to.deep.equal(BigInteger.from([0x00]))
    expect(BIG_NUM_1.shiftRight(0)).to.deep.equal(BIG_NUM_1)
    expect(BIG_NUM_1.shiftRight(5)).to.deep.equal(BigInteger.from([0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8]))
    expect(BIG_NUM_1.shiftRight(11)).to.deep.equal(BigInteger.from([0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]))
    expect(BIG_NUM_2.shiftRight(11)).to.deep.equal(BigInteger.from([0x0F, 0x59, 0x6B, 0x87, 0x15, 0x8D, 0xB5]))
    expect(BIG_NUM_2.shiftRight(31)).to.deep.equal(BigInteger.from([0xF5, 0x96, 0xB8, 0x71]))
    expect(BIG_NUM_1.shiftRight(-11)).to.deep.equal(BigInteger.from([0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8, 0xA8, 0x00]))
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
