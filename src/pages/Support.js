// material
import {styled} from '@mui/material/styles';
import {
    Button,
    Card,
    Container, InputAdornment, Stack, TextField, Typography,

} from '@mui/material';
// components
import Page from '../components/Page';
import React from "react";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import {Icon} from "@iconify/react";
import navigation2Outline from "@iconify/icons-eva/navigation-2-outline";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

// ----------------------------------------------------------------------

export default function Support() {

    return (
        <RootStyle title="Support | MediLaw">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Typography variant="h4" gutterBottom>
                        Support
                    </Typography>
                </Stack>
                <Stack flexDirection='row' alignItems='space-between' sx={{marginBottom: '0%' }}>
                    <Card justifyContent="center" sx={{padding: 6, minWidth:450, marginLeft: 8}}>
                            <Typography variant="h7">Messages</Typography>
                    </Card>
                    <Card justifyContent="space-around" sx={{padding: 7, minWidth: 450, marginLeft: 2}}>
                        <Stack mb={5} mt={0} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                            <TextField
                                fullWidth
                                multiline
                                rows={8}
                                label="Message"

                            />
                        </Stack>
                        <Button  fullWidth
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
