import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IExternalIdentity, Client, BasicAuth, FetchClient, IFetchOptions, IFetchResponse, IdentityService, InventoryService, IdReference } from '@c8y/client';
import { EdgeCMDProgress, MeasurmentType, RawMeasurment } from './property.model';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators"

const C8Y_URL = 'c8y';
const INVENTORY_URL = '/inventory/managedObjects';
const IDENTITY_URL = '/identity/externalIds';
const LOGIN_URL = `/tenant/currentTenant`
const EDGE_CONFIGURATION_URL = '/api/configuration/edge'
const ANALYTICS_CONFIGURATION_URL = '/api/configuration/analytics'
const DOWNLOADCERTIFICATE_URL = "/api/configuration/certificate";
const MEASUREMENT_URL = "/api/analytics/measurement";
const SERIES_URL = "/api/analytics/series";
const SERVICE_URL = "/api/services";

@Injectable({
  providedIn: 'root'
})
export class EdgeService {
  private fetchClient: FetchClient;
  private edgeConfiguration: any = {}

  constructor(private http: HttpClient,
    private socket: Socket) { }

  getLastMeasurements(displaySpan: number): Promise<RawMeasurment[]> {
    const promise = new Promise<any[]>((resolve, reject) => {
      const params = new HttpParams({
        fromObject: {
          displaySpan: displaySpan.toString(),
        }
      });
      this.http
        .get<RawMeasurment[]>(MEASUREMENT_URL, { params: params })
        .toPromise()
        .then((res: any[]) => {
          // Success
          resolve(res);
        },
          err => {
            // Error
            reject(err);
          }
        );
    });
    return promise;
  }

  getMeasurements(dateFrom: Date, dateTo: Date): Promise<RawMeasurment[]> {
    const promise = new Promise<any[]>((resolve, reject) => {
      const params = new HttpParams({
        fromObject: {
          dateFrom: dateFrom.toString(),
          dateTo: dateTo.toString(),
        }
      });
      this.http
        .get<RawMeasurment[]>(MEASUREMENT_URL, { params: params })
        .toPromise()
        .then((res: any[]) => {
          // Success
          resolve(res);
        },
          err => {
            // Error
            reject(err);
          }
        );
    });
    return promise;
  }

  sendCMDToEdge(msg) {
    this.socket.emit('cmd-in', msg);
  }

  getCMDProgress(): Observable<EdgeCMDProgress> {
    // return this.socket.fromEvent('cmd-edge').pipe(map((data) => JSON.stringify(data)));
    return this.socket.fromEvent('cmd-progress');
  }

  getRealtimeMeasurements(): Observable<RawMeasurment> {
    this.socket.emit('new-measurement', 'start');
    const obs = this.socket.fromEvent<string>('new-measurement').pipe(map(m => JSON.parse(m)))
    return obs;
  }

  stopMeasurements(): void {
    this.socket.emit('new-measurement', 'stop');
  }

  getCMDResult(): Observable<string> {
    return this.socket.fromEvent('cmd-result');
  }

  updateEdgeConfiguration(ec: any) {
    this.edgeConfiguration = {
      ...this.edgeConfiguration,
      ...ec,
    }
    console.log("Updated edgeConfiguration:", ec, this.edgeConfiguration);
  }

  getEdgeServiceStatus(): Promise<any> {
    return this.http
      .get<any>(SERVICE_URL)
      .toPromise()
      .then(res => {
        console.log("New status", res)
        return res
      })
  }
  getEdgeConfiguration(): Promise<any> {
    return this.http
      .get<any>(EDGE_CONFIGURATION_URL)
      .toPromise()
      .then(config => {
        Object.keys(config).forEach(key => { this.edgeConfiguration[key] = config[key] })
        return this.edgeConfiguration
      })
  }

  getSeries(): Promise<any> {
    return this.http
      .get<MeasurmentType[]>(SERIES_URL)
      .toPromise()
      .then(config => {
        return config
      })
  }

