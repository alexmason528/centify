import Auth0Lock from 'auth0-lock'

export default class AuthService {
	constructor(clientId, domain) {
		
		// Configure Auth0
		this.lock = new Auth0Lock(clientId, domain, {})

		// Add callback for lock 'authenticated' event
		this.lock.on('authenticated', this._doAuthentication.bind(this))

		// binds login functions to keep this context
		this.login = this.login.bind(this)
	}

	_doAuthentication(authResult) {
		this.setToken(authResult.idToken)
	}

	login() {
		this.lock.show()
	}

	loggedIn() {
		return !!this.getToken()
	}

	setToken(idToken) {
		localStorage.setItem('id_token', idToken)
	}

	getToken() {
		return localStorage.getItem('id_token')
	}

	logout() {
		localStorage.removeItem('id_token');
	}

}