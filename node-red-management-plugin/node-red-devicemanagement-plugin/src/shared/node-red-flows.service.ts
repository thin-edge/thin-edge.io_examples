import { formatDate, TitleCasePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { IFetchResponse, IManagedObject, InventoryService, IOperation, IResultList, OperationService, IdentityService, IExternalIdentity } from "@c8y/client";
import { Flow } from "./node-red-models";
import { AlertService } from '@c8y/ngx-components';

@Injectable({ providedIn: 'root' })
export class NodeRedFlowService {
    childAdditionFilter: object = {
        pageSize: 100,
        withTotalPages: true,
    };
    flowType: string = 'deployed_NodRed_Flow'

    constructor(private inventory: InventoryService, private operations: OperationService, private alertservice: AlertService, private identity: IdentityService) { }

    async getAll(): Promise<IResultList<IManagedObject>> {
        let queryFlows: object = {
            query: `$filter=(full.type eq 'tab' and has(c8y_noderedV2))`
        }
        return this.inventory.list(queryFlows);
    }

    async getFlow(flowId: string): Promise<IManagedObject> {
        let queryFlow: object = {
            query: `$filter=(full.id eq '${flowId}' and has(c8y_noderedV2))`
        }
        return this.inventory.list(queryFlow).then(res => res.data.pop())
    }

    private async sendOperation(type: string, flow: Flow, deviceId: string) {
        let queryNodes: object = {
            query: `$filter=((full.z eq '${flow.c8yFlowId}' or full.type eq 'mqtt-broker') and has(c8y_noderedV2))`
        }
        let nodes = await (await this.inventory.list(queryNodes)).data.map(res => res.full)
        console.log(nodes) //full.z eq '${flow.c8yFlowId}') or
        let json = {
            id: flow.c8yFlowId,
            label: flow.label,
            disable: false,
            info: flow.info,
            env: [],
            nodes: nodes
        }
        console.log(json)
        var encoded = btoa(JSON.stringify(json))
        const operation: IOperation = {
            deviceId: deviceId,
            c8y_NodeRed: {
                type: type,
                c8yFlowId: flow.c8yFlowId,
                localFlowId: flow.localFlowId,
                label: flow.label
            },
            description: `${type} the node-red flow "${flow.label}" to the runtime on the device.`,
            data: encoded
        }
        this.operations.create(operation).then(res => this.userFeedback(res.res))
    }

    async assignToDevice(selectedFlow: IManagedObject, deviceId: string) {
        let flow: Flow = {
            c8yFlowId: selectedFlow.full.id,
            label: selectedFlow.full.label,
            info: selectedFlow.full.info
        }
        await this.sendOperation("create", flow, deviceId);
        //await this.createFlowOnDevice(flow, deviceId);
    }

    async updateOnDevice(flow: Flow, deviceId: string) {
        this.sendOperation("update", flow, deviceId)
    }

    async removeFromDevice(flow: Flow, deviceId) {
        if (flow.localFlowId) {
            const operation: IOperation = {
                deviceId: deviceId,
                c8y_NodeRed: {
                    type: "remove",
                    c8yFlowId: flow.c8yFlowId,
                    localFlowId: flow.localFlowId,
                    label: flow.label
                },
                description: `Remove the node-red flow "${flow.label}" to the runtime on the device.`,

            }
            this.operations.create(operation).then(res => this.userFeedback(res.res))
        }
        else {
            this.alertservice.danger('No local flow Id availabe. Flow will be removed wihtout operation.')
        }
        await this.removeFlowFromDevice(flow, deviceId)
    }

    private async userFeedback(res: IFetchResponse) {
        if (res.status < 300) {
            this.alertservice.success('Operation created');
        } else {
            this.alertservice.danger('Failed to create operation');
        }
    }

    public async managedObjectToFlow(mo: IManagedObject): Promise<Flow> {
        const [externalId, flowMo] = await Promise.all([this.identity.list(mo.id).then(res => res.data.filter(ex => ex.type === "c8y_Serial").pop()), this.getFlow(mo.name)])

        console.log(flowMo)
        return {
            c8yFlowId: mo.name,
            info: flowMo.full.info,
            updated: mo.lastUpdated,
            localFlowId: externalId.externalId,
            label: flowMo.full.label,
            id: mo.id
        }
    }

    private flowToManagedObject(flow: Flow): Partial<IManagedObject> {
        return {
            c8yFlowId: flow.c8yFlowId,
            name: flow.c8yFlowId,
            info: flow.info,
            type: this.flowType
        }
    }

    public async getDeployedFlows(deviceId): Promise<Flow[]> {
        //TODO: Filter via API
        return await (this.inventory.childAdditionsList(deviceId, this.childAdditionFilter)
            .then(res => res.data.filter(mo => mo.type === "c8y_Service" && mo.serviceType === "node-red"))
            .then(async l => await Promise.all(l.map(mo => this.managedObjectToFlow(mo)))))
    }

    private async createFlowOnDevice(flow: Flow, deviceId: string) {
        const deviceOwner = await this.inventory.detail(deviceId).then(res => res.data.owner);
        await this.inventory.childAdditionsCreate({ ...this.flowToManagedObject(flow), owner: deviceOwner }, deviceId).then(res => {
            const identity: IExternalIdentity = {
                type: "c8y_Serial",
                externalId: flow.c8yFlowId.replace(".", ""),
                managedObject: res.data
            };
            this.identity.create(identity)
        })
    }

    private async removeFlowFromDevice(flow: Flow, deviceId: string) {
        const moId = await this.inventory.childAdditionsList(deviceId, this.childAdditionFilter).then(
            res => res.data.filter(mo => mo.name === flow.c8yFlowId).pop()?.id)
        await this.inventory.delete(moId);
    }
}