'use strict'

const expect = require('chai').expect
const error = require('../src/error.js')

describe('errors', function () {
    [
        'SchrodingerError',
        'InvalidEmptyListError',
        'InvalidParamConstructorError',
        'GetWithDifferentSeedError',
        'SetAfterGetError',
        'SetAfterSetError',
        'SetDifferentValueError',
        'SetInvalidValueError'
    ].forEach(function (errorName) {
        it(errorName + ' is an instance of Error', function () {
            const err = new error[errorName]('fizz-buzz')
            expect(err).to.be.an.instanceof(Error)
        })
    })

    ;[
        'SchrodingerError',
        'InvalidEmptyListError',
        'InvalidParamConstructorError',
        'GetWithDifferentSeedError',
        'SetAfterGetError',
        'SetAfterSetError',
        'SetDifferentValueError',
        'SetInvalidValueError'
    ].forEach(function (errorName) {
        it(errorName + ' is an instance of SchrodingerError', function () {
            const err = new error[errorName]('fizz-buzz')
            expect(err).to.be.an.instanceof(Error)
        })
    })

    it('InvalidEmptyListError is an instance of InvalidParamConstructorError', function () {
        const err = new error.InvalidEmptyListError('fizz-buzz')
        expect(err).to.be.an.instanceof(Error)
    })
})
