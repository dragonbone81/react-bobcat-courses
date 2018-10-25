import React, {Component} from 'react'
import {Container, Image, Form, Button, Grid, Icon, Label} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {toast} from 'react-toastify';
import {withRouter} from "react-router-dom";


class Profile extends Component {
    componentDidMount() {
        document.title = "BobcatCourses | Profile";
    }


    state = {
        uploadedFile: false,
        image: null,
        imageValue: '',
        fileUploading: false,
        changingEmail: false,
        changingPassword: false,
        email: '',
        newPassword: '',
        oldPassword: '',
    };
    handleFileUpload = ({target}) => {
        this.setState({imageValue: target.value});
        if (target.files[0] && target.files[0].type.startsWith("image")) {
            this.setState({uploadedFile: true, image: target.files[0]});
            toast.success('You image has been submitted', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else {
            toast.error('No file or incorrect type.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    };
    reset = () => {
        this.setState({
            uploadedFile: false,
            image: null,
            imageValue: '',
            unsubscribing: false,
            changingEmail: false,
        })
    };
    uploadFile = async () => {
        this.setState({fileUploading: true});
        const data = new FormData();
        data.append("profile_image", this.state.image);
        const response = await this.props.auth_store.uploadUserPhoto(data);
        if (response.success) {
            toast.success('Upload successful.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        this.setState({fileUploading: false});
        this.reset();
    };

    submitUnsubscribeOrEmail = async (email) => {
        email ? this.setState({changingEmail: true}) : this.setState({unsubscribing: true});
        const response = await this.props.auth_store.updateUserNotificationSettings({
            email: email ? this.state.email : this.props.auth_store.user.email,
            email_alerts: email ? this.props.auth_store.user.email_alerts : !this.props.auth_store.user.email_alerts,
        });
        if (response.success) {
            toast.success('Your settings have been updated', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else {
            toast.error('Something happened sorry :(', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        email ? this.setState({changingEmail: false, email: ''}) : this.setState({unsubscribing: false});
    };
    changePassword = async () => {
        this.setState({changingPassword: true});
        const response = await this.props.auth_store.changePassword({
            newPassword: this.state.newPassword,
            oldPassword: this.state.oldPassword
        });
        if (response.error_code === 107) {
            toast.error('Current password incorrect', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else if (response.success) {
            toast.success('Password changed!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        this.setState({
            changingPassword: false,
            newPassword: '',
            oldPassword: ''
        });

    };

    render() {
        return (
            <div className="flex-container" style={{maxWidth: 500}}>
                {this.props.auth_store.isLoggedIn ?
                    <Container>
                        <Grid divided='vertically' textAlign="center" stackable centered>
                            <Grid.Row>
                                <Grid.Column textAlign="center">
                                    <Image centered
                                           src={this.state.image ? URL.createObjectURL(this.state.image) : this.props.auth_store.user.profile_image_url}
                                           size="small"/>
                                    <p>Select your profile picture...</p>
                                    {this.state.uploadedFile ?
                                        <React.Fragment><Button onClick={this.uploadFile} labelPosition='left'
                                                                color="green"
                                                                icon><Icon name="check"/>Click
                                            to Upload</Button><Button onClick={this.reset} color="red"
                                                                      icon>{this.state.fileUploading ?
                                            <Icon name="spinner" loading/> : <Icon
                                                name="close"/>}</Button></React.Fragment> :
                                        <Label style={{cursor: 'pointer'}} width="4" as="label" htmlFor="file"
                                               size="big">
                                            <Icon name="file"/>
                                            Upload
                                        </Label>}
                                    <input value={this.state.imageValue} accept=".png,.jpeg,.jpg"
                                           onChange={this.handleFileUpload} id="file"
                                           hidden type="file"/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column textAlign="center">
                                    <div
                                        style={{
                                            paddingTop: 40,
                                            fontSize: 100,
                                            textAlign: 'center',
                                            color: 'rgb(59, 157, 244)'
                                        }}>
                                        <Icon name="mail"/>
                                    </div>
                                    <p style={{marginTop: -40}}>Update settings...</p>
                                    <Form onSubmit={() => this.submitUnsubscribeOrEmail(true)}>
                                        <Form.Field>
                                            <input value={this.state.email}
                                                   onChange={({target}) => this.setState({email: target.value})}
                                                   required
                                                   type="email" placeholder={this.props.auth_store.user.email}/>
                                        </Form.Field>
                                        <Button.Group floated="left"><Button loading={this.state.changingEmail} basic
                                                                             color="green">Update
                                            Email</Button></Button.Group>
                                        <Button.Group floated="right"><Button
                                            onClick={() => this.submitUnsubscribeOrEmail(false)}
                                            loading={this.state.unsubscribing} basic
                                            type="button"
                                            color={this.props.auth_store.user.email_alerts ? 'red' : 'green'}>{this.props.auth_store.user.email_alerts ? 'Unsubscribe' : 'Subscribe'}</Button></Button.Group>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column textAlign="center">
                                    <div
                                        style={{
                                            paddingTop: 40,
                                            fontSize: 100,
                                            textAlign: 'center',
                                            color: 'rgb(59, 157, 244)'
                                        }}>
                                        <Icon name="key"/>
                                    </div>
                                    <p style={{marginTop: -30}}>Change Password...</p>
                                    <Form onSubmit={this.changePassword}>
                                        <Form.Field>
                                            <input value={this.state.oldPassword}
                                                   onChange={({target}) => this.setState({oldPassword: target.value})}
                                                   required
                                                   type="password" placeholder='Current Password...'/>
                                        </Form.Field>
                                        <Form.Field>
                                            <input value={this.state.newPassword}
                                                   onChange={({target}) => this.setState({newPassword: target.value})}
                                                   required
                                                   type="password" placeholder='New Password...'/>
                                        </Form.Field>
                                        <Button loading={this.state.changingPassword} basic
                                                color="green">Change Password</Button>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                    :
                    <div>
                        <div className="saved-schedules-label">Your profile</div>
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
                                <div onClick={() => this.props.history.push('/login')}
                                     style={{textAlign: 'center', cursor: 'pointer'}}
                                     className="header">
                                    Please Login
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}

export default inject("auth_store")(observer(withRouter(Profile)))