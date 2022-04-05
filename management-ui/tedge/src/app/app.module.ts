import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { AppRoutingModule } from './app-routing.module';
import { RouterModule as ngRouterModule } from '@angular/router';
import { CoreModule, BootstrapComponent, RouterModule, HOOK_NAVIGATOR_NODES, CommonModule, AppStateService } from '@c8y/ngx-components';
import { ICurrentTenant, IUser } from '@c8y/client';
import { CertificateComponent } from './certificate/certificate.component';
import { BehaviorSubject } from 'rxjs';
import { AnalysisComponent } from './analysis/analysis.component';
import { ManageCertificateComponent } from './manage-certificate/manage-certificate.component';
import { CloudComponent } from './cloud/cloud.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { EdgeNavigationFactory } from './navigation.factory';
import { SetupComponent } from './setup/setup.component';
import { StatusComponent } from './status/status.component';
import { ControlComponent } from './control/control.component';
import { ChartingWidget } from './analysis/charting-widget.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartingConfigComponent } from './analysis/charting-config.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

const config: SocketIoConfig = { url: location.origin, options: {} };

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot(),
    ngRouterModule.forRoot(
      [{ path: 'analysis', component: AnalysisComponent }, 
      { path: 'cloud', component: CloudComponent },
      { path: 'setup', component: SetupComponent },
      { path: 'status', component: StatusComponent },
      { path: 'control', component: ControlComponent }],
      { enableTracing: false, useHash: true }
    ),
    CoreModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    NgChartsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    CommonModule
  ],
  
  providers: [
    { provide: HOOK_NAVIGATOR_NODES, useClass: EdgeNavigationFactory, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initAppState,
      multi: true,
      deps: [AppStateService],
    },
  ],
  bootstrap: [BootstrapComponent],
  declarations: [CertificateComponent, AnalysisComponent, 
    ManageCertificateComponent, CloudComponent, 
    SetupComponent, StatusComponent, 
    ControlComponent,ChartingWidget, 
    ChartingConfigComponent]
 })
export class AppModule { }

export function initAppState(appStateService: AppStateService) {
  return () => {
    const iuser: IUser = {
      id: "tedge",
      userName: "tedgeUser",
      displayName: "tedgeUser",
      email: "tedge@cumulocity.com",
      enabled: true,
      firstName: "Edge",
      lastName: "User",
      customProperties: [],
      applications: [{
        id: "10000",
        key: "Thin Edge"
      }]

    }
    const userInfo = {
      user: iuser,
      supportUserName: "christof"
    }
    appStateService.setUser(userInfo);
    const edgeTenant = {
      name: "thinEdge",
      domainName: "thinEdge",
      allowCreateTenants: false,
      customProperties : ["userOrigin"]
      }
    appStateService.currentTenant = new BehaviorSubject <ICurrentTenant> ( edgeTenant);
  };
}

/* export function initServicesFactory(
  edgeService: EdgeService
) {
  return async () => {
    console.log('initServicesFactory - started');
    const config = await edgeService.loadConfiguration();
    console.log('initServicesFactory - completed');
  };
} */