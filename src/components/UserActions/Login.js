import React, {Component} from 'react'
import {Message, Button, Form, Icon} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";
import {withRouter, Link} from "react-router-dom";


class Login extends Component {
    state = {
        username: '',
        password: '',
        error: {
            header: '',
            message: '',
        },
        isError: false,
        isLoggingIn: false,
    };
    componentDidMount() {
        document.title = "BobcatCourses | Login";
    }
    handleUsernameChange = ({target}) => {
        this.setState({username: target.value});
    };
    handlePasswordChange = ({target}) => {
        this.setState({password: target.value});
    };
    handleSubmit = () => {
        this.setState({isError: false});
        if (!this.state.username || !this.state.password) {
            this.setState({
                error: {
                    header: 'Please fill out all fields.',
                    message: null,
                },
                isError: true,
            });
            return;
        }
        this.login().then();
    };
    login = async () => {
        this.setState({isLoggingIn: true});
        const response = await this.props.auth_store.login({
            username: this.state.username,
            password: this.state.password
        });
        this.setState({isLoggingIn: false});
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
            <div className="login-form">
                <Form success={this.state.isLoggingIn} error={this.state.isError}
                      onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <div
                            style={{paddingTop: 20, fontSize: 100, textAlign: 'center', color: 'rgb(59, 157, 244)'}}>
                            <Icon name="book"/>
                        </div>
                    </Form.Field>
                    <Message
                        error
                        header={this.state.error.header}
                        content={this.state.error.message}
                    />
                    {this.state.isLoggingIn ?
                        <div style={{textAlign: 'center'}}>
                            <Message
                                success
                                header='Logging In...'
                                content={null}
                            />
                            <Icon size="huge" loading name="spinner"/>
                        </div>
                        :
                        <div>
                            <Form.Field>
                                <input autoComplete="on" type="text" autoCorrect="off" autoCapitalize="none"
                                       onChange={this.handleUsernameChange} value={this.state.username}
                                       placeholder='Username...'/>
                            </Form.Field>
                            <Form.Field>
                                <input autoComplete="on" onChange={this.handlePasswordChange}
                                       value={this.state.password}
                                       placeholder='Password...' type="password"/>
                            </Form.Field>
                            <Form.Field>
                                <Button color='yellow' fluid>Login</Button>
                            </Form.Field>
                        </div>
                    }
                </Form>
                <br/>
                <p><Link to="/register">Not Registered?</Link> | <Link to="/forgot-password">Forgot
                    Password? </Link></p>
            </div>
        )
    }
}

Login.propTypes = {
    auth_store: PropTypes.object,
};
export default withRouter(inject("auth_store")(observer(Login)))