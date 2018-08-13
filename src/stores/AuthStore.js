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
    isLoggedIn = false;

    hydrateStoreWithLocalStorage = async () => {
        let auth = localStorage.getItem('auth');
        if (auth === null) {
            return;
        }
        auth = JSON.parse(auth);
        if ('token' in auth && 'refresh' in auth) {
            runInAction(() => {
                this.auth = auth;
                this.isLoggedIn = true;
            });
            let response = await fetch('https://cse120-course-planner.herokuapp.com/api/auth/token/refresh', {
                method: 'POST',
                body: JSON.stringify({refresh: auth.refresh}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            response = await response.json();
            runInAction(() => {
                this.auth.token = response.access;
            });
            localStorage.setItem("auth", JSON.stringify(this.auth));
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