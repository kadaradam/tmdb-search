export class ServerError {
	constructor(clientMessage: string) {
		return { notification: clientMessage };
	}
}
