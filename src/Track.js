import {
    Button,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import React, { Component } from 'react';
//import "./Tracks.css";

import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { PulseLoader as Loading } from 'react-spinners';

const deleteTrack = gql`
    mutation deleteTrack($input: DeleteTrackInput!) {
      deleteTrack(input: $input) {
        clientMutationId
        deletedTrackId
      }
    }
`

const updateTrack = gql`
    mutation updateTrack($input : UpdateTrackInput!) {
      updateTrack(input: $input) {
        track {
          id
          name
        }
      }
    }
`

const createTrack = gql`
    mutation createTrack($input : CreateTrackInput!) {
      createTrack(input: $input) {
        track {
          id
          name
        }
      }
    }
`

const track = gql`
    query trackById($id: UUID!) {
      track: trackById(id: $id) {
        nodeId
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
    constructor(props) {
        super(props)

        this.state = {
            nodeId:         "",
            id:             "",
            name:           "",
            platformId:     "",
            organizationId: "",
        }
    }
    render() {
        return (
            <Mutation
                mutation={this.props.match.params.id === "__NEW__" ? createTrack : updateTrack}
                onCompleted={data => {
                    this.props.alert(
                        "success",
                        this.props.match.params.id === "__NEW__"
                            ? `Created!!!`
                            : `Updated!!!`,
                        this.props.match.params.id === "__NEW__"
                            ? `Track '${this.state.name}' was created`
                            : `Track '${this.state.name}' was updated`
                    )
                    if(data.createTrack)
                        this.props.history.push(`/track/${ data.createTrack.track.id }`)
                }}
            >
                {
                    (create, { data, loading, error }) => {
                        return <Query
                            query={track}
                            variables={{id: this.props.match.params.id}}
                            skip={this.props.match.params.id === "__NEW__"}
                        >
                            {
                                ({ data, loading, error }) => {
                                    if(error)
                                        return console.error(error)
                                    if(Object.keys(data) == 0)
                                        data = {
                                            track: {
                                                organization: { },
                                                platform: { }
                                            }
                                        }
                                    else
                                        this.state = {
                                            nodeId:             data.track.nodeId,
                                            id:                 data.track.id,
                                            name:               data.track.name,
                                            platformId:         data.track.platform.id,
                                            organizationId:     data.track.organization.id
                                        }

                                    return <form
                                        onSubmit={e => {
                                            e.preventDefault()
                                            create({
                                                variables: {
                                                    input: this.props.match.params.id === "__NEW__"
                                                        ? {
                                                            track: {
                                                                name:           this.state.name,
                                                                platformId:     this.state.platformId,
                                                                organizationId: this.state.organizationId,
                                                            }
                                                        }
                                                        : {
                                                            nodeId: this.state.nodeId,
                                                            trackPatch: {
                                                                id:				this.state.id,
                                                                name: 			this.state.name,
                                                                platformId: 	this.state.platformId,
                                                                organizationId: this.state.organizationId,
                                                            }
                                                        }
                                                }
                                            })
                                        }}
                                    >
                                        <FormGroup controlId="name" bsSize="large">
                                            <ControlLabel>Name</ControlLabel>
                                            <FormControl
                                                type="name"
                                                defaultValue={this.state.name}
                                                onChange={e => this.state.name = e.target.value}
                                            />
                                        </FormGroup>
                                        <FormGroup controlId="organization" bsSize="large">
                                            <ControlLabel>Organization</ControlLabel>
                                            <Query query={organizations}>
                                                {
                                                    ({ data, loading, error }) => {
                                                        if(loading) return (<Loading size={8} />)
                                                        if(data && data.organizations)
                                                            this.state.organizationId = data.organizations.nodes[0].id
                                                        return data && data.organizations
                                                            ? <FormControl
                                                                componentClass="select"
                                                                placeholder="select"
                                                                type="select"
                                                                onChange={e => this.setState({organizationId: e.target.value})}
                                                            >
                                                                {
                                                                    data.organizations.nodes.map(
                                                                        org => <option key={ org.id } value={ org.id }>
                                                                            { org.name }
                                                                        </option>
                                                                    )
                                                                }
                                                            </FormControl>
                                                            : <FormControl
                                                                type="organization"
                                                                value={""}
                                                                onChange={e => this.setState({organizationId: e.target.value})}
                                                            />
                                                    }
                                                }
                                            </Query>
                                        </FormGroup>
                                        <FormGroup controlId="platform" bsSize="large">
                                            <ControlLabel>Platform</ControlLabel>
                                            <Query query={platforms}>
                                                {
                                                    ({ data, loading, error }) => {
                                                        if(loading) return (<Loading size={8} />)
                                                        if(data && data.platforms)
                                                            this.state.platformId = data.platforms.nodes[0].id
                                                        return data && data.platforms
                                                            ? <FormControl
                                                                componentClass="select"
                                                                placeholder="select"
                                                                type="select"
                                                                onChange={e => this.setState({platformId: e.target.value})}
                                                            >
                                                                {
                                                                    data.platforms.nodes.map(
                                                                        platform => <option key={ platform.id } value={ platform.id }>
                                                                            { platform.name }
                                                                        </option>
                                                                    )
                                                                }
                                                            </FormControl>
                                                            : <FormControl
                                                                type="platform"
                                                                onChange={e => this.setState({platformId: e.target.value})}
                                                            />
                                                    }
                                                }
                                            </Query>
                                        </FormGroup>
                                        {
                                            <div>
                                                <Button
                                                    type="submit"
                                                >
                                                    {
                                                        this.props.match.params.id === "__NEW__"
                                                            ? "create new track"
                                                            : "update track"
                                                    }
                                                </Button>
                                                {
                                                    this.props.match.params.id === "__NEW__"
                                                        ? null
                                                    : <Mutation
                                                        mutation={deleteTrack}
                                                        onCompleted={() => {
                                                            this.props.alert(
                                                                "success",
                                                                "Delete!!!",
                                                                `Track was deleted`
                                                            )
                                                            this.props.history.push(`/tracks`)
                                                        }}
                                                    >
                                                        {
                                                            (del) => <Button
                                                                bsStyle="danger"
                                                                onClick={
                                                                    () => del({variables: {input: {nodeId: this.state.nodeId}}})
                                                                }
                                                            >
                                                                delete track
                                                            </Button>
                                                        }
                                                    </Mutation>
                                                }
                                            </div>
                                        }
                                    </form>
                                }
                            }
                        </Query>
                    }
                }
            </Mutation>
        )
    }
}
