export enum AssetStatus {
    InOperation = "inOperation",
    InDowntime = "inDowntime",
    InAlert = "inAlert",
    UnplannedStop = "unplannedStop",
    PlannedStop = "plannedStop",
}

export enum AssetStatusLegend {
    inOperation = "In Operation",
    inDowntime = "In Downtime",
    inAlert = "In Alert",
    unplannedStop = "Unplanned Stop",
    plannedStop = "Planned Stop",
}

export interface HealthMetric {
    status: AssetStatus;
    timestamp: string;
}

export interface AssetSpecifications {
    maxTemp: number;
    power?: number;
    rpm?: number;
}

export interface Asset {
    assignedUserIds: number[];
    companyId: number;
    healthHistory: HealthMetric[];
    healthscore: number;
    id: number;
    image: string;
    metrics: {
        lastUptimeAt: Date;
        totalCollectsUptime: number;
        totalUptime: number;
    };
    model: string;
    name: string;
    sensors: string[];
    specifications: AssetSpecifications;
    status: AssetStatus;
    unitId: number;
}

