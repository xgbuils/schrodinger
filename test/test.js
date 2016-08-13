'use strict'

const expect = require('chai').expect
const assert = require('assert')
const Schrodinger = require('../src/index.js')
const error = require('../src/error.js')

describe('schrodinger', function () {
    describe('constructor', function () {
        describe('first parameter', function () {
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

            it('throws an error if first parameter is an empty array', function () {
                function test () {
                    const param = []
                    new Schrodinger(param)
                }
                expectToThrowError(test, function (err) {
                    expect(err).to.be.instanceof(error.InvalidEmptyListError)
                    expect(err.toString())
                        .to.be.equal('InvalidEmptyListError: `[]` must not be an empty array')
                })
            })

            it('throws an error if first parameter is an string', function () {
                function test () {
                    const param = 'foo'
                    new Schrodinger(param)
                }
                expect(test).to.throw('`foo` must be a function or a non-empty array')
                expectToThrowError(test, function (err) {
                    expect(err).to.be.instanceof(error.InvalidParamConstructorError)
                    expect(err.toString())
                        .to.be.equal('InvalidParamConstructorError: `foo` must be a function or a non-empty array')
                })
            })

            it('throws an error if first parameter is a number', function () {
                function test () {
                    const param = 100
                    new Schrodinger(param)
                }
                expectToThrowError(test, function (err) {
                    expect(err).to.be.instanceof(error.InvalidParamConstructorError)
                    expect(err.toString())
                        .to.be.equal('InvalidParamConstructorError: `100` must be a function or a non-empty array')
                })
            })
        })

        describe('config parameter (second parameter)', function () {
            it('if parameter is an object, property config has the same object', function () {
                const config = {
                    SetAfterGetError: true,
                    SetAfterSetError: true
                }
                const schrodinger = new Schrodinger(['foo'], config)
                expect(schrodinger.config).to.be.deep.equal(config)
            })

            it('otherwise if parameter is truthy, then property .config is the most restrictive', function () {
                const schrodinger = new Schrodinger(['foo'], true)
                expect(schrodinger.config).to.be.deep.equal({
                    GetWithDifferentSeedError: true,
                    SetAfterGetError: true,
                    SetAfterSetError: true,
                    SetDifferentValueError: true,
                    SetInvalidValueError: true
                })
            })

            it('otherwise if parameter is false, has the correct config', function () {
                const schrodinger = new Schrodinger(['foo'], false)
                expect(schrodinger.config).to.be.deep.equal({
                    SetDifferentValueError: true
                })
            })
        })

        describe('instance properties', function () {
            describe('.list', function () {
                it('is read-only property', function () {
                    const schrodinger = new Schrodinger(['foo'])
                    function test () {
                        schrodinger.list = /^[a-c]$/
                    }
                    expect(test).to.throw('Cannot assign to read only property \'list\'')
                })
            })

            describe('.config', function () {
                it('is read-only property', function () {
                    const schrodinger = new Schrodinger(['foo'])
                    function test () {
                        schrodinger.config = 80
                    }
                    expect(test).to.throw('Cannot assign to read only property \'config\'')
                })

                it('is not possible to add property', function () {
                    const schrodinger = new Schrodinger(['foo'], {
                        SetAfterGetError: true
                    })
                    function test () {
                        schrodinger.config.foo = 80
                    }
                    expect(test).to.throw('Can\'t add property foo')
                })

                it('is not possible to update property', function () {
                    const schrodinger = new Schrodinger(['foo'], {
                        SetAfterGetError: true
                    })
                    function test () {
                        schrodinger.config.SetAfterGetError = false
                    }
                    expect(test).to.throw('Cannot assign to read only property \'SetAfterGetError\'')
                })
            })
        })
    })

    describe('calling get at first time', function () {
        describe('given Schrodinger instance created by array parameter', function () {
            it('if a seed is passed, it returns value of array in `seed % array.length` position', function () {
                const array = [23, 'foo', {}]
                const seed = 16
                const schrodinger = new Schrodinger(array)
                expect(schrodinger.get(seed)).to.be.equal(array[1])
            })
        })

        describe('given Schrodinger instance created by function parameter', function () {
            it('if a seed is passed, it returns the same value that returns the function parameter called with seed', function () {
                const fn = function (seed) {
                    return seed * seed + 24
                }
                const seed = 5
                const schrodinger = new Schrodinger(fn)
                expect(schrodinger.get(seed)).to.be.equal(fn(seed))
            })
        })
    })

    describe('calling set at first time', function () {
        describe('before calling get', function () {
            it('get returns the value set', function () {
                const array = [23, 'foo', {}]
                const seed = 236874
                const value = 39

                const schrodinger = new Schrodinger(array)
                schrodinger.set(value)
                const result = schrodinger.get(seed)
                expect(result).to.be.equal(value)
            })
        })

        describe('after calling get', function () {
            describe('and SetAfterGetError mode on', function () {
                const config = Object.freeze({
                    SetAfterGetError: true
                })
                const fn = function (seed) {
                    return seed * seed + 24
                }
                const seed = 24
                const value = 'lorem ipsum'
                it('throws an error', function () {
                    function test () {
                        const schrodinger = new Schrodinger(fn, config)
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

            describe('and SetAfterGetError mode off', function () {
                describe('and SetDifferentValueError mode on', function () {
                    const config = Object.freeze({
                        SetDifferentValueError: true
                    })
                    const fn = function (seed) {
                        return seed * seed + 24
                    }
                    const seed = 1

                    it('if the value determined by get is the same that is set, it does not throws an error', function () {
                        const schrodinger = new Schrodinger(fn, config)
                        function test () {
                            const value = schrodinger.get(seed)
                            schrodinger.set(value)
                        }
                        expect(test).to.not.throw()
                    })

                    it('if different value is set, it throws an error', function () {
                        const schrodinger = new Schrodinger(fn, config)
                        const value1 = schrodinger.get(seed)
                        const value2 = value1 + 2
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

                describe('and SetDifferentValueError mode off', function () {
                    const config = Object.freeze({})
                    const fn = function (seed) {
                        return seed * seed + 24
                    }
                    const seed = 1

                    it('if the value determined by get is the same that is set, it does not throws an error', function () {
                        const schrodinger = new Schrodinger(fn, config)
                        function test () {
                            const value = schrodinger.get(seed)
                            schrodinger.set(value)
                        }
                        expect(test).to.not.throw()
                    })

                    it('if different value is set, it does not throw error but keeps the first value', function () {
                        const schrodinger = new Schrodinger(fn, config)
                        const value1 = schrodinger.get(seed)
                        const value2 = value1 + 2
                        schrodinger.set(value2)
                        expect(schrodinger.get(seed)).to.be.equal(value1)
                    })
                })
            })
        })

        describe('given Schrodinger instance created by array parameter', function () {
            describe('and SetInvalidValueError mode on', function () {
                const config = Object.freeze({
                    SetInvalidValueError: true
                })
                const array = Object.freeze([23, 'foo', {}])
                const seed = 11
                it('throws an error if the value that attempts to set is not in array', function () {
                    const value = 39
                    function test () {
                        const schrodinger = new Schrodinger(array, config)
                        schrodinger.set(value)
                    }
                    expectToThrowError(test, function (err) {
                        expect(err).to.be.instanceof(error.SetInvalidValueError)
                        expect(err.toString())
                            .to.be.equal('SetInvalidValueError: `' + value + '` is invalid value to set. ' +
                                'Valid values: [' + array.join(', ') + '].')
                    })
                })

                it('does not throw error and set the value if it is included in array', function () {
                    const value = array[0]
                    const schrodinger = new Schrodinger(array, config)
                    schrodinger.set(value)
                    expect(schrodinger.get(seed)).to.be.equal(value)
                })
            })
        })

        describe('given Schrodinger instance created by function parameter', function () {
            describe('and SetInvalidValueError mode on', function () {
                it('omits SetInvalidValueError config mode and value is set correctly', function () {
                    const config = Object.freeze({
                        SetInvalidValueError: true
                    })
                    const fn = function (seed) {
                        return seed > 10 ? 'foo' : 'bar'
                    }
                    const value = 39
                    const seed = 111

                    const schrodinger = new Schrodinger(fn, config)
                    schrodinger.set(value)
                    const result = schrodinger.get(seed)
                    expect(result).to.be.equal(value)
                })
            })
        })
    })

    describe('calling get twice or more', function () {
        describe('with GetWithDifferentSeedError mode on', function () {
            const config = Object.freeze({
                GetWithDifferentSeedError: true
            })
            describe('when the same seed is passed', function () {
                it('returns the same value', function () {
                    const array = [23, 'foo', /^a$/, {}]
                    const seed = 16
                    const schrodinger = new Schrodinger(array, config)
                    const firstValue = schrodinger.get(seed)
                    const secondValue = schrodinger.get(seed)
                    expect(firstValue).to.be.equal(secondValue)
                })
            })

            describe('when different seed is passed', function () {
                it('throws an error', function () {
                    const fn = function () {
                        return 8
                    }
                    const seed1 = 0
                    const seed2 = -15
                    function test () {
                        const schrodinger = new Schrodinger(fn, config)
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

        describe('with GetWithDifferentSeedError mode off', function () {
            describe('when the same seed is passed', function () {
                it('returns the same value', function () {
                    const fn = function () {
                        return Math.random()
                    }
                    const seed = 16
                    const schrodinger = new Schrodinger(fn, {})
                    const firstValue = schrodinger.get(seed)
                    const secondValue = schrodinger.get(seed)
                    expect(firstValue).to.be.equal(secondValue)
                })
            })

            describe('when different seed is passed', function () {
                it('omits this seed and returns the same value', function () {
                    const array = [23, 'foo']
                    const seed1 = 16
                    const seed2 = 17

                    const schrodinger = new Schrodinger(array, {})
                    const firstValue = schrodinger.get(seed1)
                    const secondValue = schrodinger.get(seed2)

                    expect(secondValue).to.be.equal(firstValue)
                })
            })
        })
    })

    describe('calling set twice or more', function () {
        describe('and SetAfterSetError mode on', function () {
            it('throws an error', function () {
                const config = Object.freeze({
                    SetAfterSetError: true
                })
                const fn = function (seed) {
                    return seed * seed % 10
                }
                const value = 'foo'

                const schrodinger = new Schrodinger(fn, config)
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

        describe('and SetAfterSetError mode off', function () {
            describe('and SetDifferentValueError mode on', function () {
                const config = Object.freeze({
                    SetDifferentValueError: true
                })
                const fn = function (seed) {
                    return seed * seed + 24
                }
                it('if the same value is set, it does not throws an error', function () {
                    const seed = 1
                    const value = /^a+b$/

                    const schrodinger = new Schrodinger(fn, config)
                    schrodinger.set(value)
                    schrodinger.set(value)
                    expect(schrodinger.get(seed)).to.be.equal(value)
                })

                it('if different value is set, it throws an error', function () {
                    const value1 = /^a+b$/
                    const value2 = {}

                    const schrodinger = new Schrodinger(fn, config)
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

            describe('and SetDifferentValueError mode off', function () {
                const config = Object.freeze({})
                const fn = function (seed) {
                    return seed * seed + 24
                }
                const seed = 1
                it('if the same value is set, it does not throws an error', function () {
                    const value = /^a+b$/

                    const schrodinger = new Schrodinger(fn, config)
                    schrodinger.set(value)
                    schrodinger.set(value)
                    expect(schrodinger.get(seed)).to.be.equal(value)
                })

                it('if different value is set, it does not throws an error but keeps the first value', function () {
                    const value1 = /^a+b$/
                    const value2 = {}

                    const schrodinger = new Schrodinger(fn, config)
                    schrodinger.set(value1)
                    schrodinger.set(value2)
                    expect(schrodinger.get(seed)).to.be.equal(value1)
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
    assert.ok(ok, 'function does not throw error')
}
