import {
    ListGroup,
    ListGroupItem,
    Button
} from "react-bootstrap";
import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { PulseLoader as Loading } from 'react-spinners';
import ExperimentItem from './ExperimentItem';
//import "./Experiments.css";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const allExperiments = gql`
    {
      allExperiments(orderBy: [NAME_ASC]) {
        nodes {
          id
          name
          variants: variantsByExperimentId {
            nodes {
              id
              name
              percent
            }
          }
        }
      }
    }
`

export default class Experiments extends Component {
    render() {
        return (
            <div>
                <Query query={allExperiments}>
                    {
                        ({ data, loading, error }) => {
                            if(error)
                                return console.error(error)
                            if(loading)
                                return <Loading size={8} />
                            return <ListGroup>
                                {
                                    data.allExperiments.nodes.map(
                                        ex => <LinkContainer key={ex.id} to={`/experiment/${ ex.id }`}>
                                            <ListGroupItem>
                                                <ExperimentItem name={ex.name} variations={ ex.variants.nodes || [] } />
                                            </ListGroupItem>
                                        </LinkContainer>
                                    )
                                }
                            </ListGroup>
                        }
                    }
                </Query>
                <LinkContainer to={`/experiment/__NEW__`}>
                    <Button
                        bsStyle="primary"
                    >
                        new experiment
                    </Button>
                </LinkContainer>
            </div>
        )
    }
}
