import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent, CardSetRender, MyFilterPipe, OrderByPipe }  from './app.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, CardSetRender, MyFilterPipe, OrderByPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
