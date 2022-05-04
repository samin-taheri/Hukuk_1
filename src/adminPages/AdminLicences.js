import {Icon} from '@iconify/react';
import React, {useEffect, useState} from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import CircularProgress from '@mui/material/CircularProgress';
// material
import {
    Card,
    Table,
    Stack,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    Paper,
    TableHead, TablePagination, Box, TextField, InputAdornment,
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import PopupMessageService from '../services/popupMessage.service';
import {Global} from "../Global";
import LicencesService from "../services/licences.service";
import {format} from "date-fns";
import layersOutline from "@iconify/icons-eva/layers-outline";
import {useNavigate} from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import inboxOutline from '@iconify/icons-eva/inbox-outline';
import MenuItem from "@mui/material/MenuItem";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
// ----------------------------------------------------------------------

export default function AdminLicences() {
    const [allLicences, setAllLicences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [userId, setUserId] = useState(0);
    const [profileName, setProfileName] = useState("");
    const [email, setEmail] = useState("");
    const [appear, setAppear] = useState(false);
    const [isActive, setIsActive] = useState(0);
    const navigate = useNavigate();

    const licencesService = new LicencesService();
    const popupMessageService = new PopupMessageService();
    const catchMessagee = Global.catchMessage;
    const [count, setCount] = useState(10);

    const handleChangePage = (event, newPage) => {
        console.log("newPageNumber : ", newPage)
        getAllLicences(userId, profileName, email, isActive, newPage, pageSize)
        setPageNumber(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(event.target.value);
        setPageNumber(1);
        getAllLicences(userId, profileName, email, isActive, 1, event.target.value)
    };
    //List all the Case Statuses of current licence
    const getAllLicences = (userId, profileName, email, isActive, pageNumber, pageSize) => {
        licencesService.getAllLicencesAsAdmin(userId, profileName, email, isActive, pageNumber, pageSize).then(
            (result) => {
                if (result.data.Success) {
                    setAllLicences(result.data.Data);
                    setIsLoading(false)
                }
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    const appearFilter = () => {
        setAppear(true)
        getAllLicences(userId, profileName, email, isActive, pageNumber, pageSize)
    }

    const createRandomKey = () => {
        return Math.random().toString(36).substr(2, 9);
    }

    const handleChangeStatus = (event) => {
        setIsActive(event.target.value);
    };

    const handleChangeUserId = (event) => {
        setUserId(event.target.value);
    };

    useEffect(() => {
        getAllLicences(userId, profileName, email, isActive, pageNumber, pageSize);
    }, []);

    return (
        <Page title="Licences | MediLaw">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Typography variant="h4" gutterBottom>
                        Licences
                    </Typography>
                    <Button onClick={appearFilter} variant="contained" startIcon={<Icon icon={inboxOutline}/>}>
                        Filter
                    </Button>
                </Stack>
                <Stack spacing={2}>
                    {appear == true ?
                    <Stack mb={2} flexDirection="row" alignItems="center" justifyContent="space-around">
                        <Stack mb={0} justifyContent="space-around">
                            <Box sx={{maxWidth: 264, minWidth: 264}}>
                                <FormControl fullWidth size="small">
                                    <TextField
                                        select
                                        size='small'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={isActive}
                                        key={createRandomKey}
                                        label="Status"
                                        onChange={handleChangeStatus}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ToggleOffOutlinedIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    >
                                        <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                  value={-1}>All</MenuItem>
                                        <MenuItem key={Math.random().toString(36).substr(2, 9)} value={1}>
                                            Active
                                        </MenuItem>
                                        <MenuItem key={Math.random().toString(36).substr(2, 9)} value={0}>
                                            Passive
                                        </MenuItem>
                                    </TextField>
                                </FormControl>
                            </Box>
                        </Stack>
                    </Stack>
                        : null}
                </Stack>
                <Card sx={{marginTop: 6}}>
                    <Scrollbar>
                        {isLoading === true ?
                            <Stack sx={{color: 'grey.500', padding: 10}} spacing={2} direction="row"
                                   justifyContent='center'>
                                <CircularProgress color="inherit"/>
                            </Stack>
                            :
                            <>
                                {allLicences.length > 0 ? (
                                    <TableContainer component={Paper}>
                                        <Table sx={{minWidth: 650}} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{paddingLeft: 7}}>Profile Name</TableCell>
                                                    <TableCell align="left">Start Date</TableCell>
                                                    <TableCell align="left">Website</TableCell>
                                                    <TableCell align="left">Email</TableCell>
                                                    <TableCell align="center">Details</TableCell>
                                                    <TableCell align="right"/>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <>
                                                    {allLicences.map((row) => (
                                                        <TableRow
                                                            key={row.LicenceId}
                                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                                            <TableCell component="th" scope="row" sx={{paddingLeft: 7}}>
                                                                {row.ProfilName}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {format(new Date(row.StartDate), 'dd/MM/yyyy')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {row.WebSite}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {row.Email}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => navigate('/adminDashboard/licences/licencesDetails/' + row.LicenceId)}
                                                                    sx={{backgroundColor: '#b1b9be'}}
                                                                    startIcon={<Icon icon={layersOutline}/>}
                                                                >
                                                                    Details
                                                                </Button>
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
                                    <TableCell sx={{width: '40%'}}>
                                        <img src="/static/illustrations/no.png" alt="login"/>
                                        <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No Data
                                            Found</Typography>
                                    </TableCell>
                                )}
                            </>
                        }
                    </Scrollbar>
                </Card>
            </Container>
        </Page>
    );
}
