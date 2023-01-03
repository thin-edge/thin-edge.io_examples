import { formatDate, TitleCasePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { IFetchResponse, IManagedObject, InventoryService, IOperation, IResultList, OperationService } from "@c8y/client";
import { Flow } from "./node-red-models";
import { AlertService } from '@c8y/ngx-components';

@Injectable({ providedIn: 'root' })
export class NodeRedFlowService {
    constructor(private inventory: InventoryService, private operations: OperationService, public alertservice: AlertService) { }

    async getAll(): Promise<IResultList<IManagedObject>> {
        let queryFlows: object = {
            query: `$filter=(full.type eq 'tab' and has(c8y_noderedV2))`
        }
        return this.inventory.list(queryFlows);
    }

    async get(flow: Flow): Promise<IManagedObject> {
        let queryFlow: object = {
            query: `$filter=(full.id eq '${flow.id}' and has(c8y_noderedV2))`
        }
        return this.inventory.list(queryFlow).then(res => res.data.pop())
    }

    private async sendOperation(type: string, flow: Flow, deviceId: string) {
        let queryNodes: object = {
            query: `$filter=(full.z eq '${flow.id}' and has(c8y_noderedV2))`
        }
        let nodes = await (await this.inventory.list(queryNodes)).data.map(res => res.full)
        let json = {
            id: flow.id,
            label: flow.label,
            disable: false,
            info: flow.info,
            env: [],
            nodes: nodes
        }
        var encoded = btoa(JSON.stringify(json))
        const operation: IOperation = {
            deviceId: deviceId,
            c8y_NodeRed: {
                type: type
            },
            description: `${type} the node-red flow "${flow.label}" to the runtime on the device.`,
            data: encoded
        }
        this.operations.create(operation).then(res => this.userFeedback(res.res))
    }

    async assignToDevice(selectedFlow: IManagedObject, deviceId: string) {
        let flow: Flow = {
            id: selectedFlow.full.id,
            label: selectedFlow.full.label,
            info: selectedFlow.full.info
        }
        this.sendOperation("create", flow, deviceId);
        await this.updateFlowOnDeviceMo(flow, deviceId);
    }

    async updateOnDevice(flow: Flow, deviceId: string) {
        this.sendOperation("update", flow, deviceId)
        await this.updateFlowOnDeviceMo(flow, deviceId);
    }

    async removeFromDevice(flow: Flow, deviceId) {
        const operation: IOperation = {
            deviceId: deviceId,
            c8y_NodeRed: {
                type: "remove",
                flowId: flow.id
            },
            description: `$Remove the node-red flow "${flow.label}" to the runtime on the device.`,

        }
        this.operations.create(operation).then(res => this.userFeedback(res.res))
        await this.removeFlowFromMo(flow, deviceId);
    }

    private async userFeedback(res: IFetchResponse) {
        if (res.status < 300) {
            this.alertservice.success('Operation created');
        } else {
            this.alertservice.danger('Failed to create operation');
        }
    }

    async getDeployedFlows(deviceId): Promise<Flow[]> {
        return this.inventory.detail(deviceId).then(res => res.data.deployedFlows || [])
    }

    private async updateFlowOnDeviceMo(flow: Flow, deviceId: string) {
        let deployedFlows = await this.getDeployedFlows(deviceId);   //Add Flow to Managed Object
        if (deployedFlows.some(f => { return f.label === flow.label })) {
            let i = deployedFlows.findIndex(f => { return f.label === flow.label })
            deployedFlows[i] = { id: flow.id, label: flow.label, info: flow.info, updated: formatDate(new Date, 'yyyy-MM-ddTHH:mm:ss', 'en', 'utc') }

        } else {
            deployedFlows.push({ updated: formatDate(new Date, 'yyyy-MM-ddTHH:mm:ss', 'en', 'utc'), ...flow })
        }
        const mo: Partial<IManagedObject> = {
            id: deviceId,
            deployedFlows: deployedFlows
        }
        await this.inventory.update(mo)
    }

    private async removeFlowFromMo(flow: Flow, deviceId: string) {
        let deployedFlows = await this.getDeployedFlows(deviceId);

        let i = deployedFlows.findIndex(f => { return f.label === flow.label })
        if (i > -1) {
            deployedFlows.splice(i, 1);

            const mo: Partial<IManagedObject> = {
                id: deviceId,
                deployedFlows: deployedFlows
            }
            await this.inventory.update(mo)
        }
    }
}