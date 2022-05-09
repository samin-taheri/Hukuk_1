// @mui
import PropTypes from 'prop-types';
import { Box, Card, Paper, Typography, CardHeader, CardContent } from '@mui/material';
// utils
import {alpha, styled} from "@mui/material/styles";
import ConnectedClients from "../app/ConnectedClients";
import UpcomingCases from "../app/UpcomingCases";
import UpcomingEvents from "../app/UpcomingEvents";
import UpcomingTasks from "../app/UpcomingTasks";
import React from "react";

// ----------------------------------------------------------------------

AppTrafficBySite.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    list: PropTypes.array.isRequired,
};

export default function AppTrafficBySite({ title, subheader, list, ...other }) {
    return (
        <Card {...other}>
            <CardHeader title="Total Counts"/>
            <CardContent>
                <Box
                    sx={{
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: 'repeat(2, 1fr)',
                    }}
                >
                    <ConnectedClients/>
                    <UpcomingTasks/>
                    <UpcomingEvents/>
                    <UpcomingCases/>
                </Box>
            </CardContent>
        </Card>
    );
}