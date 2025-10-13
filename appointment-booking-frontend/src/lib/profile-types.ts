import { SpecialistDTO } from "./specialist-types";


export interface BaseProfileDTO  {
    id: number;
    email: string;
    avatarUrl: string;
    createdAt: string;
}

export interface UserDataResponseDTO extends BaseProfileDTO {
    type: "USER";
    name: string;
    username: string;
}

export interface CompanyDataResponseDTO extends BaseProfileDTO {
    type: "COMPANY";
    companyName: string;
    place: string;
    serviceName: string;
    serviceDescription: string;
    description: string;
    rating: number;
}

export interface EmployeeDataResponseDTO extends BaseProfileDTO {
    type: "EMPLOYEE";
    name: string;
    username: string;
    rating: number;
}