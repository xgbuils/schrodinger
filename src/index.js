'use strict'

const error = require('./error.js')

function Schrodinger (list, strict) {
    constructorErrorHandler.call(this, list)
    let config

    if (strict && typeof strict === 'object') {
        config = strict
    } else {
        config = strict || strict === undefined ? strictConfig : {}
    }
    Object.defineProperty(this, 'config', {
        value: Object.freeze(config)
    })
    Object.defineProperty(this, 'list', {
        value: list
    })
}

Schrodinger.prototype.get = function (seed) {
    getErrorHandler.call(this, seed)

    const list = this.list
    if (!this.hasOwnProperty('value')) {
        Object.defineProperties(this, {
            seed: {
                value: seed
            },
            value: {
                value: typeof list === 'function' ? list(seed) : list[seed % list.length]
            }
        })
    }
    return this.value
}

Schrodinger.prototype.set = function (value) {
    setErrorHandler.call(this, value)

    if (!this.hasOwnProperty('value')) {
        Object.defineProperty(this, 'value', {
            value: value
        })
    }
}

function errorHandler (check, createParams) {
    let typeError = check()
    if (typeError) {
        throw new error[typeError](parse(messages[typeError], createParams()))
    }
}

const GetWithDifferentSeedError = 'GetWithDifferentSeedError'
const SetDifferentValueError = 'SetDifferentValueError'
const SetInvalidValueError = 'SetInvalidValueError'

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
            list: list
        })
    )
}

function getErrorHandler (seed) {
    errorHandler(
        () => {
            if (this.config[GetWithDifferentSeedError] && this.hasOwnProperty('seed') && this.seed !== seed) {
                return GetWithDifferentSeedError
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
    const config = this.config
    errorHandler(
        () => {
            let typeError
            if (this.hasOwnProperty('value')) {
                const SetAfterMethodError = this.hasOwnProperty('seed') ?
                    'SetAfterGetError' :
                    'SetAfterSetError'
                if (config[SetAfterMethodError]) {
                    typeError = SetAfterMethodError
                } else if (value !== this.value && config[SetDifferentValueError]) {
                    typeError = SetDifferentValueError
                }
            } else if (config[SetInvalidValueError] && isArray && list.indexOf(value) === -1) {
                typeError = SetInvalidValueError
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

const strictConfig = {
    GetWithDifferentSeedError: true,
    SetAfterGetError: true,
    SetAfterSetError: true,
    SetDifferentValueError: true,
    SetInvalidValueError: true
}

const messages = {
    InvalidParamConstructorError: '`${list}` must be a function or a non-empty array',
    InvalidEmptyListError: '`[]` must not be an empty array',
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
