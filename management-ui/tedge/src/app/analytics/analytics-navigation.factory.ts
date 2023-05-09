import { Injectable } from '@angular/core';
import { NavigatorNode, NavigatorNodeFactory, _ } from '@c8y/ngx-components';

@Injectable()
export class AnalyticsNavigationFactory implements NavigatorNodeFactory {
    nav: NavigatorNode[] = [];
    // Implement the get()-method, otherwise the ExampleNavigationFactory
    // implements the NavigatorNodeFactory interface incorrectly (!)
    constructor() {
        let Realtime: NavigatorNode = new NavigatorNode({
            path: '/analytics/realtime',
            priority: 800,
            label: 'Realtime',
            icon: 'arrow-advance',
            routerLinkExact: false
        });
        let Historic: NavigatorNode = new NavigatorNode({
            path: '/analytics/historic',
            priority: 900,
            label: 'Historic',
            icon: 'timeline',
            routerLinkExact: false
        });
        let Flow: NavigatorNode = new NavigatorNode({
            path: '/analytics/flow',
            priority: 1000,
            label: 'Flow',
            icon: 'workflow',
            routerLinkExact: false
        });
        let Analytics: NavigatorNode = new NavigatorNode({
            label: _('Analytics'),
            priority: 200,
            icon: 'area-chart',
            children: [Realtime, Historic, Flow],
        });

        this.nav.push(Analytics);
    }

    get() {
        return this.nav;
    }
}