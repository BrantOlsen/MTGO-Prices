import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent, CardSetRender, MyFilterPipe, OrderByPipe }  from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports:      [ BrowserModule, AppRoutingModule ],
  declarations: [ AppComponent, CardSetRender, MyFilterPipe, OrderByPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
