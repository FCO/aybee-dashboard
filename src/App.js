import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Tracks from './Tracks';
import Track from './Track';
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

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: localStorage.getItem("token") && true
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
                        <div>
                            <Switch>
                                <Route path="/" exact render={() => <div>Home</div>} />
                                <Route path="/login" render={() => <Login handleLogin={token => this.handleLogin(token)} />} />
                                <Route path="/tracks" component={Tracks} />
                                <Route path="/track/:id" component={Track} />
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
