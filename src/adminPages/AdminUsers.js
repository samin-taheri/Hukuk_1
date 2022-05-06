import {Icon} from '@iconify/react';
import React, {useEffect, useState} from 'react';
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
    TableHead, TablePagination, Box, TextField, InputAdornment, Collapse, IconButton,
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import PopupMessageService from '../services/popupMessage.service';
import {Global} from "../Global";
import LicencesService from "../services/licences.service";
import {format} from "date-fns";
import layersOutline from "@iconify/icons-eva/layers-outline";
import {useNavigate, useParams} from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import minusOutline from '@iconify/icons-eva/minus-outline';
import plusOutline from '@iconify/icons-eva/plus-outline';
import MenuItem from "@mui/material/MenuItem";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import UserService from "../services/user.service";
import {styled} from "@mui/material/styles";
import {tableCellClasses} from "@mui/material/TableCell";
// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function AdminUsers() {
    const [allLicences, setAllLicences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [cellPhone, setCellPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(0);
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const userService = new UserService();
    const popupMessageService = new PopupMessageService();
    const catchMessagee = Global.catchMessage;
    const [count, setCount] = useState(10);
    const {id} = useParams();


    const handleChangePage = (event, newPage) => {
        console.log("newPageNumber : ", newPage)
        getAllLicences(firstName, lastName, cellPhone, isActive, email, newPage, pageSize)
        setPageNumber(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(event.target.value);
        setPageNumber(1);
        getAllLicences(firstName, lastName, cellPhone, isActive, email, 1, event.target.value)
    };
    //List all the Case Statuses of current licence
    const getAllLicences = (firstName, lastName, cellPhone, isActive, email, pageNumber, pageSize) => {
        userService.getAllUsersAsAdmin(firstName, lastName, cellPhone, isActive, email, pageNumber, pageSize).then(
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
        getAllLicences(firstName, lastName, cellPhone, isActive, email, pageNumber, pageSize)
    }

    const createRandomKey = () => {
        return Math.random().toString(36).substr(2, 9);
    }

    const handleChangeStatus = (event) => {
        setIsActive(event.target.value);
    };

    useEffect(() => {
        getAllLicences(firstName, lastName, cellPhone, isActive, email, pageNumber, pageSize);
    }, []);

    return (
        <Page title="Users | MediLaw">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Typography variant="h4" gutterBottom>
                        Users
                    </Typography>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            setOpen(!open)
                            appearFilter()
                        }}
                    >
                        {open ? <Button variant="contained" startIcon={<Icon icon={minusOutline}/>}>Unfilter</Button> :
                            <Button variant="contained" startIcon={<Icon icon={plusOutline}/>}>Filter</Button>}
                    </IconButton>
                </Stack>
                <Stack spacing={2}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Stack mb={2} flexDirection="row" alignItems="center" justifyContent="space-around">
                                <Stack mb={0} justifyContent="space-around">
                                    <Box sx={{maxWidth: 240, minWidth: 240}}>
                                        <FormControl fullWidth size="small">
                                            <TextField
                                                select
                                                size='small'
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
                        </Box>
                    </Collapse>
                </Stack>

                <Card sx={{marginTop: 5}}>
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
                                                    <StyledTableCell sx={{paddingLeft: 7}}>Profile Name</StyledTableCell>
                                                    <StyledTableCell align="left">Start Date</StyledTableCell>
                                                    <StyledTableCell align="left">Website</StyledTableCell>
                                                    <StyledTableCell align="left">Email</StyledTableCell>
                                                    <StyledTableCell align="left">Details</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <>
                                                    {/*
                                                    {allLicences.map((row) => (
                                                        <StyledTableRow
                                                            key={row.FirstName}
                                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                                            <StyledTableCell component="th" scope="row" sx={{paddingLeft: 7}}>
                                                                {row.FirstName} {row.LastName}
                                                            </StyledTableCell>
                                                            <StyledTableCell component="th" scope="row">
                                                                {format(new Date(row.StartDate), 'dd/MM/yyyy')}
                                                            </StyledTableCell>
                                                            <StyledTableCell component="th" scope="row">
                                                                {row.CellPhone}
                                                            </StyledTableCell>
                                                            <StyledTableCell component="th" scope="row">
                                                                {row.Email}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="left">
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => navigate('/adminDashboard/licences/licencesDetails/' + row.FirstName)}
                                                                    startIcon={<Icon icon={layersOutline}/>}
                                                                >
                                                                    Details
                                                                </Button>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                    */}
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
