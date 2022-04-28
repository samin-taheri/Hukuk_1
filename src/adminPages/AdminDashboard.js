// material
import { Box, Grid, Container, Typography } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// components
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
import AuthService from '../services/auth.service';
import Page from '../components/Page';
import AppConversionRates from "../components/_dashboard/user/AppConversionRates";
import AppNewsUpdate from "../components/_dashboard/user/AppNewsUpdate";

export default function AdminDashboard() {
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
        <Page title="Admin Dashboard | MediLaw">
            <Container maxWidth="xl">
                <Box sx={{ pb: 10 }}>
                    <Typography variant="h4">MediLaw Admin</Typography>
                </Box>
            </Container>
        </Page>
    );
}
