import { Component, OnInit } from '@angular/core'

import { LogService } from '../services/log/log.service'
import { RoomService } from '../services/room/room.service'
import { Room } from '../services/room/room'
import { SocketioService } from '../services/socketio/socketio.service'

// TODO: 日本語入力後，クリックによってIME確定してもEnterを押す必要がある。

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {
  // TODO: configに移動
  prompt = '$ '
  root = '~'
  currentRoom: Room | null = null
  directory = this.root
  keydebug = ''
  historyIndex: number = -1




  // 日本語入力判定
  isJapanese = false
  // Ctrl押下中判定
  isCtrl = false

  constructor(
      public logService: LogService,
      public roomService: RoomService,
      public socketioService: SocketioService
  ) { }

  ngOnInit() {
  }

  onKeyUp(e, textarea) {
    const keyCode = e.keyCode

    // Ctrl押下状態を解除する
    let returnCtrlState = (self) => {
      self.isCtrl = false
    }

    switch (keyCode) {
      // Enter
      case 13:
        e.preventDefault()
        this.onEnter(textarea.value)
        return
      // Ctrl
      case 17:
        returnCtrlState(this)
        return
      default:
        return
    }
  }

  onKeyDown(e, textarea) {
    const keyCode = e.keyCode

    // デバッグ出力
    this.keydebug = keyCode

    // カーソル位置リセット
    if (textarea.selectionStart < 2) {
      textarea.selectionStart = 2
    }

    // コマンドを修正する。
    this.fixCommand()

    // 日本語入力状態として登録する
    let setJapaneseState = (self) => {
      self.isJapanese = true
    }

    // Ctrl押下状態を登録する
    let setCtrlState = (self) => {
      self.isCtrl = true
    }

    switch (keyCode) {
      // 日本語入力
      case 229:
        setJapaneseState(this)
        return
      // Enter
      case 13:
        e.preventDefault()
        return
      // Ctrl
      case 17:
        setCtrlState(this)
        return
      // Left
      case 37:
        if (textarea.selectionStart < 3) {
          e.preventDefault()
          textarea.selectionStart = 2
        }
        return
      // Tab
      case 9:
        // 既存の挙動をキャンセルする
        e.preventDefault()
        return
      // c
      case 67:
        // Ctrl + c
        if (this.isCtrl) {
          const text = this.command + "^C"
          this.resetCommand()
          this.sendLog(text)
        }
        return
      // Up
      case 38:
        e.preventDefault()
        this.historyIndex += 1
        this.command = this.logService.getCommand(this.historyIndex)
        if (this.command == null) {
          this.historyIndex -= 1
          this.command = this.logService.getCommand(this.historyIndex)
          if (this.command == null) {
            this.resetCommand()
            return
          }
        }
        this.command = this.prompt + this.command
        return
      // Down
      case 40:
        e.preventDefault()
        this.historyIndex -= 1
        if (this.historyIndex < 0) {
          this.historyIndex = -1
          this.resetCommand()
          return
        }
        this.command = this.logService.getCommand(this.historyIndex)
        if (this.command == null) {
          this.resetCommand()
          return
        }
        this.command = this.prompt + this.command
        return
      default:
        return
    }
  }

  resetCommand() {
    this.command = this.prompt
  }

  fixCommand() {
    if (this.command.length < 2) {
      this.resetCommand()
      return
    }
  }

  // エンターで確定
  command = this.prompt
  onEnter(text: string) {
    // 日本語入力中のEnterイベントは確定処理とし，コマンド送信を行わない。
    if (this.isJapanese) {
      this.isJapanese = false
      return
    }

    // 入力部初期化
    this.resetCommand()
    this.sendCommand(text)
  }

  // ログに出力する
  sendLog(text: string) {
    this.logService.add(text)
  }

  // 受けたコマンドを投げる
  sendCommand(text: string) {
    // プロンプト部分，エンター文字をカットする
    const command: string = text.slice(this.prompt.length)

    // スペース入力
    this.sendLog('')

    // プロンプト出力
    this.sendLog(this.directory)

    // コマンド出力
    this.sendLog(text)

    // 何も入力されていなければ処理を返す
    if (command == '') {
      return
    }

    // コマンドを投げる
    this.send(command)
  }


  send(command: string) {

    // 有効なcommandを投げる
    let addEffectiveCommand = (text) => {
      this.logService.addEffectiveCommand(command)
      this.historyIndex = -1
    }

    // 部屋を作成する
    let makeRoom = (self, name) => {
      // 何も入力がなければ中断する
      if (name == '') {
        return
      }

      // 部屋を作成可能か問い合わせる
      let isCreatable = (self, name) => {
        return self.roomService.getAllNames().indexOf(name) == -1
      }

      // 作成可能であれば部屋を作成、そうでなければエラーログを出力
      if (isCreatable(self, name)) {

        const room = self.roomService.create(name)
        const result = 'Create a new \'' + room.name + '\' room!'
        self.sendLog(result)
        return

      }else{

        const result = 'Error! \'' + name + '\' is already exists!'
        self.sendLog(result)
        return

      }
    }

    // 部屋名を出力する
    let printRooms = (self) => {
      const names = self.roomService.getAllNames()
      for (let name of names) {
        self.sendLog(name)
      }
    }

    // 部屋名を出力する
    let branchRooms = (self) => {
      const names = self.roomService.getAllNames()
      let prefix: string
      for (let name of names) {
        prefix = (self.currentRoom.name == name) ? '* ' : '　'
        self.sendLog(prefix + name)
      }
    }

    // 部屋を移動する
    let changeRoom = (self, name) => {
      // rootに戻る
      let returnRoot = (self) => {
        self.currentRoom = null
        self.directory = self.root
      }

      // nameに何も入力されていない場合はrootに戻る
      if (name == '' || name == '..' || name == '.') {
        returnRoot(self)
        return
      }

      // 部屋名をキーにRoomを取得する
      const room: Room | null = self.roomService.get(name)

      // 部屋を取得できた場合に移動、そうでなければエラーログを出力
      if (room != null) {

        self.currentRoom = room
        self.directory = self.root + '/' + room.name
        const result = 'Check into \'' + room.name + '\'!'
        self.sendLog(result)

      }else{

        const result = 'Error! \'' + name + '\' is not exists!'
        self.sendLog(result)

      }
    }

    // 部屋を移動する
    let checkoutRoom = (self, name) => {
      // rootに戻る
      let returnRoot = (self) => {
        self.currentRoom = null
        self.directory = self.root
      }

      // nameに何も入力されていない場合はrootに戻る
      if (name == '' || name == '..' || name == '.') {
        returnRoot(self)
        return
      }

      // 部屋名をキーにRoomを取得する
      const room: Room | null = self.roomService.get(name)

      // 部屋を取得できた場合に移動、そうでなければエラーログを出力
      if (room != null) {

        self.currentRoom = room
        self.directory = self.root + '/' + room.name
        const result = 'Switched to room \'' + room.name + '\''
        self.sendLog(result)

      }else{

        const result = 'error: pathspec \'' + name + '\' did not match any room known to it.'
        self.sendLog(result)

      }
    }

    // 部屋を削除する
    let removeRoom = (self, name) => {
      // 同じ名前の部屋が存在するかを評価する
      let isFound = (self, name) => {
        return self.roomService.getAllNames().find(n => n == name)
      }

      // 見つからなかった場合はログに記録する。
      if (!isFound(self, name)) {
        const result = 'rm: ' + name + ': No such room'
        self.sendLog(result)
        return
      }

      // 削除
      self.roomService.remove(name)
    }

    // Socket io join
    let join = (self, name) => {
      self.socketioService.connect()
      self.socketioService.emit('connected', name)
      self.sendLog('Connected: ' + name)
    }

    // Socket io send
    let send = (self, msg) => {
      self.socketioService.emit('publish', { value: msg })
      self.sendLog('Send: ' + msg)
    }

    // 一致するコマンドを処理する
    const c = command.split(' ')[0]
    switch (c) {
      case 'mkdir':
        addEffectiveCommand(command)
        makeRoom(this, command.slice('mkdir'.length + 1))
        return
      case 'git':
        if (command.split(' ')[1] == 'checkout' && command.split(' ')[2] == '-b' && command.split(' ').length > 3) {
          addEffectiveCommand(command)
          const len = 'git checkout -b'.length + 1
          const name = command.slice(len)
          makeRoom(this, name)
          return
        }
        if (command.split(' ')[1] == 'checkout') {
          addEffectiveCommand(command)
          const len = 'git checkout'.length + 1
          const name = command.slice(len)
          checkoutRoom(this, name)
          return
        }
        if (command.split(' ')[1] == 'branch') {
          addEffectiveCommand(command)
          branchRooms(this)
          return
        }
        break
      case 'ls':
        addEffectiveCommand(command)
        printRooms(this)
        return
      case 'cd':
        addEffectiveCommand(command)
        changeRoom(this, command.slice('cd'.length + 1))
        return
      case 'rm':
        addEffectiveCommand(command)
        removeRoom(this, command.slice('rm'.length + 1))
        return
      case 'socket':
        addEffectiveCommand(command)
        join(this, command.slice('socket'.length + 1))
        return
      case 'send':
        addEffectiveCommand(command)
        send(this, command.slice('send'.length + 1))
        return
      default:
        break
    }

    // 何も処理が行われなかった場合、n.f.を出力する。
    const notFound = 'command not found: ' + command
    this.sendLog(notFound)
  }

}
