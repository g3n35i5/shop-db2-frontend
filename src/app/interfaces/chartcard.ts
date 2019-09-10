export interface ChartCard {
  title: String;
  type: String;
  xAxisLabel?: String;
  yAxisLabel?: String;
  yScaleMin?: number;
  xScaleMin?: number;
  showXAxisLabel?: Boolean;
  showYAxisLabel?: Boolean;
  data: any[];
  interpolation?: String;
}
