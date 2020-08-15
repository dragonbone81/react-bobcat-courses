import React from 'react'
import {List, Popup} from 'semantic-ui-react'
import {timesMapFull} from '../../data'

const SectionPopup = (props) => {
    return (
        <Popup
            trigger={props.trigger}
            position='top right'
            on={['hover', 'click']}
        >
            {props.clickedSectionInfo.course_id ? <div>
                    <Popup.Header>{props.clickedSectionInfo.course_id} : {props.clickedSectionInfo.type}</Popup.Header>
                    <Popup.Content>
                        <List>
                            <List.Item>
                                <List.Description>
                                    {props.clickedSectionInfo.course_name}
                                </List.Description>
                            </List.Item>
                            <List.Item>
                                <List.Description>
                                    CRN: {props.clickedSectionInfo.crn}
                                </List.Description>
                            </List.Item>
                            <List.Item>
                                <List.Description>
                                    Hours: {props.clickedSectionInfo.hours}
                                </List.Description>
                            </List.Item>
                            <List.Item>
                                <List.Description>
                                    Room: {props.clickedSectionInfo.room}
                                </List.Description>
                            </List.Item>
                            <List.Item>
                                <List.Description>
                                    Prof: {props.clickedSectionInfo.instructor}
                                </List.Description>
                            </List.Item>
                            <List.Item>
                                <List.Description>
                                    Enrolled: {props.clickedSectionInfo.enrolled} / {props.clickedSectionInfo.capacity}
                                </List.Description>
                            </List.Item>
                        </List>
                    </Popup.Content>
                </div>
                :
                <div>
                    <Popup.Header>{props.clickedSectionInfo.event_name}</Popup.Header>
                    <Popup.Content>
                        <List>
                            <List.Item>
                                <List.Description>
                                    Time: {timesMapFull[props.clickedSectionInfo.start_time.toString()].time} - {timesMapFull[props.clickedSectionInfo.end_time.toString()].time}
                                </List.Description>
                            </List.Item>
                        </List>
                    </Popup.Content>
                </div>
            }
        </Popup>
    )
};

export default SectionPopup
