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

  constructor(private edgeService: EdgeService) {
  }

  @ViewChild('terminalcontainer') private termElement: ElementRef;

  ngOnInit() {
    this.subscriptionOutput = this.edgeService.getShellCommandOutput().subscribe((data: any) => {
      const ar = new Uint8Array(data)
      const st = String.fromCharCode.apply(null, ar);
      //console.log("Shell output:", st);
      this.term.write(st);
    })

    this.subscriptionExit = this.edgeService.getShellCommandExit().subscribe((data: any) => {
      var st = String.fromCharCode.apply(null, new Uint8Array(data));
      console.log("Shell exit:", st);
      this.term.write(st);
    })
  }

  private initializeTerminal() {
    //this.term = new Terminal();
    this.term = new Terminal({'cursorBlink': true, 'cursorStyle': 'bar'});
    //this.term.setOption('convertEol', true);
    const fitAddon = new FitAddon();
    this.term.loadAddon(fitAddon);
    this.term.onKey((ev) => {
      //console.log("OnKey event:", ev.domEvent.key, ev.key);
      this.edgeService.startShellCommand(ev.key);
    });

    // this.term.onData((data) => {
    //   console.log("OnData:", data, data.charCodeAt(0));
    // });

    this.term.open(this.termElement.nativeElement);
    this.term.focus();
    //this.term.setOption('cursorBlink', true);
    //this.term.setOption('cursorStyle', 'bar');

    // make sure prompt appears
    this.edgeService.startShellCommand("\n");
  }

  ngAfterViewInit(): void {
    console.log("AfterViewInit is called!");
    this.initializeTerminal();
  }

  ngOnDestroy() {
    console.log("Destroy is called!");
    this.subscriptionOutput.unsubscribe();
    this.subscriptionExit.unsubscribe();
    if (this.term) {
      //console.log("Terminal is defined");
      this.term.dispose();
    }
  }
}