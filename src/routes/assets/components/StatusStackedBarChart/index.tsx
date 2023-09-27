import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useAssets } from '../../../../queries/assets';
import { AssetStatusLegend } from '../../../../queries/assets/types';

const statusColors: Record<string, string> = {
  inOperation: '#73d13d', // Verde
  inDowntime: '#ff4d4f',   // Vermelho
  inAlert: '#ffa940',    // Laranja
  unplannedStop: '#ffec3d', // Amarelo
  plannedStop: '#4096ff',  // Azul
};

const StatusStackedBarChart = () => {
  const { data } = useAssets();

  const uniqueStatuses = Array.from(
    new Set(data?.map(entry => AssetStatusLegend[entry.status]))
  );

  // Extrair todas as entradas de status e ordená-las por data
  const allStatusEntries = data
    ?.flatMap((asset) =>
      asset.healthHistory.map((entry) => ({
        assetName: asset.name,
        x: new Date(entry.timestamp).getTime(),
        status: entry.status,
      }))
    )
    .sort((a, b) => a.x - b.x);

  // Mapear as entradas de status para séries de gráficos
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
      text: 'Comparação de Status de Operação',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      // categories: allStatusEntries?.map((entry) => entry.assetName),
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
