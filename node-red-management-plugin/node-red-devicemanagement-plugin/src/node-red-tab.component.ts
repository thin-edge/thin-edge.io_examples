import { Component, OnInit, TemplateRef } from '@angular/core';
import { IManagedObject, InventoryService, IResult, IResultList, OperationService } from '@c8y/client';

import { ActivatedRoute } from '@angular/router';
import { Flow } from './shared/node-red-models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NodeRedFlowService } from './shared/node-red-flows.service';


@Component({
  selector: 'app-node-red-tab',
  templateUrl: './node-red-tab.component.html'
})
export class NodeRedTabComponent implements OnInit {

  private deviceId: string;
  deployedFlows: Flow[];
  modalRef?: BsModalRef;

  constructor(
    private route: ActivatedRoute, private inventory: InventoryService, private modalService: BsModalService, private flows: NodeRedFlowService) { }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.parent.data.contextData["id"];
    this.loadData()
  }

  async loadData() {
    this.deployedFlows = await this.flows.getDeployedFlows(this.deviceId);
    console.log(this.deployedFlows)
  }

  openModal(template: TemplateRef<any>, size: 'modal-lg'): void {
    this.modalRef = this.modalService.show(template, { class: size });
  }

  async remove(flow: Flow) {
    this.flows.removeFromDevice(flow, this.deviceId).then(_ => this.loadData());
  }

  update(flow: Flow) {
    this.flows.updateOnDevice(flow, this.deviceId).then(_ => this.loadData());
  }

}
