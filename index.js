'use strict';
var MailClient = require('./src/MailClient');
var Utilities = require('./src/Utilities');
module.exports.contactHandler = (event, context, callback) => {

    handleContact = handleContact(event);
    callback(null, handleContact);
};

function handleContact(event) {
    let utils = Utilities();
    let parsedEvent = utils.parseBody(event);

    let obj = {
        body: JSON.stringify({
            'Test': 'test'
        })
    };

    return obj;
}
