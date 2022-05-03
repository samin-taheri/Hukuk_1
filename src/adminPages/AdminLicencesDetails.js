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
    Stack, Table, TableCell,
    TableContainer, TableRow,
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
import plusFill from "@iconify/icons-eva/plus-fill";
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
    const catchMessagee = Global.catchMessage;
    const [allLicenceDetails, setAllLicenceDetails] = useState([])
    const [phoneNumber, setPhoneNumber] = useState("")
    const [profilename, setProfileName] = useState("")
    const [taxOffice, setTaxOffice] = useState("")
    const [billAddress, setBillAddress] = useState("")
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

    const navigate = useNavigate();

    const getAllCaseUpdateHistory = (id) => {
        licencesService.getByIdAsAdmin(id).then(
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

    const [checked, setChecked] = React.useState(['wifi']);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

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
                                maxWidth: 950,
                                bgcolor: 'background.paper',
                                marginLeft: 7,
                                marginTop: 3
                            }}>
                                <List
                                    sx={{
                                        width: '100%',
                                        maxWidth: 940,
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
                                        <ListItemText id="switch-list-label-wifi" primary="Profile Name"/>
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
                                        <ListItemText id="switch-list-label-bluetooth" primary="Phone Number"/>
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
                                        <ListItemText id="switch-list-label-wifi" primary="Start Date"/>
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
                                        <ListItemText id="switch-list-label-bluetooth" primary="Tax Office"/>
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
                                        <ListItemText id="switch-list-label-wifi" primary="Bill Address"/>
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
                                        <ListItemText id="switch-list-label-bluetooth" primary="Country / City"/>
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
                                        <ListItemText id="switch-list-label-wifi" primary="Balance"/>
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
                                        <ListItemText id="switch-list-label-bluetooth" primary="Status"/>
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
                                        <ListItemText id="switch-list-label-wifi" primary="Balance"/>
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
                </Stack>
            </Container>
        </RootStyle>
    );
}
