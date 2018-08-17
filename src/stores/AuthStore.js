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
    user = {};
    isLoggedIn = false;
    loggingIn = false;
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
    isLoggedIn: observable,
    auth: observable,
    user: observable,
    loggingIn: observable,
    login: action,
    register: action,
    logout: action,
    hydrateStoreWithLocalStorage: action,
    getAuthWithRefresh: action,
});
export default new AuthStore()