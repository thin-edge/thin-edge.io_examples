import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule as ngRouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { CoreModule, RouterModule, HOOK_NAVIGATOR_NODES, CommonModule, AlertModule } from '@c8y/ngx-components';
import { AnalysisComponent } from './analysis/analysis.component';
import { CloudComponent } from './cloud/cloud.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { EdgeNavigationFactory } from './navigation.factory';
import { SetupComponent } from './setup/setup.component';
import { StatusComponent } from './status/status.component';
import { ControlComponent } from './control/control.component';
import { AppComponent } from './boot/app.component';
import { TerminalComponent } from './share/terminal.component';
import { AnalysisModule } from './analysis/analysis.module';
import { StatusColloringDirective } from './share/status.directive';
import { StatusColloringPipe } from './share/status.pipe';
import { ShellModule } from './terminal/shell.module';


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
      { path: 'edge/setup', component: SetupComponent },
      { path: 'edge/status', component: StatusComponent },
      { path: 'edge/control', component: ControlComponent }
      ],
      { enableTracing: false, useHash: true }
    ),
    CoreModule.forRoot(),
    FormsModule,
    AlertModule,
    ReactiveFormsModule,
    AnalysisModule,
    ShellModule,
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
    ControlComponent, TerminalComponent,
    StatusColloringDirective, StatusColloringPipe]
 })
export class AppModule { }