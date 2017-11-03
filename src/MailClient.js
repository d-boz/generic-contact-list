'use-strict';
let AWS = require('aws-sdk');
let SparkPost = require('sparkpost');

/**
 * MailClient Constructor
 * 
 * @param {string} apiKey - Api Key For Sparkpost Client Submission  
 * @param {object} userInputMap - Contains all html field injection values 
 */
const MailClient = function(apiKey, userInputMap) {
    // @TODO: Move Api Key to Lambda Env or DynamoDb Table
    this.sparkClient = new SparkPost(apiKey);
    this.userInputMap = userInputMap;

    if (typeof apiKey === 'undefined') {
        throw new Error('Add Api Key to MailClient...');
    }

    if (typeof userInputMap === 'undefined') {
        throw new Error('Pass hashmap for html document interpolation...');
    }
};

/**
 * Send An Email via SparkPost
 * @param {object} authClient - 
 * @return {object} 
 */
MailClient.prototype.sendEmail = async function(authClient) {
    try {
        let rawHtmlDoc = await loadHtmlDocument(authClient.HtmlTemplateLocation);
        rawHtmlDoc = rawHtmlDoc.Body.toString('utf-8');
        
        let injectedHtmlDoc = interpolateDocument(
            rawHtmlDoc, this.userInputMap
        );
        let recipientAddress = authClient.Email.toString();
        let emailOptions = {
            content: {
                from: 'mail@mail.suitablelabs.com',
                subject: 'Mail From Suitable Labs',
                html: injectedHtmlDoc,
            },
            recipients: [
                {address: recipientAddress},
            ],
        };

        let response = await this.sparkClient.transmissions.send(emailOptions);
        return response;
    } catch (ex) {
        console.log(ex);
        return {IsSuccess: false, Message: ex};
    }
};

/**
 * Load HTML Document from S3 Bucket 
 * 
 * @param {string} htmlDoc - S3 String Path To HTML Document 
 * @return {Promise}
 */
function loadHtmlDocument(htmlDoc) {
    let s3 = new AWS.S3();
    let s3Request = s3.getObject(setS3Params(htmlDoc));

    return s3Request.promise();
}

/**
 * Set S3 Parameters for GetObject
 * 
 * @param {string} s3Path - S3 Path Extrapolate Into Bucket and Key 
 * @return {object} Params for S3 
 */
function setS3Params(s3Path) {
    let parsedUrlObj = require('url').parse(s3Path);
    let s3UrlParams = parsedUrlObj.path.split(/^(\/[\w\-\.]+[^#?\s]+\/)/);

    return {
        Bucket: s3UrlParams[1].replace(/\//g, ''),
        Key: s3UrlParams[2],
    };
}

/**
 * Interpolates String HTMLDocument with Collection
 * 
 * @param {string} htmlDoc - String HTML Document stored in Memory
 * @param {object} collection - Collection of Values to be Interpolated
 * @return {string} - Interpolated HTML Document
 */
function interpolateDocument(htmlDoc, collection) {
    let docLines = htmlDoc.split('\n');

    // @TODO: Fix.... 
    for(let line in docLines) {
        for(let item in collection) {
            docLines[line] = docLines[line].replace(item, collection[item]);
        }
    }

    return docLines.join('\n');
};

module.exports = MailClient;
