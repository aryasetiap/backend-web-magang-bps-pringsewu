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
var AttendancesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendancesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const PdfPrinter = require('pdfmake');
const fs = require("fs");
const path = require("path");
let AttendancesService = AttendancesService_1 = class AttendancesService {
    prisma;
    configService;
    logger = new common_1.Logger(AttendancesService_1.name);
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    get officeLatitude() {
        const latitude = this.configService.get('OFFICE_LATITUDE');
        if (!latitude) {
            throw new Error('OFFICE_LATITUDE not configured in environment variables');
        }
        return parseFloat(latitude);
    }
    get officeLongitude() {
        const longitude = this.configService.get('OFFICE_LONGITUDE');
        if (!longitude) {
            throw new Error('OFFICE_LONGITUDE not configured in environment variables');
        }
        return parseFloat(longitude);
    }
    get allowedRadiusMeters() {
        const radius = this.configService.get('OFFICE_RADIUS_METERS');
        if (!radius) {
            throw new Error('OFFICE_RADIUS_METERS not configured in environment variables');
        }
        return parseInt(radius);
    }
    async clockIn(userId, clockInDto, ip) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const existingAttendance = await this.prisma.attendance.findFirst({
            where: {
                userId,
                clockIn: { gte: today, lt: tomorrow },
            },
        });
        if (existingAttendance) {
            throw new common_1.ConflictException('Anda sudah melakukan presensi masuk hari ini.');
        }
        const officeLat = this.officeLatitude;
        const officeLon = this.officeLongitude;
        const officeRadius = this.allowedRadiusMeters;
        if (!officeLat || !officeLon || !officeRadius) {
            throw new common_1.InternalServerErrorException('Konfigurasi lokasi kantor tidak ditemukan.');
        }
        const distance = this.calculateDistance(clockInDto.latitude, clockInDto.longitude, officeLat, officeLon);
        if (distance > officeRadius) {
            throw new common_1.ForbiddenException(`Anda harus berada dalam radius ${officeRadius} meter dari kantor. Jarak Anda: ${Math.round(distance)} meter.`);
        }
        return this.prisma.attendance.create({
            data: {
                userId,
                ipAddress: ip,
                latitude: clockInDto.latitude,
                longitude: clockInDto.longitude,
                clockIn: new Date(),
                status: 'hadir',
            },
        });
    }
    async clockOut(userId, clockOutDto, ipAddress) {
        this.validateLocation(clockOutDto.latitude, clockOutDto.longitude);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const attendance = await this.prisma.attendance.findFirst({
            where: {
                userId,
                clockIn: { gte: today, lt: tomorrow },
                clockOut: null,
            },
        });
        if (!attendance) {
            throw new common_1.NotFoundException('Tidak ditemukan data presensi masuk untuk hari ini. Silakan clock-in terlebih dahulu.');
        }
        return this.prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                clockOut: new Date(),
                clockOutLatitude: clockOutDto.latitude,
                clockOutLongitude: clockOutDto.longitude,
            },
        });
    }
    async findAllForAdmin(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.attendance.findMany({
                skip,
                take: limit,
                orderBy: { clockIn: 'desc' },
                include: { user: true },
            }),
            this.prisma.attendance.count(),
        ]);
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async findAll(userId) {
        const attendances = await this.prisma.attendance.findMany({
            where: { userId },
            orderBy: { clockIn: 'desc' },
        });
        return { data: attendances };
    }
    async findOne(id) {
        if (!id || typeof id !== 'number' || isNaN(id)) {
            throw new common_1.BadRequestException('ID presensi tidak valid');
        }
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
        });
        if (!attendance)
            throw new common_1.NotFoundException('Attendance tidak ditemukan');
        return attendance;
    }
    validateLocation(latitude, longitude) {
        const distance = this.calculateDistance(latitude, longitude, this.officeLatitude, this.officeLongitude);
        if (distance > this.allowedRadiusMeters) {
            throw new common_1.ForbiddenException(`Anda harus berada dalam radius ${this.allowedRadiusMeters} meter dari kantor. Jarak Anda: ${Math.round(distance)} meter.`);
        }
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    async requestLeave(userId, dto, file) {
        const now = new Date();
        const wibHour = (now.getUTCHours() + 7) % 24;
        if (wibHour >= 11) {
            throw new common_1.BadRequestException('Pengajuan hanya bisa dilakukan sebelum pukul 11.00 WIB');
        }
        if (!file) {
            throw new common_1.BadRequestException('Bukti pendukung wajib diunggah');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const existing = await this.prisma.attendance.findFirst({
            where: {
                userId,
                createdAt: { gte: today, lt: tomorrow },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Anda sudah mengajukan presensi hari ini');
        }
        return this.prisma.attendance.create({
            data: {
                userId,
                status: dto.type,
                reasonDescription: dto.description,
                proofFilePath: file.path,
                submittedAt: now,
            },
        });
    }
    async validateLeave(attendanceId, status, adminId) {
        if (!Object.values(client_1.AttendanceStatus).includes(status)) {
            throw new common_1.BadRequestException('Status tidak valid');
        }
        return this.prisma.attendance.update({
            where: { id: attendanceId },
            data: {
                status,
                validatedBy: adminId,
                validatedAt: new Date(),
            },
        });
    }
    async setTanpaKeteranganForAbsentUsers() {
        this.logger.log('Menjalankan update status tanpa_keterangan jam 16:31 WIB...');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const interns = await this.prisma.user.findMany({
            where: {
                role: { name: 'intern' },
                internshipApplications: {
                    some: {
                        startDate: { lte: today },
                        endDate: { gte: today },
                        status: 'diterima',
                    },
                },
            },
            select: { id: true },
        });
        for (const intern of interns) {
            const attendance = await this.prisma.attendance.findFirst({
                where: {
                    userId: intern.id,
                    createdAt: { gte: today, lt: tomorrow },
                },
            });
            if (!attendance) {
                await this.prisma.attendance.create({
                    data: {
                        userId: intern.id,
                        status: 'tanpa_keterangan',
                        reasonDescription: 'Tidak melakukan presensi atau pengajuan izin/sakit sebelum 16:30 WIB',
                        createdAt: new Date(),
                    },
                });
                this.logger.log(`Set tanpa_keterangan untuk userId ${intern.id}`);
            }
        }
    }
    async exportAllAttendancesPdf(filter, adminName) {
        const where = {};
        if (filter.startDate && filter.endDate) {
            const start = new Date(filter.startDate);
            const end = new Date(filter.endDate);
            where.OR = [
                { clockIn: { gte: start, lte: end } },
                { submittedAt: { gte: start, lte: end } },
                { createdAt: { gte: start, lte: end } },
            ];
        }
        const attendances = await this.prisma.attendance.findMany({
            where: {
                ...where,
                user: filter.institution
                    ? { asalInstitusi: filter.institution }
                    : undefined,
            },
            include: { user: true },
            orderBy: [{ user: { name: 'asc' } }, { clockIn: 'asc' }],
        });
        const headerImagePath = path.resolve(process.cwd(), 'src/assets/header_report/header_report.png');
        const headerImageBase64 = fs.existsSync(headerImagePath)
            ? fs.readFileSync(headerImagePath).toString('base64')
            : null;
        const tableBody = [
            [
                'No',
                'Nama Intern',
                'Institusi',
                'Tanggal',
                'Status',
                'Clock In',
                'Clock Out',
                'Keterangan',
            ],
            ...attendances.map((a, i) => [
                i + 1,
                a.user?.name || '-',
                a.user?.asalInstitusi || '-',
                a.clockIn
                    ? new Date(a.clockIn).toLocaleDateString('id-ID')
                    : a.submittedAt
                        ? new Date(a.submittedAt).toLocaleDateString('id-ID')
                        : a.createdAt
                            ? new Date(a.createdAt).toLocaleDateString('id-ID')
                            : '-',
                a.status,
                a.clockIn ? new Date(a.clockIn).toLocaleTimeString('id-ID') : '-',
                a.clockOut ? new Date(a.clockOut).toLocaleTimeString('id-ID') : '-',
                a.reasonDescription || '-',
            ]),
        ];
        const statusSummary = {};
        for (const a of attendances) {
            statusSummary[a.status] = (statusSummary[a.status] || 0) + 1;
        }
        const statusTableBody = [
            ['Status', 'Jumlah'],
            ...Object.entries(statusSummary).map(([status, count]) => [
                status,
                count,
            ]),
        ];
        const content = [
            { text: 'Rekap Presensi Semua Intern', style: 'header' },
            {
                text: `Periode: ${filter.startDate || '-'} s/d ${filter.endDate || '-'}`,
            },
            { text: `Institusi: ${filter.institution || 'Semua'}` },
            {
                text: `Dicetak oleh: ${adminName} | Tanggal: ${new Date().toLocaleString('id-ID')}`,
                margin: [0, 0, 0, 20],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', '*', 'auto', 'auto', 'auto', 'auto', '*'],
                    body: tableBody,
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 32],
            },
            {
                text: 'Rekapitulasi Status Presensi:',
                style: { bold: true, margin: [0, 20, 0, 4] },
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: statusTableBody,
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 0],
            },
        ];
        const docDefinition = {
            header: (currentPage, pageCount, pageSize) => {
                if (headerImageBase64) {
                    return {
                        image: `data:image/png;base64,${headerImageBase64}`,
                        fit: [pageSize.width - 80, 80],
                        alignment: 'center',
                        margin: [0, 20, 0, 10],
                    };
                }
                return null;
            },
            content: content,
            pageMargins: [40, 120, 40, 60],
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 10],
                    alignment: 'center',
                },
            },
            defaultStyle: { font: 'Helvetica' },
        };
        const fonts = {
            Helvetica: {
                normal: 'src/assets/fonts/Helvetica-Regular.ttf',
                bold: 'src/assets/fonts/Helvetica-Bold.ttf',
                italics: 'src/assets/fonts/Helvetica-Oblique.ttf',
                bolditalics: 'src/assets/fonts/Helvetica-BoldOblique.ttf',
            },
        };
        const printer = new PdfPrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        return new Promise((resolve, reject) => {
            pdfDoc.on('data', (chunk) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        });
    }
    async exportUserAttendancePdf(userId, filter, adminName) {
        const where = { userId };
        if (filter.startDate && filter.endDate) {
            const start = new Date(filter.startDate);
            const end = new Date(filter.endDate);
            where.OR = [
                { clockIn: { gte: start, lte: end } },
                { submittedAt: { gte: start, lte: end } },
                { createdAt: { gte: start, lte: end } },
            ];
        }
        const attendances = await this.prisma.attendance.findMany({
            where,
            orderBy: [{ clockIn: 'asc' }],
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const headerImagePath = path.resolve(process.cwd(), 'src/assets/header_report/header_report.png');
        const headerImageBase64 = fs.existsSync(headerImagePath)
            ? fs.readFileSync(headerImagePath).toString('base64')
            : null;
        const tableBody = [
            ['No', 'Tanggal', 'Status', 'Clock In', 'Clock Out', 'Keterangan'],
            ...attendances.map((a, i) => [
                i + 1,
                a.clockIn
                    ? new Date(a.clockIn).toLocaleDateString('id-ID')
                    : a.submittedAt
                        ? new Date(a.submittedAt).toLocaleDateString('id-ID')
                        : a.createdAt
                            ? new Date(a.createdAt).toLocaleDateString('id-ID')
                            : '-',
                a.status,
                a.clockIn ? new Date(a.clockIn).toLocaleTimeString('id-ID') : '-',
                a.clockOut ? new Date(a.clockOut).toLocaleTimeString('id-ID') : '-',
                a.reasonDescription || '-',
            ]),
        ];
        const statusSummary = {};
        for (const a of attendances) {
            statusSummary[a.status] = (statusSummary[a.status] || 0) + 1;
        }
        const statusTableBody = [
            ['Status', 'Jumlah'],
            ...Object.entries(statusSummary).map(([status, count]) => [
                status,
                count,
            ]),
        ];
        const content = [
            {
                text: `Rekap Presensi Intern: ${user?.name || '-'}`,
                style: 'header',
            },
            { text: `Institusi: ${user?.asalInstitusi || '-'}`, alignment: 'center' },
            {
                text: `Periode: ${filter.startDate || '-'} s/d ${filter.endDate || '-'}`,
                alignment: 'center',
            },
            {
                text: `Dicetak oleh: ${adminName} | Tanggal: ${new Date().toLocaleString('id-ID')}`,
                margin: [0, 0, 0, 20],
                alignment: 'center',
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*'],
                    body: tableBody,
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 32],
            },
            {
                text: 'Rekapitulasi Status Presensi:',
                style: { bold: true, margin: [0, 20, 0, 4] },
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: statusTableBody,
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 0],
            },
        ];
        const docDefinition = {
            header: (currentPage, pageCount, pageSize) => {
                if (headerImageBase64) {
                    return {
                        image: `data:image/png;base64,${headerImageBase64}`,
                        fit: [pageSize.width - 80, 80],
                        alignment: 'center',
                        margin: [0, 20, 0, 10],
                    };
                }
                return null;
            },
            content: content,
            pageMargins: [40, 120, 40, 60],
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 10],
                    alignment: 'center',
                },
            },
            defaultStyle: { font: 'Helvetica' },
        };
        const fonts = {
            Helvetica: {
                normal: 'src/assets/fonts/Helvetica-Regular.ttf',
                bold: 'src/assets/fonts/Helvetica-Bold.ttf',
                italics: 'src/assets/fonts/Helvetica-Oblique.ttf',
                bolditalics: 'src/assets/fonts/Helvetica-BoldOblique.ttf',
            },
        };
        const printer = new PdfPrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        return new Promise((resolve, reject) => {
            pdfDoc.on('data', (chunk) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        });
    }
};
exports.AttendancesService = AttendancesService;
__decorate([
    (0, schedule_1.Cron)('31 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendancesService.prototype, "setTanpaKeteranganForAbsentUsers", null);
exports.AttendancesService = AttendancesService = AttendancesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AttendancesService);
//# sourceMappingURL=attendances.service.js.map