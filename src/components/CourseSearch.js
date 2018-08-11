import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import PropTypes from "prop-types";


class CourseSearch extends Component {
    state = {
        options: [],
        loading: false,
        minCharacters: 3,
        value: '',
        placeholder: 'Add Courses',
        error: false,
    };
    getOptions = async searchQuery => {
        let response = await fetch(`https://cse120-course-planner.herokuapp.com/api/courses/course-search/?course=${searchQuery}&term=201830`);
        response = await response.json();
        return response.map((course) => {
            return {key: course.name, text: course.name + ': ' + course.description, value: course.name}
        })
    };
    handleSearchChange = (e, {searchQuery}) => {
        if (searchQuery.length >= 3) {
            this.setState({loading: true});
            this.getOptions(searchQuery).then((response) => {
                    this.setState({
                        options: response.slice(0, 10),
                        loading: false,
                    })
                }
            )
        }
    };
    handleChange = (e, {value}) => {
        if (!this.props.course_store.courses.includes(value)) {
            this.props.course_store.addCourse(value);
            this.setState({error: false, placeholder: 'Add more...'});
        } else {
            this.setState({error: true, placeholder: 'Add more...'});
        }
    };

    filterOutChosen = (options) => {
        return options.filter((option) => !this.props.course_store.courses.includes(option.key))
    };

    render() {
        const {error, options, loading, minCharacters, value, placeholder} = this.state;
        return (
            <div>
                <Dropdown
                    fluid
                    selection
                    multiple={false}
                    search={this.filterOutChosen}
                    options={options}
                    placeholder={placeholder}
                    onChange={this.handleChange}
                    onSearchChange={this.handleSearchChange}
                    loading={loading}
                    value={value}
                    minCharacters={minCharacters}
                    selectOnNavigation={false}
                    error={error}
                    {...this.props}
                />
                {this.state.error ? <p>Course already entered</p> : null}
            </div>
        )
    }
}

CourseSearch.propTypes = {
    course_store: PropTypes.object,
};

export default inject("course_store")(observer(CourseSearch));