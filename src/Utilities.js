let _ = require('lodash');

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
Utilities.prototype.parseEventBody = function(jsonEvent) {
    let eventObject = this.parseJson(jsonEvent);
    if (eventObject === 'undefined' || Object.keys(eventObject).length === 0) {
        throw new Error('Empty Event Object...');
    }

    let eventBody = eventObject.body;
    if (eventBody === 'undefined' || Object.keys(eventBody).length === 0) {
        throw new Error('No Form Data Submitted...');
    }

    return htmlDocObjectFactory(eventObject);
};

/**
 * Returns json object
 * 
 * @param {string | object} json
 * @return {Object} 
 */
Utilities.prototype.parseJson = function(json) {
    try {
        // @TODO: Could check if blank...?
        return JSON.parse(json);
    } catch (ex) {
        return json;
    }
};

/**
 * Extract authorization token from header(remove Basic keyword & trim)
 * 
 * @param {string} tokenString - String from Authorization Header
 * @return {string} Returns the token without `Basic` keyword in string
 */
Utilities.prototype.parseToken = function(tokenString) {
    return tokenString.replace('Basic', '').trim();
};

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
    // @TODO: Eventually, pull these iterating keys from Dynamo 
    // all about that dynamic interpolation...?
    let htmlDocKeys = [
                        'apiKey', 'firstName', 'lastName',
                        'fullName', 'email', 'phone', 'message',
                    ];
    
    let eventBody = eventObject.body;
    let loweredEventBody = _.transform(eventBody, (result, val, key) => {
        result[key.toLowerCase()] = val;
    });

    let returnObj = {};
    returnObj['%%ipAddress%%'] = eventObject.identity.sourceIp;

    // Parse Body of Event ( Body always contains Input Data )
    // Iterate this event object...
    htmlDocKeys.forEach( (htmlDocKey) => {
        let loweredHtmlDocKey = htmlDocKey.toLowerCase();

        // If the htmlKey exists in user input data, add user input val to htmlKey val
        if (loweredHtmlDocKey in loweredEventBody) {
            let cleanInput = cleanEventBodyData(
                loweredEventBody[loweredHtmlDocKey]
            );

            returnObj['%%'+htmlDocKey+'%%'] = cleanInput;
        }
    });

    return returnObj;
}

module.exports = Utilities;
