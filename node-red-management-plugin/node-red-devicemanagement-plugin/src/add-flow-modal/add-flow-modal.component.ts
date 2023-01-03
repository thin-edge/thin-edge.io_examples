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
    @Input() deviceId: string;
    @Output() onSave = new EventEmitter<string>();
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
            await this.flows.assignToDevice(this.selectedFlow, this.deviceId)
            this.modalRef?.hide()
            this.onSave.emit()
        }
    }
}