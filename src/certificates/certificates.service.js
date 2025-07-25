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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const fs = require("fs");
const pdf_lib_1 = require("pdf-lib");
const path = require("path");
const fontkit = require('@pdf-lib/fontkit');
let CertificatesService = class CertificatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    drawTextCentered(page, text, options) {
        const { font, size, color = (0, pdf_lib_1.rgb)(0, 0, 0), y, maxWidth } = options;
        const { width: pageWidth, height: pageHeight } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);
        const effectiveWidth = maxWidth && maxWidth < textWidth ? maxWidth : textWidth;
        const x = (pageWidth - effectiveWidth) / 2;
        const yFromBottom = pageHeight - y;
        page.drawText(text, {
            x,
            y: yFromBottom,
            font,
            size,
            color,
            maxWidth,
            lineHeight: size * 1.2,
        });
    }
    async generateCertificate(dto, adminId) {
        const existing = await this.prisma.certificate.findUnique({
            where: { userId: dto.userId },
        });
        if (existing)
            throw new common_1.BadRequestException('Intern sudah memiliki sertifikat.');
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan.');
        const finalProject = await this.prisma.finalProject.findFirst({
            where: { userId: dto.userId, status: 'accepted' },
        });
        if (!finalProject)
            throw new common_1.BadRequestException('Final project belum accepted.');
        const start = user.activityStart;
        const end = user.activityEnd;
        let activityPeriod = '';
        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (startDate.getMonth() === endDate.getMonth() &&
                startDate.getFullYear() === endDate.getFullYear()) {
                activityPeriod = `${startDate.getDate()} - ${endDate.getDate()} ${startDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`;
            }
            else {
                activityPeriod = `${startDate.getDate()} ${startDate.toLocaleString('id-ID', {
                    month: 'long',
                })} - ${endDate.getDate()} ${endDate.toLocaleString('id-ID', {
                    month: 'long',
                    year: 'numeric',
                })}`;
            }
        }
        const safeCertificateNumber = dto.certificateNumber.replace(/[\/\\:*?"<>|]/g, '-');
        const outputDir = 'uploads/certificates/generated';
        const outputPath = path.join(outputDir, `certificate-${safeCertificateNumber}.pdf`);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const fontDir = path.join(process.cwd(), 'src', 'assets', 'fonts');
        const fontMonotype = fs.readFileSync(path.join(fontDir, 'monotype-bold.ttf'));
        const fontSourceSerif4 = fs.readFileSync(path.join(fontDir, 'SourceSerif4-Regular.ttf'));
        const fontLora = fs.readFileSync(path.join(fontDir, 'lora-regular.ttf'));
        const fontNotoSerifGeorgian = fs.readFileSync(path.join(fontDir, 'notoserifgeorgian-regular.ttf'));
        const templatePath = 'uploads/certificate-templates/certificate-template.pdf';
        if (!fs.existsSync(templatePath)) {
            throw new common_1.BadRequestException('Template sertifikat tidak ditemukan.');
        }
        const templateBytes = fs.readFileSync(templatePath);
        const pdfDoc = await pdf_lib_1.PDFDocument.load(templateBytes);
        pdfDoc.registerFontkit(fontkit);
        const page = pdfDoc.getPages()[0];
        const monotypeFont = await pdfDoc.embedFont(fontMonotype);
        const sourceSerif4Font = await pdfDoc.embedFont(fontSourceSerif4);
        const loraFont = await pdfDoc.embedFont(fontLora);
        const notoSerifGeorgianFont = await pdfDoc.embedFont(fontNotoSerifGeorgian);
        this.drawTextCentered(page, `Nomor: ${dto.certificateNumber}`, {
            y: 140,
            font: loraFont,
            size: 16,
        });
        this.drawTextCentered(page, user.namaLengkap ?? user.name, {
            y: 245,
            font: monotypeFont,
            size: 56,
            color: (0, pdf_lib_1.rgb)(8 / 255, 36 / 255, 75 / 255),
        });
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
        }
        function splitTextToLines(text, font, size, maxWidth) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const testLineWidth = font.widthOfTextAtSize(testLine, size);
                if (testLineWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                }
                else {
                    currentLine = testLine;
                }
            }
            if (currentLine)
                lines.push(currentLine);
            return lines;
        }
        const descriptiveText = `${toTitleCase(user.educationStatus ?? '')} dari ${user.asalInstitusi ?? ''}, telah menyelesaikan kegiatan ${toTitleCase(user.activityType ?? '')} di Badan Pusat Statistik Kabupaten Pringsewu yang dilaksanakan pada periode ${activityPeriod}, dengan predikat kelulusan:`;
        const lines = splitTextToLines(descriptiveText, sourceSerif4Font, 14, 530);
        lines.forEach((line, idx) => {
            this.drawTextCentered(page, line, {
                y: 290 + idx * 18,
                font: sourceSerif4Font,
                size: 14,
                maxWidth: 530,
            });
        });
        this.drawTextCentered(page, dto.predicate, {
            y: 368,
            font: loraFont,
            size: 16,
            color: (0, pdf_lib_1.rgb)(1, 1, 1),
        });
        const tglSertifikatText = `Pringsewu, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        this.drawTextCentered(page, tglSertifikatText, {
            y: 425,
            font: notoSerifGeorgianFont,
            size: 14,
        });
        this.drawTextCentered(page, dto.namaKepalaBPS, {
            y: 530,
            font: loraFont,
            size: 14,
        });
        this.drawTextCentered(page, `NIP. ${dto.nipKepalaBPS}`, {
            y: 548,
            font: loraFont,
            size: 14,
        });
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
        return await this.prisma.certificate.create({
            data: {
                certificateNumber: dto.certificateNumber,
                userId: dto.userId,
                internName: user.namaLengkap ?? user.name,
                educationalStatus: user.educationStatus ?? '',
                institusi: user.asalInstitusi ?? '',
                predicate: dto.predicate,
                namaKegiatan: user.activityType ?? '',
                activityPeriod,
                tglSertifikat: new Date(),
                namaKepalaBPS: dto.namaKepalaBPS,
                nipKepalaBPS: dto.nipKepalaBPS,
                templatePath: outputPath,
                status: client_1.CertificateStatus.generated,
                generatedAt: new Date(),
                createdBy: adminId,
            },
        });
    }
    async uploadSignedCertificate(id, filePath, adminId) {
        const cert = await this.prisma.certificate.findUnique({ where: { id } });
        if (!cert)
            throw new common_1.NotFoundException('Sertifikat tidak ditemukan.');
        if (cert.status !== client_1.CertificateStatus.generated)
            throw new common_1.BadRequestException('Sertifikat harus status generated.');
        return await this.prisma.certificate.update({
            where: { id },
            data: {
                signedFilePath: filePath,
                status: client_1.CertificateStatus.signed,
                signedAt: new Date(),
                updatedBy: adminId,
            },
        });
    }
    async issueCertificate(id, adminId) {
        const cert = await this.prisma.certificate.findUnique({ where: { id } });
        if (!cert)
            throw new common_1.NotFoundException('Sertifikat tidak ditemukan.');
        if (cert.status !== client_1.CertificateStatus.signed)
            throw new common_1.BadRequestException('Sertifikat harus status signed.');
        const [updatedCert] = await this.prisma.$transaction([
            this.prisma.certificate.update({
                where: { id },
                data: {
                    status: client_1.CertificateStatus.issued,
                    issuedAt: new Date(),
                    updatedBy: adminId,
                },
            }),
            this.prisma.user.update({
                where: { id: cert.userId },
                data: { isGraduated: true },
            }),
        ]);
        return updatedCert;
    }
    async getCertificateByUser(userId) {
        return await this.prisma.certificate.findUnique({ where: { userId } });
    }
    async getCertificateById(id) {
        return await this.prisma.certificate.findUnique({ where: { id } });
    }
    async getAllCertificates() {
        return this.prisma.certificate.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        namaLengkap: true,
                        asalInstitusi: true,
                        isGraduated: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map