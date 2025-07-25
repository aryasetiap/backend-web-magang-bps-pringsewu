import { CreateInternshipApplicationDto } from './dto/create-internship-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class InternshipApplicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    private deleteUploadedFiles;
    create(userId: number, createInternshipApplicationDto: CreateInternshipApplicationDto, files: {
        cv?: Express.Multer.File[];
        transcript?: Express.Multer.File[];
        requestLetter?: Express.Multer.File[];
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusInternship;
        cvPath: string | null;
        transcriptPath: string;
        requestLetterPath: string;
        verifiedAt: Date | null;
        feedback: string | null;
        startDate: Date | null;
        endDate: Date | null;
        userId: number;
        verifiedBy: number | null;
    }>;
    findAll(paginationQuery: PaginationQueryDto): Promise<{
        data: ({
            applicant: {
                role: {
                    name: string;
                };
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
                educationStatus: string | null;
                activityType: string | null;
                activityStart: Date | null;
                activityEnd: Date | null;
                isGraduated: boolean;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StatusInternship;
            cvPath: string | null;
            transcriptPath: string;
            requestLetterPath: string;
            verifiedAt: Date | null;
            feedback: string | null;
            startDate: Date | null;
            endDate: Date | null;
            userId: number;
            verifiedBy: number | null;
        })[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        cvUrl: string | null;
        transcriptUrl: string;
        requestLetterUrl: string;
        applicant: {
            role: {
                name: string;
            };
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
            educationStatus: string | null;
            activityType: string | null;
            activityStart: Date | null;
            activityEnd: Date | null;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusInternship;
        cvPath: string | null;
        transcriptPath: string;
        requestLetterPath: string;
        verifiedAt: Date | null;
        feedback: string | null;
        startDate: Date | null;
        endDate: Date | null;
        userId: number;
        verifiedBy: number | null;
    }>;
    updateStatus(id: number, adminId: number, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusInternship;
        cvPath: string | null;
        transcriptPath: string;
        requestLetterPath: string;
        verifiedAt: Date | null;
        feedback: string | null;
        startDate: Date | null;
        endDate: Date | null;
        userId: number;
        verifiedBy: number | null;
    }>;
    findByUser(userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusInternship;
        cvPath: string | null;
        transcriptPath: string;
        requestLetterPath: string;
        verifiedAt: Date | null;
        feedback: string | null;
        startDate: Date | null;
        endDate: Date | null;
        userId: number;
        verifiedBy: number | null;
    }[]>;
    private validateFiles;
    private validateInternshipPeriod;
}
