import '@babel/polyfill/noConflict';
import io from 'socket.io-client';
import { createInterface } from 'readline';
import axios from 'axios';
import prompt from 'prompt';
import util from 'util';
import chalk from 'chalk';
import gettingStarted from './util/gettingStarted';
import inputValidator from './util/settings';

const { log, error } = console;

const validateUser = async (password) => {
  const res = await axios.post('http://localhost:2018/auth', { password });
  return res;
};

const renderMessage = (color, name, msg) => {
  switch (color) {
    case 'red':
      log(`${chalk.italic.bold(chalk.red(name))}: ${chalk.white(msg)}`);
      break;

    case 'blue':
      log(`${chalk.italic.bold(chalk.blue(name))}: ${chalk.white(msg)}`);
      break;

    case 'yellow':
      log(`${chalk.italic.bold(chalk.yellow(name))}: ${chalk.white(msg)}`);
      break;

    case 'green':
      log(`${chalk.italic.bold(chalk.green(name))}: ${chalk.white(msg)}`);
      break;

    case 'magenta':
      log(`${chalk.italic.bold(chalk.magenta(name))}: ${chalk.white(msg)}`);
      break;

    case 'cyan':
      log(`${chalk.italic.bold(chalk.cyan(name))}: ${chalk.white(msg)}`);
      break;

    case 'gray':
      log(`${chalk.italic.bold(chalk.gray(name))}: ${chalk.white(msg)}`);
      break;

    default:
      log(`${chalk.italic.bold(chalk.bgRed(name))}: ${chalk.white(msg)}`);
      break;
  }
};

const startApp = async () => {
  try {
    prompt.start();
    prompt.message = '';
    const get = util.promisify(prompt.get);
    log(chalk.cyan('---------------  SIGN IN  ---------------'));
    const userSchema = [{
      description: 'Enter a username',
      name: 'username',
      required: true,
    },
    {
      description: 'Enter password',
      name: 'password',
      required: true,
    }];

    const { password } = await get(userSchema[1]);
    const { status, message } = (await validateUser(password)).data;

    if (status !== 200 && message !== 'Success') throw new Error('Incorrect password');

    const { username } = await get(userSchema[0]);

    const host = ['http://localhost:2018', 'https://trim-chat.herokuapp.com'];
    const socket = io(host[1], {
      path: '/chat',
    });

    socket.on('connect', () => {
      log(chalk.green(`You (${username}) are connected`));
    });

    socket.emit('Register', username, (data) => {
      log(data);
      gettingStarted();
    });

    const input = createInterface({
      input: process.stdin,
    });

    socket.on('message', ({ sender, message: msg, color }) => {
      renderMessage(color, sender, msg);
    });

    socket.on('Direct Message', ({ name, message: msg }) => {
      log(`${chalk.bold.white('Direct Message =>')}${chalk.italic.bold.cyan(name)}: ${chalk.white(msg)}`);
    });

    input.on('line', async (value) => {
      const {
        inputType, message: mssg, chatroom, receipient,
      } = inputValidator(value);

      switch (inputType) {
        case 'create room':
          socket.emit('Create chatroom', chatroom, (result) => {
            log(result);
          });
          break;

        case 'join':
          socket.emit('Join chatroom', chatroom, (result) => {
            log(result);
          });
          break;

        case 'leave':
          socket.emit('Leave chatroom', chatroom, (result) => {
            log(result);
          });
          break;

        case 'delete room':
          socket.emit('Delete chatroom', chatroom, (result) => {
            log(result);
          });
          break;

        case 'list members':
          socket.emit('View chatroom members', (result) => {
            log(result);
          });
          break;

        case 'list chatrooms':
          socket.emit('List all chatrooms', (result) => {
            log(result);
          });
          break;

        case 'Chatroom message':
          socket.emit('Chatroom message', mssg, (result) => {
            log(result);
          });
          break;

        case 'Direct message':
          socket.emit('Direct message', { mssg, receipient }, (result) => {
            log(result);
          });
          break;

        default:
          log('try "trim_chat --help" for help on how to use app');
          break;
      }
    });
  } catch (err) {
    error(chalk.red(err));
    process.exit(0);
  }
};

startApp();
