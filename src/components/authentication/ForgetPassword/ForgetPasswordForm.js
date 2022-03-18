import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Stack, TextField, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import authService from '../../../services/auth.service';
import PopupMessageService from '../../../services/popupMessage.service';
import {Global} from "../../../Global";
// ----------------------------------------------------------------------

export default function ForgetPasswordForm() {
  const navigate = useNavigate();
  const catchMessagee = Global.catchMessage;
  const LoginSchema = Yup.object().shape({
    phone: Yup.string().required('phone is required')
  });

  const formik = useFormik({
    initialValues: {
      phone: ''
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      const popupMessageService = new PopupMessageService();
      authService
        .ForgetPassword(formik.values.phone)
        .then((response) => {
          console.log(response.data.Success);
          popupMessageService.AlertSuccessMessage(response.data.Message);
          navigate('/changePassword');
        })
        .catch(() => {
          popupMessageService.AlertErrorMessage(catchMessagee)
        });
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="on" noValidate onSubmit={handleSubmit}>
        <Stack>
          <TextField
            fullWidth
            type="phone"
            label="Cell Phone"
            {...getFieldProps('phone')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon />
                </InputAdornment>
              )
            }}
            sx={{ marginBottom: 3 }}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
