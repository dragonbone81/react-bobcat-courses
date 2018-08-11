import React, {Component} from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react/index";
import {Grid} from 'semantic-ui-react';

class CourseSearch extends Component {
    render() {
        return (
            <Grid>
                {this.props.course_store.courses.map((course) => {
                    return (
                        <Grid.Column key={course} computer={12} mobile={4} tablet={12}>
                            {course} : <button>section</button> <button>x</button>
                        </Grid.Column>
                    )
                })}
            </Grid>
        )
    }
}

CourseSearch.propTypes = {
    course_store: PropTypes.object,
};

export default inject("course_store")(observer(CourseSearch));