'use strict';

const genericContactEntry = require('./lib/index');
module.exports.contactHandler = (event, context, callback) => {
    genericContactEntry.handleContact(event)
        .then((response) => {
            callback(null, response);
        })
        .catch((err) => {
            callback(null, {IsSuccess: false, Message: err});
        });
};
