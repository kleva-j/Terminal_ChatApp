/* eslint-disable global-require */
import '@babel/polyfill/noConflict';

import io from 'socket.io-client';
import readline from 'readline';
import chalk from 'chalk';

import { stdin, stdout } from 'process';
import { prompt } from 'inquirer';

import {
  GettingStarted,
  InputValidator,
  RenderMessage,
  ValidateUser,
  InquireInfo,
  error,
  Host,
  log,
} from './util';

const { createInterface } = readline;

const startApp = async () => {
  try {
    const { username, password } = await InquireInfo();

    const { status, message } = (await ValidateUser(password)).data;

    if (status !== 200 && message !== 'Success') { throw new Error('Incorrect password'); }

    const socket = io(Host, { path: '/chat' });

    socket.on('connect', () => log(chalk.green(`You (${username}) are connected`)));

    socket.emit('Register', username, GettingStarted);

    const input = createInterface({ input: stdin, output: stdout });

    socket.on('message', ({ sender, message: msg, color }) => RenderMessage(color, sender, msg));

    socket.on('Direct Message', ({ name, message: msg }) => {
      log(
        `${chalk.bold.white('Direct Message =>')}${chalk.italic.bold.cyan(
          name,
        )}: ${chalk.white(msg)}`,
      );
    });

    input.on('line', async (value) => {
      const {
        inputType,
        message: mssg,
        chatroom,
        receipient,
      } = InputValidator(value);

      switch (inputType.trim()) {
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
          socket.emit('List all chatrooms', async (rooms) => {
            if (rooms && rooms.length > 0) {
              input.close();
              const { room } = await prompt({
                type: 'list',
                name: 'room',
                choices: rooms.concat(['cancel']),
                message: 'Available chatrooms',
              });

              if (room && room.includes('cancel')) return;

              socket.emit('Join chatroom', room, result => log(result));
            }
            log(chalk.green('>>> No chatrooms available'));
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
    }).on('error', err => log(err));
  } catch (err) {
    error(chalk.red(err));
    process.exit(0);
  }
};


startApp();
