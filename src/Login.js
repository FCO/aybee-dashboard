import {
    Button,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import { Redirect } from 'react-router-dom'
import React, { Component } from 'react';
import "./Login.css";

import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const auth = gql`
    mutation authenticate($email: String!, $password: String!) {
        authenticate(input: {email: $email, password: $password}) {
        jwtToken
      }
    }
`

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    validateForm() {
        this.state.email.length > 0 && this.state.password.length > 0
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    render() {
        return (
            <Mutation mutation={auth}>
                {
                    (authenticate, { data, loading, error }) => {
                        if(error)
                            return console.error(error)
                        if(loading)
                            return "Loading..."
                        if(data) {
                            //localStorage.setItem("token", data.authenticate.jwtToken)
                            this.props.handleLogin(data.authenticate.jwtToken)
                            return <Redirect to="/" />
                        }
                        if(localStorage.getItem("token")) {
                            return "Logged in"
                        }
                        return <form onSubmit={e => {
                            this.handleSubmit(e);
                            authenticate({variables: this.state})
                        }}>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                autoFocus
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <Button
                            block
                            bsSize="large"
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>
                    }
                }
            </Mutation>
        )
    }
}
