import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class LogbooksService {
    private prisma;
    constructor(prisma: PrismaService);
    private verifyOwnership;
    create(userId: number, createLogbookDto: CreateLogbookDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }>;
    findAll(userId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }[]>;
    findOne(userId: number, id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }>;
    update(userId: number, id: number, updateLogbookDto: UpdateLogbookDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }>;
    remove(userId: number, id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusLogbook;
        userId: number;
        logDate: Date;
        content: string;
    }>;
    findAllForAdmin(page?: number, limit?: number): Promise<{
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
    exportUserLogbookReport(userId: number, filter: {
        startDate?: string;
        endDate?: string;
    }, adminName: string): Promise<Buffer>;
}
