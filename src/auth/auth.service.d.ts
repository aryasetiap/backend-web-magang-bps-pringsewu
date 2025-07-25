import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    googleLogin(googleUser: any): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            role: {
                name: string;
            };
        };
        access_token: string;
    }>;
    validateGoogleUser(googleUser: any): Promise<{
        role: {
            id: number;
            name: string;
        };
    } & {
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
    generateJwt(user: {
        userId: number;
        email: string;
        role: string;
    }): string;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    verifyResetPassword(email: string, otp: string, newPassword: string): Promise<{
        message: string;
    }>;
    sendOtpEmail(email: string, otp: string, isReset?: boolean): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<{
        message: string;
    }>;
    resendOtp(email: string): Promise<{
        message: string;
    }>;
}
