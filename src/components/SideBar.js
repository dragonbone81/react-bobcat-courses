import React, {Component} from 'react'
import {Image, Icon, Menu, Sidebar} from 'semantic-ui-react'

export default class SideNavBar extends Component {

    render() {
        return (
            <Sidebar
                direction='right'
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                onHide={this.props.hideSideBar}
                vertical
                visible={this.props.visible}
                width='thin'
            >
                {this.props.isMobile ?
                    <div>
                        {this.props.isLoggedIn ?
                            <Menu.Item>
                                {this.props.user.profile_image_url ? <Image src={this.props.user.profile_image_url}
                                                                            avatar/> : null} {this.props.user.first_name || this.props.user.username}
                            </Menu.Item>
                            :
                            null}
                        <Menu.Item name="/schedules/search" active={this.props.activeItem === '/schedules/search'}
                                   onClick={this.props.navigate}>
                            <Icon name='home'/>
                            Search Schedules
                        </Menu.Item>
                        <Menu.Item name="/schedules/saved" active={this.props.activeItem === '/schedules/saved'}
                                   onClick={this.props.navigate}>
                            <Icon name='save'/>
                            Saved Schedules
                        </Menu.Item>
                        <Menu.Item name="/waitlists" active={this.props.activeItem === '/waitlists'}
                                   onClick={this.props.navigate}>
                            <Icon name='phone'/>
                            Waitlists
                        </Menu.Item>
                        {this.props.isLoggedIn ?
                            <Menu.Item as='a' onClick={this.props.logout}>
                                <Icon name='sign out alternate'/>
                                Logout
                            </Menu.Item>
                            :
                            <Menu.Item name="/login" active={this.props.activeItem === '/login'} as='a'
                                       onClick={this.props.navigate}>
                                <Icon name='sign in alternate'/>
                                Login
                            </Menu.Item>
                        }
                    </div>
                    :
                    <div>
                        {this.props.isLoggedIn ?
                            <Menu.Item>
                                {this.props.user.profile_image_url ? <Image src={this.props.user.profile_image_url}
                                                                            avatar/> : null} {this.props.user.first_name || this.props.user.username}
                            </Menu.Item>
                            :
                            null}
                        {this.props.isLoggedIn ?
                            <Menu.Item as='a' onClick={this.props.logout}>
                                <Icon name='sign out alternate'/>
                                Logout
                            </Menu.Item>
                            :
                            <Menu.Item name="/login" active={this.props.activeItem === '/login'} as='a'
                                       onClick={this.props.navigate}>
                                <Icon name='sign in alternate'/>
                                Login
                            </Menu.Item>
                        }
                    </div>
                }
            </Sidebar>
        )
    }
}
