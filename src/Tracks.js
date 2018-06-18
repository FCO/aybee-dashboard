import {
    ListGroup,
    ListGroupItem
} from "react-bootstrap";
import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
//import "./Tracks.css";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const allTracks = gql`
    {
      allTracks {
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
            <Query query={allTracks}>
                {
                    ({ data, loading, error }) => {
                        if(error)
                            return console.error(error)
                        if(loading)
                            return "Loading..."
                        return <ListGroup>
                            {
                                data.allTracks.nodes.map(
                                    track => <LinkContainer key={track.id} to={`/track/${ track.id }`}>
                                        <ListGroupItem>
                                            { track.name }
                                        </ListGroupItem>
                                    </LinkContainer>
                                )
                            }
                        </ListGroup>
                    }
                }
            </Query>
        )
    }
}
