import {observable, action, computed, decorate, configure, runInAction} from 'mobx'

configure({enforceActions: true});

class CourseStore {
    courses = [];
    customEvents = [];
    schedules = [];
    savedSchedules = [];
    currentSavedIndex = 0;
    currentIndex = 0;
    searching = false;
    searchingSaved = false;
    noSchedulesFound = false;
    savingSchedule = false;
    deletingSchedule = false;
    gettingSections = false;
    sections = {};
    gaps = null;
    days = null;
    full = false;
    filterOptionsChanged = false;
    // selectedTermGenerateSchedule = 201910;
    selectedTermWaitlists = 201830;
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
        if (!course.event_name) {
            this.getSections(course).then();
            this.courses.push(course);
        } else {
            if (this.customEvents.filter(event => (event.event_name === course.event_name)).length > 0) {
                const index = this.customEvents.findIndex(event => event.event_name === course.event_name);
                this.customEvents[index] = course;
            }
            else {
                this.customEvents.push(course);
            }
        }
    };
    removeEvent = (eventName) => {
        this.customEvents = this.customEvents.filter((event) => event.event_name !== eventName);
        if (this.courses.length === 0) {
            this.schedules = [];
            this.noSchedulesFound = false;
        } else {
            this.scheduleSearch().then();
        }
    };
    removeCourse = (courseToRemove) => {
        this.courses = this.courses.filter((course) => course !== courseToRemove);
        delete this.sections[courseToRemove];
        if (this.courses.length === 0) {
            this.schedules = [];
            this.noSchedulesFound = false;
        } else {
            this.scheduleSearch().then();
        }
    };

    getUsersWaitlists = async (token) => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/waitlist/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        response = await response.json();
        return response
    };

    addToWaitlist = async (token, crn) => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/notifications/', {
            method: 'POST',
            body: JSON.stringify({crn}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        response = await response.json();
        return response;
    };

    removeFromWaitlist = async (token, crn) => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/waitlist/', {
            method: 'POST',
            body: JSON.stringify({crn}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        response = await response.json();
        return response;
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

    sectionsObjToArrBadCRNS = () => {
        const crns = [];
        for (let course of Object.keys(this.sections)) {
            this.sections[course].forEach((section) => section.selected ? null : crns.push(section.crn))
        }
        return crns;
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
        if (this.courses.length > 0 || this.customEvents.length > 0) {
            /// this is for the backend returning the lecture even when the other courses are full but selected
            const badCRNS = this.sectionsObjToArrBadCRNS();
            if (!this.full) {
                for (let course of Object.keys(this.sections)) {
                    let totalSeatsNonLecture = 0;
                    this.sections[course].forEach((section) => {
                        if (section.selected && section.type !== 'LECT')
                            totalSeatsNonLecture += section.available;
                    });
                    if (totalSeatsNonLecture === 0) {
                        this.sections[course].forEach((section) => badCRNS.push(section.crn));
                    }

                }
            }
            runInAction(() => this.searching = true);
            let response = await fetch('https://cse120-course-planner.herokuapp.com/api/courses/schedule-search/', {
                method: 'POST',
                body: JSON.stringify({
                    course_list: this.courses,
                    term: this.selectedTermGenerateSchedule,
                    custom_events: this.customEvents,
                    search_full: this.full,
                    filters: true,
                    gaps: this.gaps,
                    days: this.days,
                    bad_crns: badCRNS,
                    earliest_time: this.selectedEarliestTime === 'null' ? null : parseInt(this.selectedEarliestTime, 10),
                    latest_time: this.selectedLatestTime === 'null' ? null : parseInt(this.selectedLatestTime, 10),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                response = await response.json();
            } else {
                runInAction(() => {
                    this.noSchedulesFound = true;
                    this.schedules = [];
                    this.searching = false;
                    this.currentIndex = 0;
                });
                return;
            }
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
        }
        else {
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
        if (Array.isArray(response))
            runInAction(() => {
                this.savedSchedules = response;
                this.searchingSaved = false;
            });
        else {
            runInAction(() => {
                this.savedSchedules = [];
                this.searchingSaved = false;
            });
        }
    };

    changeSectionSelection = (index, courseID, value) => {
        this.filterOptionsChanged = true;
        this.sections[courseID][index].selected = value;
        if (this.sections[courseID][index].attached_crn) {
            const foundIndex = this.sections[courseID].findIndex((section) => section.crn === this.sections[courseID][index].attached_crn);
            this.sections[courseID][foundIndex].selected = value;
        }
        else if (this.sections[courseID][index].linked_courses) {
            this.sections[courseID][index].linked_courses.forEach((crn) => {
                const foundIndex = this.sections[courseID].findIndex((section) => section.crn === crn);
                this.sections[courseID][foundIndex].selected = value;
            })
        }
        if (this.sections[courseID][index].lecture_crn && !value) {
            const lectureIndex = this.sections[courseID].findIndex((section) => section.crn === this.sections[courseID][index].lecture_crn);
            const allDeselected = this.sections[courseID][lectureIndex].linked_courses.every((crn) => {
                const linkedIndex = this.sections[courseID].findIndex((section) => section.crn === crn);
                return !this.sections[courseID][linkedIndex].selected;
            });
            if (allDeselected)
                this.sections[courseID][lectureIndex].selected = false;
        }
        if (this.sections[courseID][index].lecture_crn && value) {
            const lectureIndex = this.sections[courseID].findIndex((section) => section.crn === this.sections[courseID][index].lecture_crn);
            this.sections[courseID][lectureIndex].selected = true;
        }
    };

    courseMatchWaitlist = async sectionID => {
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/courses/course-match/', {
            method: 'POST',
            body: JSON.stringify({
                course_list: [sectionID],
                term: this.selectedTermWaitlists,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        response = await response.json();
        if (response[sectionID])
            return this.sections[sectionID] = response[sectionID].map((section) => {
                return {...section, selected: true}
            }).sort((a, b) => {
                return parseInt(a.course_id.split('-')[2], 10) - parseInt(b.course_id.split('-')[2], 10);
            })
    };

    getSections = async sectionID => {
        if (!(sectionID in this.sections)) {
            runInAction(() => this.gettingSections = true);
            let response = await fetch('https://cse120-course-planner.herokuapp.com/api/courses/course-match/', {
                method: 'POST',
                body: JSON.stringify({
                    course_list: [sectionID],
                    term: this.selectedTermGenerateSchedule,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            response = await response.json();
            runInAction(() => this.gettingSections = false);
            if (response[sectionID])
                runInAction(() => this.sections[sectionID] = response[sectionID].map((section) => {
                    return {...section, selected: true}
                }).sort((a, b) => {
                    return parseInt(a.course_id.split('-')[2], 10) - parseInt(b.course_id.split('-')[2], 10);
                }));
        }
    };

    saveSchedule = async token => {
        runInAction(() => this.savingSchedule = true);
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/save-schedule/', {
            method: 'POST',
            body: JSON.stringify({
                term: this.selectedTermGenerateSchedule,
                crns: this.scheduleObjectsToArray(this.getSchedule).filter((section) => section).map((section) => section.crn),
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        runInAction(() => this.savingSchedule = false);
        response = await response.json();
        if (response.code) {
            return {errorToken: "Please ReLogin"}
        }
        return response
    };

    deleteSchedule = async token => {
        runInAction(() => this.deletingSchedule = true);
        const sections = this.scheduleObjectsToArray(this.getSavedSchedule).filter((section) => section);
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/delete-schedule/', {
            method: 'POST',
            body: JSON.stringify({
                term: sections[0].term,
                crns: sections.map((section) => section.crn),
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        response = await response.json();
        if (response.success) {
            runInAction(() => {
                this.savedSchedules = [...this.savedSchedules.slice(0, this.currentSavedIndex), ...this.savedSchedules.slice(this.currentSavedIndex + 1)];
                this.currentSavedIndex = this.currentSavedIndex === 0 ? 0 : this.currentSavedIndex - 1;
            });
        }
        if (response.code) {
            return {errorToken: "Please ReLogin"}
        }
        runInAction(() => this.deletingSchedule = false);
        return response;
    };

    getOptions = async searchQuery => {
        let response = await fetch(`https://cse120-course-planner.herokuapp.com/api/courses/course-search/?course=${searchQuery}&term=${this.selectedTermGenerateSchedule}`);
        response = await response.json();
        return response.map((course) => {
            return {key: course.name, text: course.name + ': ' + course.description, value: course.name}
        })
    };
    getOptionsWaitlist = async searchQuery => {
        let response = await fetch(`https://cse120-course-planner.herokuapp.com/api/courses/course-search/?course=${searchQuery}&term=${this.selectedTermWaitlists}`);
        response = await response.json();
        return response.map((course) => {
            return {key: course.name, text: course.name + ': ' + course.description, value: course.name}
        })
    };

    scheduleObjectsToArray = (schedule) => {
        const scheduleArr = [];
        for (let course of Object.keys(schedule.schedule)) {
            for (let section of Object.keys(schedule.schedule[course])) {
                scheduleArr.push(schedule.schedule[course][section]);
            }
        }
        return scheduleArr;
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
    changeSelectedTermWaitlists = (term) => {
        this.selectedTermWaitlists = term;
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
    customEvents: observable,
    sections: observable,
    savingSchedule: observable,
    deletingSchedule: observable,
    searching: observable,
    searchingSaved: observable,
    schedules: observable,
    savedSchedules: observable,
    currentIndex: observable,
    currentSavedIndex: observable,
    gettingSections: observable,
    gaps: observable,
    days: observable,
    terms: observable,
    earliestTimes: observable,
    latestTimes: observable,
    full: observable,
    selectedTermGenerateSchedule: observable,
    selectedTermWaitlists: observable,
    selectedEarliestTime: observable,
    selectedLatestTime: observable,
    changeSelectedTermGenerateSchedule: action,
    changeSelectedTermWaitlists: action,
    changeSelectedDaysFilter: action,
    changeSelectedGapsFilter: action,
    changeSelectedFullFilter: action,
    addCourse: action,
    filterOptionsChangedRegenerate: action,
    removeCourse: action,
    scheduleSearch: action,
    scrollSchedules: action,
    getSavedSchedules: action,
    getSections: action,
    removeEvent: action,
    scrollSavedSchedules: action,
    unmountSavedSchedules: action,
    changeSelectedEarliestTime: action,
    changeSelectedLatestTime: action,
    changeFilterOptionsChanged: action,
    changeSectionSelection: action,
    saveSchedule: action,
    deleteSchedule: action,
    getSchedule: computed,
    getSavedSchedule: computed,
});
export default new CourseStore()