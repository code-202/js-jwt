"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyProvider = void 0;
class KeyProvider {
    _key = null;
    builder;
    constructor(builder) {
        this.builder = builder;
    }
    get key() {
        return this._key;
    }
    hasKey() {
        return this._key !== null;
    }
    get promise() {
        return new Promise((resolve) => {
            if (this._key) {
                resolve(this._key);
            }
            this.builder.build().then((key) => {
                this._key = key;
                resolve(key);
            });
        });
    }
}
exports.KeyProvider = KeyProvider;
