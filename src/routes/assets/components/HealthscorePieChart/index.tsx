import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useAssets } from '../../../../queries/assets';

const HealthscorePieChart = () => {
  const { data } = useAssets();
  const healthscoreData = data?.map(asset => ({
    name: asset.name,
    y: asset.healthscore,
  }));

  const options = {
    chart: {
      type: 'pie',
      height: 300,
    },
    tooltip: {
        valueSuffix: '%'
    },
    title: {
      text: 'Healthscore',
    },
    series: [{
      name: 'Healthscore',
      data: healthscoreData,
    }],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HealthscorePieChart;
