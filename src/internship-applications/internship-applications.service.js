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
exports.InternshipApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs");
let InternshipApplicationsService = class InternshipApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    deleteUploadedFiles(files) {
        Object.values(files).forEach((fileArray) => {
            if (fileArray && fileArray[0])
                fs.unlinkSync(fileArray[0].path);
        });
    }
    async create(userId, createInternshipApplicationDto, files) {
        this.validateFiles(files);
        if (createInternshipApplicationDto.startDate &&
            createInternshipApplicationDto.endDate) {
            this.validateInternshipPeriod(createInternshipApplicationDto.startDate, createInternshipApplicationDto.endDate, false);
        }
        const existingApplication = await this.prisma.internshipApplication.findFirst({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
        });
        if (existingApplication && existingApplication.status !== 'ditolak') {
            this.deleteUploadedFiles(files);
            throw new common_1.ConflictException('Anda sudah pernah mengajukan pendaftaran magang.');
        }
        const cvPath = files.cv && files.cv[0] ? files.cv[0].path : null;
        const transcriptPath = files.transcript[0].path;
        const requestLetterPath = files.requestLetter[0].path;
        return this.prisma.internshipApplication.create({
            data: {
                userId: userId,
                cvPath: cvPath,
                transcriptPath: transcriptPath,
                requestLetterPath: requestLetterPath,
                startDate: createInternshipApplicationDto.startDate
                    ? new Date(createInternshipApplicationDto.startDate)
                    : null,
                endDate: createInternshipApplicationDto.endDate
                    ? new Date(createInternshipApplicationDto.endDate)
                    : null,
            },
        });
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 10 } = paginationQuery;
        const skip = (page - 1) * limit;
        const [applications, total] = await this.prisma.$transaction([
            this.prisma.internshipApplication.findMany({
                include: {
                    applicant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePhoto: true,
                            namaLengkap: true,
                            nimNisn: true,
                            asalInstitusi: true,
                            jurusanProdi: true,
                            nomorTelepon: true,
                            alamat: true,
                            educationStatus: true,
                            activityType: true,
                            activityStart: true,
                            activityEnd: true,
                            isGraduated: true,
                            role: {
                                select: { name: true },
                            },
                        },
                    },
                },
                skip: skip,
                take: limit,
            }),
            this.prisma.internshipApplication.count(),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: applications,
            meta: {
                totalItems: total,
                itemCount: applications.length,
                itemsPerPage: limit,
                currentPage: page,
                totalPages: totalPages,
            },
        };
    }
    async findOne(id) {
        const application = await this.prisma.internshipApplication.findUnique({
            where: { id: id },
            include: {
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePhoto: true,
                        namaLengkap: true,
                        nimNisn: true,
                        asalInstitusi: true,
                        jurusanProdi: true,
                        nomorTelepon: true,
                        alamat: true,
                        educationStatus: true,
                        activityType: true,
                        activityStart: true,
                        activityEnd: true,
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Pendaftaran dengan ID ${id} tidak ditemukan.`);
        }
        const baseUrl = 'http://localhost:3000';
        const cvUrl = application.cvPath
            ? `${baseUrl}/${application.cvPath.replace(/\\/g, '/')}`
            : null;
        const transcriptUrl = `${baseUrl}/${application.transcriptPath.replace(/\\/g, '/')}`;
        const requestLetterUrl = `${baseUrl}/${application.requestLetterPath.replace(/\\/g, '/')}`;
        return {
            ...application,
            cvUrl,
            transcriptUrl,
            requestLetterUrl,
        };
    }
    async updateStatus(id, adminId, updateApplicationStatusDto) {
        if (updateApplicationStatusDto.startDate &&
            updateApplicationStatusDto.endDate) {
            this.validateInternshipPeriod(updateApplicationStatusDto.startDate, updateApplicationStatusDto.endDate, true);
        }
        const updateData = {
            status: updateApplicationStatusDto.status,
            feedback: updateApplicationStatusDto.feedback,
            verifiedBy: adminId,
            verifiedAt: new Date(),
        };
        if (updateApplicationStatusDto.startDate) {
            updateData.startDate = new Date(updateApplicationStatusDto.startDate);
        }
        if (updateApplicationStatusDto.endDate) {
            updateData.endDate = new Date(updateApplicationStatusDto.endDate);
        }
        return this.prisma.internshipApplication.update({
            where: { id: id },
            data: updateData,
        });
    }
    async findByUser(userId) {
        return this.prisma.internshipApplication.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    validateFiles(files) {
        const requiredFields = ['transcript', 'requestLetter'];
        for (const field of requiredFields) {
            if (!files[field] || !files[field][0]) {
                throw new common_1.BadRequestException(`File untuk '${field}' wajib diunggah.`);
            }
        }
        const allFiles = [
            ...(files.cv ?? []),
            ...files.transcript,
            ...files.requestLetter,
        ];
        const maxSize = 2 * 1024 * 1024;
        for (const file of allFiles) {
            if (!file.mimetype.includes('pdf')) {
                this.deleteUploadedFiles(files);
                throw new common_1.BadRequestException(`Tipe file tidak valid: ${file.originalname}. Hanya file PDF yang diizinkan.`);
            }
            if (file.size > maxSize) {
                this.deleteUploadedFiles(files);
                throw new common_1.BadRequestException(`Ukuran file terlalu besar: ${file.originalname}. Ukuran maksimum adalah 2 MB.`);
            }
        }
    }
    validateInternshipPeriod(startDate, endDate, isAdmin) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        if (start >= end) {
            throw new common_1.BadRequestException('Tanggal mulai magang harus sebelum tanggal selesai magang.');
        }
        const oneMonthLater = new Date(start);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        if (end < oneMonthLater) {
            throw new common_1.BadRequestException('Durasi magang minimal 1 bulan.');
        }
        const sixMonthsLater = new Date(start);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        if (end > sixMonthsLater) {
            throw new common_1.BadRequestException('Durasi magang maksimal 6 bulan.');
        }
        if (!isAdmin && start < now) {
            throw new common_1.BadRequestException('Tanggal mulai magang tidak boleh di masa lalu.');
        }
    }
};
exports.InternshipApplicationsService = InternshipApplicationsService;
exports.InternshipApplicationsService = InternshipApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InternshipApplicationsService);
//# sourceMappingURL=internship-applications.service.js.map