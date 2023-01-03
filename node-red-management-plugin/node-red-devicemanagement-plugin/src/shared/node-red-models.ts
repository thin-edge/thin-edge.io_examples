import { OperationStatus } from "@c8y/client"

export interface Flow {
    label: string
    id: string
    updated?: string
    info: string
}

export interface FlowStatus {
    [flowid: string]: OperationStatus
}
