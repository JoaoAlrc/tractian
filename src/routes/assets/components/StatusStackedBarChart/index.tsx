import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useAssets } from '../../../../queries/assets';
import { AssetStatusLegend } from '../../../../queries/assets/types';

const statusColors: Record<string, string> = {
  inOperation: '#73d13d',
  inDowntime: '#ff4d4f',
  inAlert: '#ffa940',
  unplannedStop: '#ffec3d',
  plannedStop: '#4096ff',
};

const StatusStackedBarChart = () => {
  const { data } = useAssets();

  const uniqueStatuses = Array.from(
    new Set(data?.map(entry => AssetStatusLegend[entry.status]))
  );


  const allStatusEntries = data
    ?.flatMap((asset) =>
      asset.healthHistory.map((entry) => ({
        assetName: asset.name,
        x: new Date(entry.timestamp).getTime(),
        status: entry.status,
      }))
    )
    .sort((a, b) => a.x - b.x);


  const series = data?.map((asset) => ({
    name: asset.name,
    data: allStatusEntries?.filter((entry) => entry.assetName === asset.name)
      .map((entry) => ({
        x: entry.x,
        y: 1,
        status: entry.status,
        color: statusColors[entry.status],
      })),
  }));

  const options = {
    chart: {
      type: 'bar',
      height: 300,
    },
    title: {
      text: 'Health History',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          formatter: function () {
            const statusIndex = Math.round((this as any).y);
            if (statusIndex >= 0 && statusIndex < uniqueStatuses.length) {
              return uniqueStatuses[statusIndex];
            }
            return '';
          },
        },
      },
    },
    series: series,
    legend: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default StatusStackedBarChart;
