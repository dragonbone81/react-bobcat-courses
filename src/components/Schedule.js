import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Section from './Section'
import './Schedule.css'

class Schedule extends Component {
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    daysMap = {'Mon': 'M', 'Tue': 'T', 'Wed': 'W', 'Thu': 'R', 'Fri': 'F'};
    times = ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
    state = {
        sections: this.props.sections,
        scheduleInfo: this.props.scheduleInfo,
    };

    render() {
        return (
            <div>
                <div className="days-div">
                    <div className="time-name-col"/>
                    {this.days.map((day) => {
                        return <div key={day} className="day-name-col">{day}</div>
                    })}
                </div>
                <div className="schedule-container">
                    <div className="times-col">
                        {this.times.map((time) => <div key={time} className="time-col">{time}</div>)}
                    </div>
                    {this.days.map((day) => {
                        return (
                            <div key={day} className="days-col">
                                {this.times.map((time) => <div key={time} className="day-col">
                                    <div className="day-inside"/>
                                </div>)}
                                {this.getSectionsForDay(this.props.sections, this.daysMap[day])}
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
            const offset = hoursInt[0] % 100 === 0 ? (45 / 2) : (10 + 45 / 2);
            const top = ((hoursInt[0] - this.state.scheduleInfo.earliest) / 100) * 45 + offset;
            const height = ((hoursInt[1] - this.state.scheduleInfo.earliest) / 100) * 45 - top + offset;

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