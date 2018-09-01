import React, {Component} from 'react'
import {Form, Header, Container, Image, Grid, Accordion, Icon} from 'semantic-ui-react'
import {toast} from 'react-toastify';


class About extends Component {
    state = {
        name: '',
        email: '',
        message: '',
        accordionActive: false,
    };

    componentDidMount() {
        document.title = "BobcatCourses | About";
    }

    onSubmit = async () => {
        fetch('https://cse120-course-planner.herokuapp.com/api/about-us/', {
            method: 'POST',
            body: JSON.stringify({name: this.state.name, email: this.state.email, message: this.state.message}),
            headers: {
                "Content-Type": "application/json",
            },
        });
        toast.success('Your input has been submitted', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
        this.setState({
            name: '',
            email: '',
            message: '',
        })
    };

    render() {
        return (
            <div style={{backgroundColor: 'rgba(250, 250, 250, 0.8)'}} className="flex-container">
                <Container textAlign="center">
                    <div className="saved-schedules-label">About</div>
                    <Grid divided='vertically' stackable columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Accordion>
                                    <Accordion.Title style={{fontSize: 15}} active={this.state.accordionActive}
                                                     onClick={() => this.setState({accordionActive: !this.state.accordionActive})}>
                                        <Icon name='dropdown'/>
                                        BobcatCourses allows users to easily get email notifications when a
                                        course opens
                                        up, create and view each possible variation of their schedule, and save
                                        preferred schedule options for easy access later.
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.accordionActive}>
                                        <p style={{textAlign: 'left'}}>
                                            <li>BobcatCourses is a schedule planning tool that helps
                                                students at UC Merced quickly and effectively create their class
                                                schedules.
                                            </li>
                                            <br/>
                                            <li>Students are able to view all their schedule options simply by adding
                                                the
                                                specific classes that they need and clicking a button.
                                            </li>
                                            <br/>
                                            <li>Students are also able
                                                to restrict the class options that they see by applying filters to have
                                                classes
                                                only on
                                                specific days or between a specific time frame.
                                            </li>
                                            <br/>
                                            <li>BobcatCourses also allows
                                                students
                                                to personalize their schedules by adding their own custom events to
                                                block
                                                off
                                                time slots
                                                that are already reserved for other activities such as work, sports
                                                practices,
                                                and club
                                                meetings.
                                            </li>
                                        </p>
                                        <b>Made by students for students :)</b>
                                    </Accordion.Content>
                                </Accordion>
                            </Grid.Column>
                            <Grid.Column>
                                <div style={{fontSize: 15, marginBottom: 5}}>Have anything to tell us?</div>
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group widths='equal'>
                                        <Form.Input onChange={({target}) => this.setState({name: target.value})}
                                                    value={this.state.name} fluid placeholder='Name (Optional)'/>
                                        <Form.Input onChange={({target}) => this.setState({email: target.value})}
                                                    value={this.state.email} type="email" fluid
                                                    placeholder='Email Optional'/>
                                    </Form.Group>
                                    <Form.TextArea onChange={({target}) => this.setState({message: target.value})}
                                                   value={this.state.message} required
                                                   placeholder='Anything you want to tell us...'/>
                                    <Form.Button color="black">Submit</Form.Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row centered textAlign="center">
                            <Header size="huge" textAlign='center'> Made with:</Header>
                        </Grid.Row>
                        <Grid.Row verticalAlign='middle' centered textAlign="center" columns={4}>
                            <Grid.Column verticalAlign='middle' textAlign="center">
                                <h2>ReactRouter</h2>
                                <Image verticalAlign='middle' centered
                                       src="https://i.imgur.com/YQjWd5B.png"
                                       alt="" size="tiny"/>
                            </Grid.Column>
                            <Grid.Column textAlign="center">
                                <h2>React</h2>
                                <Image centered
                                       src="https://react-etc.net/files/2017-12/react-hexagon.png"
                                       alt="" size="small"/>
                            </Grid.Column>
                            <Grid.Column textAlign="center">
                                <h2>Django</h2>
                                <Image centered
                                       src="https://i.imgur.com/tHI27ZE.png"
                                       alt="" size="small"/>
                            </Grid.Column>
                            <Grid.Column textAlign="center">
                                <h2>MobX</h2>
                                <Image verticalAlign='middle' centered
                                       src="https://mobx.js.org/docs/mobx.png"
                                       alt="" size="tiny"/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <br/>
                </Container>
            </div>
        )
    }
}

export default About
