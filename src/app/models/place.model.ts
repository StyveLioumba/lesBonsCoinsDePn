import { Point } from './point.model';

export interface Place{
    id?:string;
    name?:string;
    description?:string;
    ville?:string;
    quartier?:string;
    images?:string[];
    point:Point
}

