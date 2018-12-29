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
    const chatroom = this.chatrooms.get(chatroomName);
    if (user.chatroom) return `You already belong to a chatroom ${user.chatroom}`;
    if (chatroom) return 'Chatroom already exits';
    const room = new Chatroom(chatroomName, user.name);
    room.addNewMember(user);
    this.chatrooms.set(chatroomName, room);
    return 'Chatroom has been created successfully';
  }

  deleteChatRoom(chatroomName, clientId) {
    const user = this.users.get(clientId);
    const chatroom = this.chatrooms.get(chatroomName);
    if (chatroom.creator !== user.name) return 'Permission denied, You are not the owner of the chatroom';
    this.chatrooms.delete(chatroomName);
    return 'Chatroom deleted successfully';
  }

  leaveChatRoom(clientId) {
    const user = this.users.get(clientId);
    const chatroom = this.chatrooms.get(user.chatroom);
    if (!user.chatroom) return 'You do not belong to a chatroom';
    if (chatroom.creator === user.name) {
      this.deleteChatRoom(user.chatroom, clientId);
    }
    this.users.get(clientId).chatroom = null;
    return `You have now left the ${chatroom.name} chatroom`;
  }

  joinChatRoom(clientId, chatroomName) {
    const user = this.users.get(clientId);
    const chatroom = this.chatrooms.get(chatroomName);
    if (user.chatroom) return `You already belong to a chatroom - ${user.chatroom}`;
    if (!chatroom) return `The chatroom (${chatroomName}) - does not exist.`;
    chatroom.addNewMember(user);
    this.users.get(clientId).chatroom = chatroom.name;
    return `You have successfully joined ${chatroom.name}`;
  }

  createNewUser(name, socket, color) {
    const user = this.users.get(socket.id);
    if (user) return 'User has already been registered';
    const client = new Client(name, socket, color);
    this.users.set(client.id, client);
    return 'User registered successfully';
  }

  deleteUser(clientId) {
    const user = this.users.get(clientId);
    let chatroom;
    if (user.chatroom) {
      chatroom = this.chatrooms.get(user.chatroom);
      chatroom.members.delete(user.name);
    }
    this.users.delete(user.id);
  }

  sendMessageToRoom(message, clientId, socket) {
    const user = this.users.get(clientId);
    const chatroom = this.chatrooms(user.chatroom);
    chatroom.broadcastMessage(message, user.name, socket);
  }

  sendADirectMessage(message, clientId, receiver, socket) {
    const user = this.users.get(clientId);
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
  getAllUsersInChatRoom(chatroomName, clientId) {
    const user = this.users.get(clientId);
    const chatroom = this.chatrooms.get(chatroomName);
    if (user.chatroom !== chatroomName) return 'Not granted, you are not a member of this chatroom';
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
