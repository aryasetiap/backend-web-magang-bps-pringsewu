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
exports.AttendancesController = void 0;
const common_1 = require("@nestjs/common");
const attendances_service_1 = require("./attendances.service");
const clock_in_dto_1 = require("./dto/clock-in.dto");
const clock_out_dto_1 = require("./dto/clock-out.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const request_leave_dto_1 = require("./dto/request-leave.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let AttendancesController = class AttendancesController {
    attendancesService;
    constructor(attendancesService) {
        this.attendancesService = attendancesService;
    }
    clockIn(req, clockInDto, ip) {
        const userId = req.user.userId;
        return this.attendancesService.clockIn(userId, clockInDto, ip);
    }
    async clockOut(clockOutDto, req) {
        const userId = req.user.userId;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const attendance = await this.attendancesService.clockOut(userId, clockOutDto, ipAddress);
        return {
            message: 'Presensi pulang berhasil',
            attendance: {
                ...attendance,
                clockOutCoordinates: {
                    latitude: attendance.clockOutLatitude,
                    longitude: attendance.clockOutLongitude,
                },
            },
        };
    }
    findAll(req) {
        const userId = req.user.userId;
        return this.attendancesService.findAll(userId);
    }
    async getAllAttendances(page = 1, limit = 20) {
        return this.attendancesService.findAllForAdmin(Number(page), Number(limit));
    }
    async exportAllAttendancesPdf(startDate, endDate, institution, res, req) {
        const adminName = req.user?.name || 'Admin';
        const pdfBuffer = await this.attendancesService.exportAllAttendancesPdf({ startDate, endDate, institution }, adminName);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="rekap-presensi.pdf"`,
        });
        res.end(pdfBuffer);
    }
    findOne(id) {
        return this.attendancesService.findOne(+id);
    }
    async requestLeave(req, dto, file) {
        const userId = req.user.userId;
        return this.attendancesService.requestLeave(userId, dto, file);
    }
    async validateLeave(id, status, req) {
        const adminId = req.user.userId;
        return this.attendancesService.validateLeave(+id, status, adminId);
    }
    async exportUserAttendancePdf(userId, startDate, endDate, res, req) {
        const adminName = req.user?.name || 'Admin';
        const pdfBuffer = await this.attendancesService.exportUserAttendancePdf(Number(userId), { startDate, endDate }, adminName);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="presensi-intern-${userId}.pdf"`,
        });
        res.end(pdfBuffer);
    }
};
exports.AttendancesController = AttendancesController;
__decorate([
    (0, common_1.Post)('clock-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Melakukan presensi masuk (clock-in)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, clock_in_dto_1.ClockInDto, String]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Patch)('clock-out'),
    (0, swagger_1.ApiOperation)({ summary: 'Melakukan presensi pulang dengan validasi lokasi' }),
    (0, swagger_1.ApiBody)({ type: clock_out_dto_1.ClockOutDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Presensi pulang berhasil',
        schema: {
            example: {
                message: 'Presensi pulang berhasil',
                attendance: {
                    id: 1,
                    clockIn: '2025-01-15T08:00:00Z',
                    clockOut: '2025-01-15T17:00:00Z',
                    latitude: -5.235,
                    longitude: 105.1572,
                    userId: 1,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Lokasi tidak valid',
        schema: {
            example: {
                statusCode: 403,
                message: 'Anda harus berada dalam radius 50 meter dari kantor. Jarak Anda: 120 meter.',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tidak ada data presensi masuk',
        schema: {
            example: {
                statusCode: 404,
                message: 'Tidak ditemukan data presensi masuk untuk hari ini. Silakan clock-in terlebih dahulu.',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clock_out_dto_1.ClockOutDto, Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Melihat riwayat presensi sendiri' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Melihat seluruh data presensi (admin)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "getAllAttendances", null);
__decorate([
    (0, common_1.Get)('report'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Export rekap presensi semua intern ke PDF' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('institution')),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "exportAllAttendancesPdf", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Melihat detail presensi berdasarkan ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('request-leave'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('proof', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/proofs',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
            if (allowed.includes((0, path_1.extname)(file.originalname).toLowerCase())) {
                cb(null, true);
            }
            else {
                cb(new Error('File harus JPG, PNG, atau PDF'), false);
            }
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Mengajukan permohonan cuti/izin' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_leave_dto_1.RequestLeaveDto, Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "requestLeave", null);
__decorate([
    (0, common_1.Patch)(':id/validate'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Validasi permohonan cuti/izin (admin/staff)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "validateLeave", null);
__decorate([
    (0, common_1.Get)(':userId/report'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Export presensi satu intern ke PDF' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "exportUserAttendancePdf", null);
exports.AttendancesController = AttendancesController = __decorate([
    (0, swagger_1.ApiTags)('attendances'),
    (0, common_1.Controller)('attendances'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [attendances_service_1.AttendancesService])
], AttendancesController);
//# sourceMappingURL=attendances.controller.js.map