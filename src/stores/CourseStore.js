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
    noSchedulesFound = false;
    gaps = null;
    days = null;
    full = false;
    filterOptionsChanged = false;
    // selectedTermGenerateSchedule = 201910;
    selectedTermGenerateSchedule = 201830;
    terms = [
        // {text: 'Spring 2019', value: 201910},
        {text: 'Fall 2018', value: 201830},
        {text: 'Spring 2018', value: 201810},
    ];
    selectedEarliestTime = 'null';
    earliestTimes = [
        {text: 'Earliest?', value: 'null'},
        {text: '7:30am', value: '730'},
        {text: '8:00am', value: '800'},
        {text: '8:30am', value: '830'},
        {text: '9:00am', value: '900'},
        {text: '9:30am', value: '930'},
        {text: '10:00am', value: '1000'},
        {text: '10:30am', value: '1030'},
        {text: '11:00am', value: '1100'},
        {text: '11:30am', value: '1130'},
        {text: '12:00pm', value: '1200'},
    ];
    selectedLatestTime = 'null';
    latestTimes = [
        {text: 'Latest?', value: 'null'},
        {text: '3:00pm', value: '1500'},
        {text: '3:30pm', value: '1530'},
        {text: '4:00pm', value: '1600'},
        {text: '4:30pm', value: '1630'},
        {text: '5:00pm', value: '1700'},
        {text: '5:30pm', value: '1730'},
        {text: '6:00pm', value: '1800'},
        {text: '6:30pm', value: '1830'},
        {text: '7:00pm', value: '1900'},
        {text: '7:30pm', value: '1930'},
        {text: '8:00pm', value: '2000'},
        {text: '8:30pm', value: '2030'},
        {text: '9:00pm', value: '2100'},
        {text: '9:30pm', value: '2130'},
        {text: '10:00pm', value: '2200'},
    ];
    addCourse = (course) => {
        this.courses.push(course);
    };
    removeCourse = (courseToRemove) => {
        this.courses = this.courses.filter((course) => course !== courseToRemove);
        if (this.courses.length === 0) {
            this.schedules = [];
            this.noSchedulesFound = false;
        } else {
            this.scheduleSearch().then();
        }
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

    filterOptionsChangedRegenerate = () => {
        if (this.filterOptionsChanged) {
            this.scheduleSearch().then();
            this.filterOptionsChanged = false;
        }
    };
    changeFilterOptionsChanged = () => {
        this.filterOptionsChanged = true;
    };

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
                body: JSON.stringify({
                    course_list: this.courses,
                    term: this.selectedTermGenerateSchedule,
                    search_full: this.full,
                    filters: true,
                    gaps: this.gaps,
                    days: this.days,
                    earliest_time: this.selectedEarliestTime === 'null' ? null : parseInt(this.selectedEarliestTime, 10),
                    latest_time: this.selectedLatestTime === 'null' ? null : parseInt(this.selectedLatestTime, 10),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            response = await response.json();
            if (response.length === 0) {
                runInAction(() => {
                    this.noSchedulesFound = true;
                    this.schedules = [];
                    this.searching = false;
                    this.currentIndex = 0;
                })
            } else {
                runInAction(() => {
                    this.schedules = response;
                    this.searching = false;
                    this.currentIndex = 0;
                });
            }
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

    getOptions = async searchQuery => {
        let response = await fetch(`https://cse120-course-planner.herokuapp.com/api/courses/course-search/?course=${searchQuery}&term=${this.selectedTermGenerateSchedule}`);
        response = await response.json();
        return response.map((course) => {
            return {key: course.name, text: course.name + ': ' + course.description, value: course.name}
        })
    };


    unmountSavedSchedules = () => {
        this.searchingSaved = false;
        this.savedSchedules = [];
        this.currentSavedIndex = 0;
    };
    changeSelectedTermGenerateSchedule = (term) => {
        this.courses = [];
        this.schedules = [];
        this.currentIndex = 0;
        this.selectedTermGenerateSchedule = term;
    };
    changeSelectedEarliestTime = (time) => {
        this.selectedEarliestTime = time;
    };
    changeSelectedLatestTime = (time) => {
        this.selectedLatestTime = time;
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
    latestTimes: observable,
    full: observable,
    selectedTermGenerateSchedule: observable,
    selectedEarliestTime: observable,
    selectedLatestTime: observable,
    changeSelectedTermGenerateSchedule: action,
    changeSelectedDaysFilter: action,
    changeSelectedGapsFilter: action,
    changeSelectedFullFilter: action,
    addCourse: action,
    filterOptionsChangedRegenerate: action,
    removeCourse: action,
    scheduleSearch: action,
    scrollSchedules: action,
    getSavedSchedules: action,
    scrollSavedSchedules: action,
    unmountSavedSchedules: action,
    changeSelectedEarliestTime: action,
    changeSelectedLatestTime: action,
    changeFilterOptionsChanged: action,
    getSchedule: computed,
    getSavedSchedule: computed,
});
export default new CourseStore()