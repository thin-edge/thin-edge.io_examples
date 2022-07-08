import { Component, OnInit } from '@angular/core';
import { AlertService } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { BackendCommand, BackendCommandProgress } from '../property.model';


@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
  subscriptionProgress: Subscription;
  subscriptionOutput: Subscription;
  subscriptionCommandExecute: Subscription;
  showStatusBar: boolean = true;
  message: string
  progress: number;
  commandTerminal: string

  constructor(private edgeService: EdgeService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.showStatusBar = true
    this.progress = 0
    this.commandTerminal = "# "
    this.message = ""
    this.subscriptionProgress = this.edgeService.getCommandProgress().subscribe((st: BackendCommandProgress) => {
      console.log("CommandProgress:", st);
      if (st.status == 'error') {
        this.message = "failed"
        this.alertService.danger(`Running command ${st.job} failed at step: ${st.progress}`)
        this.commandTerminal = this.commandTerminal + "\r\n" + "# "
        this.showStatusBar = true
      } else if (st.status == 'end-job') {
        this.message = "success"
        this.alertService.success(`Successfully completed command ${st.job}`)
        this.commandTerminal = this.commandTerminal + "\r\n" + "# "
        this.showStatusBar = true
        this.progress = 0
      } else if (st.status == 'start-job') {
        this.message = ""
        this.commandTerminal = this.commandTerminal + ( st.promptText && st.promptText !== "" ? "# " + st.promptText : "")
        this.showStatusBar = true
      } else if (st.cmd) {
        this.commandTerminal = this.commandTerminal + "\r\n" + "# " + st.cmd + "\r\n"
      }
      this.progress = 100 * (st.progress + 1) / st.total
    })
    this.subscriptionOutput = this.edgeService.getCommandOutput().subscribe((st: string) => {
      this.commandTerminal = this.commandTerminal + st
    })

    //listen to new commands
    this.subscriptionCommandExecute = this.edgeService.commandExecute$.subscribe((bc:BackendCommand) => {
      console.log("New backEnd command:", bc)
      if ( bc.job !== "empty") {
        delete bc.promptText;
        this.edgeService.sendBackendCommand(bc)
      }
     })
  }

  ngOnDestroy() {
    this.subscriptionOutput.unsubscribe();
    this.subscriptionProgress.unsubscribe();
    this.subscriptionCommandExecute.unsubscribe();
  }
}