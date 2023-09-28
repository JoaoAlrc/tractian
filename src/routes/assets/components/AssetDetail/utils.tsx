import { RecordTable } from "../EditableTable";
import { Asset } from "../../../../queries/assets/types";

export const tableData = (asset: Asset) => ([
    {
        key: 'healthscore',
        label: 'Healthscore (%)',
        value: asset.healthscore,
        keyName: 'healthscore',
    },
    {
        key: 'maxTemp',
        label: 'Max Temp (°C)',
        value: asset.specifications.maxTemp,
        keyName: 'specifications.maxTemp',
    },
    {
        key: 'power',
        label: 'Power (kWh)',
        value: asset.specifications.power,
        keyName: 'specifications.power',
    },
    {
        key: 'rpm',
        label: 'RPM',
        value: asset.specifications.rpm || 'N/A',
        keyName: 'specifications.rpm',
    },
    {
        key: 'totalCollectsUptime',
        label: 'Total Collects Uptime',
        value: asset.metrics.totalCollectsUptime,
        keyName: 'metrics.totalCollectsUptime',
    },
    {
        key: 'totalUptime',
        label: 'Total Uptime (Hours)',
        value: asset.metrics.totalUptime,
        keyName: 'metrics.totalUptime',
    },
] as RecordTable[]);
