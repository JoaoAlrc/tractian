import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useAssets } from '../../../../queries/assets';

const RPMBarChart = ({ }) => {
  const { data } = useAssets();
  const rpmData = data?.map(asset => ({
    name: asset.name,
    y: asset.specifications.rpm,
  }));

  const options = {
    chart: {
      type: 'bar',
      height: 300,
    },
    title: {
      text: 'RPM Comparison',
    },
    xAxis: {
      categories: data?.map(asset => asset.name),
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    series: [{
      name: 'RPM',
      data: rpmData,
    }],
    legend: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RPMBarChart;
