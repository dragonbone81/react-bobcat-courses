import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Section from './Section'
import './Schedule.css'
import {List, Header} from 'semantic-ui-react'
import {timesMap, timesArr, daysMap, daysArr, colors} from "../data";

class Schedule extends Component {
    state = {
        colorMap: {},
    };

    componentDidMount() {
        this.setState({
            colorMap: this.mapColors(this.props.sections),
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            colorMap: this.mapColors(newProps.sections),
        })
    }

    render() {
        const timeSpan = timesArr.slice(timesMap[Math.floor(this.props.scheduleInfo.earliest / 100.0) * 100].index, timesMap[Math.ceil(this.props.scheduleInfo.latest / 100.0) * 100 + 100].index);
        return (
            <div className="schedule-inside-container">
                <div className="days-div">
                    <div className="time-name-col"/>
                    {daysArr.map((day) => {
                        return <div key={day} className="day-name-col">{day}</div>
                    })}
                </div>
                <div className="schedule-container">
                    <div className="times-col">
                        {timeSpan.map((time) =>
                            <div key={time} className="time-col">{time}</div>)}
                    </div>
                    {daysArr.map((day) => {
                        return (
                            <div key={day} className="days-col">
                                {timeSpan.map((time, index) => <div key={time} className="day-col">
                                    {index === timeSpan.length - 1 ? <div className="end"/> :
                                        <div className="day-inside"/>}
                                </div>)}
                                {this.getSectionsForDay(this.props.sections, daysMap[day])}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <List celled relaxed>
                        <Header size='large'>Sections</Header>
                        {this.props.sections.map((section) => {
                            return <List.Item key={section.crn}>
                                <List.Content>
                                    <List.Header
                                        target="_blank"
                                        href={`https://mystudentrecord.ucmerced.edu/pls/PROD/xhwschedule.P_ViewCrnDetail?subjcode=${section.course_id.split('-')[0]}&validterm=${201830}&crn=${section.crn}&crsenumb=${section.course_id.split('-')[1]}`}
                                        as='a'>{section.course_id}</List.Header>
                                    <List.Description>
                                        {section.available <= 0 ?
                                            <del>{section.course_name + (section.course_id.endsWith('L') ? ' Lab' : section.course_id.endsWith('D') ? ' Discussion' : '')}</del>
                                            :
                                            section.course_name + (section.course_id.endsWith('L') ? ' Lab' : section.course_id.endsWith('D') ? ' Discussion' : '')}
                                        {(section.available <= 0 ? ' (Full)' : '')}
                                        {(section.days === ' ' || section.hours === 'TBD-TBD') ?
                                            <div><i>(No time for section, probably online)</i></div> : null}
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        })}
                    </List>
                </div>
            </div>
        )
    }

    splitSectionID = (sectionID) => {
        const sectionList = sectionID.split('-');
        return sectionList[0] + '-' + sectionList[1];
    };
    mapColors = (sections) => Array.from(new Set(sections.map(
        (section) => this.splitSectionID(section.course_id)))).reduce((obj, section, index) => {
        obj[section] = colors[index];
        return obj;
    }, {});

    getSectionsForDay = (sections, day) => {
        return sections.filter((section) => section.days.includes(day) && section.hours !== 'TBD-TBD').map((section) => {
            const hours = section.hours.split('-');
            const hoursInt = hours.map((hour) => parseInt(hour.split(":").join(""), 10));
            if (hours[1].includes("pm")) {
                hoursInt[1] += 1200;
                if (hoursInt[0] + 1200 < hoursInt[1]) {
                    hoursInt[0] += 1200;
                }
            }
            let offset = hoursInt[0] % 100 === 0 ? (45 / 2) : (10 + 45 / 2);
            this.props.scheduleInfo.earliest % 100 === 0 ? offset -= 45 / 4 : offset += 0;
            const top = ((hoursInt[0] - this.props.scheduleInfo.earliest) / 100) * 45 + offset;
            const height = ((hoursInt[1] - this.props.scheduleInfo.earliest) / 100) * 45 - top + offset;
            const color = this.state.colorMap[this.splitSectionID(section.course_id)];
            return (
                <Section color={color} key={section.crn} top={top} height={height} section={section}/>
            )
        });
    }
}

Schedule.propTypes = {
    sections: PropTypes.array,
    scheduleInfo: PropTypes.object,
};

export default Schedule