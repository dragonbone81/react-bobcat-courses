import {observable, action, decorate, configure, runInAction} from 'mobx'

configure({enforceActions: true});

class AuthStore {
    constructor() {
        this.hydrateStoreWithLocalStorage().then()
    }

    auth = {
        token: '',
        refresh: '',
    };
    googleAuth = {
        googleClientID: process.env.REACT_APP_CLIENT_ID,
        token: '',
        expiresAt: '',
    };
    user = {};
    isLoggedIn = false;
    loggingIn = false;

    createGoogleCalendar = async (calendarName) => {
        let response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.googleAuth.token}`,
            },
            body: JSON.stringify({summary: calendarName})
        });
        response = await response.json();
        return response;
    };

    authenticateGoogle = async () => {
        const redirectURI = window.location.protocol + "//" +
            window.location.hostname + (!!window.location.port ? (":" + window.location.port) : "") +
            '/auth/google/callback';
        const url = encodeURI(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.googleAuth.googleClientID}&redirect_uri=${redirectURI}&response_type=token&scope=https://www.googleapis.com/auth/calendar`);
        const win = window.open(url, "Google Authentication", 'width=400, height=500');
        let token = '';

        return new Promise((resolve) => {
            const pollTimer = window.setInterval(() => {
                try {
                    if (win.document.URL.indexOf('access_token') !== -1) {
                        window.clearInterval(pollTimer);
                        token = new URLSearchParams(win.document.URL.split("#").pop()).get("access_token");
                        this.setGoogleToken(token);
                        win.close();
                        resolve();
                    }
                } catch (e) {
                    console.log(e);
                }
            }, 100);
        });
    };

    setGoogleToken = (token) => {
        this.googleAuth.token = token;
        const date = new Date();
        this.googleAuth.expiresAt = date.setSeconds(date.getSeconds() + 3600);
    };

    updateUserNotificationSettings = async (data) => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/update-notification-settings/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.auth.token}`,
            },
        });
        response = await response.json();
        if (response.success) {
            await this.getUserInfo();
        }
        return response;
    };
    uploadUserPhoto = async (data) => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/profile-upload/', {
            method: 'POST',
            body: data,
            headers: {
                "Authorization": `Bearer ${this.auth.token}`,
            },
        });
        response = await response.json();
        if (response.success) {
            await this.getUserInfo();
        }
        return response;
    };
    getUserInfo = async () => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/user-info/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.auth.token}`,
            },
        });
        response = await response.json();
        if (response.username)
            runInAction(() => this.user = response)
    };
    getAuthWithRefresh = async (refresh) => {
        runInAction(() => {
            this.loggingIn = true;
        });
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/auth/token/refresh', {
            method: 'POST',
            body: JSON.stringify({refresh: refresh}),
            headers: {
                "Content-Type": "application/json",
            },
        });
        response = await response.json();
        if (!response.access) {
            this.logout();
        } else {
            runInAction(() => {
                this.auth.token = response.access;
                this.isLoggedIn = true;
            });
            localStorage.setItem("auth", JSON.stringify(this.auth));
        }
        runInAction(() => {
            this.loggingIn = false;
        });
    };
    hydrateStoreWithLocalStorage = async () => {
        let auth = localStorage.getItem('auth');
        if (auth === null) {
            return;
        }
        runInAction(() => {
            this.isLoggedIn = false;
        });
        auth = JSON.parse(auth);
        if ('token' in auth && 'refresh' in auth) {
            runInAction(() => {
                this.auth = auth;
            });
            await this.getAuthWithRefresh(auth.refresh);
            if (this.isLoggedIn)
                this.getUserInfo().then()
        }
    };
    logout = () => {
        this.auth = {token: '', refresh: ''};
        this.isLoggedIn = false;
        localStorage.removeItem('auth');
    };
    register = async (user) => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/register/', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        });
        response = await response.json();
        if (!(response.user && response.api_keys)) {
            return {error: 'Error Registering.'}
        } else {
            runInAction(() => {
                this.auth.token = response.api_keys.access;
                this.auth.refresh = response.api_keys.refresh;
                this.isLoggedIn = true;
            });
            localStorage.setItem("auth", JSON.stringify(this.auth));
            this.getUserInfo().then();
            return {success: true, ...response}
        }
    };
    resetPassword = async (username) => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/forgot-password/', {
            method: 'POST',
            body: JSON.stringify({username}),
            headers: {
                "Content-Type": "application/json",
            },
        });
        response = await response.json();
        return response;

    };
    login = async (auth) => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/auth/token/obtain', {
            method: 'POST',
            body: JSON.stringify(auth),
            headers: {
                "Content-Type": "application/json",
            },
        });
        response = await response.json();
        if (!(response.refresh && response.access)) {
            return {error: 'Error logging in.'}
        } else {
            runInAction(() => {
                this.auth.token = response.access;
                this.auth.refresh = response.refresh;
                this.isLoggedIn = true;
            });
            localStorage.setItem("auth", JSON.stringify(this.auth));
            this.getUserInfo().then();
            return {success: true, ...response}
        }
    };
}

decorate(AuthStore, {
    googleAuth: observable,
    isLoggedIn: observable,
    auth: observable,
    user: observable,
    loggingIn: observable,
    login: action,
    register: action,
    logout: action,
    hydrateStoreWithLocalStorage: action,
    getAuthWithRefresh: action,
    setGoogleToken: action,
});
export default new AuthStore()