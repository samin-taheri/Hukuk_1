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
import React, {useEffect, useState} from "react";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import {Icon} from "@iconify/react";
import navigation2Outline from "@iconify/icons-eva/navigation-2-outline";
import PopupMessageService from "../services/popupMessage.service";
import {Global} from "../Global";
import ChatSupportService from "../services/chatSupport.service";
import CircularProgress from "@mui/material/CircularProgress";
import CardContent from "@mui/material/CardContent";
import baselineDoneAll from '@iconify/icons-ic/baseline-done-all';
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
                </Stack>
                <Stack flexDirection='row' alignItems='space-between' sx={{marginBottom: '0%'}}>
                    <Card justifyContent="center" sx={{
                        padding: 6,
                        minWidth: 450,
                        marginLeft: 8,
                        maxHeight: 485,
                        overflow: "hidden",
                        overflowY: "scroll"
                    }}>
                        <>
                            {isLoading === true ?
                                <Stack sx={{color: 'grey.500', paddingLeft: 5, paddingTop: 25}} spacing={2}
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
                                                <Card sx={{
                                                    maxWidth: 350,
                                                    minWidth: 200,
                                                    marginTop: 2.5,
                                                    marginRight: 0,
                                                    backgroundColor: '#ebf2ff'
                                                }}>
                                                    <CardContent>
                                                        <Stack flexDirection='row'>
                                                            <Typography gutterBottom fontSize={12} component="div" key={row.ChatSupportId}>
                                                                {row.Message}
                                                            </Typography>
                                                            <Stack position='absolute' right='0' mr={3} mt={0.2}>
                                                                    <Icon icon={baselineDoneAll} width={20} height={20} color={'#4fb6ec'}/>
                                                            </Stack>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
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
                    <Card justifyContent="space-around" sx={{padding: 7, minWidth: 450, marginLeft: 2, maxWidth: 450}}>
                        <Typography gutterBottom variant="h6" component="div" pb={2}>
                            Send a Message
                        </Typography>
                        <Stack mb={5} mt={2} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                            <TextField
                                fullWidth
                                multiline
                                rows={8}
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
