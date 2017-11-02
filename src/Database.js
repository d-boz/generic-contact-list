'use-strict';

var AWS = require('aws-sdk');
var uuid = require('uuid');

//@TODO: Abstract this data to .json file

class CanaryDb {
    constructor() {
        this.dynamodb = new AWS.DynamoDB();
        this.dynamodbClient = new AWS.DynamoDB.DocumentClient();
    }

    /**
     * Check To See if Client is Authorized.
     * @TODO: Refactor to Generator or Promise or Async/Await ( Transpile with babel ... )
     * @param {*String} apiKey 
     * @param {*Function} callback 
     */
    AuthorizedClient(apiKey, callback) {
        let params = {
            TableName: "Authenticated-Contact-Clients",
            Key: {
                "ApiKey": apiKey,
            }
        };

        return new Promise((resolve, reject) => {
            this.dynamodbClient.get(params, (err, data) => {
                if(err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }

    /**
     * Add Contact Messages to Database
     * @param {*Object} body 
     */
    AddContactMessage(contactMessage, websiteName) {
        let params = {
            TableName: "Contact-Messages",
            Item: {
                "Id": uuid.v4(),
                "IpAddress": contactMessage.ipAddress,
                "FullName": contactMessage.fullName,
                "FirstName": contactMessage.firstName,
                "LastName": contactMessage.lastName,
                "Email": contactMessage.email,
                "Phone": contactMessage.phone,
                "Message": contactMessage.message,
                "WebsiteName": websiteName
            }
        };

        this.dynamodbClient.put(params, (err, data) => {
            if(err) console.error("Contact Message add unsuccessful.");
            else console.log(" Contact Message add successful.");
        });
    }
}

module.exports = CanaryDb;