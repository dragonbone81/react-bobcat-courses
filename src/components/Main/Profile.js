import React, {Component} from 'react'
import {Container, Image, Button, Grid, Icon, Label} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {toast} from 'react-toastify';


class Profile extends Component {
    componentDidMount() {
        document.title = "BobcatCourses | Profile";
    }


    state = {
        uploadedFile: false,
        image: null,
        imageValue: '',
        fileUploading: false,
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

    render() {
        return (
            <div className="flex-container">
                {this.props.auth_store.isLoggedIn &&
                <Container>
                    <Grid textAlign="center" stackable centered columns={2}>
                        <Grid.Column textAlign="center">
                            <div style={{maxWidth: 400}}>
                                <Image centered
                                       src={this.state.image ? URL.createObjectURL(this.state.image) : this.props.auth_store.user.profile_image_url}
                                       size="small"/>
                                <p>Select your profile picture...</p>
                                {this.state.uploadedFile ?
                                    <React.Fragment><Button onClick={this.uploadFile} labelPosition='left' color="green"
                                                            icon><Icon name="check"/>Click
                                        to Upload</Button><Button onClick={this.reset} color="red"
                                                                  icon>{this.state.fileUploading ?
                                        <Icon name="spinner" loading/> : <Icon
                                            name="close"/>}</Button></React.Fragment> :
                                    <Label style={{cursor: 'pointer'}} width="4" as="label" htmlFor="file" size="big">
                                        <Icon name="file"/>
                                        Upload
                                    </Label>}
                                <input value={this.state.imageValue} accept=".png,.jpeg,.jpg"
                                       onChange={this.handleFileUpload} id="file"
                                       hidden type="file"/>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                        </Grid.Column>
                    </Grid>
                </Container>
                }
            </div>
        )
    }
}

export default inject("auth_store")(observer(Profile))