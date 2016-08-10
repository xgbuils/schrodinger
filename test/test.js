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
})
