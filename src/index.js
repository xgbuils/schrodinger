var _ = require('lodash')

function Schrodinger (list) {
    if (!_.isFunction(list) && !_.isArray(list)) {
        throw new Error('`' + list + '` must be a function or a list')
    }
}

module.exports = Schrodinger
