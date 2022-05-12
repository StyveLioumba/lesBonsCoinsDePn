import { Point } from './point.model';

export interface Place{
    id?:string;
    name?:string;
    description?:string;
    point:Point
}

