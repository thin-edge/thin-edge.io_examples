import { Component, OnInit, TemplateRef } from '@angular/core';
import { OperationService } from '@c8y/client';
import { ActivatedRoute } from '@angular/router';
import { Flow, FlowStatus } from './shared/node-red-models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NodeRedFlowService } from './shared/node-red-flows.service';


@Component({
  selector: 'app-node-red-tab',
  templateUrl: './node-red-tab.component.html'
})
export class NodeRedTabComponent implements OnInit {

  private deviceId: string;
  deployedFlows: Flow[] = [];
  modalRef?: BsModalRef;
  flowStatus: FlowStatus = {};
  isRealtimeActive = false;
  constructor(
    private route: ActivatedRoute, private operations: OperationService, private modalService: BsModalService, private flows: NodeRedFlowService) { }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.parent.data.contextData["id"];
    this.loadData()
  }

  async loadData() {
    this.deployedFlows = await this.flows.getDeployedFlows(this.deviceId);
    this.getFlowStatus(this.deployedFlows)
  }

  openModal(template: TemplateRef<any>, size: 'modal-lg'): void {
    this.modalRef = this.modalService.show(template, { class: size });
  }

  async remove(flow: Flow) {
    this.flows.removeFromDevice(flow, this.deviceId).then(_ => this.loadData());
  }

  async update(flow: Flow) {
    this.flows.updateOnDevice(flow, this.deviceId).then(_ => this.loadData());
  }

  async getFlowStatus(flows: Flow[]) {
    const filter = {
      fragmentType: "c8y_NodeRed",
      deviceId: this.deviceId,
      withTotalPages: true,
      pageSize: 100,
      revert: true
    }
    await this.operations.list(filter)
      .then(res => flows.forEach(f => this.flowStatus[f.id] = res.data.find(o => o.c8y_NodeRed?.flowId === f.id).status))
  }
}
