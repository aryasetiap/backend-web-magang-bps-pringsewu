import { PrismaService } from '../prisma/prisma.service';
export declare class SubmissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    resubmit(submissionId: number, userId: number, file: Express.Multer.File, description?: string): Promise<{
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
    submit(taskId: number, userId: number, file: Express.Multer.File, description?: string): Promise<{
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
}
