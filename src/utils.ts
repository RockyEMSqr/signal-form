import { Signal } from "@preact/signals";
import dlv from 'dlv'

export function dset(obj: any, keys: string | any, val: any) {
    keys.split && (keys = keys.split('.'));
    var i = 0, l = keys.length, t = obj, x;
    for (; i < l; ++i) {
        x = t[keys[i]];
        t = t[keys[i]] = (i === l - 1 ? val : (x != null ? x : (!!~keys[i + 1].indexOf('.') || !(+keys[i + 1] > -1)) ? {} : []));
    }
}
export function dsetSignal(obj: any, keys: string | any, val: any) {
    keys.split && (keys = keys.split('.'));
    var i = 0, l = keys.length, t = obj, x;
    for (; i < l; ++i) {
        x = t[keys[i]];
        if (x instanceof Signal) {
            x = x.value;
        }
        t = t[keys[i]] = (i === l - 1 ? val : (x != null ? x : (!!~keys[i + 1].indexOf('.') || !(+keys[i + 1] > -1)) ? {} : []));
    }
}
export default function dlvSignal(obj: any, key: string | string[], def = undefined, p = 0, undef = undefined) {
    key = key.split ? key.split('.') : key;
    for (p = 0; p < key.length; p++) {
        obj = obj ? obj[key[p]] : undef;
        if (obj instanceof Signal) {
            obj = obj.value;
        }
    }
    return obj === undef ? def : obj;
}