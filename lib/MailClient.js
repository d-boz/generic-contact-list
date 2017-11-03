'use strict';
'use-strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var AWS = require('aws-sdk');
var SparkPost = require('sparkpost');

/**
 * MailClient Constructor
 * 
 * @param {string} apiKey - Api Key For Sparkpost Client Submission  
 * @param {object} userInputMap - Contains all html field injection values 
 */
var MailClient = function MailClient(apiKey, userInputMap) {
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
MailClient.prototype.sendEmail = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(authClient) {
        var rawHtmlDoc, injectedHtmlDoc, recipientAddress, emailOptions, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return loadHtmlDocument(authClient.HtmlTemplateLocation);

                    case 3:
                        rawHtmlDoc = _context.sent;

                        rawHtmlDoc = rawHtmlDoc.Body.toString('utf-8');

                        injectedHtmlDoc = interpolateDocument(rawHtmlDoc, this.userInputMap);
                        recipientAddress = authClient.Email.toString();
                        emailOptions = {
                            content: {
                                from: 'mail@mail.suitablelabs.com',
                                subject: 'Mail From Suitable Labs',
                                html: injectedHtmlDoc
                            },
                            recipients: [{ address: recipientAddress }]
                        };
                        _context.next = 10;
                        return this.sparkClient.transmissions.send(emailOptions);

                    case 10:
                        response = _context.sent;
                        return _context.abrupt('return', response);

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](0);

                        console.log(_context.t0);
                        return _context.abrupt('return', { IsSuccess: false, Message: _context.t0 });

                    case 18:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 14]]);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * Load HTML Document from S3 Bucket 
 * 
 * @param {string} htmlDoc - S3 String Path To HTML Document 
 * @return {Promise}
 */
function loadHtmlDocument(htmlDoc) {
    var s3 = new AWS.S3();
    var s3Request = s3.getObject(setS3Params(htmlDoc));

    return s3Request.promise();
}

/**
 * Set S3 Parameters for GetObject
 * 
 * @param {string} s3Path - S3 Path Extrapolate Into Bucket and Key 
 * @return {object} Params for S3 
 */
function setS3Params(s3Path) {
    var parsedUrlObj = require('url').parse(s3Path);
    var s3UrlParams = parsedUrlObj.path.split(/^(\/[\w\-\.]+[^#?\s]+\/)/);

    return {
        Bucket: s3UrlParams[1].replace(/\//g, ''),
        Key: s3UrlParams[2]
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
    var docLines = htmlDoc.split('\n');
    for (var line in docLines) {
        for (var item in collection) {
            docLines[line] = docLines[line].replace(item, collection[item]);
        }
    }

    return docLines.join('\n');
};

module.exports = MailClient;