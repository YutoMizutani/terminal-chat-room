import { Response } from './response'

export class Room {

  constructor(name: string) {
    this.name = name
    this.password = null
    this.host = []
    this.member = []
    this.log = []
  }

  // 部屋名
  name: string
  // 入室時パスワード
  password?: string
  // 管理者
  host: string[]
  // 参加者
  member: string[]
  // ログ
  log: Response[]
}
