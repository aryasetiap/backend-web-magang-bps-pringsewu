import { Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetPasswordDto } from './dto/verify-reset-password.dto';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            role: {
                name: string;
            };
            id: number;
            name: string;
            email: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: {
                name: string;
            };
        };
    }>;
    getProfile(req: any): Promise<{
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
        createdAt: Date;
        educationStatus: string | null;
        activityType: string | null;
        activityStart: Date | null;
        activityEnd: Date | null;
        isGraduated: boolean;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto, profilePhoto?: Express.Multer.File): Promise<{
        message: string;
        user: {
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
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyResetPassword(dto: VerifyResetPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(req: any): Promise<void>;
    googleCallback(req: any, res: Response): Promise<void>;
    verifyOtp(body: {
        email: string;
        otp: string;
    }): Promise<{
        message: string;
    }>;
    resendOtp(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
}
