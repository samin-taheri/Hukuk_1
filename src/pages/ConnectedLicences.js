import { useEffect, useState } from 'react';

// material
import {
    Stack,
    Button,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper, Card, Container
} from '@mui/material';
import {Icon} from "@iconify/react";
import Scrollbar from "../components/Scrollbar";
import CircularProgress from "@mui/material/CircularProgress";
import checkmarkCircleOutline from "@iconify/icons-eva/checkmark-circle-outline";
import LicenceUsersService from "../services/licenceUsers.service";
import PopupMessageService from "../services/popupMessage.service";
import {styled} from "@mui/material/styles";
import Page from "../components/Page";

// ----------------------------------------------------------------------

export default function ConnectedLicences() {
    const [isLoading, setIsLoading] = useState(true);
    const [licenceUsers, setLicenceUsers] = useState([]);

    const licenceUserService = new LicenceUsersService();
    const popupMessageService = new PopupMessageService();

    const RootStyle = styled(Page)(({ theme }) => ({
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    }));
    const getAllLicenceUser = () => {
        if (true) {
            licenceUserService.GetAllByUserIdWithNotAccept().then(
                (result) => {
                    if (result.data.Success) {
                        setLicenceUsers(result.data.Data);
                        setIsLoading(false)
                    }
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            );
        }
    };
    function AcceptRequest(id) {
        licenceUserService.ChangeAcceptence(id).then(result => {
            popupMessageService.AlertSuccessMessage(result.data.Message);
        })
    }
    useEffect(() => {
        getAllLicenceUser();
    }, [])
    return (
        <RootStyle title="Licences | MediLaw">
            <Container>
            <Typography mt={12} mb={12} gutterBottom variant="h4" component="h2">
                Connected Licences!
            </Typography>
    <Stack spacing={2} >
        <Card sx={{ marginTop: -3 }}>
            <Scrollbar>
                {isLoading === true ?
                    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyContent='center'>
                        <CircularProgress color="inherit" />
                    </Stack>
                    :
                    <>
                        {licenceUsers.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ paddingLeft: 7 }}>Profile Name</TableCell>
                                            <TableCell align="left" sx={{ paddingLeft: 5 }}>Website</TableCell>
                                            <TableCell align="left">Phone Number</TableCell>
                                            <TableCell align="right" />
                                            <TableCell align="right" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <>
                                            {
                                                licenceUsers
                                                    .map((row) => (
                                                        <TableRow
                                                            key={row.LicenceUserId}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row" sx={{ paddingLeft: 7 }}>
                                                                {row.LicenceGetDto.ProfilName}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ paddingLeft: 7 }}>
                                                                {row.LicenceGetDto.WebSite}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ paddingLeft: 7 }}>
                                                                {row.LicenceGetDto.PhoneNumber}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => AcceptRequest(row.LicenceUserId)}
                                                                    sx={{ backgroundColor: '#b1b9be' }}
                                                                    startIcon={<Icon icon={checkmarkCircleOutline} />}
                                                                >
                                                                    Accept
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                        </>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <TableCell sx={{ width: '40%' }}>
                                <img src="/static/illustrations/no.png" alt="login" />
                                <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No Data Found!</Typography>
                            </TableCell>
                        )}
                    </>
                }
            </Scrollbar>
        </Card>
    </Stack>
            </Container>
        </RootStyle>
    );
}
