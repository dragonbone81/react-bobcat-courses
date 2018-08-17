import React, {Component} from 'react'
import {Message, Button, Form, Icon} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";
import {withRouter, Link} from "react-router-dom";


class Register extends Component {
    state = {
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
        error: {
            header: '',
            message: '',
        },
        isError: false,
        isRegistering: false,
    };

    componentDidMount() {
        document.title = "BobcatCourses | Register";
    }

    handleSubmit = () => {
        this.setState({isError: false});
        if (!this.state.username || !this.state.password) {
            this.setState({
                error: {
                    header: 'Please username and password',
                    message: null,
                },
                isError: true,
            });
            return;
        }
        this.register().then();
    };
    register = async () => {
        this.setState({isRegistering: true});
        const response = await this.props.auth_store.register({
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
        });
        this.setState({isRegistering: false});
        if ('error' in response) {
            this.setState({
                isError: true,
                error: {
                    header: response.error,
                    message: null,
                }
            });
            return;
        }
        if (response.success) {
            this.setState({
                isError: false,
            });
            this.props.history.push('/schedules/search');
        }
    };

    render() {
        return (
            <div className="register-form">
                <Form success={this.state.isRegistering} error={this.state.isError}
                      onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <div
                            style={{paddingTop: 20, fontSize: 100, textAlign: 'center', color: 'rgb(59, 157, 244)'}}>
                            <Icon name="user"/>
                        </div>
                    </Form.Field>
                    <Message
                        error
                        header={this.state.error.header}
                        content={this.state.error.message}
                    />
                    {this.state.isRegistering ?
                        <div style={{textAlign: 'center'}}>
                            <Message
                                success
                                header='Registering You...'
                                content={null}
                            />
                            <Icon size="huge" loading name="spinner"/>
                        </div>
                        :
                        <div>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <input type="text" autoCorrect="off" autoCapitalize="none" onChange={({target}) => {
                                        this.setState({username: target.value})
                                    }} value={this.state.username}
                                           placeholder='Username...'/>
                                </Form.Field>
                                <Form.Field>
                                    <input onChange={({target}) => {
                                        this.setState({email: target.value})
                                    }} value={this.state.email}
                                           placeholder='Email...' type="email"/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <input onChange={({target}) => {
                                        this.setState({firstname: target.value})
                                    }} value={this.state.firstname}
                                           placeholder='First Name...'/>
                                </Form.Field>
                                <Form.Field>
                                    <input onChange={({target}) => {
                                        this.setState({lastname: target.value})
                                    }} value={this.state.lastname}
                                           placeholder='Last Name...'/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <input onChange={({target}) => {
                                    this.setState({password: target.value})
                                }} value={this.state.password}
                                       placeholder='Password...' type="password"/>
                            </Form.Field>
                            <Form.Field>
                                <Button color='yellow' fluid>Register</Button>
                            </Form.Field>
                        </div>
                    }
                </Form>
                <br/>
                <p>Already Registered? <Link to="/login">Login here.</Link></p>
            </div>
        )
    }
}

Register.propTypes = {
    auth_store: PropTypes.object,
};
export default withRouter(inject("auth_store")(observer(Register)))