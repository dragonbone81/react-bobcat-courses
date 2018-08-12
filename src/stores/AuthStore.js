import {observable, action, computed, decorate, configure, runInAction} from 'mobx'

configure({enforceActions: true});

class AuthStore {
    constructor() {
        this.hydrateStoreWithLocalStorage()
    }

    auth = {
        token: '',
        refresh: '',
    };
    isLoggedIn = false;

    hydrateStoreWithLocalStorage = () => {
        let auth = localStorage.getItem('auth');
        if (auth === null) {
            return;
        }
        auth = JSON.parse(auth);
        if ('token' in auth && 'refresh' in auth) {
            this.auth = auth;
            this.isLoggedIn = true;
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
            return {success: true, ...response}
        }
    };
}

decorate(AuthStore, {
    isLoggedIn: observable,
    login: action,
    logout: action,
    hydrateStoreWithLocalStorage: action,
});
export default new AuthStore()