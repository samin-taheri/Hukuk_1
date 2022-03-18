// material
import {
    Card,
    Stack,
    Container,
    Paper,
    Typography,
    Button,
    Box,
    TextField,
    InputAdornment,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar
} from '@mui/material';
// layouts
// components
import Page from '../components/Page';
import CurrentUsage from "../components/_dashboard/Box/CurrentUsage";
import CurrentMonthly from "../components/_dashboard/Box/CurrentMonthly";
import ClientSize from "../components/_dashboard/Box/ClientSize";
import CaseSize from "../components/_dashboard/Box/CaseSize";
import TransactionActivitySize from "../components/_dashboard/Box/TransactionActivitySize";
import UsedMaximum from "../components/_dashboard/Box/UsedMaximum";
import CurrentlyUsed from "../components/_dashboard/Box/CurrentlyUsed";
import MaximumNumber from "../components/_dashboard/Box/MaximumNumber";
import NumberOfCurrent from "../components/_dashboard/Box/NumberOfCurrent";
import SMS from "../components/_dashboard/Box/SMS";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import messageCircleOutline from '@iconify/icons-eva/message-circle-outline';
import peopleOutline from '@iconify/icons-eva/people-outline';
import infoOutline from '@iconify/icons-eva/info-outline';
import Modal from "@mui/material/Modal";
import CloseIcon from "@material-ui/icons/Close";
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import { useEffect, useState } from "react";
import UserService from 'src/services/user.service';
import LicenceUsersService from 'src/services/licenceUsers.service';
import PopupMessageService from 'src/services/popupMessage.service';
import CurrentBalance from "../components/_dashboard/Box/CurrentBalance";
import {Global} from "../Global";
import account from "../_mocks_/account";
import roundUpdate from "@iconify/icons-ic/round-update";
import Scrollbar from "../components/Scrollbar";
import FormControl from "@mui/material/FormControl";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import MenuItem from "@mui/material/MenuItem";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import WebOutlinedIcon from "@mui/icons-material/WebOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonTypesService from "../services/personTypes.service";
import CityService from "../services/city.service";
import CountryService from "../services/country.service";
import LicencesService from "../services/licences.service";
import {useParams} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import checkmarkCircleOutline from "@iconify/icons-eva/checkmark-circle-outline";
import archiveOutline from '@iconify/icons-eva/archive-outline';
import Extra from "../components/_dashboard/Box/Extra";

// ----------------------------------------------------------------------

