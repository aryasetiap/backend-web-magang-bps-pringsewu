import { LogbooksService } from './logbooks.service';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { Response } from 'express';
export declare class LogbooksController {
    private readonly logbooksService;
    constructor(logbooksService: LogbooksService);
    create(req: any, createLogbookDto: CreateLogbookDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }>;
    findAll(req: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }[]>;
    getAllLogbooks(page?: number, limit?: number): Promise<{
        data: {
            user: {
                password: undefined;
                id: number;
                name: string;
                email: string;
                profilePhoto: string | null;
                namaLengkap: string | null;
                nimNisn: string | null;
                asalInstitusi: string | null;
                jurusanProdi: string | null;
                nomorTelepon: string | null;
                alamat: string | null;
                roleId: number;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                educationStatus: string | null;
                activityType: string | null;
                activityStart: Date | null;
                activityEnd: Date | null;
                isGraduated: boolean;
                isEmailVerified: boolean;
                emailOtp: string | null;
                emailOtpExpires: Date | null;
                lastOtpSentAt: Date | null;
                resetPasswordOtp: string | null;
                resetPasswordOtpExpires: Date | null;
            };
            id: number;
            status: import(".prisma/client").$Enums.StatusLogbook;
            userId: number;
            logDate: Date;
            content: string;
        }[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(req: any, id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }>;
    update(req: any, id: number, updateLogbookDto: UpdateLogbookDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }>;
    remove(req: any, id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }>;
    exportUserLogbookReport(userId: number, startDate: string, endDate: string, req: any, res: Response): Promise<void>;
}
