import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useAssets } from '../../../../queries/assets';

const MaxTempBarChart = () => {
  const { data } = useAssets();
  const maxTempData = data?.map(asset => ({
    name: asset.name,
    y: asset.specifications.maxTemp,
  }));

  const options = {
    chart: {
      type: 'bar',
      height: 300,
    },
    title: {
      text: 'Comparação de Temperatura Máxima (°C)',
    },
    xAxis: {
      categories: data?.map(asset => asset.name),
    },
    tooltip: {
        valueSuffix: '°C'
    },
    yAxis: {
      title: {
        text: 'Max Temp (°C)',
      },
    },
    series: [{
      name: 'Max Temp',
      data: maxTempData,
    }],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default MaxTempBarChart;
