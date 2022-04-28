import {Icon} from '@iconify/react';
import 'react-datepicker/dist/react-datepicker.css';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
    Stack,
    Button,
    Container,
    Typography,
    TextField,
    InputAdornment,
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Card,
    Avatar,
    IconButton, Checkbox
} from '@mui/material';
// components
import Page from '../components/Page';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import Modal from "@mui/material/Modal";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import React, {useEffect, useState} from "react";
import PopupMessageService from "../services/popupMessage.service";
import AuthService from "../services/auth.service";
import {Global} from "../Global";
import Scrollbar from "../components/Scrollbar";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import CircularProgress from "@mui/material/CircularProgress";
import roundUpdate from "@iconify/icons-ic/round-update";
import ClientsServise from "../services/clients.servise";
import CasesService from "../services/cases.service";
import layersOutline from "@iconify/icons-eva/layers-outline";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import Label from "../components/Label";
import {sentenceCase} from "change-case";
import Switch from "@mui/material/Switch";
import TasksService from "../services/tasks.service";
import LicenceUsersService from "../services/licenceUsers.service";
import TaskTypeService from "../services/TaskType.service";
import TaskStatusesService from "../services/taskStatuses.service";
import {format} from "date-fns";
import account from "../_mocks_/account";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
// ----------------------------------------------------------------------

