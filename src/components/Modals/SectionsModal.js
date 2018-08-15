import React, {Component} from 'react'
import {Table, Dimmer, Loader, Checkbox, Modal} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";

class SectionsModal extends Component {
    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.changeModalState} closeIcon>
                <Modal.Header>Sections</Modal.Header>
                <Modal.Content scrolling>
                    {this.props.course_store.gettingSections ?
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer> : null}
                    <Table selectable unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell/>
                                <Table.HeaderCell>Section</Table.HeaderCell>
                                <Table.HeaderCell>Enrolled</Table.HeaderCell>
                                <Table.HeaderCell>Time</Table.HeaderCell>
                                <Table.HeaderCell>Days</Table.HeaderCell>
                                <Table.HeaderCell>Professor</Table.HeaderCell>
                                <Table.HeaderCell>Location</Table.HeaderCell>
                                <Table.HeaderCell>Units</Table.HeaderCell>
                                <Table.HeaderCell>CRN</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.props.course_store.sections[this.props.section] ? this.props.course_store.sections[this.props.section].map((section, index) => {
                                return (
                                    <Table.Row
                                        onClick={() => this.props.course_store.changeSectionSelection(index, this.props.section, !section.selected)}
                                        key={section.crn}>
                                        <Table.Cell><Checkbox
                                            checked={section.selected}/></Table.Cell>
                                        <Table.Cell>{section.course_id.split('-')[2] + ' ' + section.type}</Table.Cell>
                                        <Table.Cell>{section.enrolled + ' / ' + section.capacity}</Table.Cell>
                                        <Table.Cell>{section.hours}</Table.Cell>
                                        <Table.Cell>{section.days}</Table.Cell>
                                        <Table.Cell>{section.instructor}</Table.Cell>
                                        <Table.Cell>{section.room}</Table.Cell>
                                        <Table.Cell>{section.units}</Table.Cell>
                                        <Table.Cell>{section.crn}</Table.Cell>
                                    </Table.Row>
                                )
                            }) : null}
                        </Table.Body>
                    </Table>
                </Modal.Content>
            </Modal>
        )
    }
}


export default inject("course_store")(observer(SectionsModal))