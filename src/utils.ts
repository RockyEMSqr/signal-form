import { Signal, useSignal } from "@preact/signals";
import { DeepSignal } from "deepsignal";
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
export function dlvSignal(obj: any, key: string | string[], def = undefined, p = 0, undef = undefined) {
    key = key.split ? key.split('.') : key;
    for (p = 0; p < key.length; p++) {
        obj = obj ? obj[key[p]] : undef;
        if (obj instanceof Signal) {
            obj = obj.value;
        }
    }
    return obj === undef ? def : obj;
}
export function dlvDeepSignal(obj: DeepSignal<any>, key: string | string[], def = undefined, p = 0, undef = undefined) {
    key = key.split ? key.split('.') : key;
    for (p = 0; p < key.length; p++) {
        obj = obj ? obj[key[p]] : undef;
        if (p == key.length - 1) {
        }
        // if (obj instanceof Signal && p == key.length - 1) {
        //     debugger;
        //     obj = obj;
        // }
    }
    return obj === undef ? def : obj;
}
export function getSignal(obj: DeepSignal<any>, key: string | string[], def = null, p = 0, undef = undefined) {
    let keys = [key];
    if (typeof key == 'string') {
        keys = key.split('.')
    } else if (Array.isArray(key)) {
        keys = key;
    }
    for (p = 0; p < keys.length; p++) {
        if (p == keys.length - 1) {
            keys[p] = '$' + keys[p]
        }
        obj = obj ? obj[keys[p]] : undef;
    }
    return obj === undef ? def : obj;
}