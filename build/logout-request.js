"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutRequest = void 0;
const agent_1 = require("@code-202/agent");
class LogoutRequest extends agent_1.ApiRequest {
    constructor(apiEndpoint) {
        super(apiEndpoint + '/logout', 'POST');
    }
}
exports.LogoutRequest = LogoutRequest;
