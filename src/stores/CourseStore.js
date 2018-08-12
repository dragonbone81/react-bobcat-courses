import {observable, action, computed, flow, decorate, configure, runInAction} from 'mobx'

configure({enforceActions: true});

class CourseStore {
    courses = [];
    schedules = [];
    currentIndex = 0;
    searching = false;
    addCourse = (course) => {
        this.courses.push(course);
    };
    removeCourse = (courseToRemove) => {
        this.courses = this.courses.filter((course) => course !== courseToRemove);
    };

    get getSchedule() {
        return this.schedules ? this.schedules[this.currentIndex] : [];
    }

    scrollSchedules = (way) => {
        way === -1 ? this.currentIndex = (this.currentIndex - 1 < 0) ? (this.schedules.length - 1) : (this.currentIndex - 1)
            :
            this.currentIndex = (this.currentIndex + 1 === this.schedules.length) ? 0 : (this.currentIndex + 1);
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
    }
}

decorate(CourseStore, {
    courses: observable,
    searching: observable,
    schedules: observable,
    currentIndex: observable,
    addCourse: action,
    removeCourse: action,
    scheduleSearch: action,
    scrollSchedules: action,
    getSchedule: computed,
});
export default new CourseStore()