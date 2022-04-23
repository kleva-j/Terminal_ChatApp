import ChalkAnimation from 'chalk-animation';
import Inquirer from 'inquirer';
import Chalk from 'chalk';
import axios from 'axios';

export const { log, error } = console;

export const GetUsername = () => process.env.SUDO_USER
  || process.env.C9_USER
  || process.env.LOGNAME
  || process.env.USER
  || process.env.LNAME
  || process.env.USERNAME;

export async function InquireInfo() {
  return Inquirer.prompt([
    {
      description: 'Enter your password',
      name: 'password',
      type: 'password',
    },
    {
      default: GetUsername() || 'Young_warlock_69',
      description: 'Enter a username',
      name: 'username',
      type: 'input',
    },
  ]);
}

export const Host = process.env.host || 'http://localhost:6000';

export const ValidateUser = async (password) => {
  const res = await axios.post(`${Host}/auth`, { password });
  return res;
};

export const sleep = (ms = 2000) => new Promise(r => setTimeout(r, ms));

export const GettingStarted = async () => {
  const rainbowTitle = ChalkAnimation.rainbow(
    '\n🏁 💐 💮 ---------------- Welcome to Trim_Chat ----------------- 💮 💐 🏁  \n',
  );

  await sleep();

  rainbowTitle.stop();

  log(`
    ${Chalk.bgBlue('HOW TO USE APP')}:
      HINT: commands should only be typed inside these '< >'

      CHATROOM: you can create, join, leave or delete a chatroom.
      You are allowed be a member of a single chatroom at a time.

      - to create a chatroom type "<create room (name of chatroom)>"
      - to join a chatroom type "<join (name of chatroom)>"
      - to leave a chatroom type "<leave (name of chatroom)>"
      - to delete a chatroom type "<delete room (name of chatroom)>"
      - to view list of users in a chatroom type "<members>"
      - to view the list of chatrooms type "<rooms>"

      SEND MESSAGES: to send a message you must be a member of a/the chatroom.
      - to send a message in a chatroom you are in, just type the message on you terminal/console
      - to send a direct message to someone in a chatroom you are in. Type "<the message @(the person name)>"
  `);
};

export const InputValidator = (input) => {
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

export const RenderMessage = (color = 'red', name, msg) => {
  log(`> (you): ${Chalk.italic.bold(Chalk[color](name))}: ${Chalk.white(msg)}`);
};
