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
    logout: action,
    hydrateStoreWithLocalStorage: action,
    getAuthWithRefresh: action,
});
export default new AuthStore()