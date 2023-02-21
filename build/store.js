"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const mobx_1 = require("mobx");
const token_request_1 = require("./token-request");
const refresh_token_request_1 = require("./refresh-token-request");
const logout_request_1 = require("./logout-request");
const universal_cookie_1 = __importDefault(require("universal-cookie"));
class Store {
    status;
    token;
    informations;
    _apiEndpoint;
    _tokenVerifier;
    _request;
    _cookies;
    _refreshToken;
    _requestLogout;
    _notifyLogout = true;
    _cookieOptionsDomain;
    constructor(tokenVerifier, options) {
        (0, mobx_1.makeObservable)(this, {
            status: mobx_1.observable,
            token: mobx_1.observable,
            informations: mobx_1.observable,
            connected: mobx_1.computed,
            login: mobx_1.action,
            logout: mobx_1.action,
            eraseCredentials: mobx_1.action,
            updateToken: mobx_1.action,
        });
        this.status = 'waiting';
        this.token = '';
        this._tokenVerifier = tokenVerifier;
        this._apiEndpoint = options.endpoint;
        this.informations = this.createInformations();
        this._request = new token_request_1.TokenRequest(options.endpoint, tokenVerifier);
        this._request.onStatusChange((0, mobx_1.action)((status) => {
            this.status = status;
        }));
        this._refreshToken = new refresh_token_request_1.RefreshTokenRequest(options.endpoint, tokenVerifier);
        this._requestLogout = new logout_request_1.LogoutRequest(options.endpoint);
        this._cookies = new universal_cookie_1.default();
        this._notifyLogout = options.notifyLogout === undefined || options.notifyLogout === true;
        this._cookieOptionsDomain = options.cookieOptions && options.cookieOptions.domain ? options.cookieOptions.domain : '';
        this.loadTokenFromCookie();
        this.loadTokenFromUrl();
    }
    get endpoint() {
        return this._apiEndpoint;
    }
    get authorizationToken() {
        return this.token;
    }
    get authorizationPrefix() {
        return 'Bearer';
    }
    onAuthorizationError(responseStatus, responseTextStatus) {
        if (responseStatus === 401) {
            this.eraseCredentials();
        }
    }
    get connected() {
        return this.token !== '';
    }
    login(username, password, rememberMe = false) {
        if (this.status === 'pending') {
            return new Promise((resolve, reject) => {
                reject();
            });
        }
        return this._request.send(this.buildLoginData(username, password, rememberMe))
            .then((response) => {
            this.updateToken(this._request.responseData.token, this._request.responseData.decoded, true, rememberMe);
            return response;
        });
    }
    logout() {
        return new Promise((resolve, reject) => {
            if (this._notifyLogout) {
                this._requestLogout.addAuthorization(this.token);
                this._requestLogout.send()
                    .then(() => {
                    this.eraseCredentials();
                    resolve();
                })
                    .catch((response) => {
                    if (response.status === 401) {
                        this.eraseCredentials();
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            }
            else {
                this.eraseCredentials();
                resolve();
            }
        });
    }
    forceLogout() {
        this.eraseCredentials();
    }
    eraseCredentials() {
        this.token = '';
        this.informations = this.createInformations();
        this.deleteTokenCookie();
    }
    buildLoginData(username, password, rememberMe = false) {
        return {
            username: username,
            password: password,
            rememberMe: rememberMe
        };
    }
    async loadTokenFromString(token) {
        if (token) {
            try {
                const { payload, protectedHeader } = await this._tokenVerifier.verify(token);
                if (payload) {
                    (0, mobx_1.action)(() => {
                        this.token = token;
                        this.informations = Object.assign(this.informations, payload);
                        this.refreshTokenIfItNeed();
                    })();
                }
            }
            catch (error) {
                // do nothing
            }
        }
    }
    loadTokenFromCookie() {
        const token = this._cookies.get('api-token');
        if (token) {
            this.loadTokenFromString(token);
        }
    }
    saveTokenInCookie() {
        if (this.token) {
            const options = {
                path: '/',
            };
            if (this._cookieOptionsDomain) {
                options.domain = this._cookieOptionsDomain;
            }
            options.maxAge = this.informations.exp - this.informations.iat;
            this._cookies.set('api-token', this.token, options);
        }
    }
    deleteTokenCookie() {
        const options = {
            path: '/',
        };
        if (this._cookieOptionsDomain) {
            options.domain = this._cookieOptionsDomain;
        }
        this._cookies.set('api-token', null, options);
        this._cookies.remove('api-token', options);
    }
    refreshTokenIfItNeed() {
        if (!this.tokenHasToBeRefreshed()) {
            return;
        }
        this._refreshToken.addAuthorization(this.token);
        this._refreshToken.send().then((response) => {
            this.updateToken(response.data.token, response.data.decoded);
        }).catch((response) => {
            // do nothing
        });
    }
    updateToken(token, decoded, andSave = true, rememberMe = false) {
        this.token = token;
        this.informations = Object.assign(this.informations, decoded);
        if (andSave) {
            this.saveTokenInCookie();
        }
    }
    tokenHasToBeRefreshed() {
        if (!this.token) {
            return false;
        }
        const now = Math.floor((new Date()).getTime() / 1000);
        const limit = this.informations.iat + (this.informations.exp - this.informations.iat) / 2;
        return now > limit;
    }
    async loadTokenFromUrl() {
        if (typeof location === 'undefined') {
            return;
        }
        const regex = new RegExp('[\\?&]token=([^&#]*)');
        const results = regex.exec(location.search);
        if (results !== null) {
            const token = decodeURIComponent(results[1].replace(/\+/g, ' '));
            if (token) {
                try {
                    const { payload, protectedHeader } = await this._tokenVerifier.verify(token);
                    if (payload) {
                        (0, mobx_1.action)(() => {
                            this.token = token;
                            this.informations = Object.assign(this.informations, payload);
                            this.refreshTokenIfItNeed();
                        })();
                    }
                }
                catch (error) {
                    // do nothing
                }
            }
        }
    }
}
exports.Store = Store;
