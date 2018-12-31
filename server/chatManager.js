/* eslint-disable consistent-return */
import Chatroom from './chatroom';
import Client from './client';

class ChatManager {
  constructor() {
    this.chatrooms = new Map();
    this.users = new Map();
  }

  createChatRoom(clientId, chatroomName) {
    const user = this.users.get(clientId);
    if (user.chatroom) return `You already belong to a chatroom ${user.chatroom}`;
    const isAvaliable = this.chatrooms.has(chatroomName);
    if (isAvaliable) return 'Chatroom already exits';
    const room = new Chatroom(chatroomName, user.name);
    user.chatroom = room.name;
    room.addNewMember(user);
    this.chatrooms.set(chatroomName, room);
    return 'Chatroom has been created successfully';
  }

  deleteChatRoom(chatroomName, clientId) {
    const user = this.users.get(clientId);
    const isAvaliable = this.chatrooms.has(chatroomName);
    if (!isAvaliable) return `The chatroom (${chatroomName}) - does not exist.`;
    const chatroom = this.chatrooms.get(chatroomName);
    if (chatroom.creator !== user.name) return 'Request denied. You are not the owner of the chatroom.';
    chatroom.dropAllMembers();
    this.chatrooms.delete(chatroomName);
    return ' Chatroom deleted successfully';
  }

  leaveChatRoom(clientId) {
    const user = this.users.get(clientId);
    if (!user.chatroom) return 'You do not belong to a chatroom';
    const chatroom = this.chatrooms.get(user.chatroom);
    let result = '';
    if (chatroom.creator === user.name) {
      result = (this.deleteChatRoom(user.chatroom, clientId));
    }
    chatroom.removeMember(clientId);
    return `You have now left the '${chatroom.name}' chatroom.${result}`;
  }

  joinChatRoom(clientId, chatroomName) {
    const user = this.users.get(clientId);
    const isAvaliable = this.chatrooms.has(chatroomName);
    if (!isAvaliable) return `The chatroom (${chatroomName}) - does not exist.`;
    const chatroom = this.chatrooms.get(chatroomName);
    if (user.chatroom) return `You already belong to a chatroom - ${user.chatroom}`;
    chatroom.addNewMember(user);
    this.users.get(clientId).chatroom = chatroom.name;
    return `You have successfully joined ${chatroom.name}`;
  }

  createNewUser(name, socket, color) {
    const user = this.users.get(socket.id);
    if (user) return 'User has already been registered';
    const client = new Client(name, socket, color);
    this.users.set(client.id, client);
    return 'User registration complete';
  }

  deleteUser(clientId) {
    const user = this.users.get(clientId);
    if (!user.chatroom) return 'You do not belong to a chatroom';
    const chatroom = this.chatrooms.get(user.chatroom);
    chatroom.members.delete(user.name);
    this.users.delete(user.id);
  }

  /**
   *
   * @param {string} message the message
   * @param {string} clientId the id of the sender
   * @param {Object} socket the server socket
   */
  sendMessageToRoom(message, clientId, socket) {
    const user = this.users.get(clientId);
    if (!user.chatroom) return 'You do not belong to a chatroom';
    const { name, color, chatroom: room } = user;
    const chatroom = this.chatrooms.get(room);
    chatroom.broadcastMessage(message, { name, color }, socket);
  }

  /**
   *
   * @param {string} message the message
   * @param {string} clientId the id of the sender
   * @param {string} receiver the name of the receipient
   * @param {Object} socket the server socket
   */
  sendADirectMessage(message, clientId, receiver, socket) {
    const user = this.users.get(clientId);
    if (!user) return 'You do not belong to a chatroom';
    const chatroom = this.chatrooms.get(user.chatroom);
    chatroom.sendDirectMessage(socket, user.name, receiver, message);
  }

  getAllUsers() {
    return Array.from(this.users.keys());
  }

  /**
   *
   * @param {String} chatroomName the name of the chatroom
   * @param {String} clientId the client id
   * @returns {Array} an array of all the members of the chatroom
   */
  getAllUsersInChatRoom(clientId) {
    const user = this.users.get(clientId);
    if (!user.chatroom) return 'You do not belong to a chatroom';
    const chatroom = this.chatrooms.get(user.chatroom);
    return chatroom.getAllMembers();
  }

  getAllChatRooms() {
    return Array.from(this.chatrooms.values()).map(room => room.name);
  }

  /**
   * @memberof ChatManager
   * @returns {Array} an array of chatrooms and their sizes
   */
  serializeChatRooms() {
    return Array.from(this.chatrooms.values()).map(c => c.serialize());
  }
}

export default ChatManager;