export default function LicenceSettings() {
    const [openModal, setOpen] = useState(false);
    const [openModalSMS, setOpenSMS] = useState(false);
    const [openModalAddBalance, setOpenAddBalance] = useState(false);
    const [openEditLicence, setOpenEditLicence] = useState(false);
    const [profileNameEdit, setProfileNameEdit] = useState('');
    const [cityIdEdit, setCityIdEdit] = useState(0);
    const [personTypeEdit, setPersonTypeEdit] = useState();
    const [phoneNumberEdit, setPhoneNumberEdit] = useState('');
    const [billAddressEdit, setBillAddressEdit] = useState('');
    const [taxNoEdit, setTaxNoEdit] = useState('');
    const [taxOfficeEdit, setTaxOfficeEdit] = useState('');
    const [websiteEdit, setWebSiteEdit] = useState('');
    const [emailEdit, setEmailEdit] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [userCellPhone, setUserCellPhone] = useState(true);
    const [allUsers, setAllusers] = useState([]);
    const [cities, setCities] = useState([]);
    const [personTypeList, setPersonTypeList] = useState([]);
    const [countryId, setCountryId] = useState(0);

    const { id } = useParams();

    const catchMessagee = Global.catchMessage;
    const personTypesService = new PersonTypesService();
    const licencesService = new LicencesService();
    const cityService = new CityService();
    const countryService = new CountryService();
    const popupMessageService = new PopupMessageService();
    const userService = new UserService()
    const licenceUser = new LicenceUsersService()
    const popMessage = new PopupMessageService()

    const handleClose = () => {
        setOpen(false); 
        setUserCellPhone('')
    };
    const handleCloseSMS = () => {
        setOpenSMS(false);
    };
    const handleCloseAddBalance = () => {
        setOpenAddBalance(false);
    };
    const handleOpenSMS = () => {
        setOpenSMS(true);
    };
    const handleOpenAddBalance = () => {
        setOpenAddBalance(true);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleOpenEditLicence = () => {
        setOpenEditLicence(true);
    };

    function licenceInfo() {
        licencesService.getForUpdating().then(result => {
            if (result.data.Success) {
                let info = result.data.Data
                setImageFile(info.ImageFile)
                setPersonTypeEdit(info.PersonType.PersonTypeId)
                setBillAddressEdit(info.BillAddress)
                setTaxNoEdit(info.TaxNo)
                setTaxOfficeEdit(info.TaxOffice)
                setWebSiteEdit(info.WebSite)
                setEmailEdit(info.Email)
                setPhoneNumberEdit(info.PhoneNumber)
                setCityIdEdit(info.City.CityId)
                setProfileNameEdit(info.ProfilName)
            }
        },(error) => {
            console.log()(error.response.data.Message);
        }
    ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        });
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
                setPersonTypeList(list2);
            },(error) => {
            console.log()(error.response.data.Message);
        }
    ).catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    }

    const editLicence = () => {
        let obj = {
            profilName: profileNameEdit,
            userId: id,
            personTypeId: personTypeEdit,
            billAddress: billAddressEdit,
            taxNo: taxNoEdit,
            taxOffice: taxOfficeEdit,
            webSite: websiteEdit,
            email: emailEdit,
            phoneNumber: phoneNumberEdit,
            cityId: cityIdEdit
        }
        let re = licencesService.update(obj)
        re.then(
            (result) => {
                if (result.data.Success) {
                    setOpenEditLicence(false)
                    popupMessageService.AlertSuccessMessage(result.data.Message)
                }
            },
            (error) => {
                console.log()(error.response.data.Message);
            }
        ).catch(()=> {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    const getAllCountries = () => {
        countryService
            .getAll()
            .then((result) => {
                setCountryId(result.data.Data.CountryId);
            })
    }

    const getAllCities = () => {
        cityService
            .getAll(1)
            .then((result) => {
                setCities(result.data.Data);
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
            })
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    }

    function GetAllUsers() {
        userService.getAll().then(result => {
            setAllusers(result.data.Data);
        }, error => {
            console.log(error.response);
        }).catch(()=> {
            popMessage.AlertErrorMessage(catchMessagee)
        })
    }

    useEffect(() => {
        GetAllUsers();
        getAllCities();
        getAllPersonTypes();
        licenceInfo();
        getAllCountries();
    }, [])

    function GetInputeCellPhone(cellPhone) {
        setUserCellPhone(cellPhone)

    }
    function ListAllUsers(listUsers) {
        let newList = []
        if (userCellPhone.length > 3) {
            newList = allUsers
            return newList.filter(r => r.CellPhone.startsWith(userCellPhone));
        }
        return newList
    }

    function SendRequest(userId) {
        licenceUser.add(userId).then(result => {
            popMessage.AlertSuccessMessage(result.data.Message)
        },error=>{
            console.log(error.response.data);
        }).catch(()=> {
            popMessage.AlertErrorMessage(catchMessagee)
        })
    }

    return (

        <Page title="Case Status | MediLaw">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Typography variant="h4" gutterBottom>
                        Licences
                    </Typography>
                </Stack>
                <Stack sx={{ mb: 5 }}>
                    <Typography variant="h4" gutterBottom sx={{ marginLeft: -20 }}>
                        Licences
                    </Typography>
                    <CurrentUsage />
                    <CurrentMonthly />
                    <ClientSize />
                    <CaseSize />
                    <TransactionActivitySize />
                    <CurrentBalance/>
                    <UsedMaximum />
                    <CurrentlyUsed />
                    <MaximumNumber />
                    <NumberOfCurrent />
                    <SMS />
                    <Extra/>
                    <Stack flexDirection='row' marginTop='31%' marginLeft='8%'>
                        <Button sx={{ }} onClick={handleOpen} variant="contained" startIcon={<Icon icon={peopleOutline} />}>
                            Users
                        </Button>
                        <Modal sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
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
                                    maxWidth: 850,
                                    maxHeight: 600,
                                    backgroundColor: 'background.paper',
                                    border: '2px solid #fff',
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 2
                                }}
                            >
                                <Stack mb={5} flexDirection="row" justifyContent='space-between'>

                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Users!
                                    </Typography>
                                    <CloseIcon onClick={handleClose} />
                                </Stack>
                                <Stack spacing={2} >
                                    <Stack mb={0} alignItems="center" justifyContent="space-around">
                                        <Stack mb={3} justifyContent="space-around">
                                            <Box sx={{ minWidth: 400 }}>
                                                <TextField
                                                    autoFocus
                                                    fullWidth
                                                    type="number"
                                                    size="small"
                                                    label="Cell Phone"
                                                    value={userCellPhone}
                                                    onChange={(e) => GetInputeCellPhone(e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PhoneInTalkOutlinedIcon />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Stack>
                                    {ListAllUsers(allUsers).length > 0 ? (
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Image</TableCell>
                                                        <TableCell align="left">Cell Phone</TableCell>
                                                        <TableCell align="left">Name / Surname</TableCell>
                                                        <TableCell align="left">City / Country</TableCell>
                                                        <TableCell align="left" />
                                                        <TableCell align="right" />
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <>
                                                        {ListAllUsers(allUsers).map((row) => (
                                                            <TableRow
                                                                key={row.Id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell component="th" scope="row">
                                                                    <Avatar src={account.photoURL} alt="photoURL"/>
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.CellPhone}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.FirstName} /  {row.LastName}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.Title}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    <Button
                                                                        size="small"
                                                                        type="submit"
                                                                        variant="contained"
                                                                        onClick={() => SendRequest(row.Id)}
                                                                    >Add! </Button>
                                                                </TableCell>

                                                            </TableRow>
                                                        ))}
                                                    </>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : null}

                                </Stack>
                            </Box>
                        </Modal>
                        <Button onClick={handleOpenSMS} sx={{ left: '2%'}} variant="contained" startIcon={<Icon icon={messageCircleOutline} />}>
                            SMS Order
                        </Button>
                        <Modal sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                               hideBackdrop={true}
                               disableEscapeKeyDown={true}
                               open={openModalSMS}
                               aria-labelledby="modal-modal-title"
                               aria-describedby="modal-modal-description"
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    maxWidth: 850,
                                    maxHeight: 600,
                                    backgroundColor: 'background.paper',
                                    border: '2px solid #fff',
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 2
                                }}
                            >
                                <Stack mb={5} flexDirection="row" justifyContent='space-between'>

                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        SMS Package!
                                    </Typography>
                                    <CloseIcon onClick={handleCloseSMS} />
                                </Stack>
                                <Stack spacing={2} >
                                    {/*{ListAllUsers(allUsers).length > 0 ? ( */}
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Package</TableCell>
                                                        <TableCell align="left">Price</TableCell>
                                                        <TableCell align="left">Unit Price</TableCell>
                                                        <TableCell align="left" />
                                                        <TableCell align="right" />
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <>
                                                    </>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    {/* ) : null}*/}

                                </Stack>
                            </Box>
                        </Modal>
                        <Button sx={{ left: '4%' }} onClick={handleOpenAddBalance} variant="contained" startIcon={<Icon icon={plusFill} />}>
                            Add balance
                        </Button>
                        <Modal sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                               hideBackdrop={true}
                               disableEscapeKeyDown={true}
                               open={openModalAddBalance}
                               aria-labelledby="modal-modal-title"
                               aria-describedby="modal-modal-description"
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    maxWidth: 850,
                                    maxHeight: 600,
                                    backgroundColor: 'background.paper',
                                    border: '2px solid #fff',
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 2
                                }}
                            >
                                <Stack mb={5} flexDirection="row" justifyContent='space-between'>

                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Add Balance!
                                    </Typography>
                                    <CloseIcon onClick={handleCloseAddBalance} />
                                </Stack>
                                <Stack spacing={2} >
                                    <Stack mb={0} alignItems="center" justifyContent="space-around">
                                        <Stack mb={2} justifyContent="space-around">
                                            <Box sx={{ minWidth: 400 }}>
                                                <TextField
                                                    autoFocus
                                                    fullWidth
                                                    type="number"
                                                    size="small"
                                                    label="Balance"
                                                    value={userCellPhone}
                                                    onChange={(e) => GetInputeCellPhone(e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AddCardOutlinedIcon />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Stack>
                                    <Button
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                    >
                                        Add!
                                    </Button>
                                </Stack>
                            </Box>
                        </Modal>
                        <Button onClick={handleOpenEditLicence} sx={{ left: '6.2%'}} variant="contained" startIcon={<Icon icon={roundUpdate} />}>
                            Edit Licence
                        </Button>
                        <Modal sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                               hideBackdrop={true}
                               disableEscapeKeyDown={true}
                               open={openEditLicence}
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
                                    <CloseIcon onClick={()=> setOpenEditLicence(false)} />
                                </Stack>
                                <Stack spacing={2} >
                                    <Stack mb={3} alignItems="center" justifyContent="space-around">
                                        <Stack mb={3} justifyContent="space-around">
                                            <Box sx={{ minWidth: 400 }}>
                                                <FormControl fullWidth size="small">
                                                    <TextField
                                                        autoFocus
                                                        fullWidth
                                                        size="small"
                                                        label="Licence Name"
                                                        value={profileNameEdit}
                                                        onChange={(event) => setProfileNameEdit(event.target.value)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <DriveFileRenameOutlineOutlinedIcon />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                            </Box>
                                        </Stack>
                                        {cities.length > 0 ? (
                                            <Box mb={3} sx={{ minWidth: 400 }}>
                                                <FormControl fullWidth size='small'>
                                                    <TextField
                                                        select
                                                        size='small'
                                                        value={cityIdEdit}
                                                        key={Math.random().toString(36).substr(2, 9)}
                                                        label="City"
                                                        onChange={(event)=> setCityIdEdit(event.target.value)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <BusinessOutlinedIcon />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    >
                                                        {cities.map((item) => (
                                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={item.value}>
                                                                {item.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </FormControl>
                                            </Box>
                                        ) : null}
                                        {personTypeList.length > 0 ? (
                                            <Box mb={3} sx={{ minWidth: 400 }}>
                                                <FormControl fullWidth size='small'>
                                                    <TextField
                                                        select
                                                        size='small'
                                                        value={personTypeEdit}
                                                        key={Math.random().toString(36).substr(2, 9)}
                                                        label="Person Type"
                                                        onChange={(event)=> setPersonTypeEdit(event.target.value)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <AdminPanelSettingsOutlinedIcon />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    >
                                                        {personTypeList.map((item) => (
                                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={item.value}>
                                                                {item.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </FormControl>
                                            </Box>
                                        ) : null}

                                        <Stack mb={3} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Phone Number"
                                                value={phoneNumberEdit}
                                                onChange={(event) => setPhoneNumberEdit(event.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PhoneInTalkOutlinedIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Bill Adress"
                                                value={billAddressEdit}
                                                onChange={(event) => setBillAddressEdit(event.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <HomeOutlinedIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Stack>
                                        <Stack mb={3} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Tax No"
                                                value={taxNoEdit}
                                                onChange={(event) => setTaxNoEdit(event.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AddBusinessOutlinedIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Tax Office"
                                                value={taxOfficeEdit}
                                                onChange={(event) => setTaxOfficeEdit(event.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <HomeWorkOutlinedIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Stack>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Website"
                                                value={websiteEdit}
                                                onChange={(event) => setWebSiteEdit(event.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <WebOutlinedIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Email"
                                                value={emailEdit}
                                                onChange={(event) => setEmailEdit(event.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailOutlinedIcon />
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
                                        onClick={() => editLicence()}
                                    >
                                        Edit!
                                    </Button>
                                </Stack>
                            </Box>
                        </Modal>
                    </Stack>
                </Stack>
            </Container>
        </Page>
    );
}
