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
exports.FinalProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs");
let FinalProjectsService = class FinalProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createFinalProjectDto, file) {
        const data = {
            title: createFinalProjectDto.title,
            description: createFinalProjectDto.description,
            userId,
        };
        if (file) {
            data.filePath = file.path;
            data.status = 'submitted';
            data.submittedAt = new Date();
        }
        else {
            data.status = 'draft';
        }
        return this.prisma.finalProject.create({ data });
    }
    async findAllForUser(userId) {
        return this.prisma.finalProject.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllForAdmin(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.finalProject.findMany({
                skip,
                take: limit,
                orderBy: { submittedAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            isGraduated: true,
                        },
                    },
                    reviewedBy: {
                        select: { id: true, name: true },
                    },
                },
            }),
            this.prisma.finalProject.count(),
        ]);
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async findOne(id, userId) {
        const finalProject = await this.prisma.finalProject.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                reviewedBy: {
                    select: { id: true, name: true },
                },
            },
        });
        if (!finalProject) {
            throw new common_1.NotFoundException('Final project tidak ditemukan');
        }
        if (userId && finalProject.userId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke final project ini');
        }
        return finalProject;
    }
    async update(id, userId, updateFinalProjectDto, file) {
        const finalProject = await this.findOne(id, userId);
        if (['accepted'].includes(finalProject.status)) {
            throw new common_1.ForbiddenException('Final project yang sudah diterima tidak dapat diubah');
        }
        const updateData = {
            ...updateFinalProjectDto,
        };
        if (file) {
            if (finalProject.filePath && fs.existsSync(finalProject.filePath)) {
                fs.unlinkSync(finalProject.filePath);
            }
            updateData.filePath = file.path;
            updateData.status = 'submitted';
            updateData.submittedAt = new Date();
        }
        return this.prisma.finalProject.update({
            where: { id },
            data: updateData,
        });
    }
    async review(id, reviewerId, reviewDto) {
        const finalProject = await this.findOne(id);
        if (finalProject.status !== 'submitted') {
            throw new common_1.ForbiddenException('Hanya final project yang sudah disubmit yang dapat direview');
        }
        return this.prisma.finalProject.update({
            where: { id },
            data: {
                status: reviewDto.status,
                grade: reviewDto.grade,
                feedback: reviewDto.feedback,
                reviewedById: reviewerId,
                reviewedAt: new Date(),
            },
        });
    }
    async remove(id, userId) {
        const finalProject = await this.findOne(id, userId);
        if (finalProject.filePath && fs.existsSync(finalProject.filePath)) {
            fs.unlinkSync(finalProject.filePath);
        }
        return this.prisma.finalProject.delete({
            where: { id },
        });
    }
};
exports.FinalProjectsService = FinalProjectsService;
exports.FinalProjectsService = FinalProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinalProjectsService);
//# sourceMappingURL=final-projects.service.js.map