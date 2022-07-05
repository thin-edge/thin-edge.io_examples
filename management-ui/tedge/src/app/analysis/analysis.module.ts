import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CoreModule, HOOK_NAVIGATOR_NODES } from '@c8y/ngx-components';
import { ChartingWidgetComponent } from './charting-widget.component';
import { AnalysisComponent } from './analysis.component';
import { AnalysisNavigationFactory } from './analysis-navigation.factory';
import { ChartingConfigComponent } from './charting-config.component';

/**
 * Angular Routes.
 * Within this array at least path (url) and components are linked.
 */
const routes: Routes = [
  {
    path: 'analysis/realtime',
    component: AnalysisComponent
  },
  {
    path: 'analysis/historic',
    component: AnalysisComponent
  }
];

@NgModule({
  declarations: [
    ChartingWidgetComponent,
    ChartingConfigComponent,
    AnalysisComponent
  ],
  imports: [RouterModule.forChild(routes), 
    CoreModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ],
  /**
   * Adding the hooks to the providers:
   */
   providers:  [ { provide: HOOK_NAVIGATOR_NODES, useClass: AnalysisNavigationFactory, multi: true }],
  /**
   * The EntryComponents to allow the HOOK_ONCE_ROUTE to work:
   */
  entryComponents: [AnalysisComponent]
})
export class AnalysisModule {}
