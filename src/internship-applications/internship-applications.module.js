"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternshipApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const internship_applications_service_1 = require("./internship-applications.service");
const internship_applications_controller_1 = require("./internship-applications.controller");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
let InternshipApplicationsModule = class InternshipApplicationsModule {
};
exports.InternshipApplicationsModule = InternshipApplicationsModule;
exports.InternshipApplicationsModule = InternshipApplicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, callback) => {
                        const folder = (0, path_1.join)('uploads', file.fieldname);
                        if (!fs.existsSync(folder)) {
                            fs.mkdirSync(folder, { recursive: true });
                        }
                        callback(null, folder);
                    },
                    filename: (req, file, callback) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        const fileExtension = (0, path_1.extname)(file.originalname);
                        callback(null, `${randomName}${fileExtension}`);
                    },
                }),
            }),
        ],
        controllers: [internship_applications_controller_1.InternshipApplicationsController],
        providers: [internship_applications_service_1.InternshipApplicationsService],
    })
], InternshipApplicationsModule);
//# sourceMappingURL=internship-applications.module.js.map