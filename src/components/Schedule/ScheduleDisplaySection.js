import React from 'react'
import {Icon} from 'semantic-ui-react'
import Schedule from './Schedule'

const ScheduleDisplaySection = (props) => {
    return (
        <div className="schedule-column">
            {props.searching ?
                (<Icon loading size="huge" name="spinner"/>) :
                props.schedulesLength > 0 ?
                    <Schedule scheduleInfo={props.scheduleInfo}
                              sections={props.scheduleObjectsToArray(props.schedule)} term={props.term}/>
                    :
                    props.noSchedulesFound ?
                        <div style={{maxWidth: '300px', marginBottom: 10}} className="ui warning message">
                            <div style={{textAlign: 'center'}} className="header">
                                No Schedules found. Classes either conflict, filters are restricting schedules, or a
                                class is full.
                            </div>
                        </div>
                        :
                        props.savedSchedulesRendering ?
                            <div style={{maxWidth: '500px', marginBottom: 10}} className="ui warning message">
                                <div style={{textAlign: 'center'}} className="header">
                                    You don't have any saved schedules.
                                </div>
                            </div>
                            :
                            <div style={{maxWidth: '500px', marginBottom: 10}} className="ui warning message">
                                <div style={{textAlign: 'center'}} className="header">
                                    Search for courses then generate schedules.
                                </div>
                            </div>
            }
        </div>
    )
};

export default ScheduleDisplaySection