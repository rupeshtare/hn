import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { customHttpProvider } from './_helpers/index';
import { AlertComponent } from './_directives/index';
import { AlertService, LocalStorageService, SessionStorageService } from './_services/index';
import { AuthGuard } from './_guards/index';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
  ],
  providers: [
    AlertService,
    LocalStorageService,
    SessionStorageService,
    AuthGuard,
    customHttpProvider
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
