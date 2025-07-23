export interface Location {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    images: String[];
    details?: string;
    type: LocationType;
    tags?: string[];
    createdAt: Date;
    rating: number;
    UserId: number;
}

export enum LocationType {
    Rural = 'Rural',
    Geográfica = 'Geográfica',
    Histórica = 'Histórica',
}