  getAnalyticsConfiguration(): Promise<any> {
    return this.http
      .get<any>(ANALYTICS_CONFIGURATION_URL)
      .toPromise()
      .then(config => {
        return config
      })
  }

  setAnalyticsConfiguration(config): Promise<any> {
    //console.log("Configuration to be stored:", config)
    return this.http
      .post<any>(ANALYTICS_CONFIGURATION_URL, config)
      .toPromise()
      .then(config => {
        return config
      })
  }

  downloadCertificate(t: string): Promise<any | Object> {
    const promise = new Promise((resolve, reject) => {
      const apiURL = DOWNLOADCERTIFICATE_URL;
      const params = new HttpParams({
        fromObject: {
          deviceId: this.edgeConfiguration['device.id'],
        }
      });
      let options: any;
      if (t == "text") {
        options = { params: params, responseType: 'text' }
      } else {
        options = { params: params, responseType: 'blob' as 'json' }
      }
      this.http
        .get(apiURL, options)
        .toPromise()
        .then((res: any) => {
          // Success
          resolve(res);
        },
          err => {
            // Error
            reject(err);
          }
        );
    });
    return promise;
  }

  getDetailsCloudDevice(externalId: string): Promise<any | Object> {
    const options: IFetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let externalIdType = 'c8y_Serial';
    let url_id = `/identity/externalIds/${externalIdType}/${externalId}` + "?proxy=" + this.edgeConfiguration['c8y.url']
    let inventoryPromise: Promise<IFetchResponse> = this.fetchClient.fetch(url_id, options)
      .then(response => {
        console.log("Inventory response:", response);
        return response;
      })
      .then(response => response.json())
      .then(json => {
        console.log("Device id response:", json.managedObject.id);
        let deviceId = json.managedObject.id
        let url_inv = INVENTORY_URL + `/${deviceId}`
        return this.fetchClient.fetch(this.addProxy2Url(url_inv), options)
          .then(response => {
            console.log("Inventory response:", response);
            return response;
          });
      })
      .then(response => response.json())
      .catch(err => {
        console.log("Could not login:" + err.message)
        return err;
      })
    return inventoryPromise;
  }

  initFetchClient() {
    const auth = new BasicAuth({
      user: this.edgeConfiguration.username,
      password: this.edgeConfiguration.password,
    });

    const client = new Client(auth, C8Y_URL);
    this.fetchClient = client.core;
  }

  login(): Promise<IFetchResponse> {
    const options: IFetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let loginPromise: Promise<IFetchResponse> = this.fetchClient.fetch(this.addProxy2Url(LOGIN_URL), options)
      .then(response => {
        //console.log ("Resulting cmd:", response);
        return response;
      })
      .catch(err => {
        console.log("Could not login:" + err.message)
        return err;
      })
    return loginPromise;
  }

  addProxy2Url(url: string): string {
    return url + "?proxy=" + this.edgeConfiguration['c8y.url']
  }

  async uploadCertificate(): Promise<Object | any> {
    let res = await this.login();
    let body = await res.json();
    let currentTenant = body.name;
    let certificate_url = this.addProxy2Url(`/tenant/tenants/${currentTenant}/trusted-certificates`);
    console.log("Response body from login:", body)

    let cert = await this.downloadCertificate("text");
    console.log("Response body from certificate:", cert)
    const options: IFetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certInPemFormat: cert, "autoRegistrationEnabled": true, status: "ENABLED", name: this.edgeConfiguration["device.id"] })
    };

    //console.log("Upload certificate:", certificate_url, cert)

    let uploadPromise: Promise<IFetchResponse> = this.fetchClient.fetch(certificate_url, options)
      .then(response => {
        //console.log ("Resulting cmd:", response);
        return response;
      })
      .catch(err => {
        console.log("Could not upload certificate:" + err.message)
        return err;
      })
    return uploadPromise;
  }

  // Error handling
  private error(error: any) {
    let message = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }
}
