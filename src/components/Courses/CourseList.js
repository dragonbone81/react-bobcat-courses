import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Icon} from 'semantic-ui-react'
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
                                <Button onClick={() => this.props.openSectionsModal(course)}
                                        color="grey" size="tiny"
                                >Sections
                                </Button>
                                <Button icon onClick={() => this.props.course_store.removeCourse(course)}
                                        color="pink" size="tiny">
                                    <Icon name="close"/>
                                </Button>
                            </div>
                        </div>
                    )
                })}
                {this.props.course_store.customEvents.map((event) => {
                    return (
                        <div key={event.event_name} className="course-item">
                            {event.event_name} :
                            <div className="course-list-options">
                                <Button onClick={() => this.props.editSection(event.event_name)}
                                        color="grey" size="tiny"
                                >Edit
                                </Button>
                                <Button icon onClick={() => this.props.course_store.removeEvent(event.event_name)}
                                        color="pink" size="tiny">
                                    <Icon name="close"/>
                                </Button>
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