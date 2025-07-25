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
exports.CertificatesController = void 0;
const common_1 = require("@nestjs/common");
const certificates_service_1 = require("./certificates.service");
const create_certificate_dto_1 = require("./dto/create-certificate.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const passport_1 = require("@nestjs/passport");
const fs_1 = require("fs");
const fs = require("fs");
let CertificatesController = class CertificatesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async generate(dto, req) {
        return this.service.generateCertificate(dto, req.user.userId);
    }
    async uploadSigned(id, file, req) {
        if (!file)
            throw new common_1.BadRequestException('File PDF wajib diunggah');
        return this.service.uploadSignedCertificate(id, file.path, req.user.userId);
    }
    async issue(id, req) {
        return this.service.issueCertificate(id, req.user.id);
    }
    async getOwn(req) {
        return this.service.getCertificateByUser(req.user.userId);
    }
    async uploadTemplate(file, req) {
        if (!file)
            throw new common_1.BadRequestException('File PDF wajib diunggah');
        return { success: true, message: 'Template sertifikat berhasil diunggah.' };
    }
    async download(id, req, res) {
        const cert = await this.service.getCertificateById(id);
        if (!cert)
            throw new common_1.NotFoundException('Sertifikat tidak ditemukan');
        let filePath;
        let fileName;
        if (cert.status === 'issued' && cert.signedFilePath) {
            filePath = cert.signedFilePath;
            fileName = `Sertifikat_${cert.certificateNumber}.pdf`;
        }
        else if (cert.status === 'generated') {
            filePath = cert.templatePath;
            fileName = `Certificate_${cert.certificateNumber}_for-signing.pdf`;
        }
        else {
            throw new common_1.BadRequestException('Sertifikat belum siap untuk diunduh.');
        }
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('File sertifikat tidak ditemukan di server.');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        const stream = (0, fs_1.createReadStream)(filePath);
        stream.pipe(res);
    }
    async checkTemplate() {
        const templatePath = './uploads/certificate-templates/certificate-template.pdf';
        const exists = fs.existsSync(templatePath);
        return {
            templateExists: exists,
            templatePath: exists ? templatePath : null,
        };
    }
    async getAllCertificates(req) {
        if (req.user.role !== 'Admin')
            throw new common_1.ForbiddenException('Hanya admin');
        return this.service.getAllCertificates();
    }
};
exports.CertificatesController = CertificatesController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_certificate_dto_1.CreateCertificateDto, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "generate", null);
__decorate([
    (0, common_1.Patch)(':id/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "uploadSigned", null);
__decorate([
    (0, common_1.Patch)(':id/issue'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "issue", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "getOwn", null);
__decorate([
    (0, common_1.Patch)('template/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/certificate-templates',
            filename: (req, file, cb) => {
                cb(null, 'certificate-template.pdf');
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if ((0, path_1.extname)(file.originalname).toLowerCase() === '.pdf')
                cb(null, true);
            else
                cb(new Error('File harus PDF'), false);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "uploadTemplate", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "download", null);
__decorate([
    (0, common_1.Get)('template/check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "checkTemplate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "getAllCertificates", null);
exports.CertificatesController = CertificatesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('certificates'),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], CertificatesController);
//# sourceMappingURL=certificates.controller.js.map