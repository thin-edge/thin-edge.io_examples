import { Component } from '@angular/core';
import { ActionBarService, AppStateService, HeaderService, NavigatorService, TabsService, BreadcrumbService } from '@c8y/ngx-components';

@Component({
  selector: 'c8y-bootstrap',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    public tabs: TabsService,
    public ui: AppStateService,
    public navigator: NavigatorService,
    public actionBar: ActionBarService,
    public headerService: HeaderService,
    public breadcrumbService: BreadcrumbService
  ) {
    headerService.toggleNavigator();
  }
}