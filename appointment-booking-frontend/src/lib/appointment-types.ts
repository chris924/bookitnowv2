

export interface AppointmentSlotResponseDTO{

    firstHour: string;
    lastHour: string;
    firstDate: string;
    lastDate: string;
    slotResponseDTO: SlotResponseDTO[];

}

export interface SlotResponseDTO{
    id: number;
    date: string;
    start: string;
    end: string;
    status: string;
}