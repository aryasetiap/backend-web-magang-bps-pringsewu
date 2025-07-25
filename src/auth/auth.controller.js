"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const update_profile_dto_1 = require("../users/dto/update-profile.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const verify_reset_password_dto_1 = require("./dto/verify-reset-password.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    usersService;
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        const { access_token, user } = await this.authService.login(loginDto);
        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: { name: user.role.name },
            },
        };
    }
    async getProfile(req) {
        const userId = req.user.userId;
        return this.usersService.getProfile(userId);
    }
    async updateProfile(req, updateProfileDto, profilePhoto) {
        const userId = req.user.userId;
        const updatedUser = await this.usersService.updateProfile(userId, updateProfileDto, profilePhoto);
        return {
            message: 'Profil berhasil diperbarui',
            user: updatedUser,
        };
    }
    async changePassword(req, dto) {
        const userId = req.user.userId;
        return this.authService.changePassword(userId, dto.oldPassword, dto.newPassword);
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto.email);
    }
    async verifyResetPassword(dto) {
        return this.authService.verifyResetPassword(dto.email, dto.otp, dto.newPassword);
    }
    async googleAuth(req) { }
    async googleCallback(req, res) {
        try {
            const { user, access_token } = await this.authService.googleLogin(req.user);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            const encodedUser = encodeURIComponent(JSON.stringify(user));
            res.redirect(`${frontendUrl}/auth/callback?token=${access_token}&user=${encodedUser}`);
        }
        catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            res.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent(error.message)}`);
        }
    }
    async verifyOtp(body) {
        const user = await this.authService.verifyOtp(body.email, body.otp);
        return user;
    }
    async resendOtp(body) {
        return this.authService.resendOtp(body.email);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register user baru' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profile user yang sedang login' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update profil user dengan upload foto profil' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Update profile data dengan foto profil (optional)',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                namaLengkap: { type: 'string' },
                nimNisn: { type: 'string' },
                asalInstitusi: { type: 'string' },
                jurusanProdi: { type: 'string' },
                nomorTelepon: { type: 'string' },
                alamat: { type: 'string' },
                profilePhoto: {
                    type: 'string',
                    format: 'binary',
                    description: 'File foto profil (JPG, JPEG, PNG, GIF, max 2MB)',
                },
            },
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePhoto', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/profile-photos',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `profile-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return callback(new common_1.BadRequestException('Hanya file gambar yang diperbolehkan (JPG, JPEG, PNG, GIF)'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    })),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profil berhasil diupdate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'File tidak valid atau terlalu besar',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_reset_password_dto_1.VerifyResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetPassword", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map