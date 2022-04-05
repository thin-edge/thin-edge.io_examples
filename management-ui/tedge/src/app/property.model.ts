
export class CustomCertificate {
  isComplex: boolean;
  description: string;
  name: string;
  path: string;
}

export interface EdgeCMDProgress {
  status: string
  progress: number
  total: number
  cmd: string
}

export interface RawMeasurment {
  _id?: string
  topic?: string
  payload?: Object
  type?: string
  qos?: number
  datetime?: Date
  timestamp?: number
}
export interface MeasurmentType {
  type: string
  series: string[]
}

export interface RawListItem {
  id: any;
  unit: string
  text: any;
  format?: string;
}

export interface SpanListItem {
  text: string;
  spanInSeconds: number;
  displayUnit?: string;
}

export interface RowStructure {
  name: string;
  value: string;
};