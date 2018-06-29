import { Progress } from 'reactstrap'
import React, { Component } from 'react';
import {Grid, Row, Col, Popover, OverlayTrigger} from 'react-bootstrap';

import './ExperimentItem.css'

export default ({ name, variations, colors = ["blue", "red", "green"] }) => <Grid>
    <Row>
        <Col md={1}>{ name }</Col>
        <Col md={11}>
            <Progress multi>
                {
                    variations.map(
                        (v, i) => <Progress
                            bar
                            key={i}
                            color={colors[i % colors.length]}
                            value={parseFloat(v.percent) * 100}
                        >
                            {v.name}
                        </Progress>
                    )
                }
            </Progress>
        </Col>
    </Row>
</Grid>
