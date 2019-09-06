export interface ChartCard {
  title: String;
  type: String;
  xAxisLabel?: String;
  yAxisLabel?: String;
  showXAxisLabel?: Boolean;
  showYAxisLabel?: Boolean;
  data: any[];
  interpolation?: String;
}
