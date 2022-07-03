import { Injectable } from '@angular/core';
import { TabFactory, Tab } from '@c8y/ngx-components';
import { Router } from '@angular/router';

@Injectable()
export class AnalysisTabFactory implements TabFactory {
  // Inject the angular Router
  constructor(public router: Router) {}

  // Implement the get()-method, otherwise the ExampleTabFactory
  // implements the TabFactory interface incorrectly (!)
  get() {
    const tabs: Tab[] = [];
    /**
     *  We want to define two tabs:
     *    - Awesome
     *    - Outstanding
     * but these tabs should only displayed if the URL matches
     * something like: .../apps/tutorial-application/#/world/
     */
    if (this.router.url.match(/analysis/g)) {
      /**
       * mandatory for a Tab is the path (string) and the label (string)
       * A click on the tab will load the given path and therefore angular loads the
       * specified component (check: ../app.modules.ts)
       */
      tabs.push({
        path: 'analysis/realtime',
        priority: 1000,
        label: 'Realtime',
        icon: 'angellist'
      } as Tab);
      tabs.push({
        path: 'analysis/historic',
        priority: 1001,
        label: 'Historic',
        icon: 'diamond'
      } as Tab);
    }

    return tabs;
  }
}