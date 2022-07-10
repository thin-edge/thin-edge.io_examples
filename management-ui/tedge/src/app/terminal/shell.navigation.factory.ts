import { Injectable } from '@angular/core';
import { gettext, NavigatorNode, NavigatorNodeFactory, _ } from '@c8y/ngx-components';
import { EdgeService } from '../edge.service';

@Injectable()
export class ShellNavigationFactory implements NavigatorNodeFactory {
    nav: NavigatorNode[] = [];
    constructor(private edgeService: EdgeService,) {
        let Shell: NavigatorNode = new NavigatorNode({
            label: _('Shell'),
            icon: 'terminal',
            path: 'edge/shell',
            parent: gettext('Edge'),
            priority: 10,
            routerLinkExact: false
        });

        this.nav.push(Shell);
    }
    async get() {
        let conf = await this.edgeService.getAnalyticsConfiguration();
        console.log ("Retrieved configuration:", conf)
        if ( conf['expertMode']) {
            return this.nav;
        } else {
            return []
        }
    }
}