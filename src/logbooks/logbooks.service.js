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
exports.LogbooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs");
const path = require("path");
let LogbooksService = class LogbooksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyOwnership(userId, logbookId) {
        const logbook = await this.prisma.logbook.findUnique({
            where: { id: logbookId },
        });
        if (!logbook) {
            throw new common_1.NotFoundException(`Logbook dengan ID ${logbookId} tidak ditemukan.`);
        }
        if (logbook.userId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki izin untuk mengakses logbook ini.');
        }
        return logbook;
    }
    async create(userId, createLogbookDto) {
        const existing = await this.prisma.logbook.findFirst({
            where: {
                userId: userId,
                logDate: new Date(createLogbookDto.logDate),
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Anda sudah mengisi logbook untuk tanggal ini.');
        }
        return this.prisma.logbook.create({
            data: {
                userId: userId,
                logDate: new Date(createLogbookDto.logDate),
                content: createLogbookDto.content,
            },
        });
    }
    findAll(userId) {
        return this.prisma.logbook.findMany({
            where: { userId: userId },
            orderBy: { logDate: 'desc' },
        });
    }
    async findOne(userId, id) {
        return this.verifyOwnership(userId, id);
    }
    async update(userId, id, updateLogbookDto) {
        await this.verifyOwnership(userId, id);
        const data = {};
        if (updateLogbookDto.logDate) {
            data.logDate = new Date(updateLogbookDto.logDate);
        }
        if (updateLogbookDto.content) {
            data.content = updateLogbookDto.content;
        }
        if (updateLogbookDto.status) {
            data.status = updateLogbookDto.status;
        }
        return this.prisma.logbook.update({
            where: { id: id },
            data,
        });
    }
    async remove(userId, id) {
        await this.verifyOwnership(userId, id);
        return this.prisma.logbook.delete({
            where: { id: id },
        });
    }
    async findAllForAdmin(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.logbook.findMany({
                skip,
                take: limit,
                orderBy: { id: 'desc' },
                include: { user: true },
            }),
            this.prisma.logbook.count(),
        ]);
        const filteredData = data.map((item) => ({
            ...item,
            user: {
                ...item.user,
                password: undefined,
            },
        }));
        return {
            data: filteredData,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async exportUserLogbookReport(userId, filter, adminName) {
        const where = { userId };
        if (filter.startDate && filter.endDate) {
            where.logDate = {
                gte: new Date(filter.startDate),
                lte: new Date(filter.endDate),
            };
        }
        const logbooks = await this.prisma.logbook.findMany({
            where,
            orderBy: { logDate: 'asc' },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const headerImagePath = path.resolve(process.cwd(), 'src/assets/header_report/header_report.png');
        const headerImageBase64 = fs.existsSync(headerImagePath)
            ? fs.readFileSync(headerImagePath).toString('base64')
            : null;
        const tableBody = [
            ['No', 'Tanggal', 'Status', 'Aktivitas'],
            ...logbooks.map((l, i) => [
                i + 1,
                l.logDate ? new Date(l.logDate).toLocaleDateString('id-ID') : '-',
                l.status,
                l.content,
            ]),
        ];
        const content = [
            {
                text: `Rekap Logbook Intern: ${user?.name || '-'}`,
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
                    widths: ['auto', 'auto', 'auto', '*'],
                    body: tableBody,
                },
                layout: 'lightHorizontalLines',
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
        const PdfPrinter = require('pdfmake');
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
exports.LogbooksService = LogbooksService;
exports.LogbooksService = LogbooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LogbooksService);
//# sourceMappingURL=logbooks.service.js.map