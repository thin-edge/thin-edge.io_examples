import { Observable } from 'rxjs';
import { SocketIoConfig } from './config/socket-io.config';
export declare class WrappedSocket {
    private config;
    subscribersCounter: Record<string, number>;
    eventObservables$: Record<string, Observable<any>>;
    ioSocket: any;
    emptyConfig: SocketIoConfig;
    constructor(config: SocketIoConfig);
    of(namespace: string): void;
    on(eventName: string, callback: Function): void;
    once(eventName: string, callback: Function): void;
    connect(): any;
    disconnect(_close?: any): any;
    emit(_eventName: string, ..._args: any[]): any;
    removeListener(_eventName: string, _callback?: Function): any;
    removeAllListeners(_eventName?: string): any;
    fromEvent<T>(eventName: string): Observable<T>;
    fromOneTimeEvent<T>(eventName: string): Promise<T>;
}
