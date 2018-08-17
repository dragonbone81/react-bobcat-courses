import React, {Component} from 'react'
import {Message, Button, Form, Icon} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";
import {toast} from 'react-toastify';


class Login extends Component {
    state = {
        username: '',
        error: {
            header: '',
            message: '',
        },
        status: 'not_ready',
        isWorking: false,
        isError: false,
    };
    componentDidMount() {
        document.title = "BobcatCourses | Forgot";
    }
    handleUsernameChange = ({target}) => {
        this.setState({username: target.value});
    };
    handleSubmit = () => {
        this.setState({isError: false});
        if (!this.state.username) {
            this.setState({
                error: {
                    header: 'Please fill out all fields.',
                    message: null,
                },
                isError: true,
            });
            return;
        }
        this.resetPassword().then();
    };
    resetPassword = async () => {
        this.setState({isWorking: true});
        const response = await this.props.auth_store.resetPassword(this.state.username);
        this.setState({isWorking: false});
        if (!response.success) {
            this.setState({
                isError: true,
                error: {
                    header: response.error,
                    message: null,
                }
            });
            toast.error('Username not recognized or does not have email associated with it.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            return;
        }
        if (response.success) {
            this.setState({
                isError: false,
                status: 'success',
            });
            toast.success('Submitted. Please check your email.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    };

    render() {
        return (
            <div className="login-form">
                <Form success={this.state.isWorking} error={this.state.isError}
                      onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <div
                            style={{paddingTop: 20, fontSize: 100, textAlign: 'center', color: 'rgb(59, 157, 244)'}}>
                            <Icon name="key"/>
                        </div>
                    </Form.Field>
                    <Message
                        error
                        header={this.state.error.header}
                        content={this.state.error.message}
                    />
                    {this.state.isWorking ?
                        <div style={{textAlign: 'center'}}>
                            <Message
                                success
                                header='Submitting...'
                                content={null}
                            />
                            <Icon size="huge" loading name="spinner"/>
                        </div>
                        :
                        <div>
                            <p style={{fontSize: 15}}>
                                Submit your username and we will send you a link to reset your password to the email you
                                provided during registration.
                                <br/>
                                If you did not provide an email, please contact us in the About Us section.
                            </p>
                            <Form.Field>
                                <input autoComplete="on" type="text" autoCorrect="off" autoCapitalize="none"
                                       onChange={this.handleUsernameChange} value={this.state.username}
                                       placeholder='Username...'/>
                            </Form.Field>
                            <Form.Field>
                                <Button color='yellow' fluid>Send Email</Button>
                            </Form.Field>
                        </div>
                    }
                </Form>
            </div>
        )
    }
}

Login.propTypes = {
    auth_store: PropTypes.object,
};
export default inject("auth_store")(observer(Login))