import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

import { IManagedObject, IResultList } from '@c8y/client';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NodeRedFlowService } from '../shared/node-red-flows.service';


@Component({
    selector: 'add-flow-modal',
    templateUrl: './add-flow-modal.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddFlowModal implements OnInit {
    @Input() modalRef?: BsModalRef;
    @Output() select = new EventEmitter<IManagedObject>();
    selectedFlow: IManagedObject;
    allFlows: IResultList<IManagedObject>
    constructor(private flows: NodeRedFlowService) { }

    ngOnInit(): void {
        this.loadFlows()
    }
    cancel(): void {
        this.modalRef?.hide()
    }
    async loadFlows() {
        this.allFlows = await this.flows.getAll();
        console.log(this.allFlows)
    }
    flowChanged(flow: any) {
        this.selectedFlow = flow;
    }

    async create() {
        if (this.selectedFlow) {
            this.select.emit(this.selectedFlow)
            this.modalRef?.hide()
        }
    }
}