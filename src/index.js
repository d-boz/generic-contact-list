'use strict';
require('babel-polyfill');
const utils = require('./Utilities');
const Database = require('./Database');
const MailClient = require('./MailClient');

/**
 * Lambda Handler ( Makes Unit Testing Easier )
 * 
 * @param {object} event - Event passed to Lambda function from API Gateway 
 * @return {object} - Returns IsSuccess/Message object
 */
module.exports = {
    handleContact: async function(event) {
        try {
            if (event === 'undefined') {
                return {IsSuccess: false, Message: 'No event data'};
            }
            let parsedEvent = utils().parseJson(event);
            let authToken = utils().parseToken(parsedEvent.headers.Authorization);
            let db = new Database(authToken);
            let authClient = await db.fetchAuthorizedClient();
            if (Object.keys(authClient).length <= 0) {
                throw new Error(`Client doesn't exist, check your api key.`);
            }

            let parsedEventBody = utils().parseEventBody(parsedEvent);
            db.addContactMessage(parsedEventBody, authClient.Item);

            // @TODO: Move to Lambda Env Var
            let mailClient = new MailClient('24efa8c60fe4da5885eb2e22ae02a1265862ac5b', parsedEventBody);
            return mailClient.sendEmail(authClient.Item);
        } catch (ex) {
            console.log(ex);
        }
    },
};
