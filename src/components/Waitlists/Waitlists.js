import React, {Component} from 'react'
import {Container, Modal, Form, List, Icon, Header, Card, Grid, Dropdown} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {observe} from 'mobx'
import {toast} from 'react-toastify'

class Waitlists extends Component {
    state = {
        searchValue: '',
        searching: false,
        searchResults: [],
        placeholder: 'Search for Course...',
        sections: [],
        searchingSections: false,
        selectedSection: '',
        modalOpen: false,
        searchingWaitlists: false,
        observeAuth: null,
        waitlists: [],
        addingToWaitlist: false,
        crnAddingToWaitlist: '',
        removingFromWaitlist: false,
        crnAddingRemovingFromWaitlist: '',
    };

    componentDidMount() {
        document.title = "BobcatCourses | Waitlists";
        if (this.props.auth_store.isLoggedIn)
            this.getWaitlists(this.props.auth_store.auth.token).then();

        const observeAuthChange = observe(this.props.auth_store.auth, "token", (change) => {
            this.getWaitlists(this.props.auth_store.auth.token).then();
        });
        this.setState({observeAuth: observeAuthChange})
    }

    componentWillUnmount() {
        this.state.observeAuth();
    }

    handleSearch = async (e, {searchQuery}) => {
        if (searchQuery) {
            this.setState({searchValue: searchQuery, searching: true});
            const response = await this.props.course_store.getOptions(searchQuery);
            this.setState({
                searching: false, searchResults: response.slice(0, 10)
            });
        }
    };
    changeModalState = () => {
        this.setState({modalOpen: !this.state.modalOpen})
    };
    handleSearchChange = (e, {value}) => {
        this.setState({searchValue: value});
        this.getSections(value).then();
    };
    getSections = async (courseID) => {
        this.setState({searchingSections: true, sections: []});
        const response = await this.props.course_store.courseMatch(courseID);
        this.setState({sections: response, searchingSections: false});
    };
    onChangeTerm = (e, {value}) => {
        this.props.course_store.changeSelectedTermWaitlists(value);
        this.setState({
            searchValue: '',
            searchResults: [],
            sections: [],
            selectedSection: '',
            sectionDetailsShown: false,
        });
        this.getWaitlists().then();
    };
    getWaitlists = async () => {
        this.setState({searchingWaitlists: true});
        const response = await this.props.course_store.getUsersWaitlists(this.props.auth_store.auth.token);
        this.setState({
            searchingWaitlists: false, waitlists: response.filter((waitlist) => {
                return parseInt(waitlist.course.term, 10) === this.props.course_store.selectedTermWaitlists;
            })
        });
    };

