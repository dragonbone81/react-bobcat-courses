import React from 'react'
import {List, Popup} from 'semantic-ui-react'

const SectionPopup = (props) => {
    return (
        <Popup
            context={props.clickedSection}
            on='click'
            open={props.popUpOpen}
            onClose={props.handlePopupClose}
            onOpen={props.handlePopupOpen}
            position='top right'
        >
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
        </Popup>
    )
};

export default SectionPopup