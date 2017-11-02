let _ = require('lodash');

/**
 * Returns json object
 * 
 * @param {string | object} json
 * @return {Object} 
 */
function parseJson(json) {
    try {
        // @TODO: Could check if blank...?
        return JSON.parse(json);
    } catch (ex) {
        return json;
    }
}

/**
 * Sanitize input
 * 
 * @param {string} input 
 * @return {string} Sanitized string
 */
function cleanEventBodyData(input) {
    return _.escape(input);
}

/**
 * Creates new object with html doc interpolation keys associated with account
 * @TODO: Will need to add keys from DynamoDb ( rather than hard coding ... )
 * 
 * @param {object} eventObject
 * @return {object}  
 */
function htmlDocObjectFactory(eventObject) {
    returnObj['ipAddress'] = eventObject.identity.sourceIp;
    // @TODO: Eventually, pull these iterating keys from Dynamo 
    // all about that dynamic interpolation...?
    let htmlDocKeys = [
                        'apiKey', 'firstName', 'lastName',
                        'fullName', 'email', 'phone', 'message',
                    ];

    let loweredEventBody = _.transform(eventBody, (result, val, key) => {
        result[key.toLowerCase()] = val;
    });

    // Parse Body of Event ( Body always contains Input Data )
    // Iterate this massive event object...
    htmlDocKeys.forEach( (htmlDocKey) => {
        let loweredHtmlDocKey = htmlDocKey.toLowerCase();
        if (loweredHtmlDocKey in loweredEventBody) {
            let cleanInput = cleanEventBodyData(
                loweredEventBody[loweredHtmlDocKey]
            );

            returnObj[htmlDocKey] = cleanInput;
        }
    });

    return returnObj;
}

/**
 * Utilities function initialization 
 * 
 * @return {object} Utilities object
 */
const Utilities = function() {
    const utilsObject = Object.create(Utilities.prototype);
    return utilsObject;
};

/**
 * Returns hashmap for account associated html doc interpolation
 * 
 * @param {object} jsonEvent - Json encoded event 
 * @return {object} Returns Html Document 'HashMap'
 */
Utilities.prototype.parseBody = function(jsonEvent) {
    let eventObject = parseJson(jsonEvent);
    if (eventObject === 'undefined' || Object.keys(eventObject).length === 0) {
        throw new Error('Empty Event Object...');
    }

    let eventBody = eventObject.body;
    if (eventBody === 'undefined' || Object.keys(eventBody).length === 0) {
        throw new Error('No Form Data Submitted...');
    }

    return htmlDocObjectFactory(eventObject);
};

module.exports = Utilities;
