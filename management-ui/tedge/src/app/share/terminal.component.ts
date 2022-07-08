import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@c8y/ngx-components';
import { Observable, Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { BackendCommand, EdgeCMDProgress } from '../property.model';


@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
  edgeCMDProgress$: Observable<EdgeCMDProgress>;
  edgeCMDResult$: Observable<string>;
  subscriptionProgress: Subscription;
  subscriptionResult: Subscription;
  showStatusBar: boolean = false;
  message: string
  progress: number;
  commandTerminal: string
  command: string
  configurationForm: FormGroup
  edgeConfiguration: any = {}

  constructor(private edgeService: EdgeService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.initalizeTerminal({
      cmd: "",
      promptText: ""
    })
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

    //listen to new commands
    this.edgeService.commandChange$.subscribe((bc:BackendCommand) => {
      console.log("New backEnd command:", bc)
      this.initalizeTerminal(bc)
      if ( bc.cmd !== "empty") {
        delete bc.promptText;
        this.edgeService.sendCMDToEdge(bc)
      }
     })
  }

  initalizeTerminal(bc:BackendCommand) {
    this.command = bc.cmd
    this.showStatusBar = true
    this.commandTerminal = "# " + ( bc.promptText && bc.promptText !== "" ? "# " + bc.promptText : "")
    this.message = ""
  }

  ngOnDestroy() {
    this.subscriptionResult.unsubscribe();
    this.subscriptionProgress.unsubscribe();
  }
}