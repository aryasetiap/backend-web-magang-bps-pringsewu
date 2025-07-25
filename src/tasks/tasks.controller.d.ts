import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { GradeSubmissionDto } from '../submissions/dto/grade-submission.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: any, createTaskDto: CreateTaskDto, file: Express.Multer.File): Promise<{
        id: number;
        deletedAt: Date | null;
        title: string;
        description: string;
        deadline: Date;
        filePath: string | null;
        createdBy: number;
    }>;
    assignTask(id: number, assignTaskDto: AssignTaskDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    submitTask(taskId: number, req: any, file: Express.Multer.File, description: string): Promise<{
        id: number;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.StatusSubmission;
        feedback: string | null;
        userId: number;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        gradedBy: number | null;
        gradedAt: Date | null;
        isLate: boolean;
        taskId: number;
    }>;
    findSubmissionsForTask(taskId: number): Promise<({
        user: {
            name: string;
            namaLengkap: string | null;
        };
    } & {
        id: number;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.StatusSubmission;
        feedback: string | null;
        userId: number;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        gradedBy: number | null;
        gradedAt: Date | null;
        isLate: boolean;
        taskId: number;
    })[]>;
    gradeSubmission(submissionId: number, gradeSubmissionDto: GradeSubmissionDto, req: any): Promise<{
        id: number;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.StatusSubmission;
        feedback: string | null;
        userId: number;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        gradedBy: number | null;
        gradedAt: Date | null;
        isLate: boolean;
        taskId: number;
    }>;
    findMyTasks(req: any): Promise<{
        submission: {
            id: number;
            status: import(".prisma/client").$Enums.StatusSubmission;
            feedback: string | null;
            grade: number | null;
            isLate: boolean;
        } | null;
        fileUrl: string | null;
        submissions: {
            id: number;
            status: import(".prisma/client").$Enums.StatusSubmission;
            feedback: string | null;
            grade: number | null;
            isLate: boolean;
        }[];
        creator: {
            name: string;
        };
        id: number;
        deletedAt: Date | null;
        title: string;
        description: string;
        deadline: Date;
        filePath: string | null;
        createdBy: number;
    }[]>;
    findAll(): Promise<{
        data: {
            fileUrl: string | null;
            id: number;
            title: string;
            description: string;
            deadline: Date;
            filePath: string | null;
            createdBy: number;
        }[];
    }>;
    findOne(id: number, req: any): Promise<{
        fileUrl: string | null;
        id: number;
        deletedAt: Date | null;
        title: string;
        description: string;
        deadline: Date;
        filePath: string | null;
        createdBy: number;
    }>;
    update(id: number, updateTaskDto: UpdateTaskDto): Promise<{
        id: number;
        deletedAt: Date | null;
        title: string;
        description: string;
        deadline: Date;
        filePath: string | null;
        createdBy: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        deletedAt: Date | null;
        title: string;
        description: string;
        deadline: Date;
        filePath: string | null;
        createdBy: number;
    }>;
}
