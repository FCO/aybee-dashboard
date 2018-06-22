import { Progress } from 'reactstrap'
import React, { Component } from 'react';
import {Grid, Row, Col, Popover, OverlayTrigger} from 'react-bootstrap';

import './TrackItem.css'

export default ({ name, variations, colors = ["blue", "red", "green"] }) => <Grid>
    <Row>
        <Col md={1}>{ name }</Col>
        <Col md={11}>
            <Progress multi>
                {
                    Object.keys(variations).map(
                        (e, i) => <Progress
                            bar
                            key={i}
                            color={colors[i % colors.length]}
                            value={variations[e].reduce((s, p) => s + parseFloat(p.percent), 0) * 100}
                        >
                            {e}
                        </Progress>
                    )
                }
            </Progress>
        </Col>
    </Row>
</Grid>
