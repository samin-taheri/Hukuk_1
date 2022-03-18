import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField, InputAdornment, Button } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import authService from '../../../services/auth.service';
import PopupMessageService from '../../../services/popupMessage.service';
import {Global} from "../../../Global";

// ----------------------------------------------------------------------

export default function ApprovingUserForm() {
  const navigate = useNavigate();
    const catchMessagee = Global.catchMessage;
  const LoginSchema = Yup.object().shape({
    phoneConfirm: Yup.string().required('Cell phone is required'),
    SMSCode: Yup.string().required('SMS code is required')
  });

  const formik = useFormik({
    initialValues: {
      phoneConfirm: '',
      SMSCode: ''
    },
    validationSchema: LoginSchema,

    onSubmit: () => {
      const popupMessageService = new PopupMessageService();
      authService
        .approvingUser(formik.values.phoneConfirm, formik.values.SMSCode)
        .then((response) => {
          console.log(response.data.Message);
          navigate('/licencesList');
          popupMessageService.AlertErrorMessage(response.data.Message);
        })
        .catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        });
    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            type="phone"
            label="Cell phone"
            {...getFieldProps('phoneConfirm')}
            error={Boolean(touched.phoneConfirm && errors.phoneConfirm)}
            helperText={touched.phoneConfirm && errors.phoneConfirm}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlinedIcon />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            type="number"
            label="SMS Code"
            {...getFieldProps('SMSCode')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TextsmsOutlinedIcon />
                </InputAdornment>
              )
            }}
            error={Boolean(touched.SMSCode && errors.SMSCode)}
            helperText={touched.SMSCode && errors.SMSCode}
          />
          <Button fullWidth size="large" type="submit" variant="contained">
            Confirm!
          </Button>
          {/*
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openLicense}
            onClose={handleCloseLicense}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={openLicense}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 900,
                  height: 500,
                  bgcolor: 'background.paper',
                  border: '2px solid #fff',
                  boxShadow: 24,
                  borderRadius: 2,
                  p: 4
                }}
              >
                <Typography id="transition-modal-title" variant="h6" component="h2" pb={4} pt={2}>
                  Choose a licence to continue!
                </Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Profile Name</TableCell>
                        <TableCell align="right">Last Entrance</TableCell>
                        <TableCell align="right" />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {licence.length > 0 ? (
                        <>
                          {licence.map((row) => (
                            <TableRow
                              key={row.LicenceUserId}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                {row.Licence.Profil}
                              </TableCell>
                              <TableCell align="right">
                                <Moment>{row.EndDate}</Moment>
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  sx={{ height: 30 }}
                                  to="/"
                                  size="medium"
                                  variant="contained"
                                  component={RouterLink}
                                  startIcon={<Icon icon={outlineArrowForward} />}
                                  onClick={handleClick('Message A')}
                                >
                                  Login
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <Typography
                          id="transition-modal-title"
                          variant="h6"
                          component="h2"
                          pb={4}
                          pt={2}
                        >
                          Please enter your info first.
                        </Typography>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Fade>
          </Modal>
          */}
        </Stack>
      </Form>
    </FormikProvider>
  );
}
