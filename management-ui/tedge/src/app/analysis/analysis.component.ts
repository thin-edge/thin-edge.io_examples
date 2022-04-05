import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { RawListItem, SpanListItem } from '../property.model';
import { unitList, spanList } from './widget-helper';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less']
//  styleUrls: ['../../../node_modules/ngx-bootstrap/datepicker/bs-datepicker.css']
})
export class AnalysisComponent implements OnInit, OnDestroy {

  public showDialog: boolean = false;
  public onChangeConfig: EventEmitter<any> = new EventEmitter();

  unitList: RawListItem[] = unitList
  spanList: SpanListItem[] = spanList;
  config: any = {
    diagramName: 'Analytics'
  }
  rangeUnit: number =  1;
  rangeUnitCount : number = 2;  // defaults to 5 minutes
  displaySpanIndex: number = 0;       // realtime
  dateFrom: Date = new Date();
  dateTo: Date = new Date();
  bsConfig = {containerClass: "theme-orange", dateInputFormat: 'DD-MM-YYYY'};
  showMeridian = false;
  showSpinners = false;

  constructor(private edgeService: EdgeService) { }
    
  async ngOnInit() {
    let c = await this.edgeService.getAnalyticsConfiguration()
    console.log("Loaded configuration :", c)
    this.config = {
      ...this.config,
      ...c
    }
  }

  configurationChanged(event) {
    console.log("Configuration changed:", event)
    this.edgeService.setAnalyticsConfiguration(event).then( c => {
      this.config = c
      console.log("Configuration was saved:", c )
      
    })
    this.showDialog = false;
  }

  updateFrom() {
    console.log("Date from:",this.dateFrom)
  }
  updateTo() {
    console.log("Date to:",this.dateFrom)
  }

  updateRangeUnitCount(event)
  {
    console.log("RangeUnitCount:",event.target.value)
    this.rangeUnitCount = event.target.value
  }

  ngOnDestroy(): void {  }
}