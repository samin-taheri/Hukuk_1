import * as Yup from 'yup';
import React, {useEffect, useState} from 'react';
import {Link as RouterLink, Navigate, useNavigate, useParams} from 'react-router-dom';

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
    Box,
    Paper, TextField, InputAdornment, Divider, CardActions, CardContent, Card, Grid, Avatar
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import PopupMessageService from '../../../services/popupMessage.service';
import {Global} from '../../../Global';
import LicencesService from '../../../services/licences.service';
import LicenceUsersService from '../../../services/licenceUsers.service';
import AuthService from '../../../services/auth.service';
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import arrowForwardOutline from '@iconify/icons-eva/arrow-forward-outline';
import {Icon} from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import CityService from "../../../services/city.service";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import WebOutlinedIcon from '@mui/icons-material/WebOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CountryService from "../../../services/country.service";
import PersonTypesService from "../../../services/personTypes.service";
import CircularProgress from "@mui/material/CircularProgress";
import {format} from "date-fns";
import roundUpdate from "@iconify/icons-ic/round-update";
import account from "../../../_mocks_/account";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

// ----------------------------------------------------------------------

export default function LicencesListForm() {
    const [licence, setLicence] = useState([]);
    const [licenceUsers, setLicenceUsers] = useState([]);
    const [usr, setUsr] = useState();
    const [openModal, setOpen] = useState(false);

    const [profilNameAdd, setProfilNameAdd] = useState("");
    const [userIdAdd, setUserIdAdd] = useState(0);
    const [personTypeIdAdd, setPersonTypeIdAdd] = useState(1);
    const [billAddressAdd, setBillAddressAdd] = useState("");
    const [taxNoAdd, setTaxNoAdd] = useState("");
    const [taxOfficeAdd, setTaxOfficeAdd] = useState("");
    const [webSiteAdd, setWebSiteAdd] = useState("");
    const [emailAdd, setEmailAdd] = useState("");
    const [phoneNumberAdd, setPhoneNumberAdd] = useState("");
    const [cityIdAdd, setCityIdAdd] = useState(0);
    const [cities, setCities] = useState([]);
    const [personTypeList, setPersonTypeList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [valueR, setValueR] = useState('');
    const [cityValue, setCityValue] = useState(0);
    const [isCountrySelected, setIsCountrySelected] = useState(false);
    const [countries, setCountries] = useState([]);

    const popupMessageService = new PopupMessageService();
    const licencesService = new LicencesService();
    const licenceUsersService = new LicenceUsersService();
    const personTypesService = new PersonTypesService();
    const authService = new AuthService();
    const catchMessagee = Global.catchMessage;

    const {id} = useParams();
    const navigate = useNavigate();

    const LoginWithLicence = (licenceId, licenceProfileName, email) => {
        authService.loginWithLicenceId(usr.cellPhone, usr.password, licenceId).then(
            (result) => {
                if (result.data.Success) {
                    localStorage.setItem('token', JSON.stringify(result.data.Data.AccessToken.Token));
                    localStorage.setItem('userClaims', JSON.stringify(result.data.Data.OperationClaims));
                    localStorage.setItem('LicenceName', licenceProfileName);
                    localStorage.setItem('Email', email);
                    navigate('/dashboard');
                }
            },
            (error) => {
                console.log(error.response.data.Message)
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    function AcceptRequest(licenceUserId) {
    }

    const getAllPersonTypes = () => {
        personTypesService
            .getAll()
            .then((result) => {
                    setPersonTypeList(result.data.Data);
                    const personTypesFromApi = result.data.Data;
                    const list2 = [];
                    personTypesFromApi.forEach((item) => {
                        list2.push({
                            value: item.PersonTypeId,
                            label: item.PersonTypeName,
                            key: item.PersonTypeName
                        });
                    });
                    setPersonTypeIdAdd(list2[0].value)
                    setPersonTypeList(list2);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                })
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    }

    const addNewLicence = () => {
        let obj = {
            profilName: profilNameAdd,
            userId: id,
            personTypeId: personTypeIdAdd,
            billAddress: billAddressAdd,
            taxNo: taxNoAdd,
            taxOffice: taxOfficeAdd,
            webSite: webSiteAdd,
            email: emailAdd,
            phoneNumber: phoneNumberAdd,
            cityId: cityIdAdd
        }
        let re = licencesService.add(obj)
        re.then(
            (result) => {
                if (result.data.Success) {
                    getAllLicences()
                    setOpen(false)
                    popupMessageService.AlertSuccessMessage(result.data.Message)
                }
            },
            (error) => {
                console.log()(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    const handleOpen = () => {
        setProfilNameAdd('')
        setUserIdAdd(0)
        setPersonTypeIdAdd(0)
        setBillAddressAdd('')
        setTaxNoAdd('')
        setTaxOfficeAdd('')
        setWebSiteAdd('')
        setWebSiteAdd('')
        setEmailAdd('')
        setPhoneNumberAdd('')
        setCityIdAdd(0)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const getAllLicences = () => {
        setUsr(JSON.parse(localStorage.getItem('usr')));
        licencesService
            .GetAllByUserId(id)
            .then(
                (response) => {
                    setLicence(response.data.Data);
                    setIsLoading(false)
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    }

    const getAllLicencesByUserId = () => {
        licenceUsersService
            .GetAllByUserId(id)
            .then(
                (response) => {
                    setLicenceUsers(response.data.Data);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    }

    const handleChange = (event) => {
        setValueR(event.target.value);
        setIsCountrySelected(true);
        const cityService = new CityService();
        cityService
            .getAll(event.target.value)
            .then((result) => {
                    const citiesFromApi = result.data.Data;
                    const list2 = [];
                    // eslint-disable-next-line no-restricted-syntax,guard-for-in
                    citiesFromApi.forEach((item) => {
                        list2.push({
                            value: item.CityId,
                            label: item.CityName,
                            key: item.CityName
                        });
                    });
                    setCities(list2);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                })
            .catch((errors) => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    };

    const handleCitiesChange = (event) => {
        setCityValue(event.target.value);
    };
    useEffect(() => {
        const countryService = new CountryService();
        countryService
            .getAll()
            .then((result) => {
                    setCountries(result.data.Data);

                    const countriesFromApi = result.data.Data;
                    const list = [];
                    // eslint-disable-next-line no-restricted-syntax,guard-for-in
                    countriesFromApi.forEach((item) => {
                        list.push({
                            value: item.CountryId,
                            label: item.CountryName,
                            key: item.CountryName
                        });
                    });
                    setCountries(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                })
            .catch((errors) => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    }, []);

    useEffect(() => {
        getAllLicences();
        getAllLicencesByUserId();
        getAllPersonTypes();
    }, []);

    return (
        <Stack spacing={2.5}>
            <Stack flexDirection='row' justifyContent='space-between' mt={6}>
                <Typography id="transition-modal-title" variant="h5" pb={4} pt={2}/>
                <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={handleOpen}
                    startIcon={<Icon icon={plusFill}/>}
                >
                    Add Licence!
                </Button>
                <Modal sx={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}
                       hideBackdrop={true}
                       disableEscapeKeyDown={true}
                       open={openModal}
                       aria-labelledby="modal-modal-title"
                       aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 470,
                            backgroundColor: 'background.paper',
                            border: '2px solid #fff',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2
                        }}
                    >
                        <Stack mb={5} flexDirection="row" justifyContent='space-between'>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Add new licence!
                            </Typography>
                            <CloseIcon onClick={handleClose}/>
                        </Stack>
                        <Stack spacing={2}>
                            <Stack mb={3} alignItems="center" justifyContent="space-around">
                                <Stack mb={3} justifyContent="space-around">
                                    <Box sx={{minWidth: 400}}>
                                        <FormControl fullWidth size="small">
                                            <TextField
                                                autoFocus
                                                fullWidth
                                                size="small"
                                                label="Licence Name"
                                                value={profilNameAdd}
                                                onChange={(event) => setProfilNameAdd(event.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <DriveFileRenameOutlineOutlinedIcon/>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                    </Box>
                                </Stack>
                                {countries.length > 0 ? (
                                    <Stack mb={3} justifyContent="space-around">
                                        <Box sx={{minWidth: 400}}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    size='small'
                                                    value={valueR}
                                                    key={Math.random().toString(36).substr(2, 9)}
                                                    label="Country"
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PublicOutlinedIcon/>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                >
                                                    {countries.map((item) => (
                                                        <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                                  value={item.value}>
                                                            {item.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </FormControl>
                                        </Box>
                                    </Stack>
                                ) : null}

                                {cities.length > 0 && isCountrySelected ? (
                                    <Stack mb={3} justifyContent="space-around">
                                        <Box sx={{minWidth: 400}}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    size='small'
                                                    value={cityValue}
                                                    key={Math.random().toString(36).substr(2, 9)}
                                                    label="City"
                                                    onChange={handleCitiesChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <BusinessOutlinedIcon/>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                >
                                                    {cities.map((item) => (
                                                        <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                                  value={item.value}>
                                                            {item.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </FormControl>
                                        </Box>
                                    </Stack>
                                ) : null}

                                {personTypeList.length > 0 ? (
                                    <Box mb={3} sx={{minWidth: 400}}>
                                        <FormControl fullWidth size='small'>
                                            <TextField
                                                select
                                                size='small'
                                                value={personTypeIdAdd}
                                                key={Math.random().toString(36).substr(2, 9)}
                                                label="Person Type"
                                                onChange={(event) => setPersonTypeIdAdd(event.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AdminPanelSettingsOutlinedIcon/>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            >
                                                {personTypeList.map((item) => (
                                                    <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                              value={item.value}>
                                                        {item.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </FormControl>
                                    </Box>
                                ) : null}

                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Phone Number"
                                        value={phoneNumberAdd}
                                        onChange={(event) => setPhoneNumberAdd(event.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneInTalkOutlinedIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Bill Adress"
                                        value={billAddressAdd}
                                        onChange={(event) => setBillAddressAdd(event.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <HomeOutlinedIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Stack>
                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Tax No"
                                        value={taxNoAdd}
                                        onChange={(event) => setTaxNoAdd(event.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AddBusinessOutlinedIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Tax Office"
                                        value={taxOfficeAdd}
                                        onChange={(event) => setTaxOfficeAdd(event.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <HomeWorkOutlinedIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Stack>
                                <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Website"
                                        value={webSiteAdd}
                                        onChange={(event) => setWebSiteAdd(event.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <WebOutlinedIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Email"
                                        value={emailAdd}
                                        onChange={(event) => setEmailAdd(event.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlinedIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Stack>
                            </Stack>
                            <Button
                                size="large"
                                type="submit"
                                variant="contained"
                                onClick={() => addNewLicence()}
                            >
                                Add!
                            </Button>
                        </Stack>
                    </Box>
                </Modal>
            </Stack>
            <Stack flexDirection='row' justifyContent='center' paddingTop={5}>
                <Card container sx={{maxWidth: 450, minWidth: 450, minHeight: 280, padding: 4}}>
                    <>
                        {isLoading === true ?
                            <Stack sx={{color: 'grey.500', padding: 10}} spacing={2} direction="row"
                                   justifyContent='center' alignSelf='center' left='50%'>
                                <CircularProgress color="inherit"/>
                            </Stack>
                            :
                            <>
                                {licence.length > 0 ? (
                                    <>
                                        <Typography gutterBottom variant="h5" component="div" sx={{ borderBottom: '1px dashed #b1b9be', paddingBottom:3 }}>
                                            Please Choose a Licence!
                                        </Typography>
                                        {licence.map((row) => (
                                            <>
                                                <Stack sx={{flexDirection: 'row', marginTop: 4}}>
                                                    <Avatar src={account.photoURL} alt="photoURL"/>
                                                    <Stack sx={{flexDirection: 'column', paddingLeft: 3}}>
                                                        <Typography gutterBottom component="div" fontSize={16}
                                                                    fontWeight='bold' key={row.LicenceId}>
                                                            {row.ProfilName}
                                                        </Typography>
                                                        <Stack paddingTop={-3}>
                                                            <Typography
                                                                fontSize={13}>{row.PersonType.PersonTypeName} - {row.City.CityName}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                    <LoadingButton
                                                        onClick={() => LoginWithLicence(row.LicenceId, row.ProfilName, row.Email)}
                                                        sx={{height: 30, marginLeft: 12, marginTop: 1}}
                                                        type="button"
                                                        size="medium"
                                                        variant="contained"
                                                        loading={false}
                                                        startIcon={<Icon icon={arrowForwardOutline}/>}
                                                    >
                                                        Continue
                                                    </LoadingButton>
                                                </Stack>
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <card sx={{width: '40%'}}>
                                        <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No Data
                                            Found</Typography>
                                    </card>
                                )}
                            </>
                        }
                    </>
                </Card>
                <Card container sx={{maxWidth: 450, minWidth: 450, minHeight: 280, padding: 4, marginLeft: 10}}>
                    <>
                        {isLoading === true ?
                            <Stack sx={{color: 'grey.500', padding: 10}} spacing={2} direction="row"
                                   justifyContent='center' alignSelf='center' left='50%'>
                                <CircularProgress color="inherit"/>
                            </Stack>
                            :
                            <>
                                {licenceUsers.length > 0 ? (
                                    <>
                                        <Typography id="transition-modal-title" variant="h5" sx={{ borderBottom: '1px dashed #b1b9be', paddingBottom:3 }}>
                                            Your Registered Licences!
                                        </Typography>
                                        {licenceUsers.map((row) => (


                                            <Stack sx={{flexDirection: 'row', marginTop: 4}}>
                                                <Avatar src={account.photoURL2} alt="photoURL"/>
                                                <Stack sx={{flexDirection: 'column', paddingLeft: 3}}>
                                                    <Typography gutterBottom component="div" fontSize={16}
                                                                fontWeight='bold' key={row.LicenceUserId}>
                                                        {row.LicenceGetDto.ProfilName}
                                                    </Typography>
                                                </Stack>
                                                <LoadingButton
                                                    onClick={() => LoginWithLicence(row.LicenceId, row.ProfilName, row.Email)}
                                                    sx={{height: 30, marginLeft: 12, marginTop: 1}}
                                                    type="button"
                                                    size="medium"
                                                    variant="contained"
                                                    loading={false}
                                                    startIcon={<Icon icon={arrowForwardOutline}/>}
                                                >
                                                    Continue
                                                </LoadingButton>
                                            </Stack>
                                        ))}
                                    </>
                                ) : (
                                    <card>
                                        <Stack>
                                            <Typography id="transition-modal-title" variant="h5" sx={{ borderBottom: '1px dashed #b1b9be', paddingBottom:3 }}>
                                                Your Registered Licences!
                                            </Typography>
                                        <img src="/static/illustrations/no.png" alt="login"/>
                                        <Typography variant="h4" gutterBottom textAlign='center' color='#a9a9a9'>No Data
                                            Found</Typography>
                                        </Stack>
                                    </card>
                                )}
                            </>
                        }
                    </>
                </Card>
            </Stack>
        </Stack>
    );
}
