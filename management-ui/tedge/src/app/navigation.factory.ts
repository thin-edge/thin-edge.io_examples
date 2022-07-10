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
            path: '/edge/setup',
            priority: 80,
            routerLinkExact: false
        });

        let Control: NavigatorNode = new NavigatorNode({
            label: _('Control'),
            icon: 'rocket',
            path: '/edge/control',
            priority: 40,
            routerLinkExact: false
        });

        let Status: NavigatorNode = new NavigatorNode({
            label: _('Status'),
            icon: 'info-circle',
            path: '/edge/status',
            priority: 20,
            routerLinkExact: false
        });
       
        let Cloud: NavigatorNode = new NavigatorNode({
            path: '/cloud',
            label: _('Cloud'),
            name: 'Cloud',
            priority: 100,
            icon: 'cloud',
            routerLinkExact: false
        });
        let Edge: NavigatorNode = new NavigatorNode({
            label: _('Edge'),
            name: 'Edge',
            priority: 300,
            children: [Setup, Control, Status],
            icon: 'thin-client',
            routerLinkExact: false
        });
        this.nav.push(Edge, Cloud);
    }

    get() {
        return this.nav;
    }
}