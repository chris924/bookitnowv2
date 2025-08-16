
//Base Interface for the Specialists,Companies,Place objects
export interface BaseItemInterface  //TODO: Refactor BaseItemInterface, so only id label value remains
{
    id: number,
    label: string,
    value: string,
    image?: string,
    company?: string,
    rating?: number
}
// Specialist DTO, this comes from the backend
export interface SpecialistDTO extends BaseItemInterface {
  image: string;
  company: string;
  about: string;
  rating: number;
}
// Company DTO, this comes from the backend
export interface CompanyDTO extends BaseItemInterface {
  image: string;
  rating: number;
}
// Place DTO, this comes from the backend
export interface PlaceDTO extends BaseItemInterface {

}

export interface SpecialistServiceDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
 // image?: string;
}

export interface SpecialistPageDTO extends SpecialistDTO {
  employeeGetResponseDTO: SpecialistDTO;
  employeeServices: SpecialistServiceDTO[];
}


export interface searchResultPropInterface
{
  specialists: SpecialistDTO[]
}
