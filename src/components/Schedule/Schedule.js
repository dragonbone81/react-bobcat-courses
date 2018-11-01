import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SectionPopup from './SectionPopup'
import SectionsList from '../Courses/SectionsList'
import './Schedule.css'
import {Segment} from 'semantic-ui-react';
import {timesMap, timesArr, daysMap, daysArr, colors} from "../../data";

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
                {this.props.sections.some((section) => section.available === 0) &&
                <Segment size='big' inverted color='red' secondary>This schedule has a full section</Segment>}
                {this.props.scheduleInfo.hasConflictingFinals &&
                <Segment size='big' inverted color='red' secondary>This schedule has conflicting final times</Segment>}
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
                <SectionsList sections={this.props.sections} term={this.props.term}/>
            </div>
        )
    }

    splitSectionID = (sectionID) => {
        if (!sectionID)
            return '0';
        const sectionList = sectionID.split('-');
        return sectionList[0] + '-' + sectionList[1];
    };
    mapColors = (sections) => Array.from(new Set(sections.map(
        //added section check for classes like BIO1L that don't have a lecture
        (section) => section ? this.splitSectionID(section.course_id) : []))).reduce((obj, section, index) => {
        obj[section] = colors[index];
        return obj;
    }, {});

    getSectionsForDay = (sections, day) => {
        //added section check for classes like BIO1L that don't have a lecture
        return sections.filter((section) => section && section.days.includes(day) && section.hours !== 'TBD-TBD').map((section) => {
            let hoursInt = [];
            if (section.hours && !section.start_time && !section.end_time) {
                const hours = section.hours.split('-');
                hoursInt = hours.map((hour) => {
                    hour = hour.split(":").join("");
                    if (hour.includes('am') || hour.includes('pm')) {
                        let minuteStr = Math.floor((parseInt(hour.substr(hour.length - 4).substr(0, 2), 10) / 60) * 100).toString();
                        parseInt(minuteStr, 10) < 10 ? minuteStr += '0' : minuteStr += '';
                        return parseInt(hour.substr(0, hour.length - 4) + minuteStr, 10);
                    }
                    else {
                        let minuteStr = Math.floor((parseInt(hour.substr(hour.length - 2), 10) / 60) * 100).toString();
                        parseInt(minuteStr, 10) < 10 ? minuteStr += '0' : minuteStr += '';
                        return parseInt(hour.substr(0, hour.length - 2) + minuteStr, 10);

                    }
                });
                if (hours[1].includes("pm") && !hours[1].startsWith('12')) {
                    hoursInt[1] += 1200;
                    if (hoursInt[0] + 1200 < hoursInt[1]) {
                        hoursInt[0] += 1200;
                    }
                }
            } else if (section.start_time && section.end_time) {
                let startStr = section.start_time.toString();
                let minuteStrStart = Math.floor((parseInt(startStr.substr(startStr.length - 2), 10) / 60) * 100).toString();
                parseInt(minuteStrStart, 10) < 10 ? minuteStrStart += '0' : minuteStrStart += '';
                hoursInt.push(parseInt(startStr.substr(0, startStr.length - 2) + minuteStrStart, 10));

                let endStr = section.end_time.toString();
                let minuteStrEnd = Math.floor((parseInt(endStr.substr(endStr.length - 2), 10) / 60) * 100).toString();
                parseInt(minuteStrEnd, 10) < 10 ? minuteStrEnd += '0' : minuteStrEnd += '';
                hoursInt.push(parseInt(endStr.substr(0, endStr.length - 2) + minuteStrEnd, 10));
            }
            const earliest = this.props.scheduleInfo.earliest % 100 === 0 ? this.props.scheduleInfo.earliest : this.props.scheduleInfo.earliest - 30;
            const top = 11.25 + (((hoursInt[0] - earliest) / 100) * 45);
            const height = ((hoursInt[1] - hoursInt[0]) / 100) * 45;
            const color = this.state.colorMap[this.splitSectionID(section.course_id)];
            const sectionComponent =
                <div key={section.crn} className="hour-slot" style={{
                    width: '100%',
                    position: 'absolute',
                    zIndex: 1,
                    top: top,
                    borderLeft: `3px solid ${color ? color.slice(0, -6).replace('rgba', 'rgb') + ')' : null}`,
                    backgroundColor: color,
                    background: color,
                    height: height,
                    display: 'block',
                    borderRadius: 5,
                    cursor: 'pointer',
                    color: '#5b5b5b'
                }}>
                    <div className="title"
                         style={{fontSize: 14}}>{section.course_id ? section.course_id : section.event_name}
                    </div>
                </div>;
            return (
                <SectionPopup key={section.crn || section.event_name} trigger={sectionComponent}
                              clickedSectionInfo={section}
                              position='top center'/>
            )
        });
    }
}

Schedule.propTypes = {
    sections: PropTypes.array,
    scheduleInfo: PropTypes.object,
};

export default Schedule