'use strict';
'use-strict';

var AWS = require('aws-sdk');
var uuid = require('uuid');

var Database = function Database(clientKey) {
    this.dynamoDb = new AWS.DynamoDB();
    this.dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    this.clientKey = clientKey;
};

Database.prototype.fetchAuthorizedClient = function () {
    var params = {
        TableName: 'Authenticated-Contact-Clients',
        Key: {
            'ApiKey': this.clientKey
        }
    };

    var dynamoDbRequest = this.dynamoDbClient.get(params);
    return dynamoDbRequest.promise();
};

Database.prototype.addContactMessage = function (contactMessage, websiteName) {
    var params = {
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
            'WebsiteName': contactMessage.webisteName
        }
    };

    this.dynamoDbClient.put(params, function (err, data) {
        if (err) console.error('Issues adding contact message. ', err);else console.log('Contact message successfully added.');
    });
};

module.exports = Database;