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

  removeMember(clientName, requester) {
    if (requester.name === this.creator) {
      const client = Array.from(this.members.values()).find(user => user.name === clientName);
      this.members.delete(client.id);
    }
  }

  getChatHistory() {
    return this.chatHistory.slice();
  }

  broadcastMessage(message, client, socket) {
    this.members.forEach((m) => {
      if (m.name === client) return;
      socket.to(`${m.id}`).emit('Chatroom Message', {
        message,
        sender: client,
      });
    });
    return this.addChatMessage({ clientName: client.name, message });
  }

  sendDirectMessage(socket, sender, receiver, message) {
    socket.to(`${receiver.id}`).emit('Direct Message', {
      message,
      sender,
    });
  }

  /**
   * @description adds a chat message to the chat history
   * @param {Object} entry chat object
   */
  addChatMessage(entry) {
    const { clientName, message } = entry;
    return this.chatHistory.push({
      sender: clientName,
      message,
    });
  }

  /**
   * @description this get all user in chatroom
   * @returns {Array} a list of users in chatroom
   */
  getAllMembers() {
    return Array.from(this.members.keys());
  }

  serailize() {
    return {
      name: this.name,
      users: this.members.size,
    };
  }
}

export default Chatroom;
