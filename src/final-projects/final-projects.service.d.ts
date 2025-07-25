import { PrismaService } from '../prisma/prisma.service';
import { CreateFinalProjectDto } from './dto/create-final-project.dto';
import { UpdateFinalProjectDto } from './dto/update-final-project.dto';
import { ReviewFinalProjectDto } from './dto/review-final-project.dto';
export declare class FinalProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createFinalProjectDto: CreateFinalProjectDto, file?: Express.Multer.File): Promise<{
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
    findAllForUser(userId: number): Promise<{
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
    findAllForAdmin(page?: number, limit?: number): Promise<{
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
    findOne(id: number, userId?: number): Promise<{
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
    update(id: number, userId: number, updateFinalProjectDto: UpdateFinalProjectDto, file?: Express.Multer.File): Promise<{
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
    review(id: number, reviewerId: number, reviewDto: ReviewFinalProjectDto): Promise<{
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
    remove(id: number, userId: number): Promise<{
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
