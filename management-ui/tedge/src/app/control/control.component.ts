import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@c8y/ngx-components';
import { Observable, Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { EdgeCMDProgress, BackendCommand } from '../property.model';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  configurationForm: FormGroup
  edgeConfiguration: any = {}

  constructor(private edgeService: EdgeService, private formBuilder: FormBuilder) {
   }

  ngOnInit() {
    this.getNewConfiguration()
    this.initForm()
  }

  initForm() {
    this.configurationForm = this.formBuilder.group({
      tenantUrl: [(this.edgeConfiguration['c8y.url'] ? this.edgeConfiguration['c8y.url']: ''), Validators.required],
      deviceId: [(this.edgeConfiguration['device.id'] ? this.edgeConfiguration['device.id']: ''), Validators.required],
    });
  }

  async startEdge() {
    const bc: BackendCommand = {cmd: 'start', promptText: 'Starting Thin Edge ...' };
    this.edgeService.commandChange$.next(bc);
  }

  async stopEdge(){
    const bc: BackendCommand = {cmd: 'stop', promptText: 'Stopping Thin Edge ...' };
    this.edgeService.commandChange$.next(bc);
  }

  async restartPlugins() {
    const bc: BackendCommand = {cmd: 'restartPlugins', promptText: 'Restarting Plugins  ...' };
    this.edgeService.commandChange$.next(bc);
  }

  getNewConfiguration() {
    this.edgeService.getEdgeConfiguration().then ( config => {
      this.edgeConfiguration = config
      this.configurationForm.setValue ({
        tenantUrl: this.edgeConfiguration['c8y.url'] ? this.edgeConfiguration['c8y.url']: '',
        deviceId: this.edgeConfiguration['device.id'] ? this.edgeConfiguration['device.id']: '',
      })
    })
  }
}