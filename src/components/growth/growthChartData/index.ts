import GrowthChartBoys0_2 from './GrowthChartDataBoys0-2.json';
import GrowthChartBoys2_5 from './GrowthChartDataBoys2-5.json';
import GrowthChartGirls0_2 from './GrowthChartDataGirls0-2.json';
import GrowthChartGirls2_5 from './GrowthChartDataGirls2-5.json';
import Height_age_girls0_5 from './height-ageGirls0-5.json';
import Height_age_boys0_5 from './height-ageBoys0-5.json';

export type GrowthChart0_2Type = typeof GrowthChartBoys0_2;
export type GrowthChartHeightAgeType = typeof Height_age_boys0_5;

export const ChartData = {
    GrowthChartBoys0_2,
    GrowthChartBoys2_5,
    GrowthChartGirls0_2,
    GrowthChartGirls2_5,
    Height_age_girls0_5,
    Height_age_boys0_5
}
