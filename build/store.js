import { ApiRequest } from '@code-202/agent';
import { action, computed, makeObservable, observable } from 'mobx';
import Cookies from 'universal-cookie';
import { TokenRequest } from './token-request';
export class Store {
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
        this.status = 'waiting';
        this.token = '';
        this.informations = this.createInformations();
        makeObservable(this, {
            status: observable,
            token: observable,
            informations: observable,
            connected: computed,
            login: action,
            logout: action,
            eraseCredentials: action,
            updateToken: action,
        });
        this._tokenVerifier = tokenVerifier;
        this._apiEndpoint = options.endpoint;
        this._request = new TokenRequest(options.endpoint + (options.urls?.login || '/login_check'), 'POST', tokenVerifier);
        this._request.onStatusChange(action((status) => {
            this.status = status;
        }));
        this._refreshToken = new TokenRequest(options.endpoint + (options.urls?.refreshToken || '/security/refresh'), 'GET', tokenVerifier);
        this._requestLogout = new ApiRequest(options.endpoint + (options.urls?.logout || '/logout'), 'POST');
        this._cookies = new Cookies();
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
    onAccessDeniedError(responseStatus, responseTextStatus, data) {
        console.error('access-denied');
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
                    action(() => {
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
        if (results !== null && results[1] !== undefined) {
            const token = decodeURIComponent(results[1].replace(/\+/g, ' '));
            if (token) {
                try {
                    const { payload, protectedHeader } = await this._tokenVerifier.verify(token);
                    if (payload) {
                        action(() => {
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
    normalize() {
        return {
            status: this.status,
            token: this.token,
            informations: this.informations,
        };
    }
    denormalize(data) {
        try {
            action(() => {
                this.status = data.status;
                this.token = data.token;
                this.informations = data.informations;
            })();
        }
        catch (e) {
            console.error('Impossible to deserialize : bad data');
        }
    }
}
//# sourceMappingURL=store.js.map