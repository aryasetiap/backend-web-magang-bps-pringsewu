import { InternshipApplicationsService } from './internship-applications.service';
import { CreateInternshipApplicationDto } from './dto/create-internship-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class InternshipApplicationsController {
    private readonly internshipApplicationsService;
    constructor(internshipApplicationsService: InternshipApplicationsService);
    create(files: {
        cv?: Express.Multer.File[];
        transcript?: Express.Multer.File[];
        requestLetter?: Express.Multer.File[];
    }, req: any, createInternshipApplicationDto: CreateInternshipApplicationDto): Promise<{
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
    getMyApplication(req: any): Promise<{
        data: {
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
        }[];
    }>;
    findOne(id: string): Promise<{
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
    updateStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto, req: any): Promise<{
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
}
