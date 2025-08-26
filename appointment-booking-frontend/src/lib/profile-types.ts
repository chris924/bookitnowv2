import { SpecialistDTO } from "./specialist-types";


export interface BaseProfileDTO  {
    id: number;
    email: string;
    avatarUrl: string;
    createdAt: string;
}

export interface UserDataResponseDTO extends BaseProfileDTO {
    name: string;
    username: string;
}

export interface CompanyDataResponseDTO extends BaseProfileDTO {

    companyName: string;
    place: string;
    serviceName: string;
    serviceDescription: string;
    employees: SpecialistDTO;
    rating: number;
}

export interface EmployeeDataResponseDTO extends BaseProfileDTO {
    name: string;
    username: string;
    rating: number;
}