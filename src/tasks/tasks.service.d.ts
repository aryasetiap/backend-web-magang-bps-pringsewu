import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { GradeSubmissionDto } from '../submissions/dto/grade-submission.dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(creatorId: number, createTaskDto: CreateTaskDto, file?: Express.Multer.File): Promise<{
        id: number;
        deletedAt: Date | null;
        title: string;
        description: string;
        deadline: Date;
        filePath: string | null;
        createdBy: number;
    }>;
    assignTask(taskId: number, assignTaskDto: AssignTaskDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    submitTask(userId: number, taskId: number, file?: Express.Multer.File, description?: string): Promise<{
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
    gradeSubmission(submissionId: number, gradeSubmissionDto: GradeSubmissionDto, graderId: number): Promise<{
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
    findTasksForUser(userId: number, page?: number, limit?: number): Promise<{
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
    findOne(id: number): Promise<{
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
    isUserAssignedToTask(taskId: number, userId: number): Promise<boolean>;
}
