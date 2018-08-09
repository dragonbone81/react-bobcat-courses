import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Schedule.css'

class Schedule extends Component {
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    daysMap = {'Mon': 'M', 'Tue': 'T', 'Wed': 'W', 'Thu': 'R', 'Fri': 'F'};
    times = ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
    // schedule = getSchedule(this.props.schedule);
    state = {
        schedule: {},
    };

    componentDidMount() {
        this.setState({
            schedule: this.getSchedule(this.props.schedule)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            schedule: this.getSchedule(nextProps.schedule)
        })
    }

    render() {
        return (
            <div className="schedule">
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
                                {this.state.schedule[this.daysMap[day]]}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    getSchedule = (sched) => {
        const courses = [];
        for (let course of Object.keys(sched.schedule)) {
            courses.push(sched.schedule[course])
        }
        const days = {'M': [], 'T': [], 'W': [], 'R': [], 'F': []};
        const noday = [];
        for (let course of courses) {
            for (let section of Object.keys(course)) {
                const section_days = course[section].days.split('');
                let hours = course[section].hours.split('-');
                const hoursInt = hours.map((hour) => parseInt(hour.split(":").join(""), 10));
                if (hours[1].includes("pm")) {
                    hoursInt[1] += 1200;
                    if (hoursInt[0] + 1200 < hoursInt[1])
                        hoursInt[0] += 1200;
                }
                // course[section].hours = hoursInt;
                if (section_days.length === 0 || section_days[0] === " ") {
                    noday.push(course[section]);
                    continue
                }
                for (let day of section_days) {
                    const top = ((hoursInt[0] - sched.info.earliest) / 100) * 45;
                    const height = ((hoursInt[1] - sched.info.earliest) / 100) * 45 - top;
                    days[day].push(
                        <div key={course[section].crn} className="hour-slot" style={{
                            width: '100%',
                            opacity: .7,
                            position: 'absolute',
                            zIndex: 1,
                            top: top,
                            backgroundColor: 'rgb(200, 150, 0)',
                            height: height,
                            display: 'block',
                        }}>
                            <div className="title" style={{opacity: 1, fontSize: 14}}>{course[section].course_id}</div>
                        </div>)
                }
            }
        }
        return days
    }
}

Schedule.propTypes = {
    schedule: PropTypes.object,
};

export default Schedule