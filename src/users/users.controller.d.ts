import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
    }>;
    findAll(paginationQuery: PaginationQueryDto): Promise<{
        data: {
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
        }[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
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
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto, profilePhoto?: Express.Multer.File): Promise<{
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
    }>;
}
