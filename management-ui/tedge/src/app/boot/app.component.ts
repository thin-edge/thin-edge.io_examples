import { Component } from '@angular/core';
import { ActionBarService, AppStateService, HeaderService, NavigatorService, TabsService, BreadcrumbService, AlertService } from '@c8y/ngx-components';
import { distinctUntilChanged } from 'rxjs/operators';

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
    public breadcrumbService: BreadcrumbService,
    public alertService: AlertService
  ) {
    headerService.toggleNavigator();
    this.ui
    .map(({ lang }) => lang)
    .pipe(distinctUntilChanged())
    .subscribe(() => {
      this.actionBar.refresh();
    });
  }
}