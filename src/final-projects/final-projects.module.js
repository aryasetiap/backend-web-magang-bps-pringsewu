"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalProjectsModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const final_projects_controller_1 = require("./final-projects.controller");
const final_projects_service_1 = require("./final-projects.service");
let FinalProjectsModule = class FinalProjectsModule {
};
exports.FinalProjectsModule = FinalProjectsModule;
exports.FinalProjectsModule = FinalProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/final-projects',
                    filename: (req, file, callback) => {
                        const randomHex = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        const fileExtension = (0, path_1.extname)(file.originalname);
                        callback(null, `final-project-${randomHex}${fileExtension}`);
                    },
                }),
                fileFilter: (req, file, callback) => {
                    if (file.mimetype === 'application/pdf' ||
                        file.mimetype === 'application/msword' ||
                        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        callback(null, true);
                    }
                    else {
                        callback(new Error('Hanya file PDF atau DOC yang diperbolehkan!'), false);
                    }
                },
                limits: {
                    fileSize: 10 * 1024 * 1024,
                },
            }),
        ],
        controllers: [final_projects_controller_1.FinalProjectsController],
        providers: [final_projects_service_1.FinalProjectsService],
        exports: [final_projects_service_1.FinalProjectsService],
    })
], FinalProjectsModule);
//# sourceMappingURL=final-projects.module.js.map