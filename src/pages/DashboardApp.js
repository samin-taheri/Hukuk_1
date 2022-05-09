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
import React, {useEffect} from 'react';
import AuthService from '../services/auth.service';
import Page from '../components/Page';
import AppConversionRates from "../components/_dashboard/user/AppConversionRates";
import AppTrafficBySite from "../components/_dashboard/user/AppTraficBySite";

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
                        <Grid item xs={12} md={6} lg={4} mt={8}>
                            <AppConversionRates/>
                        </Grid>
                        <Grid item xs={12} md={6} lg={7.8} mt={8}>
                            <AppTrafficBySite />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Page>
    );
}
