export class APIError extends Error {
	status: number;
	body: any;

	constructor(status: number, message: string, body: any = null) {
		super(message);
		this.name = "APIError";
		this.status = status;
		this.body = body;

		// Necessário para herança correta em alguns ambientes
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
