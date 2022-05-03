// material
import {styled} from '@mui/material/styles';
import {
    Box,
    Button,
    Card,
    Container,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,

} from '@mui/material';
// components
import Page from '../components/Page';
import React, {useEffect, useState, useRef} from "react";
import {Icon} from "@iconify/react";
import navigation2Outline from "@iconify/icons-eva/navigation-2-outline";
import PopupMessageService from "../services/popupMessage.service";
import {Global} from "../Global";
import ChatSupportService from "../services/chatSupport.service";
import CircularProgress from "@mui/material/CircularProgress";
import CardContent from "@mui/material/CardContent";
import baselineDoneAll from '@iconify/icons-ic/baseline-done-all';
import {format} from "date-fns";
import ReplayIcon from '@mui/icons-material/Replay';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    }
}));

// ----------------------------------------------------------------------

export default function Support() {

    const popupMessageService = new PopupMessageService();
    const chatSupportService = new ChatSupportService();
    const catchMessagee = Global.catchMessage;
    const [message, setMessage] = useState("");
    const [supportMessages, setSupportMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();

    const getAllSupportMessages = () => {
        chatSupportService.getAllMessegaAsUser().then(
            (result) => {
                if (result.data.Success) {
                    setSupportMessages(result.data.Data)
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

    function addNewRecord() {
        let obj = {
            message: message
        }
        let re = chatSupportService.addMessegaAsUser(obj)
        re.then((result) => {
                if (result.data.Success) {
                    getAllSupportMessages()
                    setMessage("")
                    popupMessageService.AlertSuccessMessage(result.data.Message)
                }
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    }

    const makeTheMessageRead = () => {
        chatSupportService.makeItReadAsUser().then(
            (result) => {
                if (result.data.Success) {
                    getAllSupportMessages()
                }
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleButtonClick = () => {
        getAllSupportMessages()
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = window.setTimeout(() => {
                setSuccess(true);
                setLoading(false);
            }, 2000);
        }
    };

    useEffect(() => {
        getAllSupportMessages()
        makeTheMessageRead()
    }, []);

    return (
        <RootStyle title="Support | MediLaw">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Typography variant="h4" gutterBottom>
                        Support
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Fab
                                aria-label="save"
                                color="primary"
                                sx={buttonSx}
                                onClick={handleButtonClick}
                            >
                                {success ? <CheckIcon /> : <ReplayIcon />}
                            </Fab>
                            {loading && (
                                <CircularProgress
                                    size={68}
                                    sx={{
                                        color: green[500],
                                        position: 'absolute',
                                        top: -6,
                                        left: -6,
                                        zIndex: 1,
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Stack>
                <Stack flexDirection='column' alignItems='space-between'>
                    <Card justifyContent="center" sx={{
                        padding: 6,
                        minWidth: 450,
                        maxWidth: 950,
                        marginLeft: 7,
                        maxHeight: 395,
                        overflow: "hidden",
                        overflowY: "scroll",
                    }}>
                        <>
                            {isLoading === true ?
                                <Stack sx={{color: 'grey.500', paddingLeft: 0, paddingTop: 3}} spacing={2}
                                       direction="row"
                                       justifyContent='center' alignSelf='center' left='50%'>
                                    <CircularProgress color="inherit"/>
                                </Stack>
                                :
                                <>
                                    <Typography gutterBottom variant="h6" component="div" pb={2}>
                                        Sent Messages
                                    </Typography>
                                    {supportMessages.length > 0 ? (
                                        <>
                                            {supportMessages.map((row) => (
                                                <>
                                                {row.IsAnswer == true ?
                                                        <Card sx={{
                                                            maxWidth: 300,
                                                            minWidth: 200,
                                                            marginTop: 2.5,
                                                            marginRight: 0,
                                                            backgroundColor: '#fff',
                                                            maxHeight: 75,
                                                        }}>
                                                            <CardContent>
                                                                <Stack flexDirection='row'>
                                                                    <Typography gutterBottom fontSize={12} component="div" key={row.ChatSupportId}>
                                                                        {row.Message}
                                                                    </Typography>
                                                                </Stack>
                                                                <Typography gutterBottom fontSize={10} component="div">
                                                                    {format(new Date(row.Date), 'dd/MM/yyyy kk:mm')}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                        :
                                                        <Card sx={{
                                                            maxWidth: 350,
                                                            minWidth: 200,
                                                            marginTop: 2.5,
                                                            marginRight: 0,
                                                            backgroundColor: '#ebf2ff',
                                                            marginLeft: 70,
                                                            maxHeight: 75,
                                                        }}>
                                                            <CardContent>
                                                                <Stack flexDirection='row'>
                                                                    <Typography gutterBottom fontSize={12}
                                                                                component="div" key={row.ChatSupportId}>
                                                                        {row.Message}
                                                                    </Typography>
                                                                    {row.DoesItRead == true ?
                                                                    <Stack position='absolute' right='0' mr={3}
                                                                           mt={3}>
                                                                        <Icon icon={baselineDoneAll} width={20}
                                                                              height={20} color={'#4fb6ec'}/>
                                                                    </Stack>
                                                                        :null}
                                                                </Stack>
                                                                <Typography gutterBottom fontSize={10} component="div">
                                                                    {format(new Date(row.Date), 'dd/MM/yyyy kk:mm')}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                }
                                                </>
                                            ))}
                                        </>
                                    ) : (
                                        <card sx={{width: '40%'}}>
                                            <img src="/static/illustrations/no.png" alt="login"/>
                                            <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No
                                                Data
                                                Found</Typography>
                                        </card>
                                    )}
                                </>
                            }
                        </>
                    </Card>
                    <Card justifyContent="space-around" sx={{padding: 7, minWidth: 450, maxWidth: 950, marginLeft: 7, marginTop: 3}}>
                        <Typography gutterBottom variant="h6" component="div" pb={2}>
                            Send a Message
                        </Typography>
                        <Stack mb={5} mt={2} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                label="Message"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}

                            />
                        </Stack>
                        <Button
                            onClick={() => addNewRecord()}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            startIcon={<Icon icon={navigation2Outline}/>}>
                            Send
                        </Button>
                    </Card>
                </Stack>
            </Container>
        </RootStyle>
    );
}
