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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const { name, email, password, roleName } = createUserDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException(`User dengan email ${email} sudah terdaftar.`);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Peran '${roleName}' tidak ditemukan.`);
        }
        const newUser = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId: role.id,
            },
        });
        const { password: _, ...result } = newUser;
        return result;
    }
    async getProfile(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
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
                createdAt: true,
                isGraduated: true,
                role: {
                    select: { name: true },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User dengan ID ${id} tidak ditemukan.`);
        }
        return user;
    }
    async updateProfile(id, updateProfileDto, profilePhoto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { profilePhoto: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User dengan ID ${id} tidak ditemukan.`);
        }
        const updateData = {
            ...updateProfileDto,
        };
        if (typeof updateProfileDto.educationStatus !== 'undefined') {
            updateData.educationStatus = updateProfileDto.educationStatus;
        }
        if (typeof updateProfileDto.activityType !== 'undefined') {
            updateData.activityType = updateProfileDto.activityType;
        }
        if (typeof updateProfileDto.activityStart !== 'undefined') {
            updateData.activityStart = updateProfileDto.activityStart
                ? new Date(updateProfileDto.activityStart)
                : null;
        }
        if (typeof updateProfileDto.activityEnd !== 'undefined') {
            updateData.activityEnd = updateProfileDto.activityEnd
                ? new Date(updateProfileDto.activityEnd)
                : null;
        }
        if (profilePhoto) {
            if (user.profilePhoto) {
                const oldPhotoPath = path.resolve(user.profilePhoto);
                if (fs.existsSync(oldPhotoPath)) {
                    try {
                        fs.unlinkSync(oldPhotoPath);
                    }
                    catch (error) {
                        console.error('Gagal menghapus foto profil lama:', error);
                    }
                }
            }
            updateData.profilePhoto = profilePhoto.path.replace(/\\/g, '/');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
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
        });
        return updatedUser;
    }
    async findAll(paginationQuery) {
        const page = Number(paginationQuery.page) > 0 ? Number(paginationQuery.page) : 1;
        const limit = Number(paginationQuery.limit) > 0 ? Number(paginationQuery.limit) : 10;
        const skip = (page - 1) * limit;
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where: { deletedAt: null },
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
                skip,
                take: limit,
            }),
            this.prisma.user.count({
                where: { deletedAt: null },
            }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: users,
            meta: {
                totalItems: total,
                itemCount: users.length,
                itemsPerPage: limit,
                currentPage: page,
                totalPages,
            },
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
                deletedAt: null,
            },
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
        });
        if (!user) {
            throw new common_1.NotFoundException(`User dengan ID ${id} tidak ditemukan`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
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
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`User dengan ID ${id} tidak ditemukan.`);
                }
            }
            throw error;
        }
    }
    async remove(id) {
        return this.prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map