import React from 'react'
import {List, Header} from 'semantic-ui-react'

const SectionsList = ({sections}) => {
    return (
        <List celled relaxed>
            <Header size='large'>Sections</Header>
            {sections.sort((a, b) => {
                if (!a.course_id || !b.course_id) {
                    return -1;
                }
                return parseInt(a.course_id.split('-')[2], 10) - parseInt(b.course_id.split('-')[2], 10);
            }).map((section) => {
                //added section check for courses like BIO1L that don't have lecture
                return section ? <List.Item key={section.crn ? section.crn : section.event_name}>
                    <List.Content>
                        {section.course_id ? <List.Header
                            target="_blank"
                            href={`https://mystudentrecord.ucmerced.edu/pls/PROD/xhwschedule.P_ViewCrnDetail?subjcode=${section.course_id.split('-')[0]}&validterm=${section.term}&crn=${section.crn}&crsenumb=${section.course_id.split('-')[1]}`}
                            as='a'>{section.course_id}</List.Header> : <List.Header>{section.event_name}</List.Header>}
                        {section.course_id ? <List.Description>
                            {section.available <= 0 ?
                                <del>{section.course_name + (section.course_id.endsWith('L') ? ' Lab' : section.course_id.endsWith('D') ? ' Discussion' : '')}</del>
                                :
                                section.course_name + (section.course_id.endsWith('L') ? ' Lab' : section.course_id.endsWith('D') ? ' Discussion' : '')}
                            {(section.available <= 0 ? ' (Full)' : '')}
                            {(section.days === ' ' || section.hours === 'TBD-TBD') ?
                                <div><i>(No time for section, probably online)</i>
                                </div> : null} ({section.crn})
                        </List.Description> : null}
                    </List.Content>
                </List.Item> : null
            })}
            <List.Item>CRN's: {sections.sort((a, b) => {
                if (!a.course_id || !b.course_id) {
                    return -1;
                }
                return parseInt(a.course_id.split('-')[2], 10) - parseInt(b.course_id.split('-')[2], 10);
            }).map((section, index) => section.course_id ? (section.crn + (index === sections.length - 1 ? '' : ', ')) : null)}</List.Item>
        </List>
    )
};

export default SectionsList
