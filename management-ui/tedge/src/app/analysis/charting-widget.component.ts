import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Chart, ChartOptions, ChartConfiguration, UpdateMode } from 'chart.js';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import { Observable, Subscription } from 'rxjs';
import { EdgeService } from '../edge.service';
import { RawMeasurment } from '../property.model';
import { flatten, generateNextColor, unitList, spanList } from './widget-helper';

Chart.register(StreamingPlugin);

@Component({
  selector: "charting-widget",
  templateUrl: "./charting-widget.component.html",
  styleUrls: ["./charting-widget.component.css"],
})
export class ChartingWidget implements OnDestroy, OnInit, OnChanges {
  
  constructor(
    private edgeService: EdgeService,
    ) { }
    
    ngOnInit(): void {
    }
    
    @ViewChild('analytic') private lineChartCanvas: ElementRef;
    
    @Input() config: any;
    @Input() displaySpanIndex: number;   // default of diagram is always realtime
    @Input() dateFrom: Date;
    @Input() dateTo: Date;
    @Input() rangeUnitCount: number;
    @Input() rangeUnit: number;
    
    subscriptionMongoMeasurement: Subscription
    measurements$: Observable<RawMeasurment>
    chartDataPointList: { [name: string]: number } = { index: 0 }
    lineChart: Chart;
    fillCurve: boolean;

  x_realtime: any = {
    type: 'realtime',
    realtime: {
      delay: 2000,
      duration: 300000 // 5 minutes
    }
  };

  x_fixed: any = {
    type: 'time',
    time: {
      unit: 'minute',
    }
  };

  chartOptions: ChartOptions = {
    scales: {
      x: this.x_realtime,
      y: {}
    },
    //parsing: false
  };

  chartConfiguration: ChartConfiguration = {
    type: 'line',
    data: {
      datasets: []
    },
    options: this.chartOptions
  }

  ngAfterViewInit(): void {
    if (this.lineChartCanvas) {
      this.lineChart = new Chart(this.lineChartCanvas.nativeElement, this.chartConfiguration)
      console.log("Chart initialized!")
    } else {
      console.log("Chart not initialized!")
    }
  }

  startRealtime() {
    //console.log("Realtime started!")
    this.measurements$ = this.edgeService.getRealtimeMeasurements()
    this.subscriptionMongoMeasurement = this.measurements$.subscribe((m: RawMeasurment) => {
      //console.log("New Mongo Measurement", m)
      this.pushEventToChartData(m)
      this.updateChart("show")
    })
  }

  private pushEventToChartData(event: RawMeasurment): void {

    // test for event with payload
    if (event && event.payload) {
      let flat = flatten(event.payload)
      //console.log("Log initial ", flat, event);
      for (let key in flat) {
        //console.log("Testing key", this.chartDataPointList[key], key);
        if (key.endsWith('value')) {
          // test if key is already in chartDataPoint
          // add new series
          if (this.chartDataPointList[key] === undefined) {
            //   label: 'Dataset 1',
            //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
            //   borderColor: 'rgb(255, 99, 132)',
            //   borderDash: [8, 4],
            //   fill: true,
            //   data: []
            let nextColor = generateNextColor(this.chartDataPointList.index)
            this.lineChart.data.datasets.push(
              {
                label: key.replace(".value", ""),
                //backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: nextColor,
                borderDash: [8, 4],
                fill: this.fillCurve,
                data: []
              }
            )

            this.chartDataPointList[key] = this.chartDataPointList.index
            console.log("Adding key", this.chartDataPointList[key], key, this.lineChart.data.datasets);
            ++this.chartDataPointList.index

          }
          //(_chartData[this.chartDataPointList[key]].data as ChartPoint[]).push(dp)
          let p = {
            x: event.datetime,
            //x: event.timestamp,
            y: flat[key]
          } as any
          //console.log("New DataPoint", event, p, this.chartDataPointList[key] ); 
          this.lineChart.data.datasets[this.chartDataPointList[key]].data.push(p)
        } else {
          //console.log("Ignore key", this.chartDataPointList[key], key);
        }
      }
    }
  }

