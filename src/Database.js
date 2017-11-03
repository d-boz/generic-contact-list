'use-strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

/**
 * Constructor
 * 
 * @param {string} clientKey - Initializes Api Key to Sort Clients By  
 */
const Database = function(clientKey) {
    this.dynamoDb = new AWS.DynamoDB();
    this.dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    this.clientKey = clientKey;
};

/**
 * Check to see if the user is authorized
 * Based on clientKey/Token supplied in constructor
 * 
 * @return {promise}
 */
Database.prototype.fetchAuthorizedClient = function() {
    let params = {
        TableName: 'Authenticated-Contact-Clients',
        Key: {
            'ApiKey': this.clientKey,
        },
    };

    let dynamoDbRequest = this.dynamoDbClient.get(params);
    return dynamoDbRequest.promise();
};

/**
 * Adds contact message to DynamoDB Table ( Contact-Messages )
 * 
 * @param {object} contactMessage - Object with event input from form
 * @param {string} websiteName - Stores contact-message via WebsiteName ( TODO: Prolly should use ID or something instead... )
 */
Database.prototype.addContactMessage = function(contactMessage, websiteName) {
    let params = {
        TableName: 'Contact-Messages',
        Item: {
            'Id': uuid.v4(),
            'IpAddress': contactMessage.ipAddress,
            'FullName': contactMessage.fullName,
            'FirstName': contactMessage.firstName,
            'LastName': contactMessage.lastName,
            'Email': contactMessage.email,
            'Phone': contactMessage.phone,
            'Message': contactMessage.message,
            'WebsiteName': contactMessage.webisteName,
        },
    };

    this.dynamoDbClient.put(params, (err, data) => {
        if (err) console.error('Issues adding contact message. ', err);
        else console.log('Contact message successfully added.');
    });
};

module.exports = Database;
