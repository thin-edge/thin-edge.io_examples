import { Component, OnInit } from '@angular/core';
import { AlertService } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { BackendCommandProgress } from '../property.model';


@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
  subscriptionProgress: Subscription;
  subscriptionOutput: Subscription;
  showStatusBar: boolean = true;
  progress: number = 0;
  commandTerminal: string = "# "
  currentLine: string = ""

  constructor(private edgeService: EdgeService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscriptionProgress = this.edgeService.getJobProgress().subscribe((st: BackendCommandProgress) => {
      console.log("JobProgress:", st);
      this.progress = 100 * (st.progress + 1) / st.total
      if (st.status == 'error') {
        this.alertService.danger(`Running command ${st.job} failed at step: ${st.progress}`)
        this.commandTerminal = this.commandTerminal + "\n" + "# "
        this.progress = 0
      } else if (st.status == 'end-job') {
        this.alertService.success(`Successfully completed command ${st.job}`)
        this.commandTerminal = this.commandTerminal + "\n" + "# "
        this.progress = 0
      } else if (st.status == 'start-job') {
        this.progress = 0
        this.resetTerminal();
        this.commandTerminal = this.commandTerminal + ( st.promptText && st.promptText !== "" ? "# " + st.promptText : "")
      } else if (st.status == 'processing') {
        this.commandTerminal = this.commandTerminal + "\n" + "# " + st.cmd + "\n"
      }
    })
    this.subscriptionOutput = this.edgeService. getJobOutput().subscribe((st: string) => {
      this.commandTerminal = this.commandTerminal + st
    })

  }

  private resetTerminal() {
    this.commandTerminal = "# ";
  }

  onKeydown(e){
    console.log ("Keydown:", e);
    if (e.key == 'Enter') {
      this.commandTerminal = this.commandTerminal + this.currentLine + "\n" + "# "
      console.log ("CommandTerminal:", this.commandTerminal);
      if (this.currentLine == "clear") {
        this.resetTerminal();
      }
      this.currentLine = ""
    } else if (e.key == 'Backspace' ) {
      // test if key is backspace and we don't remove a newline
      this.currentLine = this.currentLine.slice(0, -1) 
    } else if (!e.ctrlKey){
      this.currentLine = this.currentLine + e.key;
    } else {
      console.log ("Keydown ignore:", e);
    }
  }

  onChange(e){
    console.log ("Onchange:", e);
  }

  ngOnDestroy() {
    this.subscriptionOutput.unsubscribe();
    this.subscriptionProgress.unsubscribe();
  }
}