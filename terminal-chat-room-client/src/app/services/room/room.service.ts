import { Injectable } from '@angular/core'
import { Room } from './room'
// import { RoomFactory } from './room-factory'

@Injectable()
export class RoomService {
  private rooms: Room[] = []

  constructor() { }

  // 部屋を作成する
  create(name: string) {
    // TODO: factoryパタンで書き換え
    const room: Room = new Room(name)
    this.rooms.push(room)
    return room
  }

  // 全部屋名を返す
  getAllNames(): string[] {
    let names: string[] = []
    for (let room of this.rooms) {
      names.push(room.name)
    }
    return names
  }

  // 部屋を部屋名を元に取得する
  get(withName: string): Room | null {
    const name: string = withName
    for (let room of this.rooms) {
      if (room.name == name) {
        return room
      }
    }
    return null
  }

  // 部屋を部屋名を元に削除する
  remove(withName: string) {
    this.rooms = this.rooms.filter(room => room.name != withName)
  }
}
