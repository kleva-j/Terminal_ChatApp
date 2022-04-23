/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

class Chatroom {
  constructor(name, clientName) {
    this.name = name;
    this.chatHistory = [];
    this.members = new Map();
    this.creator = clientName;
  }

  addNewMember(client) {
    const newClient = client;
    newClient.chatRoom = this.name;
    return this.members.set(client.id, newClient);
  }

  removeMember(clientId) {
    this.members.get(clientId).chatroom = null;
    this.members.delete(clientId);
  }

  dropAllMembers() {
    this.members.forEach((m) => {
      m.chatroom = null;
      this.members.delete(m.id);
    });
  }

  getChatHistory() {
    return this.chatHistory.slice();
  }

  broadcastMessage(message, { name: sender, color }, socket) {
    this.members.forEach((m) => {
      if (m.name === sender) return;
      socket.to(`${m.id}`).emit('message', { sender, message, color });
    });
    return this.addChatMessage({ clientName: sender, message });
  }

  sendDirectMessage(socket, name, receiver, message) {
    const receipient = Array.from(this.members.values()).find(item => item.name === receiver);
    socket.to(`${receipient.id}`).emit('Direct Message', { message, name });
  }

  /**
   * @description adds a chat message to the chat history
   * @param {Object} entry chat object
   */
  addChatMessage({ clientName, message }) {
    return this.chatHistory.push({ sender: clientName, message });
  }

  /**
   * @description this get all user in chatroom
   * @returns {Array} a list of users in chatroom
   */
  getAllMembers() {
    return Array.from(this.members.values()).map(user => user.name);
  }

  serialize() {
    return {
      name: this.name,
      users: this.members.size,
    };
  }
}

export default Chatroom;
