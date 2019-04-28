import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron'
// http communication
import { HttpClient, HttpParams } from '@angular/common/http'

import { FocusService } from './services/focus/focus.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'terminal-chat-room-client';
  result = 'result'

  // Dependency injection
  constructor(
      private _electronService: ElectronService,
      private http: HttpClient,
      private focus: FocusService,
  ) {}

  launchWindow() {
    this._electronService.shell.openExternal('https://coursetro.com')
  }

  name = 'Angular'

  onclick() {
    // 2リクエストを発信
    this.http.get('http://localhost:8080', {
      responseType: 'text',
      // 3URLにクエリパラメーターを指定
      params: new HttpParams().set('name', this.name),
    })
    .subscribe(
      data => {
        this.result = data
      },
      error => {
        this.result = '通信に失敗しました。'
      }
    )
  }

  onFocus() {
      let element: HTMLElement = document.getElementById('focusable')
      this.focus.focus(element)
  }

  // Set prompt
  prompt = '$' + ' '
}
