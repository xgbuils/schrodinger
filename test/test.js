var expect = require('chai').expect
var Schrodinger = require('../src/index.js')

describe('schrodinger', function () {
    describe('constructor', function () {
        it('accepts non-empty array as first parameter', function () {
            var param = ['foo']
            var instance = new Schrodinger(param)
            expect(instance).to.be.an.instanceOf(Schrodinger)
        })

        it('accepts function as first parameter', function () {
            var param = function (seed) {
                return seed % 5
            }
            var instance = new Schrodinger(param)
            expect(instance).to.be.an.instanceOf(Schrodinger)
        })

        it('throws exception if first parameter is an string', function () {
            function test () {
                var param = 'foo'
                new Schrodinger(param)
            }
            expect(test).to.throw('`foo` must be a function or a list')
        })

        it('throws exception if first parameter is a number', function () {
            function test () {
                var param = 100
                new Schrodinger(param)
            }
            expect(test).to.throw('`100` must be a function or a list')
        })
    })

    describe('calling get at first time', function () {
        describe('after array constructor parameter', function () {
            it('if is passed a seed, it returns element in seed % array.length position', function () {
                var array = [23, 'foo', {}]
                var seed = 16
                var schrodinger = new Schrodinger(array)
                expect(schrodinger.get(seed)).to.be.equal(array[1])
            })
        })

        describe('after function constructor parameter', function () {
            it('if is passed a seed, it returns the same value that returns the function parameter', function () {
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
            it('throws an exception', function () {
                var fn = function (seed) {
                    return seed * seed + 24
                }
                var seed = 24
                var value = 'lorem ipsum'
                function test () {
                    var schrodinger = new Schrodinger(fn)
                    schrodinger.get(seed)
                    schrodinger.set(value)
                }
                expect(test).to.throw('It is not possible to set the value `' +
                    value + '` after calling get method.')
            })
        })

        describe('when constructor uses strict mode with array parameter', function () {
            it('throws an exception if it is set value that is not in array', function () {
                var array = [23, 'foo', {}]
                var value = 39
                function test () {
                    var schrodinger = new Schrodinger(array, true)
                    schrodinger.set(value)
                }
                expect(test).to.throw('`' + value + '` is invalid value to set. Valid values: [' +
                    array.join(', ') + '].')
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
})
