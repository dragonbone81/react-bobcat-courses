import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Section from './Section'
import './Schedule.css'
import {timesMap, timesArr, daysMap, daysArr} from "../data";

class Schedule extends Component {
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
            </div>
        )
    }

    getSectionsForDay = (sections, day) => {
        return sections.filter((section) => section.days.includes(day)).map((section) => {
            const hours = section.hours.split('-');
            const hoursInt = hours.map((hour) => parseInt(hour.split(":").join(""), 10));
            hours[1].includes("pm") ? hoursInt[1] += 1200 : null;
            hours[1].includes("pm") && hoursInt[0] + 1200 < hoursInt[1] ? hoursInt[0] += 1200 : null;
            let offset = hoursInt[0] % 100 === 0 ? (45 / 2) : (10 + 45 / 2);
            this.props.scheduleInfo.earliest % 100 === 0 ? offset -= 45 / 4 : offset += 0;
            const top = ((hoursInt[0] - this.props.scheduleInfo.earliest) / 100) * 45 + offset;
            const height = ((hoursInt[1] - this.props.scheduleInfo.earliest) / 100) * 45 - top + offset;

            return (
                <Section key={section.crn} top={top} height={height} section={section}/>
            )
        });
    }
}

Schedule.propTypes = {
    sections: PropTypes.array,
    scheduleInfo: PropTypes.object,
};

export default Schedule