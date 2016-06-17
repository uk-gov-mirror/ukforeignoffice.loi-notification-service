/**
 * Created by skaifem on 31/12/2015.
 */

var sendgrid = require('./sendgrid.js');

exports.config = function() {
    var node_env = process.env.NODE_ENV || 'development';

    return sendgrid;
};
