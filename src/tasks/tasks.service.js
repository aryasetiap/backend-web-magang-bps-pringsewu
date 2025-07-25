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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(creatorId, createTaskDto, file) {
        const { title, description, deadline, internIds } = createTaskDto;
        let filePath = undefined;
        if (file) {
            filePath = file.path;
        }
        const task = await this.prisma.task.create({
            data: {
                title,
                description,
                deadline: new Date(deadline),
                createdBy: creatorId,
                filePath,
            },
        });
        if (internIds && internIds.length > 0) {
            const assignmentsData = internIds.map((internId) => ({
                taskId: task.id,
                userId: internId,
            }));
            await this.prisma.taskAssignment.createMany({
                data: assignmentsData,
                skipDuplicates: true,
            });
        }
        await this.prisma.auditLog.create({
            data: {
                action: 'create',
                entity: 'task',
                entityId: task.id,
                userId: creatorId,
                description: `Membuat tugas "${task.title}"`,
            },
        });
        return task;
    }
    async assignTask(taskId, assignTaskDto) {
        const { internIds } = assignTaskDto;
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task) {
            throw new common_1.NotFoundException(`Tugas dengan ID ${taskId} tidak ditemukan.`);
        }
        const assignmentsData = internIds.map((internId) => ({
            taskId: taskId,
            userId: internId,
        }));
        return this.prisma.taskAssignment.createMany({
            data: assignmentsData,
            skipDuplicates: true,
        });
    }
    async submitTask(userId, taskId, file, description) {
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
            where: {
                taskId_userId: {
                    taskId: taskId,
                    userId: userId,
                },
            },
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
            throw new common_1.ConflictException('Anda sudah pernah mengumpulkan tugas ini.');
        }
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        const isLate = !!(task && new Date() > task.deadline);
        return this.prisma.submission.create({
            data: {
                filePath: file ? file.path : null,
                taskId: taskId,
                userId: userId,
                status: 'submitted',
                isLate,
                description,
            },
        });
    }
    async findSubmissionsForTask(taskId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task) {
            throw new common_1.NotFoundException(`Tugas dengan ID ${taskId} tidak ditemukan.`);
        }
        return this.prisma.submission.findMany({
            where: {
                taskId: taskId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        namaLengkap: true,
                    },
                },
            },
        });
    }
    async gradeSubmission(submissionId, gradeSubmissionDto, graderId) {
        const submission = await this.prisma.submission.findUnique({
            where: { id: submissionId },
            include: { task: true },
        });
        if (!submission)
            throw new common_1.NotFoundException('Submission tidak ditemukan.');
        if (submission.task.createdBy !== graderId) {
            throw new common_1.ForbiddenException('Anda tidak berhak menilai submission ini.');
        }
        if (!['submitted', 'revisi'].includes(submission.status)) {
            throw new common_1.BadRequestException('Submission hanya bisa dinilai jika status submitted/revisi.');
        }
        if (gradeSubmissionDto.status === 'revisi') {
            const updated = await this.prisma.submission.update({
                where: { id: submissionId },
                data: {
                    feedback: gradeSubmissionDto.feedback,
                    status: 'revisi',
                    gradedBy: graderId,
                    gradedAt: new Date(),
                },
            });
            await this.prisma.notification.create({
                data: {
                    userId: updated.userId,
                    message: 'Submission Anda perlu revisi.',
                },
            });
            return updated;
        }
        const updated = await this.prisma.submission.update({
            where: { id: submissionId },
            data: {
                grade: gradeSubmissionDto.grade,
                feedback: gradeSubmissionDto.feedback,
                status: 'reviewed',
                gradedBy: graderId,
                gradedAt: new Date(),
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: updated.userId,
                message: 'Submission Anda telah dinilai.',
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: 'grade',
                entity: 'submission',
                entityId: submissionId,
                userId: graderId,
                description: `Submission dinilai dengan status ${gradeSubmissionDto.status || 'reviewed'}`,
            },
        });
        return updated;
    }
    findTasksForUser(userId, page = 1, limit = 10) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return this.prisma.task
            .findMany({
            where: {
                assignments: {
                    some: { userId },
                },
                deletedAt: null,
            },
            include: {
                creator: { select: { name: true } },
                submissions: {
                    where: { userId },
                    select: {
                        id: true,
                        status: true,
                        grade: true,
                        feedback: true,
                        isLate: true,
                    },
                },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { deadline: 'asc' },
        })
            .then((tasks) => tasks.map((task) => ({
            ...task,
            submission: task.submissions.length
                ? task.submissions.sort((a, b) => b.id - a.id)[0]
                : null,
            fileUrl: task.filePath
                ? `${baseUrl}/${task.filePath.replace(/\\/g, '/')}`
                : null,
        })));
    }
    async findAll() {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const tasks = await this.prisma.task.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                title: true,
                description: true,
                deadline: true,
                createdBy: true,
                filePath: true,
            },
        });
        return {
            data: tasks.map((task) => ({
                ...task,
                fileUrl: task.filePath
                    ? `${baseUrl}/${task.filePath.replace(/\\/g, '/')}`
                    : null,
            })),
        };
    }
    async findOne(id) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const task = await this.prisma.task.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                deadline: true,
                createdBy: true,
                filePath: true,
                deletedAt: true,
            },
        });
        if (!task || task.deletedAt)
            throw new common_1.NotFoundException('Task tidak ditemukan');
        return {
            ...task,
            fileUrl: task.filePath
                ? `${baseUrl}/${task.filePath.replace(/\\/g, '/')}`
                : null,
        };
    }
    async update(id, updateTaskDto) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            select: {
                id: true,
                deletedAt: true,
                deadline: true,
            },
        });
        if (!task || task.deletedAt) {
            throw new common_1.NotFoundException('Task tidak ditemukan atau sudah dihapus.');
        }
        if (task.deadline && new Date() > task.deadline) {
            throw new common_1.BadRequestException('Task sudah melewati deadline dan tidak bisa diubah.');
        }
        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                ...updateTaskDto,
                deadline: updateTaskDto.deadline
                    ? new Date(updateTaskDto.deadline)
                    : undefined,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: 'update',
                entity: 'task',
                entityId: id,
                userId: updated.createdBy,
                description: `Update tugas "${updated.title}"`,
            },
        });
        return updated;
    }
    async remove(id) {
        const deleted = await this.prisma.task.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.prisma.auditLog.create({
            data: {
                action: 'delete',
                entity: 'task',
                entityId: id,
                userId: deleted.createdBy,
                description: `Soft delete tugas "${deleted.title}"`,
            },
        });
        return deleted;
    }
    async isUserAssignedToTask(taskId, userId) {
        const assignment = await this.prisma.taskAssignment.findUnique({
            where: { taskId_userId: { taskId, userId } },
        });
        return !!assignment;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map