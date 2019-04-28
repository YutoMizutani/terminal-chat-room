import { Component, OnInit } from '@angular/core'

import { LogService } from '../services/log/log.service'

@Component({
  selector: 'app-command-log',
  templateUrl: './command-log.component.html',
  styleUrls: ['./command-log.component.css']
})
export class CommandLogComponent implements OnInit {
  logs: string[]

  constructor(
      private logService: LogService
  ) { }

  ngOnInit() {
      this.getLogs()
  }

  getLogs(): void {
      this.logs = this.logService.get()
  }
}
