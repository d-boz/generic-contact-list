'use strict';
//const MailClient = require('./src/MailClient');
const utilities = require('./src/Utilities');
const Database = require('./src/Database');
module.exports.contactHandler = (event, context, callback) => {
    handleContact = handleContact(event);

    callback(null, handleContact);
};

/**
 * Lambda Handler ( Makes Unit Testing Easier )
 * 
 * @param {object} event - Event passed to Lambda function from API Gateway 
 * @return {object} - Returns IsSuccess/Message object
 */
async function handleContact(event) {
    // Check if data is even exists...
    if (event === 'undefined') {
        return {IsSuccess: false, Message: 'No event data'};
    }
    // Parse event data 
    let parsedEvent = utilities().parseBody(event);
    let db = new Database();    
    let authorizedClient = await db.fetchAuthorizedClient(parsedEvent.)

    // 
    return obj;
}