  private resetChart() {
    if (this.lineChart) {
      this.chartDataPointList = { index: 0 };
      this.lineChart.data.datasets = [];
      this.lineChart.options = this.chartOptions
    }
  }

  private updateChart(mode:UpdateMode) {
    if (this.lineChart) {
      console.log("UpdateChart called!")
      this.lineChart.update(mode);
    } else {
      //console.log("UpdateChart sorry empty!")
    }
  }


  private stopRealtime() {
    //console.log("Realtime stopped!")
    if (this.subscriptionMongoMeasurement) this.subscriptionMongoMeasurement.unsubscribe();
    this.edgeService.stopMeasurements();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const changedProp = changes[propName];
      if (propName == "config") {
        console.log("Changed property", changedProp, propName, parseInt(changedProp.currentValue.rangeLow))
        if (changedProp.currentValue.fillCurve) {
          this.fillCurve = changedProp.currentValue.fillCurve
        }
        if (parseInt(changedProp.currentValue.rangeLow)) {
          this.chartOptions.scales.y.min = parseInt(changedProp.currentValue.rangeLow)
        }
        if (parseInt(changedProp.currentValue.rangeHigh)) {
          this.chartOptions.scales.y.max = parseInt(changedProp.currentValue.rangeHigh)
        }
        console.log("New Chart options Display", this.chartOptions);
        //console.log("Now can change config", changedProp.currentValue.rangeLow, changedProp.currentValue.rangeHigh)
      } else if (propName == "rangeUnitCount") {
        this.rangeUnitCount = parseInt(changedProp.currentValue)
        console.log("Changed rangeUnitCount", this.rangeUnitCount);
        this.x_realtime.realtime.duration = unitList[this.rangeUnit].id * this.rangeUnitCount * 1000;
        this.updateDisplayMode();
      } else if (propName == "rangeUnit") {
        this.rangeUnit = parseInt(changedProp.currentValue)
        console.log("Changed rangeUnit", this.rangeUnit);
        this.x_realtime.realtime.duration = unitList[this.rangeUnit].id * this.rangeUnitCount * 1000;
        this.updateDisplayMode();
      } else if (propName == "displaySpanIndex") {
        this.displaySpanIndex = parseInt(changedProp.currentValue)
        console.log("Changed displaySpanIndex", this.displaySpanIndex, this.x_fixed.time.unit);
        this.updateDisplayMode();
      } else if (propName == "dateFrom") {
        this.dateFrom = changedProp.currentValue
        console.log("Changed dateFrom", this.dateFrom);
        // only update if to range is set
        this.updateDisplayMode();
      } else if (propName == "dateTo") {
        this.dateTo = changedProp.currentValue
        console.log("Changed dateTo", this.dateTo);
        this.updateDisplayMode();
      }
    }
  }
  public async updateDisplayMode() {
    console.log("UpdateDisplayMode called!")
    this.stopRealtime();
    if (this.displaySpanIndex == 0) {
      // realtime data is displayed
      this.chartOptions.scales['x'] = this.x_realtime;
      this.resetChart();
      this.startRealtime();
    } else  {
      // if historical data to be displayed  
      this.x_fixed.time.unit = spanList[this.displaySpanIndex].displayUnit
      this.chartOptions.scales['x'] = this.x_fixed;
      this.resetChart();
      let ob: any[]
      if (this.displaySpanIndex == 4) {
        // if historical data is an interval 
        ob = await this.edgeService.getMeasurements(this.dateFrom, this.dateTo);
      } else {
        ob = await this.edgeService.getLastMeasurements(spanList[this.displaySpanIndex].spanInSeconds);
      }
      ob.forEach(m => this.pushEventToChartData(m))
      // console.log("New history", ob)
      this.updateChart("none")
    }
  }

  ngOnDestroy() {
    this.stopRealtime();
    console.log("Destroy called.")
    this.lineChart.destroy();
  }
}