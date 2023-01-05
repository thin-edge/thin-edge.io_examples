import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'applyStatusColoring'
})

export class StatusColoringPipe implements PipeTransform {

  constructor(private _domSanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    return this._domSanitizer.bypassSecurityTrustHtml(this.highlight(value));
  }

  ngOnInit() { }

  highlight(text: string) {
    let stopped = "<span style='color:red'>stopped</span>";
    let crashed = "<span style='color:red'>crashed</span>";
    let started = "<span style='color:green'>started</span>";
    let org: string = text;
    //console.log ("Formatted highlight:", org)
    let fmt: string = text;
    if (text) {
      fmt = text.replace(/stopped/g, stopped)
        .replace(/crashed/g, crashed)
        .replace(/started/g, started);
      //console.log ("Formatted status exit:", fmt)
    }
    return fmt;
  }
}