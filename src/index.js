function Schrodinger (list, strict) {
    if (!(typeof list === 'function') && !Array.isArray(list)) {
        throw new Error('`' + list + '` must be a function or a list')
    }

    this.strict = !!strict
    this.list = list
}

Schrodinger.prototype.get = function (seed) {
    var list = this.list
    if (!this.hasOwnProperty('seed')) {
        this.seed = seed
    } else if (this.strict && this.seed !== seed) {
        throw new Error('It is not possible to call get method with seed `' +
            seed + '` if it is previously called with another seed (`' + this.seed + '`).')
    }

    if (!this.hasOwnProperty('value')) {
        this.value = typeof list === 'function' ? list(seed) : list[seed % list.length]
    }
    return this.value
}

Schrodinger.prototype.set = function (value) {
    var list = this.list
    if (this.hasOwnProperty('value')) {
        throw new Error('It is not possible to set the value `' +
            value + '` after calling get method.')
    } else if (this.strict && Array.isArray(list) && list.indexOf(value) === -1) {
        throw new Error('`' + value + '` is invalid value to set. Valid values: [' +
            list.join(', ') + '].')
    }
    this.value = value
}

module.exports = Schrodinger
