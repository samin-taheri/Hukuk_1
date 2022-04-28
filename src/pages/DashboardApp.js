// material
import {
    Box,
    Grid,
    Container,
    Typography,
    Stack,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow, TableCell, TableBody, Button, IconButton, Card
} from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// components
import {useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import AuthService from '../services/auth.service';
import Page from '../components/Page';
import AppConversionRates from "../components/_dashboard/user/AppConversionRates";
import AppNewsUpdate from "../components/_dashboard/user/AppNewsUpdate";
import AppTasks from "../components/_dashboard/user/AppTasks";
import Iconify from "../components/_dashboard/user/Iconify";
import AppTrafficBySite from "../components/_dashboard/user/AppTraficBySite";
import PopupMessageService from "../services/popupMessage.service";
import EventsService from "../services/events.service";
import {Global} from "../Global";
import Scrollbar from "../components/Scrollbar";
import CircularProgress from "@mui/material/CircularProgress";
import {Icon} from "@iconify/react";
import attachFill from "@iconify/icons-eva/attach-fill";
import roundUpdate from "@iconify/icons-ic/round-update";
import layersOutline from "@iconify/icons-eva/layers-outline";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import Modal from "@mui/material/Modal";
import CloseIcon from "@material-ui/icons/Close";
import {format} from "date-fns";

export default function DashboardApp() {
    const navigate = useNavigate();
    const authService = new AuthService();

    const steps = [
        'Select master blaster campaign settings',
        'Create an ad group',
        'Create an ad',
    ];

    useEffect(() => {
        if (!authService.IsAuth()) {
            navigate('/login');
        }
    }, []);

    return (
        <Page title="Dashboard | MediLaw">
            <Container maxWidth="xl">
                <Box sx={{pb: 10}}>
                    <Typography variant="h4">Hi, Welcome to MediLaw</Typography>
                    {/*
          <Box sx={{ width: '100%', marginTop:7 }}>
            <Stepper activeStep={1} alternativeLabel>
              {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
              ))}
            </Stepper>
          </Box>
          */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4} mt={10}>
                            <AppConversionRates/>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} mt={10}>
                            <AppTrafficBySite
                                title="Traffic by Site"
                                list={[
                                    {
                                        name: 'FaceBook',
                                        value: 323234,
                                        icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32}
                                                       height={32}/>,
                                    },
                                    {
                                        name: 'Google',
                                        value: 341212,
                                        icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32}
                                                       height={32}/>,
                                    },
                                    {
                                        name: 'Linkedin',
                                        value: 411213,
                                        icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32}
                                                       height={32}/>,
                                    },
                                    {
                                        name: 'Twitter',
                                        value: 443232,
                                        icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32}
                                                       height={32}/>,
                                    },
                                    {
                                        name: 'Linkedin',
                                        value: 411213,
                                        icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32}
                                                       height={32}/>,
                                    },
                                    {
                                        name: 'Twitter',
                                        value: 443232,
                                        icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32}
                                                       height={32}/>,
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} mt={10}>
                            <AppNewsUpdate/>
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            <AppTasks
                                title="Tasks"
                                list={[
                                    {id: '1', label: 'Create FireStone Logo'},
                                    {id: '2', label: 'Add SCSS and JS files if required'},
                                    {id: '3', label: 'Stakeholder Meeting'},
                                    {id: '4', label: 'Scoping & Estimations'},
                                    {id: '5', label: 'Sprint Showcase'},
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Page>
    );
}
