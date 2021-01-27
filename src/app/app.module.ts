import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ToastDefaults, SnotifyService, SnotifyModule } from 'ng-snotify';
import { notifyService } from '../services/snotify';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from '../environments/environment';
import { EffectsModule } from "@ngrx/effects";
import { EFFECTS } from "./app.effects";
import { appReducers } from "./app.reducers";
import { VizIndexHttpService } from './services/vizindex-http.service';
import { ProjectService } from './services/project_service';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    NgbModule,
    HttpClientModule,
    SnotifyModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ChartsModule,
    NgMultiSelectDropDownModule.forRoot(),
    EffectsModule.forRoot(EFFECTS),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      name: "VizIndex NgRx Store DevTools",
      maxAge: 100,
      logOnly: environment.production
  }),
  ],
  providers: [{ provide: "SnotifyToastConfig", useValue: ToastDefaults }, SnotifyService, notifyService, VizIndexHttpService, ProjectService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
