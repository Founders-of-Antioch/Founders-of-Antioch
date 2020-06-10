import * as io from "socket.io";
import { Socket } from "socket.io";

export class ClientManager {
  listOfClients: Map<string, object>;

  constructor() {
    this.listOfClients = new Map();
  }

  addClient(client: Socket) {
    this.listOfClients.set(client.id, { client });
  }

  removeClient(client: any) {
    this.listOfClients.delete(client.id);
  }
}
