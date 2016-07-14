var async = require('async')
var get = require('lodash.get')
var format = require('util').format

module.exports = function(options) {

    var pg = get(options, 'pg') || require('pg')
    var pool
    var config
    var logger

    function init(dependencies, cb) {
        config = dependencies.config
        logger = dependencies.logger || console
        cb()
    }

    function validate(cb) {
        if (!config) return cb(new Error('config is required'))
        cb()
    }

    function start(cb) {
        logger.info(format('Connecting to %s', getConnectionUrl()))
        config.log = logger
        pool = new pg.Pool(config)
        pool.query('select 1').then(function() {
            return cb(null, pool)
        }).catch(function(err) {
            return cb(err)
        })
    }

    function stop(cb) {
        if (!pool) return cb()
        logger.info(format('Disconnecting from %s', getConnectionUrl()))
        pool.end(cb)
    }

    function getConnectionUrl() {
        return format('postgres://%s:%s/%s', config.host || 'localhost', config.port || 5432, config.database || '')
    }

    return {
        start: async.seq(init, validate, start),
        stop: stop
    }
}