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
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs");
let SubmissionsService = class SubmissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resubmit(submissionId, userId, file, description) {
        if (!file && (!description || description.trim() === '')) {
            throw new common_1.BadRequestException('Minimal file atau deskripsi harus diisi.');
        }
        const submission = await this.prisma.submission.findUnique({
            where: { id: submissionId },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Submission tidak ditemukan.');
        }
        const task = await this.prisma.task.findUnique({
            where: { id: submission.taskId },
        });
        const isLate = !!(task && new Date() > task.deadline);
        if (submission.userId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak berhak mengubah submission ini.');
        }
        if (!['revisi', 'submitted'].includes(submission.status)) {
            throw new common_1.ForbiddenException('Submission tidak dapat diunggah ulang pada status ini.');
        }
        if (submission.status === 'reviewed') {
            throw new common_1.ForbiddenException('Submission sudah dinilai dan tidak bisa diubah.');
        }
        if (file && submission.filePath && fs.existsSync(submission.filePath)) {
            fs.unlinkSync(submission.filePath);
        }
        if (file) {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (!allowedTypes.includes(file.mimetype)) {
                fs.unlinkSync(file.path);
                throw new common_1.BadRequestException('Tipe file tidak didukung. Hanya PDF/DOC/DOCX.');
            }
            if (file.size > 5 * 1024 * 1024) {
                fs.unlinkSync(file.path);
                throw new common_1.BadRequestException('Ukuran file melebihi 5MB.');
            }
        }
        return this.prisma.submission.update({
            where: { id: submissionId },
            data: {
                filePath: file ? file.path : submission.filePath,
                status: 'submitted',
                grade: null,
                feedback: null,
                isLate,
                description: description ?? submission.description,
            },
        });
    }
    async submit(taskId, userId, file, description) {
        if (!file && (!description || description.trim() === '')) {
            throw new common_1.BadRequestException('Minimal file atau deskripsi harus diisi.');
        }
        if (file) {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (!allowedTypes.includes(file.mimetype)) {
                fs.unlinkSync(file.path);
                throw new common_1.BadRequestException('Tipe file tidak didukung. Hanya PDF/DOC/DOCX.');
            }
            if (file.size > 5 * 1024 * 1024) {
                fs.unlinkSync(file.path);
                throw new common_1.BadRequestException('Ukuran file melebihi 5MB.');
            }
        }
        const assignment = await this.prisma.taskAssignment.findUnique({
            where: { taskId_userId: { taskId, userId } },
        });
        if (!assignment) {
            if (file)
                fs.unlinkSync(file.path);
            throw new common_1.ForbiddenException('Anda tidak ditugaskan untuk mengerjakan tugas ini.');
        }
        const existingSubmission = await this.prisma.submission.findFirst({
            where: { taskId, userId },
        });
        if (existingSubmission) {
            if (file)
                fs.unlinkSync(file.path);
            throw new common_1.BadRequestException('Anda sudah pernah mengumpulkan tugas ini.');
        }
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        const isLate = !!(task && new Date() > task.deadline);
        return this.prisma.submission.create({
            data: {
                filePath: file ? file.path : null,
                taskId,
                userId,
                status: 'submitted',
                isLate,
                description,
            },
        });
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map