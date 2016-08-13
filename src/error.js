var inherits = require('util').inherits

function SchrodingerError (message) {
    this.message = message
}

function InvalidParamConstructorError () {
    SchrodingerError.apply(this, arguments)
    Error.captureStackTrace(this, InvalidParamConstructorError)
}

function InvalidEmptyListError () {
    SchrodingerError.apply(this, arguments)
    Error.captureStackTrace(this, InvalidEmptyListError)
}

function GetWithDifferentSeedError () {
    SchrodingerError.apply(this, arguments)
    Error.captureStackTrace(this, GetWithDifferentSeedError)
}

function SetAfterGetError () {
    SchrodingerError.apply(this, arguments)
    Error.captureStackTrace(this, SetAfterGetError)
}

function SetAfterSetError () {
    SchrodingerError.apply(this, arguments)
    Error.captureStackTrace(this, SetAfterSetError)
}

function SetDifferentValueError () {
    SchrodingerError.apply(this, arguments)
    Error.captureStackTrace(this, SetDifferentValueError)
}

function SetInvalidValueError () {
    SchrodingerError.apply(this, arguments)
    Error.captureStackTrace(this, SetInvalidValueError)
}

inherits(SchrodingerError, Error)
inherits(InvalidParamConstructorError, SchrodingerError)
inherits(InvalidEmptyListError, InvalidParamConstructorError)
inherits(SetAfterGetError, SchrodingerError)
inherits(SetAfterSetError, SchrodingerError)
inherits(SetDifferentValueError, SchrodingerError)
inherits(GetWithDifferentSeedError, SchrodingerError)
inherits(SetInvalidValueError, SchrodingerError)

var errors = {
    SchrodingerError: SchrodingerError,
    InvalidEmptyListError: InvalidEmptyListError,
    InvalidParamConstructorError: InvalidParamConstructorError,
    GetWithDifferentSeedError: GetWithDifferentSeedError,
    SetAfterGetError: SetAfterGetError,
    SetAfterSetError: SetAfterSetError,
    SetDifferentValueError: SetDifferentValueError,
    SetInvalidValueError: SetInvalidValueError
}

Object.keys(errors).forEach(function (errorName) {
    errors[errorName].prototype.toString = function () {
        return errorName + ': ' + this.message
    }
})

module.exports = errors
