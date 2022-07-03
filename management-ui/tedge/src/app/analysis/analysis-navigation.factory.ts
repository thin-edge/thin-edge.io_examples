import { Injectable } from '@angular/core';
import { NavigatorNode, NavigatorNodeFactory, _ } from '@c8y/ngx-components';

@Injectable()
export class AnalysisNavigationFactory implements NavigatorNodeFactory {
    nav: NavigatorNode[] = [];
    // Implement the get()-method, otherwise the ExampleNavigationFactory
    // implements the NavigatorNodeFactory interface incorrectly (!)
    constructor() {
        let Realtime: NavigatorNode = new NavigatorNode({
            path: '/analysis/realtime',
            priority: 1000,
            label: 'Realtime',
            icon: 'angellist',
            routerLinkExact: false
        });
        let Historic: NavigatorNode = new NavigatorNode({
            path: '/analysis/historic',
            priority: 1000,
            label: 'Historic',
            icon: 'angellist',
            routerLinkExact: false
        });
        let Analysis: NavigatorNode = new NavigatorNode({
            label: _('Analysis'),
            priority: 200,
            icon: 'area-chart',
            children: [Realtime, Historic],
        });

        this.nav.push(Analysis);
    }

    get() {
        return this.nav;
    }
}