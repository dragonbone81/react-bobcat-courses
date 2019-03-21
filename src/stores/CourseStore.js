import {observable, action, computed, decorate, configure, runInAction} from 'mobx'
import {termsMap, monthsMap, dayMapGoogleCodes, dayMapMicrosoftCodes} from '../data'

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
    gaps = 'asc';
    days = 'asc';
    full = true;
    filterOptionsChanged = false;
    // selectedTermWaitlists = 201830;
    selectedTermWaitlists = 201930;
    selectedTermGenerateSchedule = 201930;
    // selectedTermGenerateSchedule = 201830;
    terms = [
        {text: 'Summer 2019', value: 201920},
        {text: 'Fall 2019', value: 201930},
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
                    let type = 'otherType';
                    let allSectionsSameType = true;
                    this.sections[course].forEach((section) => {
                        if (type === 'otherType')
                            type = section.type;
                        else if (section.type !== type) {
                            allSectionsSameType = false;
                        }
                        if (section.selected && section.type !== 'LECT')
                            totalSeatsNonLecture += section.available;
                    });
                    if (totalSeatsNonLecture === 0 && !allSectionsSameType) {
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
            if (response.status === 200 && response.ok) {
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
                hasConflictingFinals: this.getSchedule.info.hasConflictingFinals,
                term: this.selectedTermGenerateSchedule,
                custom_events: this.customEvents,
                crns: this.scheduleObjectsToArray(this.getSchedule).filter((section) => section && section.crn).map((section) => section.crn),
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
        const sections = this.scheduleObjectsToArray(this.getSavedSchedule).filter((section) => section && section.crn);
        let response = await fetch('https://cse120-course-planner.herokuapp.com/api/users/delete-schedule/', {
            method: 'POST',
            body: JSON.stringify({
                term: this.getSavedSchedule.info.term,
                crns: sections.map((section) => section.crn),
                custom_events: this.scheduleObjectsToArray(this.getSavedSchedule).filter((section) => section && section.event_name),
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
        let scheduleArr = [];
        for (let course of Object.keys(schedule.schedule)) {
            scheduleArr = [...scheduleArr, ...schedule.schedule[course]]
        }
        scheduleArr = schedule.custom_events ? [...scheduleArr, ...schedule.custom_events] : scheduleArr;
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
        this.sections = {};
        this.selectedTermGenerateSchedule = term;
        this.customEvents = [];
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
        if (this.days !== filter) {
            this.filterOptionsChanged = true;
            this.days = filter
        }
    };
    changeSelectedGapsFilter = (filter) => {
        if (this.gaps !== filter) {
            this.filterOptionsChanged = true;
            this.gaps = filter
        }
    };
    changeSelectedFullFilter = () => {
        this.full = !this.full;
    };
    saveToGoogle = async (scheduleObject, createGoogleCalendar, googleToken, calendarName) => {
        const schedule = this.scheduleObjectsToArray(scheduleObject);
        const calendar = await createGoogleCalendar(calendarName);
        const calendarID = calendar.id;
        const colorMap = schedule.reduce((acc, course, index) => {
            acc[course.simple_name || course.event_name] = index + 1;
            return acc;
        }, {});
        let customEventsCompleted = false;
        schedule.filter((course) => course && course.days.length > 0 && course.hours !== 'TBD-TBD' && !course.event_name).forEach(async (course) => {
            const year = termsMap[course.term];
            const startMonth = monthsMap[course.dates.split(" ")[0].split("-")[1]];
            const startDay = course.dates.split(" ")[0].split("-")[0];
            let startHour = '';
            let endHour = '';
            let hours = course.hours.split("-");
            if (hours[1].includes("am")) {
                startHour = hours[0].length === 5 ? hours[0] : "0" + hours[0];
                endHour = hours[1].substr(0, hours[1].length - 2).length === 5 ? hours[1].substr(0, hours[1].length - 2) : "0" + hours[1].substr(0, hours[1].length - 2);
            } else {
                const hoursInt = hours.map((hour) => {
                    if (hour.includes("pm")) {
                        return parseInt(hour.substr(0, hours[1].length - 2).split(":").join(""), 10)
                    }
                    return parseInt(hour.split(":").join(""), 10)
                });
                if (!hours[1].startsWith('12')) {
                    hoursInt[1] += 1200;
                    if (hoursInt[0] + 1200 < hoursInt[1]) {
                        hoursInt[0] += 1200;
                    }
                }
                hours = hoursInt.map((hour) => hour.toString());
                if (hours[0].length === 4) {
                    startHour = hours[0].substr(0, 2) + ':' + hours[0].substr(2, 4)
                }
                else if (hours[0].length === 3) {
                    startHour = "0" + hours[0].substr(0, 1) + ':' + hours[0].substr(1, 3)
                }
                if (hours[1].length === 4) {
                    endHour = hours[1].substr(0, 2) + ':' + hours[1].substr(2, 4)

                }
                else if (hours[1].length === 3) {
                    endHour = "0" + hours[1].substr(0, 1) + ':' + hours[1].substr(1, 3)
                }
            }
            const days = course.days.split('').map((day) => dayMapGoogleCodes[day]).join(',');
            const date = new Date(`${year}-${startMonth}-${startDay} ${startHour}:00 PST`);
            let startDayOfWeek = dayMapMicrosoftCodes[course.days.split('').find((day) => dayMapMicrosoftCodes[day] >= date.getDay())];
            if (startDayOfWeek === null || startDayOfWeek === undefined) {
                startDayOfWeek = dayMapMicrosoftCodes[course.days.split('')[0]] + 7
            }
            const event = {
                summary: course.course_id,
                location: course.room,
                description: course.course_name,
                start: {
                    'dateTime': `${year}-${startMonth}-${parseInt(startDay, 10) + startDayOfWeek - date.getDay()}T${startHour}:00`,
                    'timeZone': 'America/Los_Angeles'
                },
                end: {
                    'dateTime': `${year}-${startMonth}-${parseInt(startDay, 10) + startDayOfWeek - date.getDay()}T${endHour}:00`,
                    'timeZone': 'America/Los_Angeles'
                },
                recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${days};COUNT=${course.days.length * 16}`],
                colorId: `${colorMap[course.simple_name]}`,
            };
            fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`, {
                method: "POST",
                body: JSON.stringify(event),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${googleToken}`,
                },
            });
            if (!customEventsCompleted) {
                schedule.filter((course) => course && course.event_name).forEach(async (course) => {
                    let startHour = course.start_time.toString();
                    let endHour = course.end_time.toString();
                    if (startHour.length === 4) {
                        startHour = startHour.substr(0, 2) + ':' + startHour.substr(2, 4)
                    }
                    else if (startHour.length === 3) {
                        startHour = "0" + startHour.substr(0, 1) + ':' + startHour.substr(1, 3)
                    }
                    if (endHour.length === 4) {
                        endHour = endHour.substr(0, 2) + ':' + endHour.substr(2, 4)

                    }
                    else if (endHour.length === 3) {
                        endHour = "0" + endHour.substr(0, 1) + ':' + endHour.substr(1, 3)
                    }
                    const days = course.days.split('').map((day) => dayMapGoogleCodes[day]).join(',');
                    const date = new Date(`${year}-${startMonth}-${startDay} ${startHour}:00 PST`);
                    let startDayOfWeek = dayMapMicrosoftCodes[course.days.split('').find((day) => dayMapMicrosoftCodes[day] >= date.getDay())];
                    if (startDayOfWeek === null || startDayOfWeek === undefined) {
                        startDayOfWeek = dayMapMicrosoftCodes[course.days.split('')[0]] + 7
                    }
                    const event = {
                        summary: course.event_name,
                        start: {
                            'dateTime': `${year}-${startMonth}-${parseInt(startDay, 10) + startDayOfWeek - date.getDay()}T${startHour}:00`,
                            'timeZone': 'America/Los_Angeles'
                        },
                        end: {
                            'dateTime': `${year}-${startMonth}-${parseInt(startDay, 10) + startDayOfWeek - date.getDay()}T${endHour}:00`,
                            'timeZone': 'America/Los_Angeles'
                        },
                        recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${days};COUNT=${course.days.length * 16}`],
                        colorId: `${colorMap[course.event_name]}`,
                    };
                    fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`, {
                        method: "POST",
                        body: JSON.stringify(event),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${googleToken}`,
                        },
                    });
                });
                customEventsCompleted = true;
            }
        });
    };
    saveToMicrosoft = async (scheduleObject, createMicrosoftCalendar, microsoftToken, calendarName) => {
        const schedule = this.scheduleObjectsToArray(scheduleObject);
        let calendar = await createMicrosoftCalendar(calendarName);
        if (calendar.error) {
            const date = Date.now().toString();
            calendar = await createMicrosoftCalendar(calendarName + " " + date.substr(date.length - 9));
        }
        const calendarID = calendar.Id;
        let customEventsCompleted = false;
        schedule.filter((course) => course && course.days.length > 0 && course.hours !== 'TBD-TBD' && !course.event_name).forEach(async (course) => {
            const year = termsMap[course.term];
            const startMonth = monthsMap[course.dates.split(" ")[0].split("-")[1]];
            const startDay = course.dates.split(" ")[0].split("-")[0];
            let startHour = '';
            let endHour = '';
            let hours = course.hours.split("-");
            if (hours[1].includes("am")) {
                startHour = hours[0].length === 5 ? hours[0] : "0" + hours[0];
                endHour = hours[1].substr(0, hours[1].length - 2).length === 5 ? hours[1].substr(0, hours[1].length - 2) : "0" + hours[1].substr(0, hours[1].length - 2);
            } else {
                const hoursInt = hours.map((hour) => {
                    if (hour.includes("pm")) {
                        return parseInt(hour.substr(0, hours[1].length - 2).split(":").join(""), 10)
                    }
                    return parseInt(hour.split(":").join(""), 10)
                });
                if (!hours[1].startsWith('12')) {
                    hoursInt[1] += 1200;
                    if (hoursInt[0] + 1200 < hoursInt[1]) {
                        hoursInt[0] += 1200;
                    }
                }
                hours = hoursInt.map((hour) => hour.toString());
                if (hours[0].length === 4) {
                    startHour = hours[0].substr(0, 2) + ':' + hours[0].substr(2, 4)
                }
                else if (hours[0].length === 3) {
                    startHour = "0" + hours[0].substr(0, 1) + ':' + hours[0].substr(1, 3)
                }
                if (hours[1].length === 4) {
                    endHour = hours[1].substr(0, 2) + ':' + hours[1].substr(2, 4)

                }
                else if (hours[1].length === 3) {
                    endHour = "0" + hours[1].substr(0, 1) + ':' + hours[1].substr(1, 3)
                }
            }
            const days = course.days.split('').map((day) => dayMapMicrosoftCodes[day].toString());
            const event = {
                Subject: course.course_id,
                Body: {
                    Content: course.course_name,
                },
                Location: {
                    DisplayName: course.room,
                },
                Start: {
                    "DateTime": `${year}-${startMonth}-${startDay}T${startHour}:00`,
                    "TimeZone": "Pacific Standard Time"
                },
                End: {
                    "DateTime": `${year}-${startMonth}-${startDay}T${endHour}:00`,
                    "TimeZone": "Pacific Standard Time"
                },
                Recurrence: {
                    Pattern: {
                        Type: 'weekly',
                        Interval: 1,
                        DaysOfWeek: days,
                    },
                    Range: {
                        Type: 'numbered',
                        StartDate: `${year}-${startMonth}-${startDay}`,
                        NumberOfOccurrences: course.days.length * 16,
                    },
                },
            };
            fetch(`https://outlook.office.com/api/v2.0/me/calendars/${calendarID}/events`, {
                method: "POST",
                body: JSON.stringify(event),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${microsoftToken}`,
                },
            });
            if (!customEventsCompleted) {
                schedule.filter((course) => course && course.event_name).forEach(async (course) => {
                    let startHour = course.start_time.toString();
                    let endHour = course.end_time.toString();
                    if (startHour.length === 4) {
                        startHour = startHour.substr(0, 2) + ':' + startHour.substr(2, 4)
                    }
                    else if (startHour.length === 3) {
                        startHour = "0" + startHour.substr(0, 1) + ':' + startHour.substr(1, 3)
                    }
                    if (endHour.length === 4) {
                        endHour = endHour.substr(0, 2) + ':' + endHour.substr(2, 4)

                    }
                    else if (endHour.length === 3) {
                        endHour = "0" + endHour.substr(0, 1) + ':' + endHour.substr(1, 3)
                    }
                    const days = course.days.split('').map((day) => dayMapMicrosoftCodes[day].toString());
                    const event = {
                        Subject: course.event_name,
                        Start: {
                            "DateTime": `${year}-${startMonth}-${startDay}T${startHour}:00`,
                            "TimeZone": "Pacific Standard Time"
                        },
                        End: {
                            "DateTime": `${year}-${startMonth}-${startDay}T${endHour}:00`,
                            "TimeZone": "Pacific Standard Time"
                        },
                        Recurrence: {
                            Pattern: {
                                Type: 'weekly',
                                Interval: 1,
                                DaysOfWeek: days,
                            },
                            Range: {
                                Type: 'numbered',
                                StartDate: `${year}-${startMonth}-${startDay}`,
                                NumberOfOccurrences: course.days.length * 16,
                            },
                        },
                    };
                    fetch(`https://outlook.office.com/api/v2.0/me/calendars/${calendarID}/events`, {
                        method: "POST",
                        body: JSON.stringify(event),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${microsoftToken}`,
                        },
                    });
                });
                customEventsCompleted = true;
            }
        });
    };
    createICS = (scheduleObject) => {
        const schedule = this.scheduleObjectsToArray(scheduleObject);
        let customEventsCompleted = false;
        let ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:BobcatCourses\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n`;
        schedule.filter((course) => course && course.days.length > 0 && course.hours !== 'TBD-TBD' && !course.event_name).forEach((course) => {
            const year = termsMap[course.term];
            const startMonth = monthsMap[course.dates.split(" ")[0].split("-")[1]];
            const startDay = course.dates.split(" ")[0].split("-")[0];
            let startHour = '';
            let endHour = '';
            let hours = course.hours.split("-");
            if (hours[1].includes("am")) {
                startHour = hours[0].length === 5 ? hours[0] : "0" + hours[0];
                endHour = hours[1].substr(0, hours[1].length - 2).length === 5 ? hours[1].substr(0, hours[1].length - 2) : "0" + hours[1].substr(0, hours[1].length - 2);
            } else {
                const hoursInt = hours.map((hour) => {
                    if (hour.includes("pm")) {
                        return parseInt(hour.substr(0, hours[1].length - 2).split(":").join(""), 10)
                    }
                    return parseInt(hour.split(":").join(""), 10)
                });
                if (!hours[1].startsWith('12')) {
                    hoursInt[1] += 1200;
                    if (hoursInt[0] + 1200 < hoursInt[1]) {
                        hoursInt[0] += 1200;
                    }
                }
                hours = hoursInt.map((hour) => hour.toString());
                if (hours[0].length === 4) {
                    startHour = hours[0].substr(0, 2) + ':' + hours[0].substr(2, 4)
                }
                else if (hours[0].length === 3) {
                    startHour = "0" + hours[0].substr(0, 1) + ':' + hours[0].substr(1, 3)
                }
                if (hours[1].length === 4) {
                    endHour = hours[1].substr(0, 2) + ':' + hours[1].substr(2, 4)

                }
                else if (hours[1].length === 3) {
                    endHour = "0" + hours[1].substr(0, 1) + ':' + hours[1].substr(1, 3)
                }
            }
            const days = course.days.split('').map((day) => dayMapGoogleCodes[day]).join(',');
            const startTime = new Date(year + '-' + startMonth + '-' + startDay + ' ' + startHour + ':00 PST');
            const endTime = new Date(year + '-' + startMonth + '-' + startDay + ' ' + endHour + ':00 PST');
            ics += `BEGIN:VEVENT\r\nUID:${course.crn}\r\nSUMMARY: ${course.course_id}\r\nRRULE:FREQ=WEEKLY;BYDAY=${days};COUNT=${course.days.length * 16}\r\nDTSTART:${startTime.getUTCFullYear()}${(startTime.getUTCMonth() + 1).toString().padStart(2, '0')}${startTime.getUTCDate().toString().padStart(2, '0')}T${startTime.getUTCHours().toString().padStart(2, '0')}${startTime.getUTCMinutes().toString().padStart(2, '0')}00Z\r\nDTEND:${endTime.getUTCFullYear()}${(endTime.getUTCMonth() + 1).toString().padStart(2, '0')}${endTime.getUTCDate().toString().padStart(2, '0')}T${endTime.getUTCHours().toString().padStart(2, '0')}${endTime.getUTCMinutes().toString().padStart(2, '0')}00Z\r\nDTSTAMP:${startTime.getUTCFullYear()}${(startTime.getUTCMonth() + 1).toString().padStart(2, '0')}${startTime.getUTCDate().toString().padStart(2, '0')}T${startTime.getUTCHours().toString().padStart(2, '0')}${startTime.getUTCMinutes().toString().padStart(2, '0')}00Z\r\nDESCRIPTION:${course.course_name}\r\nEND:VEVENT\r\n`;
            if (!customEventsCompleted) {
                schedule.filter((course) => course && course.event_name).forEach(async (course) => {
                    let startHour = course.start_time.toString();
                    let endHour = course.end_time.toString();
                    if (startHour.length === 4) {
                        startHour = startHour.substr(0, 2) + ':' + startHour.substr(2, 4)
                    }
                    else if (startHour.length === 3) {
                        startHour = "0" + startHour.substr(0, 1) + ':' + startHour.substr(1, 3)
                    }
                    if (endHour.length === 4) {
                        endHour = endHour.substr(0, 2) + ':' + endHour.substr(2, 4)

                    }
                    else if (endHour.length === 3) {
                        endHour = "0" + endHour.substr(0, 1) + ':' + endHour.substr(1, 3)
                    }
                    const days = course.days.split('').map((day) => dayMapGoogleCodes[day]).join(',');
                    const startTime = new Date(year + '-' + startMonth + '-' + startDay + ' ' + startHour + ':00 PST');
                    const endTime = new Date(year + '-' + startMonth + '-' + startDay + ' ' + endHour + ':00 PST');
                    ics += `BEGIN:VEVENT
UID:${course.event_name}
SUMMARY: ${course.event_name}
RRULE:FREQ=WEEKLY;BYDAY=${days};COUNT=${course.days.length * 16}
DTSTART:${startTime.getUTCFullYear()}${(startTime.getUTCMonth() + 1).toString().padStart(2, '0')}${startTime.getUTCDate().toString().padStart(2, '0')}T${startTime.getUTCHours().toString().padStart(2, '0')}${startTime.getUTCMinutes().toString().padStart(2, '0')}00Z
DTEND:${endTime.getUTCFullYear()}${(endTime.getUTCMonth() + 1).toString().padStart(2, '0')}${endTime.getUTCDate().toString().padStart(2, '0')}T${endTime.getUTCHours().toString().padStart(2, '0')}${endTime.getUTCMinutes().toString().padStart(2, '0')}00Z
DTSTAMP:${startTime.getUTCFullYear()}${(startTime.getUTCMonth() + 1).toString().padStart(2, '0')}${startTime.getUTCDate().toString().padStart(2, '0')}T${startTime.getUTCHours().toString().padStart(2, '0')}${startTime.getUTCMinutes().toString().padStart(2, '0')}00Z
END:VEVENT\r\n`;
                });
                customEventsCompleted = true;
            }
        });

        ics += "END:VCALENDAR";
        const data = new Blob([ics], {type: 'text/calendar; charset=utf-8'});
        const url = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', 'bobcatCoursesCalendar.ics');
        tempLink.click();
    }
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
