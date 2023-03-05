import { ApiRequest } from '@code-202/agent'

export class LogoutRequest extends ApiRequest {
    constructor (apiEndpoint: string) {
        super(apiEndpoint + '/logout', 'POST')
    }
}
