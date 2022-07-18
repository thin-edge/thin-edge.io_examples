import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss', '../../../node_modules/xterm/css/xterm.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ShellComponent implements OnInit {
  currentLine: string = ""
  subscriptionOutput: Subscription;
  subscriptionExit: Subscription;
  term: any;
  prepareCR: boolean = false;

  constructor(private edgeService: EdgeService) {
  }

  @ViewChild('terminalcontainer') private termElement: ElementRef;

  ngOnInit() {
    this.subscriptionOutput = this.edgeService.getShellCommandOutput().subscribe((data: any) => {
      const ar = new Uint8Array(data)
      const char_minus1 = ar[ar.length - 1]
      const st = String.fromCharCode.apply(null, ar);
      console.log("Shell output:", st, char_minus1);

      this.term.write(st);
    })

    this.subscriptionExit = this.edgeService.getShellCommandExit().subscribe((data: any) => {
      var st = String.fromCharCode.apply(null, new Uint8Array(data));
      console.log("Shell exit:", st);
    })

  }

  ngAfterViewInit(): void {
    //this.term = new Terminal({convertEol: true, cursorBlink: true, cursorStyle :'block'});
    this.term = new Terminal();
    this.term.setOption('cursorStyle', 'block');
    this.term.setOption('cursorBlink', true);
    this.term.setOption('convertEol', true);
    this.term.setOption('rendererType', 'dom');
    const fitAddon = new FitAddon();
    this.term.loadAddon(fitAddon);
    this.term.onKey((ev) => {
      console.log("OnKey event:", ev.domEvent.key, ev.key, ev);

      this.edgeService.startShellCommand(ev.key);
    });

    // this.term.onData((data) => {
    //   console.log("OnData:", data, data.charCodeAt(0));
    // });
    this.term.focus();
    this.term.open(this.termElement.nativeElement);
  }

  ngOnDestroy() {
    this.subscriptionOutput.unsubscribe();
    this.subscriptionExit.unsubscribe();
    if (this.term) {
      console.log("Terminal is defined");
      //this.term.destroy();
    }
  }
}