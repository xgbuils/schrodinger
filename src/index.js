'use strict'

const error = require('./error.js')

function Schrodinger (list, strict) {
    constructorErrorHandler.call(this, list)

    this.strict = !!strict
    this.list = list
}

Schrodinger.prototype.get = function (seed) {
    getErrorHandler.call(this, seed)

    const list = this.list
    if (!this.hasOwnProperty('value')) {
        this.seed = seed
        this.value = typeof list === 'function' ? list(seed) : list[seed % list.length]
    }
    return this.value
}

Schrodinger.prototype.set = function (value) {
    setErrorHandler.call(this, value)

    this.value = value
}

function constructorErrorHandler (list) {
    const isArray = Array.isArray(list)
    return errorHandler(
        () => {
            let typeError
            if (isArray) {
                if (list.length === 0) {
                    typeError = 'InvalidEmptyListError'
                }
            } else if (typeof list !== 'function') {
                typeError = 'InvalidParamConstructorError'
            }
            return typeError
        },
        () => ({
            reportedParam: isArray ? '[]' : list
        })
    )
}

function errorHandler (check, createParams) {
    let typeError = check()
    if (typeError) {
        throw new error[typeError](parse(messages[typeError], createParams()))
    }
}

function getErrorHandler (seed) {
    errorHandler(
        () => {
            if (this.strict && this.hasOwnProperty('seed') && this.seed !== seed) {
                return 'GetWithDifferentSeedError'
            }
        },
        () => ({
            seed: seed,
            thisSeed: this.seed
        })
    )
}

function setErrorHandler (value) {
    const list = this.list
    const isArray = Array.isArray(list)
    const strict = this.strict
    errorHandler(
        () => {
            let typeError
            if (this.hasOwnProperty('value')) {
                if (strict) {
                    typeError = this.hasOwnProperty('seed') ? 'SetAfterGetError' : 'SetAfterSetError'
                } else if (value !== this.value) {
                    typeError = 'SetDifferentValueError'
                }
            } else if (strict && isArray && list.indexOf(value) === -1) {
                typeError = 'SetInvalidValueError'
            }
            return typeError
        },
        () => ({
            thisValue: this.value,
            thisSeed: this.seed,
            value: value,
            list: isArray && list.join(', ')
        })
    )
}

const messages = {
    InvalidParamConstructorError: '`${reportedParam}` must be a function or a non-empty array',
    InvalidEmptyListError: '`${reportedParam}` must not be an empty array',
    GetWithDifferentSeedError: 'It is not possible to call get method with seed `${seed}` if it is previously called with another seed (`${thisSeed}`).',
    SetAfterGetError: 'It is not possible to set `${value}` after having previously called get method.',
    SetAfterSetError: 'It is not possible to set `${value}` after having previously called set method.',
    SetDifferentValueError: 'It is invalid to set different value `${value}`. Value `${thisValue}` is previously determined by get or set method.',
    SetInvalidValueError: '`${value}` is invalid value to set. Valid values: [${list}].'
}

function parse (string, params) {
    return string.replace(/\$\{(\w+)\}/g, function (m, prop) {
        return params[prop]
    })
}

module.exports = Schrodinger
