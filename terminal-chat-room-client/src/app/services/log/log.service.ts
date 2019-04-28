import { Injectable } from '@angular/core';

@Injectable()
export class LogService {

  constructor() { }

  public logs: string[] = [];
  public effectiveCommands: string[] = [];

  // 有効なコマンドを追加する
  addEffectiveCommand(text: string) {
    this.effectiveCommands.push(text);
  }

  // コマンドを取得する
  getCommand(index: number): string | null {
    // 配列外を指定した場合はnullを返す
    if (index < 0 || index > this.effectiveCommands.length) {
      return null;
    }
    return this.effectiveCommands[(this.effectiveCommands.length-1) - index];
  }

  // ログを取得する
  get(): string[] {
    return this.logs;
  }

  // ログを追加する
  add(text: string) {
    this.logs.push(text);
  }

  // ログを保存する
  save() {
      // TODO
  }
}
