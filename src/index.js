var _ = require('lodash')

function Schrodinger (list) {
    if (!_.isFunction(list) && !_.isArray(list)) {
        throw new Error('`' + list + '` must be a function or a list')
    }

    this.list = list
}

Schrodinger.prototype.get = function (seed) {
    var list = this.list
    return _.isFunction(this.list) ? list(seed) : list[seed % list.length]
}

module.exports = Schrodinger