export default function Tasks() {

    const today = new Date();
    const date = today.setDate(today.getDate());
    const defaultValue = new Date(date).toISOString().split('T')[0]
    const popupMessageService = new PopupMessageService();
    const authService = new AuthService();
    const clientsServise = new ClientsServise();
    const catchMessagee = Global.catchMessage;
    const casesService = new CasesService();
    const taskStatusesService = new TaskStatusesService();
    const licenceUsersService = new LicenceUsersService();
    const tasksService = new TasksService();
    const taskTypeService = new TaskTypeService();
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openModalForDetails, setOpenModalForDetails] = useState(false);

    const [isActiveForFilter, setIsActiveForFilter] = useState(-1);
    const [clientIdForFilter, setClientIdForFilter] = useState(-1);
    const [information, setInformation] = useState("");
    const [startDate, setStartDate] = useState(defaultValue);
    const [lastDate, setLastDate] = useState(defaultValue);
    const [endDate, setEndDate] = useState(defaultValue);
    const [tasks, setTasks] = useState([]);
    const [taskId, setTaskId] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [usersAdd, setUsersAdd] = useState(0);
    const [usersForFilter, setUsersForFilter] = useState(-1);
    const [allTaskTypes, setAllTaskTypes] = useState([]);
    const [taskTypesAdd, setTaskTypesAdd] = useState(0);
    const [taskTypesForFilter, setTaskTypesForFilter] = useState(-1);
    const [isActiveAdd, setIsActiveAdd] = useState(false);
    const [taskStatusesForFilter, setTaskStatusesForFilter] = useState(-1);
    const [allTaskStatuses, setAllTaskStatuses] = useState([]);
    const [taskStatusAdd, setTaskStatusAdd] = useState(0);
    const [time, setTime] = useState(true);
    const [isEndDate, setIsEndDate] = useState(false);
    const [isLastDate, setIsLastDate] = useState(false);

    const [allClients, setAllClients] = useState([]);
    const [allCases, setAllCases] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(0)
    const [selectedCases, setSelectedCases] = useState(0)
    const [message, setMessage] = useState("")
    const [openIfCaseDoesntExist, setOpenIfCaseDoesntExist] = useState(false);

    function filtering(tasks) {
        let filteredCaseTypes = tasks
        if (clientIdForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.Customer.CustomerId === clientIdForFilter)
        if (usersForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.User.Id === usersForFilter)
        if (taskTypesForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.TaskType.TaskTypeId === taskTypesForFilter)
        if (taskStatusesForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.TaskStatus.TaskStatusId === taskStatusesForFilter)
        if (isActiveForFilter > -1)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.IsActive == isActiveForFilter)
        return filteredCaseTypes
    }

    //Changing Activity of the current Case Status
    const changeActivity = (cId) => {
        tasksService.changeActivity2(cId).then(result => {
            getAllTasks()
            popupMessageService.AlertSuccessMessage(result.data.Message);
        }, error => {
            popupMessageService.AlertErrorMessage(error.response.data.Message)
        }).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    // List all clients
    function getAllClients() {
        clientsServise.getAll().then(result => {
                setAllClients(result.data.Data)
                setSelectedClientId(result.data.Data[0].CustomerId)
                getAllCases(result.data.Data[0].CustomerId)
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    }

    // List all Cases
    function getAllCases(selectedId) {
        casesService.getAllByCustomerId(selectedId).then(result => {
                let id = result.data.Data[0].CaseeId
                setSelectedCases(id)
                setAllCases(result.data.Data)
                setOpenIfCaseDoesntExist(false)
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            setOpenIfCaseDoesntExist(true)
            setMessage('Sorry, this client does not have any cases!')

        })
    }
    // Handle client change
    function handleClientChange(id) {
        getAllCases(id)
        setSelectedClientId(id)
    }

    // List all Users
    const getAllUsers = () => {
        licenceUsersService
            .getAll()
            .then(
                (response) => {
                    setAllUsers(response.data.Data);
                    const CaseTypesFromApi = response.data.Data;
                    const list = [];
                    CaseTypesFromApi.forEach((item) => {
                        list.push({
                            value: item.User.Id,
                            label: item.User.Title,
                            key: item.User.Title
                        });
                    });
                    setUsersAdd(list[0].value)
                    setAllUsers(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    };

    // List all Task Types
    const getAllTaskTypes = () => {
        taskTypeService
            .getAll()
            .then(
                (response) => {
                    setAllTaskTypes(response.data.Data);
                    const CaseTypesFromApi = response.data.Data;
                    const list = [];
                    CaseTypesFromApi.forEach((item) => {
                        list.push({
                            value: item.TaskTypeId,
                            label: item.TaskTypeName,
                            key: item.TaskTypeName
                        });
                    });
                    setTaskTypesAdd(list[0].value)
                    setAllTaskTypes(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    };

    // List all Task Statuses
    const getAllTaskStatuses = () => {
        taskStatusesService
            .getAll()
            .then(
                (response) => {
                    setAllTaskStatuses(response.data.Data);
                    const CaseTypesFromApi = response.data.Data;
                    const list = [];
                    CaseTypesFromApi.forEach((item) => {
                        list.push({
                            value: item.TaskStatusId,
                            label: item.TaskStatusName,
                            key: item.TaskStatusName
                        });
                    });
                    setTaskStatusAdd(list[0].value)
                    setAllTaskStatuses(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    };

    const createRandomKey = () => {
        return Math.random().toString(36).substr(2, 9);
    }

    const handleChangeStatus = (event) => {
        setIsActiveAdd(event.target.value);
    };

    const handleOpen = () => {
        setTaskId(0)
        setInformation("")
        setStartDate(defaultValue)
        setLastDate(defaultValue)
        setEndDate(defaultValue)
        setOpenModal(true)
    };
    const handleClose = () => {
        setOpenModal(false)
    };
    const getAllTasks = () => {
        tasksService.getAll().then(
            (result) => {
                if (result.data.Success) {
                    setTasks(result.data.Data)
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

    function deleteTasks(id) {
        tasksService.delete(id).then(result => {
                if (result.data.Success) {
                    popupMessageService.AlertSuccessMessage(result.data.Message);
                    getAllTasks()
                }
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    function modalForEdit(id) {
        tasksService.getById(id).then(result => {
            if (result.data.Success) {
                let edit = result.data.Data
                setTaskId(edit.TaskkId)
                setSelectedClientId(edit.Customer.CustomerId)
                setUsersAdd(edit.User.Id)
                setIsActiveAdd(edit.IsActive)
                setTaskStatusAdd(edit.TaskStatus.TaskStatusId)
                setInformation(edit.Info)
                setStartDate(edit.StartDate.format(defaultValue))
                setLastDate(edit.LastDate.format(defaultValue))
                setEndDate(edit.EndDate.format(defaultValue))
                setTaskTypesAdd(edit.TaskType.TaskTypeId)
            }
        })
        setOpenModal(true)
    }

    function getByIdTasks(id) {
        tasksService.getById(id).then(result => {
            if (result.data.Success) {
                let edit = result.data.Data
                setInformation(edit.Info)
                setStartDate(edit.StartDate)
                setLastDate(edit.LastDate)
                setEndDate(edit.EndDate)
            }
        })
        setOpenModalForDetails(true)
    }

    const handleClosModal = () => {
        setOpenModalForDetails(false)
    }

    function addNewRecord() {
        let obj = {
            customerId: selectedClientId,
            caseId: selectedCases,
            userId: usersAdd,
            info: information,
            startDate: startDate,
            lastDate: lastDate,
            endDate: endDate,
            isActive: isActiveAdd,
            taskTypeId: taskTypesAdd,
            taskStatusId: taskStatusAdd
        }
        let re
        if (taskId > 0) {
            obj.taskkId = taskId
            re = tasksService.update(obj)
        } else {
            re = tasksService.add(obj)
        }
        re.then((result) => {
                if (result.data.Success) {
                    getAllTasks()
                    setOpenModal(false)
                    popupMessageService.AlertSuccessMessage(result.data.Message)
                }
            },
            (error) => {
                setOpenModal(false)
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    }

    useEffect(() => {
        getAllClients()
        getAllTasks()
        getAllUsers()
        getAllTaskTypes()
        getAllTaskStatuses()
        setTime(false)
    }, []);

    return (
        <Page title="Tasks | MediLaw">
            {time === true ?
                <Stack sx={{color: 'grey.500', padding: 30}} spacing={2} direction="row"
                       justifyContent='center' alignSelf='center' left='50%'>
                    <CircularProgress color="inherit"/>
                </Stack>
                :
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                        <Typography variant="h4" gutterBottom>
                            Tasks
                        </Typography>
                        {authService.DoesHaveMandatoryClaim('TaskAdd') || authService.DoesHaveMandatoryClaim('LicenceOwner') ? (
                            <>
                                <Button onClick={handleOpen} variant="contained" startIcon={<Icon icon={plusFill}/>}>
                                    New Record
                                </Button>
                                <Modal sx={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}
                                       hideBackdrop={true}
                                       disableEscapeKeyDown={true}
                                       open={openModal}
                                       aria-labelledby="modal-modal-title"
                                       aria-describedby="modal-modal-description"
                                >
                                    <Box sx={{
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
                                    }}>
                                        <Stack mb={5} flexDirection="row" justifyContent='space-between'>
                                            {taskId > 0 ?
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Edit record!
                                                </Typography>
                                                :
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Add new record!
                                                </Typography>
                                            }
                                            <IconButton sx={{bottom: 4}}>
                                                <CloseIcon onClick={handleClose}/>
                                            </IconButton>
                                        </Stack>
                                        <Stack spacing={2}>
                                            <Stack mb={0} alignItems="center" justifyContent="space-around">
                                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                                    {allClients.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Clients"
                                                                    value={selectedClientId}
                                                                    onChange={(e) => handleClientChange(e.target.value)}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <PersonOutlineOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {allClients.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.CustomerId}
                                                                        >
                                                                            {item.CustomerName}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                    {allCases.length > 0 ? (
                                                        <Stack mb={4} justifyContent="space-around">
                                                            <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                                <FormControl fullWidth size="small">
                                                                    <TextField
                                                                        select
                                                                        size='small'
                                                                        label="Cases"
                                                                        value={selectedCases}
                                                                        onChange={(e) => setSelectedCases(e.target.value)}
                                                                        key={Math.random().toString(36).substr(2, 9)}
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <BusinessCenterOutlinedIcon/>
                                                                                </InputAdornment>
                                                                            )
                                                                        }}
                                                                    >
                                                                        {allCases.map((item) => (
                                                                            <MenuItem
                                                                                key={Math.random().toString(36).substr(2, 9)}
                                                                                value={item.CaseeId}
                                                                            >
                                                                                {item.CaseNo}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                </FormControl>
                                                            </Box>
                                                        </Stack>
                                                    ) : null}
                                                </Stack>
                                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                                    {allUsers.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Users"
                                                                    value={usersAdd}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    onChange={(event) => setUsersAdd(event.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <PeopleAltOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {allUsers.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                    {allTaskTypes.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Task Types"
                                                                    value={taskTypesAdd}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    onChange={(event) => setTaskTypesAdd(event.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <AssignmentOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {allTaskTypes.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                </Stack>
                                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                                    {allTaskStatuses.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Task Status"
                                                                    value={taskStatusAdd}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    onChange={(event) => setTaskStatusAdd(event.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <AssignmentTurnedInOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {allTaskStatuses.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                    <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                        <FormControl fullWidth size="small">
                                                            <TextField
                                                                select
                                                                size='small'
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={isActiveAdd}
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
                                                                <MenuItem key={createRandomKey} value>
                                                                    Active
                                                                </MenuItem>
                                                                <MenuItem key={createRandomKey} value={false}>
                                                                    Passive
                                                                </MenuItem>
                                                            </TextField>
                                                        </FormControl>
                                                    </Box>
                                                </Stack>
                                                <Stack mb={3} justifyContent="space-around">
                                                    <Box sx={{minWidth: 400}}>
                                                        <TextField
                                                            type='text'
                                                            size="small"
                                                            fullWidth
                                                            multiline
                                                            label="Information"
                                                            value={information}
                                                            onChange={(event) => setInformation(event.target.value)}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <DnsOutlinedIcon/>
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    </Box>
                                                </Stack>
                                                <Stack mb={3} justifyContent="space-around">
                                                    <Box sx={{minWidth: 400}}>
                                                        <FormControl fullWidth size="small">
                                                            <TextField
                                                                id="date"
                                                                label="Start Date"
                                                                type="date"
                                                                size="small"
                                                                value={startDate}
                                                                onChange={(e) => setStartDate(e.target.value)}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <TodayOutlinedIcon/>
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                </Stack>
                                                <Stack pl={3} pr={3} mb={0} direction={{xs: 'column', sm: 'row'}} spacing={3}>
                                                    <Typography variant="body2" gutterBottom mb={4}>
                                                        Do you know the end date?
                                                    </Typography>
                                                    <Checkbox
                                                        sx={{ mr: 2, width: 75 , height: 50, mt: 0.6}}
                                                        checked={isEndDate}
                                                        onChange={(e) => setIsEndDate(e.target.checked)}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />
                                                    <Typography variant="body2" gutterBottom mb={4}>
                                                        Do you know the last date?
                                                    </Typography>
                                                    <Checkbox
                                                        sx={{ mr: 2, width: 75 , height: 50, mt: 0.6}}
                                                        checked={isLastDate}
                                                        onChange={(e) => setIsLastDate(e.target.checked)}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />
                                                </Stack>
                                                {isLastDate ?
                                                    <>
                                                <Stack mb={3} justifyContent="space-around">
                                                    <Box sx={{minWidth: 400}}>
                                                        <FormControl fullWidth size="small">
                                                            <TextField
                                                                id="date"
                                                                label="Last Date"
                                                                type="date"
                                                                size="small"
                                                                value={lastDate}
                                                                onChange={(e) => setLastDate(e.target.value)}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <EventAvailableOutlinedIcon/>
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                </Stack>
                                                </>
                                                    :null}
                                                {isEndDate ?
                                                    <>
                                                <Stack mb={4} justifyContent="space-around">
                                                    <Box sx={{minWidth: 400}}>
                                                        <FormControl fullWidth size="small">
                                                            <TextField
                                                                id="date"
                                                                label="End Date"
                                                                type="date"
                                                                size="small"
                                                                value={endDate}
                                                                onChange={(e) => setEndDate(e.target.value)}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <InsertInvitationOutlinedIcon/>
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                </Stack>
                                                    </>
                                                    :null}
                                            </Stack>
                                            {openIfCaseDoesntExist === false ?
                                                <>
                                                    {taskId > 0 ?
                                                        <Button sx={{bottom: 7}} size="large" type="submit"
                                                                variant="contained"
                                                                onClick={() => addNewRecord()}>
                                                            Edit!
                                                        </Button>
                                                        :
                                                        <Button sx={{bottom: 7}} size="large" type="submit"
                                                                variant="contained"
                                                                onClick={() => addNewRecord()}>
                                                            Add!
                                                        </Button>
                                                    }
                                                </> :
                                                <Typography variant="body1" gutterBottom mb={3} color='red'>
                                                    {message}
                                                </Typography>}
                                        </Stack>
                                    </Box>
                                </Modal>
                            </>
                        ) : null}
                    </Stack>
                    <Stack mb={5} flexDirection="row" alignItems="center" justifyContent="space-around">
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Clients
                            </Typography>
                            {allClients.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Clients"
                                            value={clientIdForFilter}
                                            onChange={(e) => setClientIdForFilter(e.target.value)}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlineOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {allClients.map((item) => (
                                                <MenuItem
                                                    key={Math.random().toString(36).substr(2, 9)}
                                                    value={item.CustomerId}
                                                >
                                                    {item.CustomerName}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Users
                            </Typography>
                            {allUsers.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Users"
                                            value={usersForFilter}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            onChange={(e) => setUsersForFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PeopleAltOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {allUsers.map((item) => (
                                                <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                          value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Status
                            </Typography>
                            <Box sx={{minWidth: 300}}>
                                <FormControl fullWidth size="small">
                                    <TextField
                                        select
                                        size='small'
                                        value={isActiveForFilter}
                                        key={Math.random().toString(36).substr(2, 9)}
                                        label="Status"
                                        onChange={(e) => setIsActiveForFilter(e.target.value)}
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
                    <Stack mb={5} marginTop={-7} flexDirection="row" alignItems="center" justifyContent="flex-start">
                        <Stack mb={5} ml={4}>
                            <Typography variant="body1" gutterBottom mb={3}>
                                Task Types
                            </Typography>
                            {allTaskTypes.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Task Types"
                                            value={taskTypesForFilter}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            onChange={(event) => setTaskTypesForFilter(event.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AssignmentOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {allTaskTypes.map((item) => (
                                                <MenuItem
                                                    key={Math.random().toString(36).substr(2, 9)}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                        <Stack mb={5} ml={6.5}>
                            <Typography variant="body1" gutterBottom mb={3}>
                                Task Statuses
                            </Typography>
                            {allTaskStatuses.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Task Statuses"
                                            value={taskStatusesForFilter}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            onChange={(event) => setTaskStatusesForFilter(event.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AssignmentTurnedInOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {allTaskStatuses.map((item) => (
                                                <MenuItem
                                                    key={Math.random().toString(36).substr(2, 9)}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                    </Stack>
                    <Card sx={{marginTop: -3}}>
                        <Scrollbar>
                            {isLoading === true ?
                                <Stack sx={{color: 'grey.500', padding: 10}} spacing={2} direction="row"
                                       justifyContent='center'>
                                    <CircularProgress color="inherit"/>
                                </Stack>
                                :
                                <>
                                    {tasks.length > 0 ? (
                                        <TableContainer component={Paper}>
                                            <Table sx={{minWidth: 650}} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{paddingLeft: 7}}>Client</TableCell>
                                                        <TableCell align="left">User</TableCell>
                                                        <TableCell align="left">Task Type</TableCell>
                                                        <TableCell align="left">Task Status</TableCell>
                                                        <TableCell align="left">Status</TableCell>
                                                        <TableCell align="left">Change Activity</TableCell>
                                                        <TableCell align="left">Edit</TableCell>
                                                        <TableCell align="left">Details</TableCell>
                                                        <TableCell align="left">Delete</TableCell>
                                                        <TableCell align="right"/>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <>
                                                        {filtering(tasks).map((row) => (
                                                            <TableRow
                                                                key={row.TaskkId}
                                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                            >
                                                                <TableCell component="th" scope="row"
                                                                           sx={{paddingLeft: 7}}>
                                                                    {row.Customer.CustomerName}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.User.Title}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.TaskType.TaskTypeName}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.TaskStatus.TaskStatusName}
                                                                </TableCell>
                                                                {row.IsActive ? (
                                                                    <TableCell component="th" scope="row">
                                                                        <Label variant="ghost" color="success">
                                                                            {sentenceCase('Active')}
                                                                        </Label>
                                                                    </TableCell>
                                                                ) : (
                                                                    <TableCell component="th" scope="row">
                                                                        <Label variant="ghost" color="error">
                                                                            {sentenceCase('Passive')}
                                                                        </Label>
                                                                    </TableCell>
                                                                )}
                                                                <TableCell>
                                                                    <Switch
                                                                        sx={{left: '15%'}}
                                                                        checked={row.IsActive}
                                                                        onChange={() => changeActivity(row.TaskkId)}
                                                                        inputProps={{'aria-label': 'controlled'}}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        onClick={() => modalForEdit(row.TaskkId)}
                                                                        variant="contained"
                                                                        sx={{backgroundColor: '#b1b9be'}}
                                                                        startIcon={<Icon icon={roundUpdate}/>}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    <Button
                                                                        onClick={() => getByIdTasks(row.TaskkId)}
                                                                        variant="contained"
                                                                        sx={{backgroundColor: '#b1b9be'}}
                                                                        startIcon={<Icon icon={layersOutline}/>}
                                                                    >
                                                                        Details
                                                                    </Button>
                                                                </TableCell>
                                                                {authService.DoesHaveMandatoryClaim('TaskDelete') || authService.DoesHaveMandatoryClaim('LicenceOwner') ? (
                                                                    <>
                                                                        <TableCell align="left">
                                                                            <Button
                                                                                onClick={() => deleteTasks(row.TaskkId)}
                                                                                variant="contained"
                                                                                sx={{backgroundColor: '#c9505c'}}
                                                                                startIcon={<Icon
                                                                                    icon={trash2Outline}/>}>Delete</Button>
                                                                        </TableCell>
                                                                    </>
                                                                ) : null}
                                                                <Modal sx={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}
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
                                                                            minWidth: 500,
                                                                            maxWidth: 500,
                                                                            backgroundColor: 'background.paper',
                                                                            border: '2px solid #fff',
                                                                            boxShadow: 24,
                                                                            p: 4,
                                                                            borderRadius: 2
                                                                        }}>
                                                                        <Stack mb={4} flexDirection="row"
                                                                               justifyContent='space-between'>
                                                                            <Typography id="modal-modal-title"
                                                                                        variant="h6"
                                                                                        component="h2">Details!</Typography>
                                                                            <IconButton sx={{bottom: 4}}>
                                                                                <CloseIcon onClick={handleClosModal}/>
                                                                            </IconButton>
                                                                        </Stack>
                                                                        <Stack mb={2} justifyContent="space-around">
                                                                            <Box sx={{minWidth: 300}}>
                                                                                <TableContainer component={Paper}>
                                                                                    <Table aria-label="simple table">
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">Start
                                                                                                Date</TableCell>
                                                                                            <TableCell>{format(new Date(startDate), 'dd/MM/yyyy')}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">Last
                                                                                                Date</TableCell>
                                                                                            <TableCell>{format(new Date(lastDate), 'dd/MM/yyyy')}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">End
                                                                                                Date</TableCell>
                                                                                            <TableCell>{format(new Date(endDate), 'dd/MM/yyyy')}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell
                                                                                                variant="head">Info</TableCell>
                                                                                            <TableCell>{information}</TableCell>
                                                                                        </TableRow>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Box>
                                                                        </Stack>
                                                                    </Box>
                                                                </Modal>
                                                            </TableRow>
                                                        ))}
                                                    </>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <TableCell sx={{width: '40%'}}>
                                            <img src="/static/illustrations/no.png" alt="login"/>
                                            <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No
                                                Data Found</Typography>
                                        </TableCell>
                                    )}
                                </>
                            }
                        </Scrollbar>
                    </Card>
                </Container>
            }
        </Page>
    );
}
