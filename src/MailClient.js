'use-strict';
let AWS = require('aws-sdk');
let SparkPost = require('sparkpost');

/**
 * MailClient Constructor
 * 
 * @param {string} apiKey - Api Key For Sparkpost Client Submission  
 */
const MailClient = function(apiKey, options) {
    // @TODO: Move Api Key to Lambda Env or DynamoDb Table
    this.sparkClient = new SparkPost(apiKey);

    if(typeof apiKey === 'undefined')
        throw new Error('Add Api Key to MailClient...');
}

/**
 * Send An Email via SparkPost
 */
MailClient.prototype.sendEmail = function() {
    this.sparkClient.transmissions.send({
        content: {
            from: 'mail@mail.suitablelabs.com',
            subject: 'Hello, World!',
            html: '<html><body><h1> Testing</h1></body></html>',
        },
        recipients: [
            { address: 'dj@suitablelabs.com' }
        ]
    })
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });
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
 * @param {string} s3Path - S3 Path Extrapolate Into Bucket and Key 
 * @return {object} Params for S3 
 */
function setS3Params(s3Path) {
    let parsedUrlObj = require('url').parse(s3Path);
    let s3UrlParams = parsedUrlObj.path.split(/^(\/[\w\-\.]+[^#?\s]+\/)/);
    return params = {
        Bucket: s3UrlParams[1].replace(/\//g, ''),
        Key: s3UrlParams[2],
    };
}

function createCollection() {};

/**
 * Interpolates String HTMLDocument with Collection
 * 
 * @param {string} htmlDoc - String HTML Document stored in Memory
 * @param {object} collection - Collection of Values to be Interpolated
 * @return {string} - Interpolated HTML Document
 */
function interpolateDocument(htmlDoc, collection) {
    let documentSplit = htmlDoc.split(' ');

    for (let i = 0; i < collection.length; i++) {
        let objKey = Object.keys(collection[i]).toString();
        let objVal = Object.values(collection[i]).toString();
        documentSplit[objKey] = objVal;
    }

    return documentSplit.join(' ');
};

module.exports = MailClient;