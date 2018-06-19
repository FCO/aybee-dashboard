import {
    ListGroup,
    ListGroupItem,
    Button
} from "react-bootstrap";
import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { PulseLoader as Loading } from 'react-spinners';
import TrackItem from './TrackItem';
//import "./Tracks.css";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const allTracks = gql`
    {
      allTracks(orderBy: [NAME_ASC]) {
        nodes {
          id
          name
          platform: platformByPlatformId {
            name
          }
        }
      }
    }
`

export default class Tracks extends Component {
    render() {
        return (
            <div>
                <Query query={allTracks}>
                    {
                        ({ data, loading, error }) => {
                            if(error)
                                return console.error(error)
                            if(loading)
                                return <Loading size={8} />
                            return <ListGroup>
                                {
                                    data.allTracks.nodes.map(
                                        t => <LinkContainer key={t.id} to={`/track/${ t.id }`}>
                                            <ListGroupItem>
                                                <TrackItem { ...t} variations={[
                                                    {
                                                        percent: .1,
                                                        experiment: "Bla",
                                                        name: "A"
                                                    },
                                                    {
                                                        percent: .2,
                                                        experiment: "Bla",
                                                        name: "B"
                                                    },
                                                    {
                                                        percent: .1,
                                                        experiment: "Ble",
                                                        name: "A"
                                                    },
                                                    {
                                                        percent: .2,
                                                        experiment: "Ble",
                                                        name: "B"
                                                    },
                                                    {
                                                        percent: .3,
                                                        experiment: "Ble",
                                                        name: "C"
                                                    }
                                                ]} />
                                            </ListGroupItem>
                                        </LinkContainer>
                                    )
                                }
                            </ListGroup>
                        }
                    }
                </Query>
                <LinkContainer to={`/track/__NEW__`}>
                    <Button
                        bsStyle="primary"
                    >
                        new track
                    </Button>
                </LinkContainer>
            </div>
        )
    }
}