    addToWaitlist = async (crn) => {
        this.setState({addingToWaitlist: true, crnAddingToWaitlist: crn});
        const response = await this.props.course_store.addToWaitlist(this.props.auth_store.auth.token, crn).then();
        if (response.success) {
            toast.success('Added to waitlist', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            this.getWaitlists().then();
            this.setState({
                sections: this.state.sections.filter((section) => section.crn !== crn),
            })
        } else {
            toast.error('Could not add to waitlist :(', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        this.setState({
            addingToWaitlist: false,
            crnAddingToWaitlist: '',
        });
    };
    removeFromWaitlist = async (crn) => {
        this.setState({removingFromWaitlist: true, crnRemovingFromWaitlist: crn});
        const response = await this.props.course_store.removeFromWaitlist(this.props.auth_store.auth.token, crn).then();
        if (response.success) {
            toast.success('Removed from waitlist', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            this.getWaitlists().then();
        } else {
            toast.error('Sorry, something weird happened :(', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        this.setState({
            removingFromWaitlist: false,
            crnAddingRemovingFromWaitlist: '',
        });
    };

    render() {
        return (
            <div className="flex-container" style={{paddingBottom:30}}>
                {this.props.auth_store.isLoggedIn ?
                    <Container>
                        <Modal size='mini' open={this.state.modalOpen} onClose={this.changeModalState} closeIcon>
                            <Modal.Header>Options</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Select fluid onChange={this.onChangeTerm}
                                                 value={this.props.course_store.selectedTermWaitlists}
                                                 options={this.props.course_store.terms}/>
                                </Form>
                            </Modal.Content>
                        </Modal>
                        <Grid stackable textAlign='center' columns={3} centered>
                            <Grid.Row centered textAlign='center'>
                                <Grid.Column textAlign='center'>
                                    <Header size='large'>Waitlists
                                        - {this.props.course_store.terms.find((term) => term.value === this.props.course_store.selectedTermWaitlists).text}</Header>
                                </Grid.Column>
                                <div style={{marginTop: 5}} className="cog-setting-icon">
                                    <Icon style={{cursor: 'pointer'}} onClick={this.changeModalState} name="edit"/>
                                </div>
                            </Grid.Row>
                            <Grid.Row columns={2} centered>
                                <Grid.Column textAlign='center'>
                                    <Header size='medium'>Search</Header>
                                    <Dropdown
                                        fluid
                                        selection
                                        multiple={false}
                                        search={(options) => options}
                                        options={this.state.searchResults}
                                        placeholder={this.state.placeholder}
                                        onChange={this.handleSearchChange}
                                        onSearchChange={this.handleSearch}
                                        loading={this.state.searching}
                                        value={this.state.searchValue}
                                        minCharacters={1}
                                        selectOnNavigation={false}
                                    />
                                    {this.state.searchingSections &&
                                    <div><i style={{marginTop: 10}} className="spinner fas fa-spinner fa-spin"/></div>}
                                    {this.state.sections.length > 0 ?
                                        <Card fluid>
                                            <Card.Content header='Sections'/>
                                            <Card.Content extra style={{maxHeight: 200, overflowY: 'scroll'}}>
                                                <List size='large' selection verticalAlign='middle'>
                                                    {this.state.sections.map((section) => {
                                                        return this.state.waitlists.map((waitlist) => waitlist.course.crn).includes(section.crn) ?
                                                            <List.Item
                                                                key={section.crn} style={{cursor: 'auto'}}>
                                                                <List.Content className='list-content-grey'>
                                                                    <List.Description>{section.course_id} Already in
                                                                        waitlist</List.Description>
                                                                </List.Content>
                                                            </List.Item>
                                                            :
                                                            <List.Item
                                                                onClick={() => this.addToWaitlist(section.crn)}
                                                                key={section.crn}>
                                                                <List.Content
                                                                    className={section.available > 0 ? 'list-content-green' : 'list-content-red'}>
                                                                    <Grid verticalAlign='middle' stackable
                                                                          textAlign='center' columns={2}
                                                                          centered>
                                                                        <Grid.Column width={13} textAlign='center'>
                                                                            <List.Header>{section.course_id}</List.Header>
                                                                            <List.Description>Spots:
                                                                                ({section.available}/{section.capacity}) </List.Description>
                                                                        </Grid.Column>
                                                                        <Grid.Column width={3} textAlign='center'>
                                                                            <List.Description>
                                                                                {this.state.addingToWaitlist && this.state.crnAddingToWaitlist === section.crn ?
                                                                                    <Icon size="large"
                                                                                          name="spinner"
                                                                                          loading/>
                                                                                    :
                                                                                    <Icon size="large"
                                                                                          name="arrow alternate circle right"/>
                                                                                }
                                                                            </List.Description>
                                                                        </Grid.Column>
                                                                    </Grid>
                                                                </List.Content>
                                                            </List.Item>
                                                    })}
                                                </List>
                                            </Card.Content>
                                        </Card>
                                        :
                                        null
                                    }
                                </Grid.Column>
                                <Grid.Column textAlign='center'>
                                    <Header size='medium'>View</Header>
                                    <Card fluid>
                                        <Card.Content extra style={{maxHeight: 200, overflowY: 'scroll'}}>
                                            {this.state.searchingWaitlists ?
                                                <div><i style={{marginTop: 10}}
                                                        className="spinner fas fa-spinner fa-spin"/>
                                                </div> :
                                                this.state.waitlists.length > 0 ?
                                                    <List size='large' selection verticalAlign='middle'>
                                                        {this.state.waitlists.map((section) => {
                                                            return <List.Item
                                                                onClick={() => this.removeFromWaitlist(section.course.crn)}
                                                                key={section.course.crn}>
                                                                <List.Content
                                                                    className={section.course.available > 0 ? 'list-content-green' : 'list-content-red'}>
                                                                    <Grid relaxed verticalAlign='middle' stackable
                                                                          textAlign='center' columns={3}
                                                                          centered>
                                                                        <Grid.Column
                                                                            style={{paddingLeft: 15}}
                                                                            width={1}
                                                                            textAlign='center'>
                                                                            <List.Description>
                                                                                {this.state.removingFromWaitlist && this.state.crnRemovingFromWaitlist === section.course.crn ?
                                                                                    <Icon size="large"
                                                                                          name="spinner"
                                                                                          loading/>
                                                                                    :
                                                                                    <Icon size="large"
                                                                                          name="arrow alternate circle left"/>
                                                                                }
                                                                            </List.Description>
                                                                        </Grid.Column>
                                                                        <Grid.Column width={7} textAlign='center'>
                                                                            <List.Header>{section.course.course_id}</List.Header>
                                                                            <List.Description>Spots:
                                                                                ({section.course.available}/{section.course.capacity}) </List.Description>
                                                                        </Grid.Column>
                                                                        <Grid.Column width={7} textAlign='center'>
                                                                            <List.Description>People in
                                                                                Waitlist: {section.users}</List.Description>
                                                                        </Grid.Column>
                                                                    </Grid>
                                                                </List.Content>
                                                            </List.Item>
                                                        })}
                                                    </List>
                                                    : <div>You have no waitlisted classes for the term.</div>
                                            }
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                    :
                    <Container style={{textAlign: 'center'}}>
                        <Header size='large'>Waitlists
                            - {this.props.course_store.terms.find((term) => term.value === this.props.course_store.selectedTermWaitlists).text}</Header>
                        {this.props.auth_store.loggingIn ?
                            <div style={{maxWidth: '500px', margin: 'auto', marginBottom: 10, marginTop: 10}}
                                 className="ui warning message">
                                <div style={{textAlign: 'center'}} className="header">
                                    Logging In
                                </div>
                            </div>
                            :
                            <div style={{maxWidth: '500px', margin: 'auto', marginBottom: 10, marginTop: 10}}
                                 className="ui warning message">
                                <div style={{textAlign: 'center'}} className="header">
                                    Please Login
                                </div>
                            </div>
                        }
                    </Container>
                }
            </div>
        )
    }
}

export default inject("course_store", "auth_store")(observer(Waitlists))