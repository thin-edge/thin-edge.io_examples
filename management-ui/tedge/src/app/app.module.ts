import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { AppRoutingModule } from './app-routing.module';
import { RouterModule as ngRouterModule } from '@angular/router';
import { CoreModule, RouterModule, HOOK_NAVIGATOR_NODES, CommonModule, AlertModule } from '@c8y/ngx-components';
import { AnalysisComponent } from './analysis/analysis.component';
import { CloudComponent } from './cloud/cloud.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { EdgeNavigationFactory } from './navigation.factory';
import { SetupComponent } from './setup/setup.component';
import { StatusComponent } from './status/status.component';
import { ControlComponent } from './control/control.component';
import { AppComponent } from './boot/app.component';
import { NgChartsModule } from 'ng2-charts';
import { AnalysisModule } from './analysis/analysis.module';

const config: SocketIoConfig = { url: location.origin, options: {} };

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot(),
    ngRouterModule.forRoot(
      [
      { path: '', component: SetupComponent },   // set default route
      { path: 'analysis', component: AnalysisComponent }, 
      { path: 'cloud', component: CloudComponent },
      { path: 'setup', component: SetupComponent },
      { path: 'status', component: StatusComponent },
      { path: 'control', component: ControlComponent }
      ],
      { enableTracing: false, useHash: true }
    ),
    CoreModule.forRoot(),
    FormsModule,
    AlertModule,
    ReactiveFormsModule,
    AnalysisModule,
    SocketIoModule.forRoot(config),
    NgChartsModule,
    CommonModule
  ],
  
  providers: [
    { provide: HOOK_NAVIGATOR_NODES, useClass: EdgeNavigationFactory, multi: true },
  ],
  bootstrap: [AppComponent],
  declarations: [
    CloudComponent, AppComponent,
    SetupComponent, StatusComponent, 
    ControlComponent]
 })
export class AppModule { }