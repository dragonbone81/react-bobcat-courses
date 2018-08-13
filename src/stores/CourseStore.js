import {observable, action, computed, decorate, configure, runInAction} from 'mobx'

configure({enforceActions: true});

class CourseStore {
    courses = [];
    schedules = [];
    savedSchedules = [];
    currentSavedIndex = 0;
    currentIndex = 0;
    searching = false;
    searchingSaved = false;
    gaps = null;
    days = null;
    full = false;
    // selectedTermGenerateSchedule = 201910;
    selectedTermGenerateSchedule = 201830;
    terms = [
        // {text: 'Spring 2019', value: 201910},
        {text: 'Fall 2018', value: 201830},
        {text: 'Spring 2018', value: 201810},
    ];
    selectedEarliestTime = '800';
    earliestTimes = [
        // {text: 'Earliest?', value: null},
        {text: '8:00am', value: '800'},
        {text: '8:30am', value: '830'},
    ];
    addCourse = (course) => {
        this.courses.push(course);
    };
    removeCourse = (courseToRemove) => {
        this.courses = this.courses.filter((course) => course !== courseToRemove);
    };

    get getSchedule() {
        if (!this.schedules)
            return {};
        return this.schedules.length > 0 ? this.schedules[this.currentIndex] : {};
    }

    get getSavedSchedule() {
        if (!this.savedSchedules)
            return {};
        return this.savedSchedules.length > 0 ? this.savedSchedules[this.currentSavedIndex] : {};
    }

    scrollSavedSchedules = (way) => {
        if (this.savedSchedules.length > 0) {
            way === -1 ? this.currentSavedIndex = (this.currentSavedIndex - 1 < 0) ? (this.savedSchedules.length - 1) : (this.currentSavedIndex - 1)
                :
                this.currentSavedIndex = (this.currentSavedIndex + 1 === this.savedSchedules.length) ? 0 : (this.currentSavedIndex + 1);
        }
    };

    scrollSchedules = (way) => {
        if (this.schedules.length > 0) {
            way === -1 ? this.currentIndex = (this.currentIndex - 1 < 0) ? (this.schedules.length - 1) : (this.currentIndex - 1)
                :
                this.currentIndex = (this.currentIndex + 1 === this.schedules.length) ? 0 : (this.currentIndex + 1);
        }
    };

    scheduleSearch = async () => {
        if (this.courses.length > 0) {
            runInAction(() => this.searching = true);
            let response = await fetch('https://cse120-course-planner.herokuapp.com/api/courses/schedule-search/', {
                method: 'POST',
                body: JSON.stringify({course_list: this.courses, term: 201830, search_full: true}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            response = await response.json();
            runInAction(() => {
                this.schedules = response;
                this.searching = false;
                this.currentIndex = 0;
            });
        } else {
            runInAction(() => this.schedules = []);
        }
    };
    getSavedSchedules = async (token) => {
        runInAction(() => {
            this.searchingSaved = true;
            this.savedSchedules = [];
            this.currentSavedIndex = 0;
        });
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/schedule-dump/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        response = await response.json();
        runInAction(() => {
            this.savedSchedules = response;
            this.searchingSaved = false;
        });
    };
    unmountSavedSchedules = () => {
        this.searchingSaved = false;
        this.savedSchedules = [];
        this.currentSavedIndex = 0;
    };
    changeSelectedTermGenerateSchedule = (term) => {
        this.selectedTermGenerateSchedule = term;
    };
    changeSelectedEarliestTime = (time) => {
        this.selectedEarliestTime = time;
    };
    changeSelectedDaysFilter = (filter) => {
        this.days === filter ? this.days = null : this.days = filter;
    };
    changeSelectedGapsFilter = (filter) => {
        this.gaps === filter ? this.gaps = null : this.gaps = filter;
    };
    changeSelectedFullFilter = () => {
        this.full = !this.full;
    };
}

decorate(CourseStore, {
    courses: observable,
    searching: observable,
    searchingSaved: observable,
    schedules: observable,
    savedSchedules: observable,
    currentIndex: observable,
    currentSavedIndex: observable,
    gaps: observable,
    days: observable,
    terms: observable,
    earliestTimes: observable,
    full: observable,
    selectedTermGenerateSchedule: observable,
    selectedEarliestTime: observable,
    changeSelectedTermGenerateSchedule: action,
    changeSelectedDaysFilter: action,
    changeSelectedGapsFilter: action,
    changeSelectedFullFilter: action,
    addCourse: action,
    removeCourse: action,
    scheduleSearch: action,
    scrollSchedules: action,
    getSavedSchedules: action,
    scrollSavedSchedules: action,
    unmountSavedSchedules: action,
    changeSelectedEarliestTime: action,
    getSchedule: computed,
    getSavedSchedule: computed,
});
export default new CourseStore()