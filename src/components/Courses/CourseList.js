import React, {Component} from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import '../../App.css'

class CourseSearch extends Component {
    render() {
        return (
            <div className='course-list'>
                {this.props.course_store.courses.map((course) => {
                    return (
                        <div key={course} className="course-item">
                            {course} :
                            <div className="course-list-options">
                                <button onClick={() => this.props.openSectionsModal(course)}
                                        className="ui button tiny grey"
                                >Sections
                                </button>
                                <button onClick={() => this.props.course_store.removeCourse(course)}
                                        className="ui icon button tiny pink">
                                    <i className="fas fa-times"/>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

CourseSearch.propTypes = {
    course_store: PropTypes.object,
};

export default inject("course_store")(observer(CourseSearch));