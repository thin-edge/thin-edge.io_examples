import { Component, OnInit } from '@angular/core';
import { AlertService } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { BackendCommandProgress } from '../property.model';


@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  commandTerminal: string = "# "
  currentLine: string = ""
  subscriptionOutput: Subscription;
  subscriptionExit: Subscription;
  subscriptionConfirmation: Subscription;

  constructor(private edgeService: EdgeService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscriptionOutput = this.edgeService.getShellCommandOutput().subscribe((data: any) => {
      var st = String.fromCharCode.apply(null, new Uint8Array(data));
      var end = this.commandTerminal.slice(-2) 
      // test if last two char represent the prompt "# ", then remove these
      if ( end == "# ") {
        this.commandTerminal = this.commandTerminal.slice(0,-2);
      }
      this.commandTerminal = this.commandTerminal  + st 
    })

    this.subscriptionConfirmation = this.edgeService.getShellCommandConfirmation().subscribe((data: any) => {
      var st = String.fromCharCode.apply(null, new Uint8Array(data));
      this.commandTerminal = this.commandTerminal  + st 
    })

    this.subscriptionExit = this.edgeService.getShellCommandExit().subscribe((data: any) => {
      var st = String.fromCharCode.apply(null, new Uint8Array(data));
      this.commandTerminal = this.commandTerminal  + st + "\n" + "# "
    })

  }

  private resetTerminal() {
    this.commandTerminal = "# ";
  }

  onKeydown(e){
    console.log ("Keydown:", e);
    if (e.key == 'Enter') {
      //this.commandTerminal = this.commandTerminal + this.currentLine + "\n" + "# "
      console.log ("CommandTerminal:", this.commandTerminal);
      if (this.currentLine == "clear") {
        this.resetTerminal();
      }
      this.edgeService.startShellCommand(this.currentLine);
      this.currentLine = ""
    } else if (e.key == 'Backspace' ) {
      // test if key is backspace and we don't remove a newline
      this.currentLine = this.currentLine.slice(0, -1) 
    } else if (!e.ctrlKey && e.key !== "Shift"){
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
    this.subscriptionExit.unsubscribe();
    this.subscriptionConfirmation.unsubscribe();
  }
}