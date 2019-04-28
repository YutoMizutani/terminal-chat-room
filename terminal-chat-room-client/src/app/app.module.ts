// Angular-Modules
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule }   from '@angular/forms'
// http communication
import { HttpClientModule } from '@angular/common/http'

// Angular-Components
import { AppComponent } from './app.component'

// Module
import { NgxElectronModule } from 'ngx-electron'

// Directive
import { AutofocusDirective } from './directives/autofocus/autofocus.directive'
import { AutosizeDirective } from './directives/autosize/autosize.directive'

// Service
import { FocusService } from './services/focus/focus.service'
import { LogService } from './services/log/log.service'
import { RoomService } from './services/room/room.service'

// Component
import { InputFieldComponent } from './input-field/input-field.component'
import { CommandLogComponent } from './command-log/command-log.component'

@NgModule({
  declarations: [
    AppComponent,
    InputFieldComponent,
    CommandLogComponent,
    AutofocusDirective,
    AutosizeDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxElectronModule,
    HttpClientModule,
  ],
  providers: [
    FocusService,
    LogService,
    RoomService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
