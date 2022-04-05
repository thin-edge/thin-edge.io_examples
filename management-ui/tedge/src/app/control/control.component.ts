import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@c8y/ngx-components';
import { Observable, Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { EdgeCMDProgress } from '../property.model';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  refresh: EventEmitter<any> = new EventEmitter();
  public showCreateCertificate: boolean = false;
  edgeCMDProgress$: Observable<EdgeCMDProgress>;
  edgeCMDResult$: Observable<string>;
  subscriptionProgress; subscriptionResult: Subscription
  showStatusBar: boolean = false;
  message: string
  progress: number;
  commandTerminal: string
  command: string
  configurationForm: FormGroup
  edgeConfiguration: any = {}

  constructor(private edgeService: EdgeService, private alertService: AlertService, private formBuilder: FormBuilder) {
   }

  ngOnInit() {
    this.initalizeTerminal("")
    this.getNewConfiguration()
    this.initForm()
    this.edgeCMDProgress$ = this.edgeService.getCMDProgress()
    this.subscriptionProgress = this.edgeCMDProgress$.subscribe((st: EdgeCMDProgress) => {
      if (st.status == 'error') {
        this.message = "failed"
        this.alertService.danger(`Running command ${this.command} failed at step: ${st.progress}`)
        this.commandTerminal = this.commandTerminal + "\r\n" + "# "
        this.showStatusBar = false
      } else if (st.status == 'end-job') {
        this.message = "success"
        this.alertService.success(`Successfully completed command ${this.command}`)
        this.commandTerminal = this.commandTerminal + "\r\n" + "# "
        this.showStatusBar = false
      } else if (st.cmd) {
        this.commandTerminal = this.commandTerminal + "\r\n" + "# " + st.cmd + "\r\n"
      }
      this.progress = 100 * (st.progress + 1) / st.total
    })
    this.edgeCMDResult$ = this.edgeService.getCMDResult()
    this.subscriptionResult = this.edgeCMDResult$.subscribe((st: string) => {
      this.commandTerminal = this.commandTerminal + st
    })
  }
  initForm() {
    this.configurationForm = this.formBuilder.group({
      tenantUrl: [(this.edgeConfiguration['c8y.url'] ? this.edgeConfiguration['c8y.url']: ''), Validators.required],
      deviceId: [(this.edgeConfiguration['device.id'] ? this.edgeConfiguration['device.id']: ''), Validators.required],
    });
  }

  startEdge() {
    this.initalizeTerminal('start')
    this.edgeService.sendCMDToEdge({ cmd: this.command })
    this.commandTerminal = "Starting Thin Edge ..."
  }

  stopEdge() {
    this.initalizeTerminal('stop')
    this.edgeService.sendCMDToEdge({ cmd: this.command })
    this.commandTerminal = "Stopping Thin Edge ..."
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

  onChange (event) {
    console.log("Change event:", event)
  }
  onKeydown (event) {
    if (event.key === "Enter") {
      console.log("Execute:",event);
    } else {
    console.log("Ignoring:", event)
    }
  }
  initalizeTerminal(cmd) {
    this.command = cmd
    this.showStatusBar = true
    this.commandTerminal = "# "
    this.message = ""
  }

  ngOnDestroy() {
    this.subscriptionResult.unsubscribe();
    this.subscriptionProgress.unsubscribe();
  }
}