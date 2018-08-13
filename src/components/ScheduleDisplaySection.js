import React from 'react'
import Schedule from './Schedule'

const ScheduleDisplaySection = (props) => {
    return (
        <div className="schedule-column">
            {props.searching ?
                (<i className="spinner fas fa-spinner fa-spin"/>) :
                props.schedulesLength > 0 ?
                    <Schedule scheduleInfo={props.scheduleInfo}
                              sections={props.scheduleObjectsToArray(props.schedule)}/>
                    :
                    props.noSchedulesFound ?
                        <div style={{maxWidth: '300px', marginBottom: 10}} className="ui warning message">
                            <div style={{textAlign: 'center'}} className="header">
                                No Schedules found. Classes either conflict, filters are restricting schedules, or a
                                class is full.
                            </div>
                        </div>
                        :
                        <div style={{maxWidth: '500px', marginBottom: 10}} className="ui warning message">
                            <div style={{textAlign: 'center'}} className="header">
                                Search for courses then generate schedules
                            </div>
                        </div>}
        </div>
    )
};

export default ScheduleDisplaySection