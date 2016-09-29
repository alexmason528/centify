import { EventEmitter } from 'events'
import { isTokenExpired } from './jwtHelper'
import Auth0Lock from 'auth0-lock'
import LogoImg from 'images/centify-auth0-logo.png'

export default class AuthService extends EventEmitter {
  constructor(clientId, domain, redirectUrl) {
    super()
    this.domain = domain
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {

      languageDictionary: {
        title: "MyCentify Login"
      },
      container: 'loginContainer',
      theme: {
        logo: LogoImg,
        primaryColor: "green"
      },
      auth: {
        params: {scope: 'openid centifyOrgId centifyUserId centifyLicense'},
        redirect: true,
        redirectUrl: redirectUrl,
        responseType: "token",
        sso: true
      },
      /*additionalSignUpFields: [{
        name: "address",                              // required
        placeholder: "enter your address",            // required
        validator: function(value) {                  // optional
          // only accept addresses with more than 10 chars
          return value.length > 10;
        }
      }]*/
    })
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)

    this.notLinked = true
  }

  _doAuthentication(authResult) {
    this.setToken(authResult.idToken)
    this.handleState(authResult.state)
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
      } else if (profile.centifyUserId) {
        // Saves the user token
        this.setProfile(profile)
        if (this.onGetProfile) {
          this.notLinked = false
          this.onGetProfile()
        }
      } else {
        if (this.onAccountNotLinked) {
          this.notLinked = true
          this.onAccountNotLinked()
        }
      }
    })
  }

  _authorizationError(error) {
    // Unexpected authentication error
    console.log('Authentication Error', error)
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }

  isExpired = () => {
    /// for testing
    if (window.localStorage.getItem('exp') == 'a') {
      return true;
    }
    return isTokenExpired(this.getToken())
  }

  setProfile(profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  getProfile() {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(profile) : {}
  }

  updateProfile(userId, data) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    }
    return fetch(`https://${this.domain}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(newProfile => this.setProfile(newProfile))
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  handleState(state) {
    // Handles any state passed in. For Signup, redirect to Thankyou page
    if(state) {
      try {
        let stateData = JSON.parse(state.split('?')[0]) // For some reason I'm getting ?k= on the end of state - remove it
        console.log('stateData', stateData)
        if(stateData.process === 'signup') {
          localStorage.setItem('returnUrl', "thankyou")
        }
      } catch(e) {
        console.log('state was not JSON:', e)
      }
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}
