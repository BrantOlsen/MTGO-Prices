import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent, MyFilterPipe, OrderByPipe }  from './app.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, MyFilterPipe, OrderByPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
