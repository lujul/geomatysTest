import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CanvasTestComponent } from './canvas-test/canvas-test.component';
import { FormTestComponent } from './form-test/form-test.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CanvasTestComponent,
    FormTestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
