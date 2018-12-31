const settings = (input) => {
  const validation = {
    inputType: undefined,
    message: undefined,
    chatroom: undefined,
    receipient: undefined,
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
      const pealedInput = input.replace(/(<|>)/g, '');
      const [i, j] = pealedInput.split(' (');
      const chatroom = j.replace(/(\(|\))/g, '');
      validation.inputType = i;
      validation.chatroom = chatroom;
      return validation;
    }
  }

  if (input.includes('@(') && input.endsWith(')')) {
    const [message, rest] = input.replace(/(<|>)/g, '').split(' @(');
    const receipient = rest.replace(/(\(|\))/g, '');
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

export default settings;
