import { FinalProjectsService } from './final-projects.service';
import { CreateFinalProjectDto } from './dto/create-final-project.dto';
import { UpdateFinalProjectDto } from './dto/update-final-project.dto';
import { ReviewFinalProjectDto } from './dto/review-final-project.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class FinalProjectsController {
    private readonly finalProjectsService;
    constructor(finalProjectsService: FinalProjectsService);
    create(req: any, createFinalProjectDto: CreateFinalProjectDto, file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusFinalProject;
        feedback: string | null;
        userId: number;
        title: string;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        submittedAt: Date | null;
        reviewedAt: Date | null;
        reviewedById: number | null;
    }>;
    findAllForUser(req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusFinalProject;
        feedback: string | null;
        userId: number;
        title: string;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        submittedAt: Date | null;
        reviewedAt: Date | null;
        reviewedById: number | null;
    }[]>;
    findAllForAdmin(query: PaginationQueryDto): Promise<{
        data: ({
            user: {
                id: number;
                name: string;
                email: string;
                isGraduated: boolean;
            };
            reviewedBy: {
                id: number;
                name: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StatusFinalProject;
            feedback: string | null;
            userId: number;
            title: string;
            description: string | null;
            filePath: string | null;
            grade: number | null;
            submittedAt: Date | null;
            reviewedAt: Date | null;
            reviewedById: number | null;
        })[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: number, req: any): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
        };
        reviewedBy: {
            id: number;
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusFinalProject;
        feedback: string | null;
        userId: number;
        title: string;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        submittedAt: Date | null;
        reviewedAt: Date | null;
        reviewedById: number | null;
    }>;
    update(id: number, req: any, updateFinalProjectDto: UpdateFinalProjectDto, file?: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusFinalProject;
        feedback: string | null;
        userId: number;
        title: string;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        submittedAt: Date | null;
        reviewedAt: Date | null;
        reviewedById: number | null;
    }>;
    review(id: number, req: any, reviewDto: ReviewFinalProjectDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusFinalProject;
        feedback: string | null;
        userId: number;
        title: string;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        submittedAt: Date | null;
        reviewedAt: Date | null;
        reviewedById: number | null;
    }>;
    remove(id: number, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusFinalProject;
        feedback: string | null;
        userId: number;
        title: string;
        description: string | null;
        filePath: string | null;
        grade: number | null;
        submittedAt: Date | null;
        reviewedAt: Date | null;
        reviewedById: number | null;
    }>;
}
