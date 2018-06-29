import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Tracks from './Tracks';
import Track from './Track';
import Experiments from './Experiments';
import Experiment from './Experiment';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom'
import { Nav, NavItem, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ApolloProvider } from "react-apollo";
import client from "./GraphQLClient";
import { AlertList } from "react-bs-notifier";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated:    localStorage.getItem("token") && true,
            alerts:             []
        };
    }

    handleLogout() {
        localStorage.removeItem("token")
        this.setState({
            isAuthenticated: false
        })
    }

    handleLogin(token) {
        localStorage.setItem("token", token)
        this.setState({
            isAuthenticated: true
        })
    }

    alert(type, headline, message) {
        this.setState({
            alerts: [
                ...this.state.alerts,
                {
                    id: new Date().getTime(),
                    headline,
                    type,
                    message
                }
            ]
        })
    }

    onAlertDismissed(alert) {
        const alerts = this.state.alerts;

        const idx = alerts.indexOf(alert);

        if (idx >= 0) {
            this.setState({
                alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
            });
        }
    }

    render() {
        return (
            <ApolloProvider client={client}>
                <Router>
                    <div>
                        <Navbar fluid collapseOnSelect>
                            <Navbar.Header>
                                <Navbar.Brand>
                                    <Link to="/">AyBee</Link>
                                </Navbar.Brand>
                                <Navbar.Toggle />
                            </Navbar.Header>
                            <Nav>
                                <LinkContainer to="/tracks">
                                    <NavItem>Tracks</NavItem>
                                </LinkContainer>
                                <LinkContainer to="/experiments">
                                    <NavItem>Experiments</NavItem>
                                </LinkContainer>
                            </Nav>
                            <Navbar.Collapse>
                                <Nav pullRight>
                                    {this.state.isAuthenticated
                                        ? <NavItem onClick={() => this.handleLogout()}>Logout</NavItem>
                                        : <LinkContainer to="/login">
                                            <NavItem>Login</NavItem>
                                        </LinkContainer>
                                    }
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <AlertList
                            showIcon={true}
                            timeout={5000}
                            dismissTitle="dismiss"
                            onDismiss={this.onAlertDismissed.bind(this)}
                            alerts={this.state.alerts}
                        />
                        <div>
                            <Switch>
                                <Route path="/" exact       render={() => <div>Home</div>} />
                                <Route path="/login"        render={() => <Login
                                    alert={this.alert.bind(this)}
                                    handleLogin={token => this.handleLogin(token)}
                                />} />
                                <Route path="/tracks"       render={props => <Tracks {...props} alert={this.alert.bind(this)} />} />
                                <Route path="/track/:id"    render={props => <Track  {...props} alert={this.alert.bind(this)} />} />
                                <Route path="/experiments"       render={props => <Experiments {...props} alert={this.alert.bind(this)} />} />
                                <Route path="/experiment/:id"    render={props => <Experiment  {...props} alert={this.alert.bind(this)} />} />
                                <Redirect to="/login" />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </ApolloProvider>
        );
    }
}

export default App;
