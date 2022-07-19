import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AlertService } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { BackendCommandProgress } from '../property.model';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';


@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss', '../../../node_modules/xterm/css/xterm.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TerminalComponent implements OnInit {
  subscriptionProgress: Subscription;
  subscriptionOutput: Subscription;
  showStatusBar: boolean = true;
  progress: number = 0;
  term: any;

  constructor(private edgeService: EdgeService, private alertService: AlertService) {
  }

  @ViewChild('terminalcontainer') private termElement: ElementRef;

  ngOnInit() {
    this.subscriptionProgress = this.edgeService.getJobProgress().subscribe((st: BackendCommandProgress) => {
      console.log("JobProgress:", st);
      this.progress = 100 * (st.progress + 1) / st.total
      if (st.status == 'error') {
        this.alertService.danger(`Running command ${st.job} failed at step: ${st.progress}`)
        this.term.write("\n/ $");
        this.progress = 0
      } else if (st.status == 'end-job') {
        this.alertService.success(`Successfully completed command ${st.job}`)
        this.term.write("\n/ $");
        this.progress = 0
      } else if (st.status == 'start-job') {
        this.progress = 0
        this.term.clear();
        this.term.write( (st.promptText && st.promptText !== "" ? "/ $ # " + st.promptText : "") + "\n")
      } else if (st.status == 'processing') {
        this.term.write("\n" + "/ $ " + st.cmd + "\n");
      }
    })
    this.subscriptionOutput = this.edgeService. getJobOutput().subscribe((st: string) => {
      this.term.write(st);
    })

  }

  ngAfterViewInit(): void {
    console.log("AfterViewInit is called!");
    this.initializeTerminal();
  }

  private initializeTerminal() {
    this.term = new Terminal({'rows': 30, 'cols': 80});
    this.term.setOption('convertEol', true);
    this.term.open(this.termElement.nativeElement);
    this.term.focus();
    this.term.setOption('cursorBlink', true);
    this.term.setOption('cursorStyle', 'bar');

    // make sure prompt appears
    this.term.write("/ $ ");
  }


  ngOnDestroy() {
    this.subscriptionOutput.unsubscribe();
    this.subscriptionProgress.unsubscribe();
    if (this.term) {
      this.term.dispose();
    }
  }
}