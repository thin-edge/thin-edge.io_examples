import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { BackendCommand, BackendCommandProgress } from '../property.model';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  configurationForm: FormGroup
  subscriptionProgress: Subscription
  edgeConfiguration: any = {}
  pendingCommand: string = "";

  constructor(private edgeService: EdgeService, private formBuilder: FormBuilder) {
   }

  ngOnInit() {
    this.getNewConfiguration()
    this.initForm()

    this.subscriptionProgress = this.edgeService.getCommandProgress().subscribe((st: BackendCommandProgress) => {
      //console.log("CommandProgress:", st);
      if (st.status == 'error' || st.status == 'end-job') {
        this.pendingCommand = '';
      }
    })
  }

  initForm() {
    this.configurationForm = this.formBuilder.group({
      tenantUrl: [(this.edgeConfiguration['c8y.url'] ? this.edgeConfiguration['c8y.url']: ''), Validators.required],
      deviceId: [(this.edgeConfiguration['device.id'] ? this.edgeConfiguration['device.id']: ''), Validators.required],
    });
  }

  async startEdge() {
    this.pendingCommand = 'start';
    const bc: BackendCommand = {job: 'start', promptText: 'Starting Thin Edge ...' };
    this.edgeService.commandExecute$.next(bc);
  }

  async stopEdge(){
    this.pendingCommand = 'stop';
    const bc: BackendCommand = {job: 'stop', promptText: 'Stopping Thin Edge ...' };
    this.edgeService.commandExecute$.next(bc);
  }

  async restartPlugins() {
    this.pendingCommand = 'restartPlugins';
    const bc: BackendCommand = {job: 'restartPlugins', promptText: 'Restarting Plugins  ...' };
    this.edgeService.commandExecute$.next(bc);
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

  ngOnDestroy() {
    this.subscriptionProgress.unsubscribe();
  }
}