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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { name, email, password } = registerDto;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const defaultRole = await this.prisma.role.findUnique({
            where: { name: 'Intern' },
        });
        if (!defaultRole) {
            throw new common_1.InternalServerErrorException("Role default 'Intern' tidak ditemukan.");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        try {
            const newUser = await this.prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    roleId: defaultRole.id,
                    isEmailVerified: false,
                    emailOtp: otp,
                    emailOtpExpires: otpExpires,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            try {
                await this.sendOtpEmail(email, otp);
            }
            catch (mailErr) {
                await this.prisma.user.delete({ where: { email } });
                throw new common_1.InternalServerErrorException('Gagal mengirim email OTP. Silakan coba lagi.');
            }
            return {
                message: 'Registrasi berhasil. Silakan verifikasi email Anda.',
                user: newUser,
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Email sudah terdaftar.');
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Email belum diverifikasi. Silakan cek email Anda.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role.name,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: { name: user.role.name },
            },
        };
    }
    async googleLogin(googleUser) {
        if (!googleUser) {
            throw new common_1.UnauthorizedException('No user from google');
        }
        const user = await this.validateGoogleUser(googleUser);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role.name,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: {
                    name: user.role.name,
                },
            },
            access_token,
        };
    }
    async validateGoogleUser(googleUser) {
        const { email, firstName, lastName } = googleUser;
        let user = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            const defaultRole = await this.prisma.role.findUnique({
                where: { name: 'Intern' },
            });
            if (!defaultRole) {
                throw new common_1.InternalServerErrorException("Role default 'Intern' tidak ditemukan.");
            }
            const randomPassword = crypto.randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            user = await this.prisma.user.create({
                data: {
                    email,
                    name: `${firstName} ${lastName}`,
                    password: hashedPassword,
                    roleId: defaultRole.id,
                },
                include: { role: true },
            });
        }
        return user;
    }
    generateJwt(user) {
        const payload = {
            sub: user.userId,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Password lama salah');
        if (oldPassword === newPassword)
            throw new common_1.UnauthorizedException('Password baru tidak boleh sama dengan password lama');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Password berhasil diubah' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Email tidak ditemukan');
        if (user.resetPasswordOtpExpires && user.resetPasswordOtpExpires > new Date()) {
            throw new common_1.UnauthorizedException('OTP reset password masih aktif, cek email Anda.');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.user.update({
            where: { email },
            data: { resetPasswordOtp: otp, resetPasswordOtpExpires: otpExpires },
        });
        await this.sendOtpEmail(email, otp, true);
        return { message: 'OTP reset password telah dikirim ke email Anda.' };
    }
    async verifyResetPassword(email, otp, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires)
            throw new common_1.UnauthorizedException('OTP tidak ditemukan');
        if (user.resetPasswordOtp !== otp)
            throw new common_1.UnauthorizedException('OTP salah');
        if (user.resetPasswordOtpExpires < new Date())
            throw new common_1.UnauthorizedException('OTP kadaluarsa');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetPasswordOtp: null,
                resetPasswordOtpExpires: null,
            },
        });
        return { message: 'Password berhasil direset. Silakan login dengan password baru.' };
    }
    async sendOtpEmail(email, otp, isReset = false) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const subject = isReset
            ? '🔒 Permintaan Reset Password - Kode OTP Magang BPS Kab. Pringsewu'
            : '🔑 Verifikasi Email Anda - Kode OTP Magang BPS Kab. Pringsewu';
        const text = isReset
            ? `Halo!\n\nAnda meminta reset password akun Magang BPS Kab. Pringsewu.\nKode OTP Anda: ${otp}\n\nJangan bagikan kode ini kepada siapapun.\n\nSalam,\nMagang BPS Kab. Pringsewu\n\n© Arya Setia Pratama & Divany Pangestika | Universitas Lampung 2025`
            : `Halo!\n\nTerima kasih telah mendaftar di Magang BPS Kab. Pringsewu.\nKode OTP verifikasi email Anda: ${otp}\n\nJangan bagikan kode ini kepada siapapun.\n\nSalam,\nMagang BPS Kab. Pringsewu\n\n© Arya Setia Pratama & Divany Pangestika | Universitas Lampung 2025`;
        const html = isReset
            ? `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #eee;padding:24px;">
          <h2 style="color:#1976d2;">Permintaan Reset Password</h2>
          <p>Halo!</p>
          <p>Anda meminta reset password akun <b>Magang BPS Kab. Pringsewu</b>.</p>
          <p style="font-size:18px;">Kode OTP Anda:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#1976d2;margin:16px 0;">${otp}</div>
          <p>Jangan bagikan kode ini kepada siapapun. Kode berlaku selama 10 menit.</p>
          <br>
          <p>Salam,<br>Magang BPS Kab. Pringsewu</p>
          <hr>
          <small style="color:#888;">&copy; Arya Setia Pratama &amp; Divany Pangestika | Universitas Lampung 2025</small>
        </div>
      `
            : `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #eee;padding:24px;">
          <h2 style="color:#1976d2;">Verifikasi Email Anda</h2>
          <p>Halo!</p>
          <p>Terima kasih telah mendaftar di <b>Magang BPS Kab. Pringsewu</b>.</p>
          <p style="font-size:18px;">Kode OTP verifikasi email Anda:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#1976d2;margin:16px 0;">${otp}</div>
          <p>Jangan bagikan kode ini kepada siapapun. Kode berlaku selama 10 menit.</p>
          <br>
          <p>Salam,<br>Magang BPS Kab. Pringsewu</p>
          <hr>
          <small style="color:#888;">&copy; Arya Setia Pratama &amp; Divany Pangestika | Universitas Lampung 2025</small>
        </div>
      `;
        await transporter.sendMail({
            from: '"Magang BPS Kab. Pringsewu" <noreply@bps.go.id>',
            to: email,
            subject,
            text,
            html,
        });
    }
    async verifyOtp(email, otp) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        if (user.isEmailVerified)
            return { message: 'Email sudah diverifikasi' };
        if (!user.emailOtp || !user.emailOtpExpires)
            throw new common_1.UnauthorizedException('OTP tidak ditemukan');
        if (user.emailOtp !== otp)
            throw new common_1.UnauthorizedException('OTP salah');
        if (user.emailOtpExpires < new Date())
            throw new common_1.UnauthorizedException('OTP kadaluarsa');
        await this.prisma.user.update({
            where: { email },
            data: {
                isEmailVerified: true,
                emailOtp: null,
                emailOtpExpires: null,
            },
        });
        return { message: 'Email berhasil diverifikasi' };
    }
    async resendOtp(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        if (user.isEmailVerified)
            return { message: 'Email sudah diverifikasi' };
        if (user.emailOtp && user.emailOtpExpires && user.emailOtpExpires > new Date()) {
            throw new common_1.UnauthorizedException('OTP masih aktif, silakan cek email Anda.');
        }
        const now = new Date();
        if (user.lastOtpSentAt) {
            const diff = (now.getTime() - new Date(user.lastOtpSentAt).getTime()) / (1000 * 60 * 60);
            if (diff < 1) {
                throw new common_1.UnauthorizedException('Anda hanya dapat meminta OTP sekali per jam.');
            }
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.user.update({
            where: { email },
            data: { emailOtp: otp, emailOtpExpires: otpExpires, lastOtpSentAt: now },
        });
        await this.sendOtpEmail(email, otp);
        return { message: 'OTP baru telah dikirim ke email Anda.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map