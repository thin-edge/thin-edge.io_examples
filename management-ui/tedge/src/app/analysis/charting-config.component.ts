
import { Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import { EdgeService } from '../edge.service';
import { MeasurmentType } from '../property.model';

@Component({
  selector: 'charting-config',
  templateUrl: './charting-config.component.html',
  styleUrls: ['./charting-config.component.less']
})
export class ChartingConfigComponent implements OnInit {

  constructor(public edgeService: EdgeService) { }

  @Output() onChangeConfig = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  @Input() config: { fillCurve: boolean; fitAxis: boolean; rangeLow: any; rangeHigh: any; };
  measurementTypes: MeasurmentType[] = []
  isHidden: boolean = false;

  async ngOnInit() {
    this.measurementTypes = await this.edgeService.getSeries();
    console.log("This config:", this.config)
  }

  public onSaveClicked(): void {
    this.onChangeConfig.emit(this.config);
  }

  public onCloseClicked(): void {
    this.onClose.emit();
  }

  public updateConfig(): void {
    console.log("Update configuration", this.config)
  }
  
  public updateFillCurve(): void {
    console.log("Update configuration fill curve", this.config)
    this.config.fillCurve = !this.config.fillCurve
  }

  public updateFitAxis() {
    console.log("Adapting fit, before:", this.config)
    this.config.fitAxis = !this.config.fitAxis
    if (this.config.fitAxis) {
      delete this.config.rangeLow;
      delete this.config.rangeHigh;
    }
    console.log("Adapting fit, after:", this.config)
  }

}