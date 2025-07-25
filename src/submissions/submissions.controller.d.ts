import { SubmissionsService } from './submissions.service';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    resubmit(id: number, file: Express.Multer.File, description: string, req: any): Promise<{
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
