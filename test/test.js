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
})
