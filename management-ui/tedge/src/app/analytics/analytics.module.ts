import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CoreModule, HOOK_NAVIGATOR_NODES } from '@c8y/ngx-components';
import { ChartingWidgetComponent } from './chart/charting-widget.component';
import { AnalyticsComponent } from './chart/analytics.component';
import { AnalyticsNavigationFactory } from './analytics-navigation.factory';
import { ChartingConfigComponent } from './chart/charting-config.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NodeRedIframeComponent } from './analytic/node-red-iframe.component';

/**
 * Angular Routes.
 * Within this array at least path (url) and components are linked.
 */
const routes: Routes = [
  {
    path: 'analytics/realtime',
    component: AnalyticsComponent
  },
  {
    path: 'analytics/historic',
    component: AnalyticsComponent
  },
  {
    path: 'analytics/flow',
    component: NodeRedIframeComponent
  }
];

@NgModule({
  declarations: [
    ChartingWidgetComponent,
    ChartingConfigComponent,
    AnalyticsComponent
  ],
  imports: [RouterModule.forChild(routes), 
    CoreModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  /**
   * Adding the hooks to the providers:
   */
   providers:  [ { provide: HOOK_NAVIGATOR_NODES, useClass: AnalyticsNavigationFactory, multi: true }],
  /**
   * The EntryComponents to allow the HOOK_ONCE_ROUTE to work:
   */
  entryComponents: [AnalyticsComponent]
})
export class AnalyticsModule {}
