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
        pool = new pg.Pool(config)
        pool.on('connect', client => {
            /*
                pg maintains the order of queued requests. Since the connect event is synchronous
                we can be sure the following statements will be executed before any other queries
            */
            client.on('notice', function(notice) {
                switch (notice.severity) {
                    case 'DEBUG': {
                        logger.debug(notice.message)
                        break;
                    }
                    case 'LOG': {
                        logger.info(notice.message)
                        break;
                    }
                    case 'INFO': {
                        logger.info(notice.message)
                        break;
                    }
                    case 'NOTICE': {
                        logger.info(notice.message)
                        break;
                    }
                    case 'WARNING': {
                        logger.warn(notice.message)
                        break;
                    }
                    case 'EXCEPTION': {
                        logger.error(notice.message)
                        break;
                    }
                    default: {
                        logger.error(notice.message)
                        break;
                    }
                }
            })
            async.eachSeries(config.onConnect || [], function(query, cb) {
                client.query(query, function(err) {
                    if (err) logger.error(format('Error running query: %s', query), err)
                    cb()
                })
            })
        })
        pool.on('error', function(err) {
            logger.warn(format('An idle client has experienced an error'), err)
        })
        cb(null, pool);
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
