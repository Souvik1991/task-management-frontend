export interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    avatar: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
}

export interface DialogData {
    id: number;
    cb: Function;
}

export interface TaskDialogData {
    pid: number;
    tid: number;
    cb: Function;
}

export interface Tasks {
    id: number;
    project: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    asigned_to: {
        id: number;
        first_name: string;
        last_name: string;
    };
    completed: boolean;
    subtasks: Tasks[];
}

export interface ProjectDetails {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    avatar: string;
    tasks: Tasks[]
}