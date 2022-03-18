import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
import { LicencesListForm } from '../components/authentication/LicencesListForm';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

// ----------------------------------------------------------------------

export default function LicencesList() {
  return (
    <RootStyle title="Licences | MediLaw">
      <Container>
        <Typography variant="h4" gutterBottom />
        <LicencesListForm />
      </Container>
    </RootStyle>
  );
}
