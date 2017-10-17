import * as CryptoJS from 'crypto-js';

const KEY_PREFIX = 'hn';
const KEY = CryptoJS.enc.Base64.parse('ParseTwice2');
const IV = { iv: CryptoJS.enc.Base64.parse('#base64IV#') };

export class WebStorageUtility {
    static generateStorageKey(key: string): string {
        return CryptoJS.AES.encrypt(`${KEY_PREFIX}_${key}`, KEY, IV).toString();
    }

    static get(storage: Storage, key: string): any {
        const storageKey = WebStorageUtility.generateStorageKey(key);

        const value = storage.getItem(storageKey);

        return WebStorageUtility.getGettable(value);
    }

    static set(storage: Storage, key: string, value: any): void {
        const storageKey = WebStorageUtility.generateStorageKey(key);

        storage.setItem(storageKey, WebStorageUtility.getSettable(value));
    }

    static remove(storage: Storage, key: string): void {
        const storageKey = WebStorageUtility.generateStorageKey(key);

        storage.removeItem(storageKey);
    }

    private static getSettable(value: any): string {
        value = typeof value === 'string' ? value : JSON.stringify(value);
        return CryptoJS.AES.encrypt(value, KEY, IV).toString();
    }

    private static getGettable(value: string): any {
        if (value === null) {
            return value;
        }
        value = CryptoJS.AES.decrypt(value, KEY, IV).toString(CryptoJS.enc.Utf8);
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
}
