export interface WorkordersChecklist {
    completed: boolean;
    task: string;
};

export interface Workorders {
    id: number;
    assetId: number;
    assignedUserIds: number[];
    checklist: WorkordersChecklist[];
    description: string;
    priority: string;
    status: string;
    title: string;
}

