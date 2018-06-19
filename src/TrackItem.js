import { Progress } from 'reactstrap'
import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

export default ({ name, variations }) => <Grid>
    <Row>
        <Col md={1}>{ name }</Col>
        <Col md={11}>
            <Progress multi>
                {
                    variations.map(
                        v => <Progress bar value={v.percent * 100}>{v.experiment}:{v.name}</Progress>
                    )
                }
            </Progress>
        </Col>
    </Row>
</Grid>
