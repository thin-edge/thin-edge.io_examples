import { RealtimeAction } from '@c8y/ngx-components';
import { Observable } from 'rxjs';
import { Realtime, IOperation, IManagedObject } from '@c8y/client';
import { Injectable } from '@angular/core';

export interface RealtimeMessage<T> {
    channel: 'operations';
    data: T;
    id: string;
    realtimeAction: RealtimeAction;
}

@Injectable({ providedIn: 'root' })
export class RealtimeHelperService {
    constructor(private realtime: Realtime) { }
    /**
     * Wraps the Cumulocity operation realtime API back into an rxjs observable.
     */

    operations$(id: string): Observable<RealtimeMessage<IOperation>> {
        const channel = 'operations';
        const path = `/${channel}/${id}`;
        return new Observable<any>((observer) => {
            const subscription = this.realtime.subscribe(path, (msg) => {
                const data: RealtimeMessage<IOperation> = {
                    channel: msg.channel,
                    data: msg.data.data,
                    id: msg.id,
                    realtimeAction: msg.data.realtimeAction,
                };
                observer.next(data);
            });
            return () => this.realtime.unsubscribe(subscription);
        });
    }

    /**
     * Wraps the Cumulocity inventory realtime API back into an rxjs observable.
     */
    inventory$(id: string): Observable<RealtimeMessage<IManagedObject>> {
        const channel = 'managedobjects';
        const path = `/${channel}/${id}`;
        return new Observable<any>((observer) => {
            const subscription = this.realtime.subscribe(path, (msg) => {
                const data: RealtimeMessage<IManagedObject> = {
                    channel: msg.channel,
                    data: msg.data.data,
                    id: msg.id,
                    realtimeAction: msg.data.realtimeAction,
                };
                observer.next(data);
            });
            return () => this.realtime.unsubscribe(subscription);
        });
    }
}