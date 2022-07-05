
import { Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import { EdgeService } from '../edge.service';
import { MeasurmentType } from '../property.model';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'charting-config',
  templateUrl: './charting-config.component.html',
  styleUrls: ['./charting-config.component.less']
})
export class ChartingConfigComponent implements OnInit {

  constructor(public edgeService: EdgeService) { }

  @Output() onChangeConfig = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  @Input() config: { fillCurve: boolean; fitAxis: boolean; rangeLow: any; rangeHigh: any; diagramName: string};
  measurementTypes: MeasurmentType[] = []
  isHidden: boolean = false;



  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'diagramName',
      type: 'input',
      templateOptions: {
        label: 'Digram Name',
        description: 'Name of diagram.',
        required: true,
        change: (field, $event) => console.warn(field, $event),
      },
    },
    {
      key: 'fitAxis',
      type: 'checkbox',
      templateOptions: {
        label: 'Fit Axis',
        description: 'Fit Axis',
        readonly: false,
        change: (field, $event) => {
          console.warn(field, $event)
          this.updateFitAxis();
        },
      }
    },
    {
      key: 'fillCurve',
      type: 'checkbox',
      templateOptions: {
        label: 'Fill Curve',
        description: 'Fill Curve',
        readonly: false,
        change: (field, $event) => console.warn(field, $event),
      }
    },
    {
      key: 'rangeLow',
      type: 'input',
      hideExpression: 'model.fitAxis',
      templateOptions: {
        label: 'Lower range y-axis',
        description: 'Low Range',
        type: 'number',
        readonly: false,
        change: (field, $event) => console.warn(field, $event),
      }
    },
    {
      key: 'rangeHigh',
      type: 'input',
      hideExpression: 'model.fitAxis',
      templateOptions: {
        label: 'Higher range y-axis',
        description: 'High Range',
        type: 'number',
        readonly: false,
        change: (field, $event) => console.warn(field, $event),
      }
    },
    
  ];
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
  }

  public updateFitAxis() {
    console.log("Adapting fit, before:", this.config)
    if (this.config.fitAxis) {
      delete this.config.rangeLow;
      delete this.config.rangeHigh;
    }
    console.log("Adapting fit, after:", this.config)
  }
}