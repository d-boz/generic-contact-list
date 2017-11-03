'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('babel-polyfill');
var utils = require('./Utilities');
var Database = require('./Database');
var MailClient = require('./MailClient');

/**
 * Lambda Handler ( Makes Unit Testing Easier )
 * 
 * @param {object} event - Event passed to Lambda function from API Gateway 
 * @return {object} - Returns IsSuccess/Message object
 */
module.exports = {
    handleContact: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
            var parsedEvent, authToken, db, authClient, parsedEventBody, mailClient;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            if (!(event === 'undefined')) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', { IsSuccess: false, Message: 'No event data' });

                        case 3:
                            parsedEvent = utils().parseJson(event);
                            authToken = utils().parseToken(parsedEvent.headers.Authorization);
                            db = new Database(authToken);
                            _context.next = 8;
                            return db.fetchAuthorizedClient();

                        case 8:
                            authClient = _context.sent;

                            if (!(Object.keys(authClient).length <= 0)) {
                                _context.next = 11;
                                break;
                            }

                            throw new Error('Client doesn\'t exist, check your api key.');

                        case 11:
                            parsedEventBody = utils().parseEventBody(parsedEvent);

                            db.addContactMessage(parsedEventBody, authClient.Item);

                            // @TODO: Move to Lambda Env Var
                            mailClient = new MailClient('24efa8c60fe4da5885eb2e22ae02a1265862ac5b', parsedEventBody);
                            return _context.abrupt('return', mailClient.sendEmail(authClient.Item));

                        case 17:
                            _context.prev = 17;
                            _context.t0 = _context['catch'](0);

                            console.log(_context.t0);

                        case 20:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 17]]);
        }));

        function handleContact(_x) {
            return _ref.apply(this, arguments);
        }

        return handleContact;
    }()
};