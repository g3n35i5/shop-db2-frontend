import {Component, Input, OnInit} from '@angular/core';
import {curveCardinal, curveLinear, curveStepAfter} from 'd3-shape';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() title: String;
  @Input() chartType: String;
  @Input() chartData: any[];
  @Input() xAxisLabel: String = '';
  @Input() yAxisLabel: String = '';
  @Input() showXAxisLabel: Boolean = false;
  @Input() showYAxisLabel: Boolean = false;
  @Input() interpolation: String;
  @Input() scheme: any;
  @Input() yScaleMin: number;
  @Input() xScaleMin: number;

  public curve: any;
  public showGridLines: Boolean = true;

  constructor() {
  }

  ngOnInit() {
    switch (this.interpolation) {
      case 'smooth':
        this.curve = curveCardinal;
        break;
      case 'binary':
        this.curve = curveStepAfter;
        break;
      default:
        this.curve = curveLinear;
        break;
    }
  }

}
