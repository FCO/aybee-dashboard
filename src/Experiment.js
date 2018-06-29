import {
    Button,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import React, { Component } from 'react';

import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { PulseLoader as Loading } from 'react-spinners';

const deleteExperiment = gql`
    mutation deleteExperiment($input: DeleteExperimentInput!) {
      deleteExperiment(input: $input) {
        clientMutationId
        deletedExperimentId
      }
    }
`

const updateExperiment = gql`
    mutation updateExperiment($input : UpdateExperimentInput!) {
      updateExperiment(input: $input) {
        experiment {
          id
          name
        }
      }
    }
`

const createExperiment = gql`
    mutation createExperiment($input : CreateExperimentInput!) {
      createExperiment(input: $input) {
        experiment {
          id
          name
        }
      }
    }
`

const experiment = gql`
    query experimentById($id: UUID!) {
      experiment: experimentById(id: $id) {
        nodeId
        id
        name
        organizationId
        trackId
      }
    }
`

const tracks = gql`
    {
      tracks: allTracks {
        nodes {
          id
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

export default class Experiment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            nodeId:         "",
            id:             "",
            name:           "",
            organizationId: "",
            trackId:        "",
        }
    }
    render() {
        return (
            <Mutation
                mutation={this.props.match.params.id === "__NEW__" ? createExperiment : updateExperiment}
                onCompleted={data => {
                    this.props.alert(
                        "success",
                        this.props.match.params.id === "__NEW__"
                            ? `Created!!!`
                            : `Updated!!!`,
                        this.props.match.params.id === "__NEW__"
                            ? `Experiment '${this.state.name}' was created`
                            : `Experiment '${this.state.name}' was updated`
                    )
                    if(data.createExperiment)
                        this.props.history.push(`/experiment/${ data.createExperiment.experiment.id }`)
                }}
            >
                {
                    (create, { data, loading, error }) => {
                        return <Query
                            query={experiment}
                            variables={{id: this.props.match.params.id}}
                            skip={this.props.match.params.id === "__NEW__"}
                        >
                            {
                                ({ data, loading, error }) => {
                                    if(error)
                                        return console.error(error)
                                    if(Object.keys(data) == 0)
                                        data = {
                                            experiment: {
                                                organization: { },
                                                platform: { }
                                            }
                                        }
                                    else
                                        this.state = {
                                            nodeId:             data.experiment.nodeId,
                                            id:                 data.experiment.id,
                                            name:               data.experiment.name,
                                            organizationId:     data.experiment.organizationId,
                                            trackId:            data.experiment.trackId
                                        }

                                    return <form
                                        onSubmit={e => {
                                            e.preventDefault()
                                            create({
                                                variables: {
                                                    input: this.props.match.params.id === "__NEW__"
                                                        ? {
                                                            experiment: {
                                                                name:           this.state.name,
                                                                organizationId: this.state.organizationId,
                                                            }
                                                        }
                                                        : {
                                                            nodeId: this.state.nodeId,
                                                            experimentPatch: {
                                                                id:				this.state.id,
                                                                name: 			this.state.name,
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
                                        <FormGroup controlId="track" bsSize="large">
                                            <ControlLabel>Track</ControlLabel>
                                            <Query query={tracks}>
                                                {
                                                    ({ data, loading, error }) => {
                                                        if(loading) return (<Loading size={8} />)
                                                        if(data && data.tracks)
                                                            this.state.trackId = data.tracks.nodes[0].id
                                                        return data && data.tracks
                                                            ? <FormControl
                                                                componentClass="select"
                                                                placeholder="select"
                                                                type="select"
                                                                value={ this.state.trackId }
                                                                onChange={e => this.setState({trackId: e.target.value})}
                                                            >
                                                                {
                                                                    data.tracks.nodes.map(
                                                                        t => <option
                                                                            key={ t.id }
                                                                            value={ t.id }
                                                                        >
                                                                            { t.name }
                                                                        </option>
                                                                    )
                                                                }
                                                            </FormControl>
                                                            : <FormControl
                                                                type="track"
                                                                value={""}
                                                                onChange={e => this.setState({trackId: e.target.value})}
                                                            />
                                                    }
                                                }
                                            </Query>
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
                                        {
                                            <div>
                                                <Button
                                                    type="submit"
                                                >
                                                    {
                                                        this.props.match.params.id === "__NEW__"
                                                            ? "create new experiment"
                                                            : "update experiment"
                                                    }
                                                </Button>
                                                {
                                                    this.props.match.params.id === "__NEW__"
                                                        ? null
                                                    : <Mutation
                                                        mutation={deleteExperiment}
                                                        onCompleted={() => {
                                                            this.props.alert(
                                                                "success",
                                                                "Delete!!!",
                                                                `Experiment was deleted`
                                                            )
                                                            this.props.history.push(`/experiments`)
                                                        }}
                                                    >
                                                        {
                                                            (del) => <Button
                                                                bsStyle="danger"
                                                                onClick={
                                                                    () => del({variables: {input: {nodeId: this.state.nodeId}}})
                                                                }
                                                            >
                                                                delete experiment
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
