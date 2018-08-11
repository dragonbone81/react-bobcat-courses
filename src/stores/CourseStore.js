import {observable, action, computed, flow, decorate, configure} from 'mobx'

configure({enforceActions: true});

class CourseStore {
    courses = [];
    addCourse = (course) => {
        this.courses.push(course);
    }
}

decorate(CourseStore, {
    courses: observable,
    addCourse: action,
});
export default new CourseStore()