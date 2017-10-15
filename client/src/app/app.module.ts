import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { customHttpProvider } from './_helpers/index';
import { AlertComponent, LoaderComponent } from './_directives/index';
import { AlertService, LoaderService, LocalStorageService, SessionStorageService } from './_services/index';
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
    LoaderComponent,
  ],
  providers: [
    AlertService,
    LocalStorageService,
    SessionStorageService,
    AuthGuard,
    customHttpProvider,
    LoaderService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
