import {
    Button,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import React, { Component } from 'react';
//import "./Tracks.css";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const track = gql`
    query trackById($id: UUID!) {
      track: trackById(id: $id) {
        id
        name
        organization: organizationByOrganizationId {
          name
        }
        platform: platformByPlatformId {
          name
        }
      }
    }
`

const organizations = gql`
    {
      organizations: allOrganizations {
        nodes {
          id
          name
        }
      }
    }
`

const platforms = gql`
    {
      platforms: allPlatforms {
        nodes {
          id
          name
        }
      }
    }
`

export default class Track extends Component {
    render() {
        return (
            <Query query={track} variables={{id: this.props.match.params.id}}>
                {
                    ({ data, loading, error }) => {
                        if(error)
                            return console.error(error)
                        if(loading)
                            return "Loading..."
                        return <form>
                            <FormGroup controlId="name" bsSize="large">
                                <ControlLabel>Name</ControlLabel>
                                <FormControl
                                    type="name"
                                    value={data.track.name}
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup controlId="organization" bsSize="large">
                                <ControlLabel>Organization</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    type="organization"
                                    value={data.track.organization.name}
                                    readOnly
                                >
                                    <Query query={organizations}>
                                        {
                                            ({ data, loading, error }) => {
                                                if(error)   throw error;
                                                if(loading) return "Loading..."
                                                console.log(data)
                                                return data.organizations.nodes.map(
                                                    org => <option key={ org.id }>
                                                        { org.name }
                                                    </option>
                                                )
                                            }
                                        }
                                    </Query>
                                </FormControl>
                            </FormGroup>
                            <FormGroup controlId="platform" bsSize="large">
                                <ControlLabel>Platform</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    type="platform"
                                    value={data.track.platform.name}
                                    readOnly
                                >
                                    <Query query={platforms}>
                                        {
                                            ({ data, loading, error }) => {
                                                if(error)   throw error;
                                                if(loading) return "Loading..."
                                                console.log(data)
                                                return data.platforms.nodes.map(
                                                    platform => <option key={ platform.id }>
                                                        { platform.name }
                                                    </option>
                                                )
                                            }
                                        }
                                    </Query>
                                </FormControl>
                            </FormGroup>
                        </form>
                    }
                }
            </Query>
        )
    }
}
