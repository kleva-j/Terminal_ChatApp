'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var settings = function settings(input) {
  var validation = {
    inputType: undefined,
    message: undefined,
    chatroom: undefined,
    receipient: undefined
  };

  if (input.startsWith('<') && input.endsWith('>')) {
    if (input === '<members>') {
      validation.inputType = 'list members';
      return validation;
    }
    if (input === '<rooms>') {
      validation.inputType = 'list chatrooms';
      return validation;
    }
    if (input.includes('(') && input.includes(')')) {
      var pealedInput = input.replace(/(<|>)/g, '');

      var _pealedInput$split = pealedInput.split(' ('),
          _pealedInput$split2 = _slicedToArray(_pealedInput$split, 2),
          i = _pealedInput$split2[0],
          j = _pealedInput$split2[1];

      var chatroom = j.replace(/(\(|\))/g, '');
      validation.inputType = i;
      validation.chatroom = chatroom;
      return validation;
    }
  }

  if (input.includes('@(') && input.endsWith(')')) {
    var _input$replace$split = input.replace(/(<|>)/g, '').split(' @('),
        _input$replace$split2 = _slicedToArray(_input$replace$split, 2),
        message = _input$replace$split2[0],
        rest = _input$replace$split2[1];

    var receipient = rest.replace(/(\(|\))/g, '');
    validation.inputType = 'Direct message';
    validation.message = message;
    validation.receipient = receipient;
    return validation;
  }

  if (input !== '') {
    validation.inputType = 'Chatroom message';
    validation.message = input;
    return validation;
  }
  return validation;
};

exports.default = settings;