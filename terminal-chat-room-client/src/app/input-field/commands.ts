import { RoomService } from '../services/room/room.service';

export class Commands {
  service: RoomService;

  inject(s: RoomService) {
    this.service = s;
  }

  send(command: string): string {
    const c = command.split(' ')[0];
    let result = '';
    switch (c) {
      case 'mkdir':
        const t = command.slice(5);
        const a = this.service.create(t);
        const name = a.name;
        result = 'Create a new \'' + name + '\' room!';
        break;
      default:
        result = 'command not found: ' + command;
        break;
    }
    return result;
  }
}
