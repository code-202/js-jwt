import { Request, Response, ApiRequest } from '@code-202/agent'
import { Denormalizable, Normalizable } from '@code-202/serializer'
import { action, computed, makeObservable, observable } from 'mobx'
import Cookies, { CookieSetOptions } from 'universal-cookie'
import { TokenRequest } from './token-request'
import { TokenVerifier } from './token-verifier'

export interface Options {
    endpoint: string
    notifyLogout?: boolean
    cookieOptions?: {
        domain?: string
    }
    urls?: {
        login?: string //'/login_check'
        refreshToken?: string //'/security/refresh'
        logout?: string //'/logout'
    }
}

export interface Informations {
    iat: number
    exp: number
    username: string
}

export abstract class Store<T extends Informations> implements Request.AuthorizationService, Normalizable<StoreNormalized<T>>, Denormalizable<StoreNormalized<T>> {
    public status: Request.Status
    public token: string
    public informations: T

    protected _apiEndpoint: string
    protected _tokenVerifier: TokenVerifier
    protected _request: TokenRequest
    protected _cookies: Cookies
    protected _refreshToken: TokenRequest
    protected _requestLogout: ApiRequest
    protected _notifyLogout: boolean = true
    protected _cookieOptionsDomain: string

    constructor (tokenVerifier: TokenVerifier, options: Options) {
        makeObservable <Store<T>, 'eraseCredentials' | 'updateToken'> (this, {
            status: observable,
            token: observable,
            informations: observable,

            connected: computed,

            login: action,
            logout: action,
            eraseCredentials: action,
            updateToken: action,
        })

        this.status = 'waiting'
        this.token = ''

        this._tokenVerifier = tokenVerifier

        this._apiEndpoint = options.endpoint

        this.informations = this.createInformations()

        this._request = new TokenRequest(options.endpoint + (options.urls?.login || '/login_check'), 'POST', tokenVerifier)
        this._request.onStatusChange(action((status: Request.Status) => {
            this.status = status
        }))

        this._refreshToken = new TokenRequest(options.endpoint + (options.urls?.refreshToken || '/security/refresh'), 'GET', tokenVerifier)
        this._requestLogout = new ApiRequest(options.endpoint + (options.urls?.logout || '/logout'), 'POST')

        this._cookies = new Cookies()

        this._notifyLogout = options.notifyLogout === undefined || options.notifyLogout === true
        this._cookieOptionsDomain = options.cookieOptions && options.cookieOptions.domain ? options.cookieOptions.domain : ''

        this.loadTokenFromCookie()

        this.loadTokenFromUrl()
    }

    protected abstract createInformations(): T

    public get endpoint (): string {
        return this._apiEndpoint
    }

    public get authorizationToken (): string {
        return this.token
    }

    public get authorizationPrefix (): string {
        return 'Bearer'
    }

    public onAuthorizationError (responseStatus: any | null, responseTextStatus: any | null): void {
        if( responseStatus === 401) {
            this.eraseCredentials()
        }
    }

    public onAccessDeniedError (responseStatus: any | null, responseTextStatus: any | null, data: any | null): void {
        console.error('access-denied')
    }

    public get connected (): boolean {
        return this.token !== ''
    }

    public login (username: string, password: string, rememberMe: boolean = false): Promise<any> {
        if (this.status === 'pending') {
            return new Promise((resolve, reject) => {
                reject()
            })
        }

        return this._request.send(this.buildLoginData(username, password, rememberMe))
        .then((response: Response.Response) => {
            this.updateToken(this._request.responseData.token, this._request.responseData.decoded, true, rememberMe)
            return response
        })
    }

    public logout (): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._notifyLogout) {
                this._requestLogout.addAuthorization(this.token)
                this._requestLogout.send()
                    .then(() => {
                        this.eraseCredentials()

                        resolve()
                    })
                    .catch((response: Response.Response) => {
                        if (response.status === 401) {
                            this.eraseCredentials()
                            resolve()
                        } else {
                            reject()
                        }
                    })
            } else {
                this.eraseCredentials()

                resolve()
            }

        })
    }

    public forceLogout () {
        this.eraseCredentials()
    }

    protected eraseCredentials () {
        this.token = ''
        this.informations = this.createInformations()
        this.deleteTokenCookie()
    }

    protected buildLoginData (username: string, password: string, rememberMe: boolean = false): object {
        return {
            username: username,
            password: password,
            rememberMe: rememberMe
        }
    }

    public async loadTokenFromString (token: string) {
        if (token) {
            try {
                const { payload, protectedHeader } = await this._tokenVerifier.verify(token)
                if (payload) {
                    action(() => {
                        this.token = token
                        this.informations = Object.assign(this.informations, payload)
                        this.refreshTokenIfItNeed()
                    })()
                }
            } catch (error) {
                // do nothing
            }
        }
    }

    protected loadTokenFromCookie () {
        const token = this._cookies.get('api-token')

        if (token) {
            this.loadTokenFromString(token)
        }
    }

    protected saveTokenInCookie () {
        if (this.token) {
            const options: CookieSetOptions = {
                path: '/',
            }

            if (this._cookieOptionsDomain) {
                options.domain = this._cookieOptionsDomain
            }

            options.maxAge = this.informations.exp - this.informations.iat

            this._cookies.set('api-token', this.token, options)
        }
    }

    protected deleteTokenCookie () {
        const options: CookieSetOptions = {
            path: '/',
        }

        if (this._cookieOptionsDomain) {
            options.domain = this._cookieOptionsDomain
        }

        this._cookies.set('api-token', null, options)
        this._cookies.remove('api-token', options)
    }

    protected refreshTokenIfItNeed (): void {
        if (!this.tokenHasToBeRefreshed()) {
            return
        }

        this._refreshToken.addAuthorization(this.token)
        this._refreshToken.send().then((response: Response.Response) => {
            this.updateToken(response.data.token, response.data.decoded)
        }).catch((response: Response | Error) => {
            // do nothing
        })
    }

    protected updateToken (token: string, decoded: Informations, andSave: boolean = true, rememberMe: boolean = false) {
        this.token = token
        this.informations = Object.assign(this.informations, decoded)

        if (andSave) {
            this.saveTokenInCookie()
        }
    }

    protected tokenHasToBeRefreshed (): boolean {
        if (!this.token) {
            return false
        }

        const now: number = Math.floor((new Date()).getTime() / 1000)
        const limit = this.informations.iat + (this.informations.exp - this.informations.iat) / 2

        return now > limit
    }

    protected async loadTokenFromUrl () {
        if (typeof location === 'undefined') {
            return
        }

        const regex = new RegExp('[\\?&]token=([^&#]*)')
        const results = regex.exec(location.search)

        if (results !== null) {
            const token = decodeURIComponent(results[1].replace(/\+/g, ' '))

            if (token) {
                try {
                    const { payload, protectedHeader } = await this._tokenVerifier.verify(token)
                    if (payload) {
                        action(() => {
                            this.token = token
                            this.informations = Object.assign(this.informations, payload)
                            this.refreshTokenIfItNeed()
                        })()
                    }
                } catch (error) {
                    // do nothing
                }
            }
        }
    }

    public normalize (): StoreNormalized<T> {
        return {
            status: this.status,
            token: this.token,
            informations: this.informations,
        }
    }

    public denormalize (data: StoreNormalized<T>): void {
        try {
            action(() => {
                this.status = data.status
                this.token = data.token
                this.informations = data.informations
            })()
        } catch (e) {
            console.error('Impossible to deserialize : bad data')
        }
    }
}

export interface StoreNormalized<T> {
    status: Request.Status
    token: string
    informations: T
}
