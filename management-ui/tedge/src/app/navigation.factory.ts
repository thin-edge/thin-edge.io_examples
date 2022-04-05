import { Injectable } from '@angular/core';
import { NavigatorNode, NavigatorNodeFactory, _ } from '@c8y/ngx-components';

@Injectable()
export class EdgeNavigationFactory implements NavigatorNodeFactory {
    nav: NavigatorNode[] = [];
    // Implement the get()-method, otherwise the ExampleNavigationFactory
    // implements the NavigatorNodeFactory interface incorrectly (!)
    constructor() {

        let Setup: NavigatorNode = new NavigatorNode({
            label: _('Setup'),
            icon: 'c8y-administration',
            path: '/setup',
            priority: 2,
            routerLinkExact: false
        });

        let Control: NavigatorNode = new NavigatorNode({
            label: _('Control'),
            icon: 'rocket',
            path: '/control',
            priority: 2,
            routerLinkExact: false
        });

        let Status: NavigatorNode = new NavigatorNode({
            label: _('Status'),
            icon: 'info-circle',
            path: '/status',
            priority: 2,
            routerLinkExact: false
        });
       
        let Analysis: NavigatorNode = new NavigatorNode({
            path: '/analysis',
            label: _('Analysis'),
            priority: 300,
            icon: 'area-chart',
            routerLinkExact: false
        });
        
        let Cloud: NavigatorNode = new NavigatorNode({
            path: '/cloud',
            label: _('Cloud'),
            name: 'cloud',
            priority: 100,
            icon: 'cloud',
            routerLinkExact: false
        });
        let Edge: NavigatorNode = new NavigatorNode({
            label: _('Edge'),
            name: 'egde',
            priority: 200,
            children: [Setup, Control, Status],
            icon: 'upload',
            routerLinkExact: false
        });
        this.nav.push(Analysis, Edge, Cloud);
    }

    get() {
        return this.nav;
    }
}