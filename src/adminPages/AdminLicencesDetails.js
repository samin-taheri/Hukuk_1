// material
import {styled} from '@mui/material/styles';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container, Divider,
    IconButton,
    Paper,
    Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow,
    Typography
} from '@mui/material';
// components
import Page from '../components/Page';
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import PopupMessageService from "../services/popupMessage.service";
import {Global} from "../Global";
import {Icon} from "@iconify/react";
import arrowBackOutline from "@iconify/icons-eva/arrow-back-outline";
import CircularProgress from "@mui/material/CircularProgress";
import LicencesService from "../services/licences.service";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import {format} from "date-fns";
import Label from "../components/Label";
import {sentenceCase} from "change-case";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@mui/material/Modal";
import SmsHistoryService from "../services/smsHistory.service";
import plusFill from "@iconify/icons-eva/plus-fill";
import layersOutline from "@iconify/icons-eva/layers-outline";
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

// ----------------------------------------------------------------------

export default function AdminLicencesDetails() {
    const {id} = useParams()
    const popupMessageService = new PopupMessageService();
    const licencesService = new LicencesService();
    const smsHistoryService = new SmsHistoryService();
    const catchMessagee = Global.catchMessage;
    const [phoneNumber, setPhoneNumber] = useState("")
    const [profilename, setProfileName] = useState("")
    const [taxOffice, setTaxOffice] = useState("")
    const [billAddress, setBillAddress] = useState("")
    const [pageNumber, setPageNumber] =useState(0);
    const [pageSize, setPageSize] = useState(4);
    const [count, setCount] = useState(10);
    const [smsHistories, setSmsHistories] = useState([])
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [balance, setBalance] = useState("")
    const [isActive, setIsActive] = useState(false)
    const [personType, setPersonType] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const today = new Date();
    const date = today.setDate(today.getDate());
    const defaultValue = new Date(date).toISOString().split('T')[0]
    const [startDate, setStartDate] = useState(defaultValue);
    const [openModalForDetails, setOpenModalForDetails] = useState(false);
    const navigate = useNavigate();

    const getAllCaseUpdateHistory = (Lid) => {
        licencesService.getByIdAsAdmin(Lid).then(
            (result) => {
                let details = result.data.Data
                setProfileName(details.ProfilName)
                setPhoneNumber(details.PhoneNumber)
                setTaxOffice(details.TaxOffice)
                setStartDate(details.StartDate)
                setBillAddress(details.BillAddress)
                setCity(details.City.CityName)
                setCountry(details.City.Country.CountryName)
                setBalance(details.Balance)
                setPersonType(details.PersonType.PersonTypeName)
                setIsActive(details.IsActive)
                setIsLoading(false)
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    const handleChangePage = (event, newPage) => {
        getAllSmsHistories(newPage, pageSize, id)
        setPageNumber(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(event.target.value);
        setPageNumber(1);
        getAllSmsHistories(1, event.target.value, id)
    };

    function getAllSmsHistories(pageNumber, pageSize, licenceId) {
        smsHistoryService.getAllAsAdmin(pageNumber, pageSize, licenceId).then(
            (result) => {
                if (result.data.Success) {
                    setSmsHistories(result.data.Data)
                }
                setOpenModalForDetails(true)
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    }

    const handleClosModal = () => {
        setOpenModalForDetails(false)
    }

    useEffect(() => {
        getAllCaseUpdateHistory(id)
    }, [])

    return (
        <RootStyle title="Licence Details | MediLaw">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={4}>
                    <IconButton onClick={() => navigate(-1)} sx={{mr: 3, color: 'text.primary', bottom: 3}}
                                size="large">
                        <Icon icon={arrowBackOutline}/>
                    </IconButton>
                    <Typography variant="h4" gutterBottom>Licence Details</Typography>
                </Stack>
                <Stack flexDirection='row'>
                    {isLoading === true ?
                        <Stack sx={{color: 'grey.500', paddingLeft: 60, paddingTop: 20}} spacing={2}
                               direction="row"
                               justifyContent='center' alignSelf='center' left='50%'>
                            <CircularProgress color="inherit"/>
                        </Stack>
                        :
                        <>
                            <Card sx={{
                                width: '100%',
                                maxWidth: 840,
                                bgcolor: 'background.paper',
                                marginLeft: 10,
                                marginTop: 3
                            }}>
                                <List
                                    sx={{
                                        width: '100%',
                                        maxWidth: 830,
                                        bgcolor: 'background.paper',
                                        marginLeft: 0.5,
                                        padding: 2
                                    }}>
                                    <ListItem sx={{
                                        backgroundColor: '#f7f7f7',
                                        padding: 2,
                                        border: '6px solid #fff',
                                    }}>
                                        <ListItemIcon>
                                            <BadgeOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" primary="Profile Name :"/>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {profilename}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{paddingLeft: 2.7}}>
                                        <ListItemIcon>
                                            <LocalPhoneOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-bluetooth" primary="Phone Number :"/>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {phoneNumber}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{
                                        backgroundColor: '#f7f7f7',
                                        padding: 2,
                                        border: '6px solid #fff',
                                    }}>
                                        <ListItemIcon>
                                            <EventAvailableOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" primary="Start Date :"/>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {format(new Date(startDate), 'dd/MM/yyyy')}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{paddingLeft: 2.7}}>
                                        <ListItemIcon>
                                            <MapsHomeWorkOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-bluetooth" primary="Tax Office :"/>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {taxOffice}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{
                                        backgroundColor: '#f7f7f7',
                                        padding: 2,
                                        border: '6px solid #fff',
                                    }}>
                                        <ListItemIcon>
                                            <BusinessOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" primary="Bill Address :"/>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {billAddress}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{paddingLeft: 2.7}}>
                                        <ListItemIcon>
                                            <LanguageOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-bluetooth" primary="Country / City :"/>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {country} / {city}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{
                                        backgroundColor: '#f7f7f7',
                                        padding: 2,
                                        border: '6px solid #fff',
                                    }}>
                                        <ListItemIcon>
                                            <LocalAtmOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" primary="Balance :"/>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            ${balance}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{paddingLeft: 2.7}}>
                                        <ListItemIcon>
                                            <PersonPinOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-bluetooth" primary="Person Type :"/>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {personType}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{
                                        backgroundColor: '#f7f7f7',
                                        padding: 2,
                                        border: '6px solid #fff',
                                    }}>
                                        <ListItemIcon>
                                            <ToggleOffOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" primary="Status :"/>
                                        {isActive ? (
                                            <Label variant="ghost" color="success" sx={{fontSize: 13}}>
                                                {sentenceCase('Active')}
                                            </Label>
                                        ) : (
                                            <Label variant="ghost" color="error" sx={{fontSize: 13}}>
                                                {sentenceCase('Passive')}
                                            </Label>
                                        )}
                                    </ListItem>
                                </List>
                            </Card>
                        </>
                    }
                    <Box sx={{height: 320, transform: 'translateX(0px)', flexGrow: 1, marginRight: 4, marginTop: -18}}>
                        <SpeedDial
                            direction='down'
                            ariaLabel="SpeedDial basic example"
                            sx={{position: 'absolute', bottom: 16, right: 0}}
                            icon={<SpeedDialIcon/>}
                        >
                            <SpeedDialAction
                                icon={<SmsOutlinedIcon/>}
                                tooltipTitle='SMS History'
                                onClick={(e) => {
                                    getAllSmsHistories(pageNumber, pageSize, id, e)
                                }}
                            />
                            <SpeedDialAction
                                key={Math.random().toString(36).substr(2, 9)}
                                icon={<AccountBalanceWalletOutlinedIcon/>}
                                tooltipTitle='Payment History'
                            />
                            <SpeedDialAction
                                key={Math.random().toString(36).substr(2, 9)}
                                icon={<PeopleAltOutlinedIcon/>}
                                tooltipTitle='Registered Users'
                            />
                        </SpeedDial>
                    </Box>
                </Stack>
                <Modal sx={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                       hideBackdrop={true}
                       disableEscapeKeyDown={true}
                       open={openModalForDetails}
                       aria-labelledby="modal-modal-title"
                       aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            minWidth: 700,
                            maxWidth: 700,
                            backgroundColor: 'background.paper',
                            border: '2px solid #fff',
                            p: 4,
                            borderRadius: 2
                        }}>
                        <Stack mb={2} flexDirection="row"
                               justifyContent='space-between'>
                            <Typography id="modal-modal-title"
                                        variant="h6" component="h2">
                                SMS History!
                            </Typography>
                            <IconButton sx={{bottom: 4}}>
                                <CloseIcon onClick={handleClosModal}/>
                            </IconButton>
                        </Stack>
                        {smsHistories.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table sx={{minWidth: 650, marginTop: 2}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{backgroundColor: '#f7f7f7'}}>
                                            <TableCell sx={{paddingLeft: 3}}>Recipient Name</TableCell>
                                            <TableCell align="left">Recipient Role</TableCell>
                                            <TableCell align="left">Date</TableCell>
                                            <TableCell align="left">Phone Number</TableCell>
                                            <TableCell align="right"/>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <>
                                            {smsHistories.map((row) => (
                                                <TableRow
                                                    key={row.SmsHistoryId}
                                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                                    <TableCell component="th" scope="row" sx={{paddingLeft: 3}}>
                                                        {row.RecipientName}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.RecipientRole}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {format(new Date(row.Date), 'dd/MM/yyyy')}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.PhoneNumber}
                                                    </TableCell>
                                                    <TableCell align="right"/>
                                                </TableRow>
                                            ))}
                                        </>
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={count}
                                    page={pageNumber}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={pageSize}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableContainer>
                        ) : (
                            <Box>
                                <img src="/static/illustrations/no.png" alt="login"/>
                                <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No Data Found</Typography>
                            </Box>
                        )}
                    </Box>
                </Modal>
            </Container>
        </RootStyle>
    )
        ;
}
