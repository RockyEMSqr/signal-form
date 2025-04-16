import { DeepSignal } from "deepsignal";
import { DateTime, Zone } from "luxon";
export declare function dset(obj: any, keys: string | any, val: any): void;
export declare function dsetSignal(obj: any, keys: string | any, val: any): void;
export declare function getSignal(obj: DeepSignal<any>, key: string | string[], def?: null, p?: number, undef?: undefined): any;
export declare function getDT(val: string | number | DateTime<boolean> | Date, tz?: string | Zone<boolean> | null | undefined): DateTime<boolean> | undefined;
