export declare enum CertificateStatusDto {
    generated = "generated",
    signed = "signed",
    issued = "issued"
}
export declare class UpdateCertificateStatusDto {
    status: CertificateStatusDto;
}
