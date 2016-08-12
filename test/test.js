'use strict'

const expect = require('chai').expect
const assert = require('assert')
const Schrodinger = require('../src/index.js')
const error = require('../src/error.js')

describe('schrodinger', function () {
    describe('constructor', function () {
        it('accepts non-empty array as first parameter', function () {
            const param = ['foo']
            const instance = new Schrodinger(param)
            expect(instance).to.be.an.instanceOf(Schrodinger)
        })

        it('accepts function as first parameter', function () {
            const param = function (seed) {
                return seed % 5
            }
            const instance = new Schrodinger(param)
            expect(instance).to.be.an.instanceOf(Schrodinger)
        })

        it('throws an exception if first parameter is an empty array', function () {
            function test () {
                var param = []
                new Schrodinger(param)
            }
            expectToThrowError(test, function (err) {
                expect(err).to.be.instanceof(error.InvalidEmptyListError)
                expect(err.toString())
                    .to.be.equal('InvalidEmptyListError: `[]` must not be an empty array')
            })
        })

        it('throws an exception if first parameter is an string', function () {
            function test () {
                var param = 'foo'
                new Schrodinger(param)
            }
            expect(test).to.throw('`foo` must be a function or a non-empty array')
            expectToThrowError(test, function (err) {
                expect(err).to.be.instanceof(error.InvalidParamConstructorError)
                expect(err.toString())
                    .to.be.equal('InvalidParamConstructorError: `foo` must be a function or a non-empty array')
            })
        })

        it('throws an exception if first parameter is a number', function () {
            function test () {
                var param = 100
                new Schrodinger(param)
            }
            expectToThrowError(test, function (err) {
                expect(err).to.be.instanceof(error.InvalidParamConstructorError)
                expect(err.toString())
                    .to.be.equal('InvalidParamConstructorError: `100` must be a function or a non-empty array')
            })
        })
    })

    describe('calling get at first time', function () {
        describe('after array constructor parameter', function () {
            it('if a seed is passed, it returns element in seed % array.length position', function () {
                var array = [23, 'foo', {}]
                var seed = 16
                var schrodinger = new Schrodinger(array)
                expect(schrodinger.get(seed)).to.be.equal(array[1])
            })
        })

        describe('after function constructor parameter', function () {
            it('if a seed is passed, it returns the same value that returns the function parameter', function () {
                var fn = function (seed) {
                    return seed * seed + 24
                }
                var seed = 5
                var schrodinger = new Schrodinger(fn)
                expect(schrodinger.get(seed)).to.be.equal(fn(seed))
            })
        })
    })

    describe('calling set at first time', function () {
        describe('before calling get', function () {
            it('get returns the value set', function () {
                var array = [23, 'foo', {}]
                var seed = 236874
                var value = 39

                var schrodinger = new Schrodinger(array)
                schrodinger.set(value)
                var result = schrodinger.get(seed)
                expect(result).to.be.equal(value)
            })
        })

        describe('after calling get', function () {
            describe('with strict mode', function () {
                it('throws an exception', function () {
                    var fn = function (seed) {
                        return seed * seed + 24
                    }
                    var seed = 24
                    var value = 'lorem ipsum'
                    function test () {
                        var schrodinger = new Schrodinger(fn, true)
                        schrodinger.get(seed)
                        schrodinger.set(value)
                    }
                    expectToThrowError(test, function (err) {
                        expect(err).to.be.instanceof(error.SetAfterGetError)
                        expect(err.toString())
                            .to.be.equal('SetAfterGetError: It is not possible to set `' +
                                value + '` after having previously called get method.')
                    })
                })
            })

            describe('without strict mode', function () {
                it('if the value determined by get is set, it does not throws an exception', function () {
                    var fn = function (seed) {
                        return seed * seed + 24
                    }
                    var seed = 1

                    var schrodinger = new Schrodinger(fn, false)
                    function test () {
                        var value = schrodinger.get(seed)
                        schrodinger.set(value)
                    }
                    expect(test).to.not.throw()
                })

                it('if different value is set, it throws an exception', function () {
                    var fn = function (seed) {
                        return seed * seed + 24
                    }
                    var seed = 1

                    var schrodinger = new Schrodinger(fn, false)
                    var value1 = schrodinger.get(seed)
                    var value2 = value1 + 2
                    function test () {
                        schrodinger.set(value2)
                    }
                    expectToThrowError(test, function (err) {
                        expect(err).to.be.instanceof(error.SetDifferentValueError)
                        expect(err.toString())
                            .to.be.equal('SetDifferentValueError: It is invalid to set different value `' + value2 +
                                '`. Value `' + value1 + '` is previously determined by get or set method.')
                    })
                })
            })
        })

        describe('when constructor uses strict mode with array parameter', function () {
            it('throws an exception if value that is not in array is set ', function () {
                var array = [23, 'foo', {}]
                var value = 39
                function test () {
                    var schrodinger = new Schrodinger(array, true)
                    schrodinger.set(value)
                }
                expect(test).to.throw('`' + value + '` is invalid value to set. Valid values: [' +
                    array.join(', ') + '].')
                expectToThrowError(test, function (err) {
                    expect(err).to.be.instanceof(error.SetInvalidValueError)
                    expect(err.toString())
                        .to.be.equal('SetInvalidValueError: `' + value + '` is invalid value to set. ' +
                            'Valid values: [' + array.join(', ') + '].')
                })
            })
        })

        describe('when constructor uses strict mode with function parameter', function () {
            it('omits strict mode and value is set correctly', function () {
                var fn = function (seed) {
                    return seed > 10 ? 'foo' : 'bar'
                }
                var value = 39
                var seed = 111

                var schrodinger = new Schrodinger(fn, true)
                schrodinger.set(value)
                var result = schrodinger.get(seed)
                expect(result).to.be.equal(value)
            })
        })
    })

    describe('calling get twice or more', function () {
        describe('with strict mode', function () {
            describe('when the same seed is passed', function () {
                it('returns the same value', function () {
                    var array = [23, 'foo', {}]
                    var seed = 16
                    var schrodinger = new Schrodinger(array, true)
                    var firstValue = schrodinger.get(seed)
                    var secondValue = schrodinger.get(seed)
                    expect(firstValue).to.be.equal(secondValue)
                })
            })

            describe('when different seed is passed', function () {
                it('throws an error', function () {
                    var array = [23, 'foo', {}]
                    var seed1 = 16
                    var seed2 = 30
                    function test () {
                        var schrodinger = new Schrodinger(array, true)
                        schrodinger.get(seed1)
                        schrodinger.get(seed2)
                    }
                    expectToThrowError(test, function (err) {
                        expect(err).to.be.instanceof(error.GetWithDifferentSeedError)
                        expect(err.toString())
                            .to.be.equal('GetWithDifferentSeedError: It is not possible to call get method with seed `' +
                                seed2 + '` if it is previously called with another seed (`' + seed1 + '`).')
                    })
                })
            })
        })

        describe('without strict mode', function () {
            describe('when the same seed is passed', function () {
                it('returns the same value', function () {
                    var array = [23, 'foo', {}]
                    var seed = 16
                    var schrodinger = new Schrodinger(array, false)
                    var firstValue = schrodinger.get(seed)
                    var secondValue = schrodinger.get(seed)
                    expect(firstValue).to.be.equal(secondValue)
                })
            })

            describe('when different seed is passed', function () {
                it('omits this seed and returns the same value', function () {
                    var array = [23, 'foo', {}]
                    var seed1 = 16
                    var seed2 = 17

                    var schrodinger = new Schrodinger(array, false)
                    var firstValue = schrodinger.get(seed1)
                    var secondValue = schrodinger.get(seed2)

                    expect(secondValue).to.be.equal(firstValue)
                })
            })
        })
    })

    describe('calling set twice or more', function () {
        describe('with strict mode', function () {
            it('throws an exception', function () {
                var fn = function (seed) {
                    return seed * seed % 10
                }
                var value = 'foo'

                var schrodinger = new Schrodinger(fn, true)
                function test () {
                    schrodinger.set(value)
                    schrodinger.set(value)
                }
                expectToThrowError(test, function (err) {
                    expect(err).to.be.instanceof(error.SetAfterSetError)
                    expect(err.toString())
                        .to.be.equal('SetAfterSetError: It is not possible to set `' +
                            value + '` after having previously called set method.')
                })
            })
        })

        describe('without strict mode', function () {
            it('if the same value is set, it does not throws an exception', function () {
                var fn = function (seed) {
                    return seed * seed + 24
                }
                var seed = 1
                var value = /^a+b$/

                var schrodinger = new Schrodinger(fn, false)
                schrodinger.set(value)
                schrodinger.set(value)
                expect(schrodinger.get(seed)).to.be.equal(value)
            })

            it('if different value is set, it throws an exception', function () {
                var fn = function (seed) {
                    return seed * seed + 24
                }
                var value1 = /^a+b$/
                var value2 = {}

                var schrodinger = new Schrodinger(fn, false)
                function test () {
                    schrodinger.set(value1)
                    schrodinger.set(value2)
                }
                expectToThrowError(test, function (err) {
                    expect(err).to.be.instanceof(error.SetDifferentValueError)
                    expect(err.toString())
                        .to.be.equal('SetDifferentValueError: It is invalid to set different value `' + value2 +
                            '`. Value `' + value1 + '` is previously determined by get or set method.')
                })
            })
        })
    })
})

function expectToThrowError (test, cb) {
    let ok = true
    try {
        test()
        ok = false
    } catch (err) {
        cb(err)
    }
    assert.ok(ok, 'function does not throw exception')
}
