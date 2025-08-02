
//Base Interface for the Specialists,Companies,Place objects
export interface BaseItemInterface
{
    label: string,
    value: string,
    image?: string,
    company?: string,
    rating?: number
}
// Specialist DTO, this comes from the backend
export interface SpecialistDTO {
  label: string;
  value: string;
  image: string;
  company: string;
  rating: number;
}
// Company DTO, this comes from the backend
export interface CompanyDTO {
  label: string;
  value: string;
  image: string;
  rating: number;
}
// Place DTO, this comes from the backend
export interface PlaceDTO {
  label: string;
  value: string;
}


export interface searchResultPropInterface
{
  specialists: SpecialistDTO[]
}