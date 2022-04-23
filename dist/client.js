'use strict';

require('@babel/polyfill/noConflict');

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _readline = require('readline');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _gettingStarted = require('./util/gettingStarted');

var _gettingStarted2 = _interopRequireDefault(_gettingStarted);

var _settings = require('./util/settings');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _console = console,
    log = _console.log,
    error = _console.error;


var host = ['http://localhost:6000', 'https://trim-chat.herokuapp.com'];

var validateUser = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(password) {
    var res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios2.default.post('http://localhost:6000/auth', { password: password });

          case 2:
            res = _context.sent;
            return _context.abrupt('return', res);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function validateUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

var renderMessage = function renderMessage(color, name, msg) {
  switch (color) {
    case 'red':
      log(_chalk2.default.italic.bold(_chalk2.default.red(name)) + ': ' + _chalk2.default.white(msg));
      break;

    case 'blue':
      log(_chalk2.default.italic.bold(_chalk2.default.blue(name)) + ': ' + _chalk2.default.white(msg));
      break;

    case 'yellow':
      log(_chalk2.default.italic.bold(_chalk2.default.yellow(name)) + ': ' + _chalk2.default.white(msg));
      break;

    case 'green':
      log(_chalk2.default.italic.bold(_chalk2.default.green(name)) + ': ' + _chalk2.default.white(msg));
      break;

    case 'magenta':
      log(_chalk2.default.italic.bold(_chalk2.default.magenta(name)) + ': ' + _chalk2.default.white(msg));
      break;

    case 'cyan':
      log(_chalk2.default.italic.bold(_chalk2.default.cyan(name)) + ': ' + _chalk2.default.white(msg));
      break;

    case 'gray':
      log(_chalk2.default.italic.bold(_chalk2.default.gray(name)) + ': ' + _chalk2.default.white(msg));
      break;

    default:
      log(_chalk2.default.italic.bold(_chalk2.default.bgRed(name)) + ': ' + _chalk2.default.white(msg));
      break;
  }
};

var startApp = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var get, userSchema, _ref3, username, socket, input;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            _prompt2.default.start();
            _prompt2.default.message = '';
            get = _util2.default.promisify(_prompt2.default.get);

            log(_chalk2.default.cyan('---------------  SIGN IN  ---------------'));
            userSchema = [{
              description: 'Enter a username',
              name: 'username',
              required: true
            }, {
              description: 'Enter password',
              name: 'password',
              required: true
            }];

            // const { password } = await get(userSchema[1]);
            // const { status, message } = (await validateUser(password)).data;

            // if (status !== 200 && message !== 'Success') { throw new Error('Incorrect password'); }

            _chalk2.default.bgBlue('got here first');

            _context3.next = 9;
            return get(userSchema[0]);

          case 9:
            _ref3 = _context3.sent;
            username = _ref3.username;


            _chalk2.default.bgBlue('got here seconds');

            socket = (0, _socket2.default)(host[1], { path: '/chat' });


            socket.on('connect', function () {
              log(_chalk2.default.green('You (' + username + ') are connected'));
            });

            socket.emit('Register', username, function (data) {
              log(data);
              (0, _gettingStarted2.default)();
            });

            input = (0, _readline.createInterface)({
              input: process.stdin
            });


            socket.on('message', function (_ref4) {
              var sender = _ref4.sender,
                  msg = _ref4.message,
                  color = _ref4.color;

              renderMessage(color, sender, msg);
            });

            socket.on('Direct Message', function (_ref5) {
              var name = _ref5.name,
                  msg = _ref5.message;

              log('' + _chalk2.default.bold.white('Direct Message =>') + _chalk2.default.italic.bold.cyan(name) + ': ' + _chalk2.default.white(msg));
            });

            input.on('line', function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(value) {
                var _inputValidator, inputType, mssg, chatroom, receipient;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _inputValidator = (0, _settings2.default)(value), inputType = _inputValidator.inputType, mssg = _inputValidator.message, chatroom = _inputValidator.chatroom, receipient = _inputValidator.receipient;
                        _context2.t0 = inputType;
                        _context2.next = _context2.t0 === 'create room' ? 4 : _context2.t0 === 'join' ? 6 : _context2.t0 === 'leave' ? 8 : _context2.t0 === 'delete room' ? 10 : _context2.t0 === 'list members' ? 12 : _context2.t0 === 'list chatrooms' ? 14 : _context2.t0 === 'Chatroom message' ? 16 : _context2.t0 === 'Direct message' ? 18 : 20;
                        break;

                      case 4:
                        socket.emit('Create chatroom', chatroom, function (result) {
                          log(result);
                        });
                        return _context2.abrupt('break', 22);

                      case 6:
                        socket.emit('Join chatroom', chatroom, function (result) {
                          log(result);
                        });
                        return _context2.abrupt('break', 22);

                      case 8:
                        socket.emit('Leave chatroom', chatroom, function (result) {
                          log(result);
                        });
                        return _context2.abrupt('break', 22);

                      case 10:
                        socket.emit('Delete chatroom', chatroom, function (result) {
                          log(result);
                        });
                        return _context2.abrupt('break', 22);

                      case 12:
                        socket.emit('View chatroom members', function (result) {
                          log(result);
                        });
                        return _context2.abrupt('break', 22);

                      case 14:
                        socket.emit('List all chatrooms', function (result) {
                          log(result);
                        });
                        return _context2.abrupt('break', 22);

                      case 16:
                        socket.emit('Chatroom message', mssg, function (result) {
                          log(result);
                        });
                        return _context2.abrupt('break', 22);

                      case 18:
                        socket.emit('Direct message', { mssg: mssg, receipient: receipient }, function (result) {
                          log(result);
                        });
                        return _context2.abrupt('break', 22);

                      case 20:
                        log('try "trim_chat --help" for help on how to use app');
                        return _context2.abrupt('break', 22);

                      case 22:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x2) {
                return _ref6.apply(this, arguments);
              };
            }());
            _context3.next = 25;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3['catch'](0);

            error(_chalk2.default.red(_context3.t0));
            process.exit(0);

          case 25:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 21]]);
  }));

  return function startApp() {
    return _ref2.apply(this, arguments);
  };
}();

startApp();