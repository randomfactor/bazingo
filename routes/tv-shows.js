/**
 * Created by randall on 11/27/16.
 */
var express = require('express');
var router = express.Router();
var r = require('rethinkdb');

/* GET tv shows listing. */
router.get('/', function(req, res, next) {
    var connection = null;
    r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
        if (err) throw err;
        connection = conn;

        r.db('test').table('tv_shows').run(connection, function(err, cursor) {
            if (err) throw err;
            cursor.toArray(function(err, result) {
                if (err) throw err;
                // console.log(JSON.stringify(result, null, 2));
                res.setHeader('Content-Type', 'application/json');
                res.send({data: result});
            });
        });
    });
});

module.exports = router;