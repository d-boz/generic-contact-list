'use-strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

const Database = function() {
    this.dynamoDb = new AWS.DynamoDB();
    this.dynamoDbClient = new AWS.DynamoDB.DocumentClient();
};

Database.prototype.fetchAuthorizedClient = function() {
    let params = {
        TableName: 'Authenticated-Contact-Clients',
        Key: {
            'ApiKey': apiKey,
        },
    };

    let dynamoDbRequest = this.dynamoDbClient.get(params);
    return dynamoDbRequest.promise();
};

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
