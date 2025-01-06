import { OperationStatus } from "@c8y/client"

export interface Flow {
    label?: string
    c8yFlowId: string
    updated?: string
    info: string
    localFlowId?: string
    id?: string
}

export interface FlowStatus {
    [flowid: string]: OperationStatus
}
