import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@c8y/ngx-components';
import { Observable, Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { BackendCommand, EdgeCMDProgress } from '../property.model';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  configurationForm: FormGroup
  edgeConfiguration: any = {}

  constructor(private edgeService: EdgeService, private alertService: AlertService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.initForm()
  }

  async initForm() {
    this.configurationForm = this.formBuilder.group({
      tenantUrl: ['', Validators.required],
      deviceId: ['', Validators.required],
      username: [''],
      password: [''],
    });

    this.edgeConfiguration = await this.edgeService.getEdgeConfiguration();
    this.configurationForm.setValue(this.getC());
  }

  getC() {
    return {
      tenantUrl: (this.edgeConfiguration['c8y.url'] ? this.edgeConfiguration['c8y.url'] : ''),
      deviceId: (this.edgeConfiguration['device.id'] ? this.edgeConfiguration['device.id'] : ''),
      username: this.edgeConfiguration.username ? this.edgeConfiguration.username : '',
      password: this.edgeConfiguration.password ? this.edgeConfiguration.password : '',
    }
  }

  async startEdge() {
    const bc: BackendCommand = {cmd: 'start', promptText: 'Starting Thin Edge ...' };
    this.edgeService.commandChange$.next(bc);
  }

  async stopEdge() {
    const bc: BackendCommand = {cmd: 'stop', promptText: 'Stopping Thin Edge ...' };
    this.edgeService.commandChange$.next(bc);
  }

  async configureEdge() {
    const up = {
      'device.id': this.configurationForm.value.deviceId,
      'c8y.url': this.configurationForm.value.tenantUrl,
    }
    this.edgeService.updateEdgeConfiguration(up);
    let url = this.configurationForm.controls['tenantUrl'].value.replace('https://', '').replace('/', '') as string;
    const bc: BackendCommand = {
      cmd: 'configure',
      promptText: 'Configure Thin Edge ...',
      deviceId: this.configurationForm.value.deviceId,
      tenantUrl: url
     };
    this.edgeService.commandChange$.next(bc);
  }

  async resetEdge() {
    this.initForm()
    const bc: BackendCommand = {
      cmd: 'reset',
      promptText: 'Resetting Thin Edge ...',
     };
    this.edgeService.commandChange$.next(bc);
  }

  async downloadCertificate() {
    const bc: BackendCommand = {cmd: 'empty', promptText: 'Download Certificate  ...' };
    this.edgeService.commandChange$.next(bc);
    try {
      const data = await this.edgeService.downloadCertificate("blob")
      const url = window.URL.createObjectURL(data);
      window.open(url);
      console.log("New download:", url)
      //window.location.assign(res.url);
    } catch (error) {
      console.log(error);
      this.alertService.danger(`Download failed!`)
    }
  }

  async updateCloudConfiguration() {
    const up = {
      'c8y.url': this.configurationForm.value.tenantUrl,
      username: this.configurationForm.value.username,
      password: this.configurationForm.value.password,
    }
    this.edgeService.updateEdgeConfiguration(up);
    this.edgeService.initFetchClient();
  }

  async upload() {
    this.updateCloudConfiguration();

    try {
      const res = await this.edgeService.uploadCertificate()
      console.log("Upload response:", res)
      if (res.status < 300) {
        this.alertService.success("Uploaded certificate to cloud tenant")
      } else {
        this.alertService.danger("Failed to upload certificate!")
      }
    } catch (err) {
      this.alertService.danger("Failed to upload certificate: " + err.message)
    }
  }

}