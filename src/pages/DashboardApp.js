// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { Scheduler } from '@aldabil/react-scheduler';
// components
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from 'react';
import AuthService from '../services/auth.service';
import Page from '../components/Page';

export default function DashboardApp() {
  const navigate = useNavigate();
  const authService = new AuthService();
  useEffect(() => {
    if (!authService.IsAuth()) {
      navigate('/login');
    }
  }, []);

  return (
    <Page title="Dashboard | MediLaw">
      <Container maxWidth="xl">
        <Box sx={{ pb: 10 }}>
          <Typography variant="h4">Hi, Welcome to MediLaw</Typography>
        </Box>
      </Container>
    </Page>
  );
}
