'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = undefined;

var _chalkAnimation = require('chalk-animation');

var _chalkAnimation2 = _interopRequireDefault(_chalkAnimation);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var sleep = exports.sleep = function sleep() {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2000;
  return new Promise(function (r) {
    return setTimeout(r, ms);
  });
};
var _console = console,
    log = _console.log;
exports.default = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var rainbowTitle;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rainbowTitle = _chalkAnimation2.default.rainbow('🏁 💐 💮 ---------------- Welcome to Trim_Chat ----------------- 💮 💐 🏁  \n');
          _context.next = 3;
          return sleep();

        case 3:

          rainbowTitle.stop();

          log('\n    ' + _chalk2.default.bgBlue('HOW TO USE APP') + ':\n      HINT: commands should only be typed inside these \'< >\'\n\n      CHATROOM: you can create, join, leave or delete a chatroom.\n      You are allowed be a member of a single chatroom at a time.\n\n      - to create a chatroom type "<create room (name of chatroom)>"\n      - to join a chatroom type "<join (name of chatroom)>"\n      - to leave a chatroom type "<leave (name of chatroom)>"\n      - to delete a chatroom type "<delete room (name of chatroom)>"\n      - to view list of users in a chatroom type "<members>"\n      - to view the list of chatrooms type "<rooms>"\n\n      SEND MESSAGES: to send a message you must be a member of a/the chatroom.\n      - to send a message in a chatroom you are in, just type the message on you terminal/console\n      - to send a direct message to someone in a chatroom you are in. Type "<the message @(the person name)>"\n  ');

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));