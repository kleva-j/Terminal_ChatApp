import '@babel/polyfill/noConflict';
import io from 'socket.io-client';
import { createInterface } from 'readline';
import axios from 'axios';
import prompt from 'prompt';
import util from 'util';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();
const { log, error } = console;

const validateUser = async (password) => {
  const res = await axios.post('https://trim-chat.herokuapp.com/auth', { password });
  return res;
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

    const socket = io('https://trim-chat.herokuapp.com', {
      path: '/chat',
    });

    socket.on('connect', () => {
      log(chalk.green(`You (${username}) are connected`));
    });

    socket.on('user connected', (data) => {
      log(chalk.yellow(`New user: ${data} has joined`));
    });

    const input = createInterface({
      input: process.stdin,
    });

    socket.emit('Join Chatroom', username);

    socket.on('message', ({ name, msg, cl }) => {
      switch (cl) {
        case 'red':
          log(`${chalk.bold(chalk.red(name))}: ${chalk.italic(chalk.white(msg))}`);
          break;

        case 'blue':
          log(`${chalk.bold(chalk.blue(name))}: ${chalk.italic(chalk.white(msg))}`);
          break;

        case 'yellow':
          log(`${chalk.bold(chalk.yellow(name))}: ${chalk.italic(chalk.white(msg))}`);
          break;

        case 'green':
          log(`${chalk.bold(chalk.green(name))}: ${chalk.italic(chalk.white(msg))}`);
          break;

        case 'magenta':
          log(`${chalk.bold(chalk.magenta(name))}: ${chalk.italic(chalk.white(msg))}`);
          break;

        case 'cyan':
          log(`${chalk.bold(chalk.cyan(name))}: ${chalk.italic(chalk.white(msg))}`);
          break;

        case 'gray':
          log(`${chalk.bold(chalk.gray(name))}: ${chalk.italic(chalk.white(msg))}`);
          break;

        default:
          log(`${chalk.bold(chalk.bgRed(name))}: ${chalk.italic(chalk.white(msg))}`);
          break;
      }
    });

    input.on('line', async (msg) => {
      socket.emit('message', msg);
    });
  } catch (err) {
    error(chalk.red(err));
    process.exit(0);
  }
};

startApp();
