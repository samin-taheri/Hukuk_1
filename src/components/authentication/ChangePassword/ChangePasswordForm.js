import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField, InputAdornment, Button } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import authService from '../../../services/auth.service';
import PopupMessageService from '../../../services/popupMessage.service';

// ----------------------------------------------------------------------

export default function ChangePasswordForm() {
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    cellPhone: Yup.string().required('Cell phone is required'),
    smsCode: Yup.string().required('SMS code is required'),
    newPassword: Yup.string().required('New password is required')
  });

  const formik = useFormik({
    initialValues: {
      cellPhone: '',
      smsCode: '',
      newPassword: ''
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      const popupMessageService = new PopupMessageService();
      authService
        .UpdateUserPassword(
          formik.values.cellPhone,
          formik.values.smsCode,
          formik.values.newPassword
        )
        .then((response) => {
          popupMessageService.AlertSuccessMessage(response.data.Message);
          console.log(response.data.Message);
          navigate('/dashboard');
        })
        .catch((errorResponse) => {
          popupMessageService.AlertErrorMessage(errorResponse.data.Message);
          console.log('errorResponse');
          console.log(errorResponse);
        });
    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="on" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            type="phone"
            label="Cell phone"
            {...getFieldProps('cellPhone')}
            error={Boolean(touched.cellPhone && errors.cellPhone)}
            helperText={touched.cellPhone && errors.cellPhone}
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
            {...getFieldProps('smsCode')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TextsmsOutlinedIcon />
                </InputAdornment>
              )
            }}
            error={Boolean(touched.smsCode && errors.smsCode)}
            helperText={touched.smsCode && errors.smsCode}
          />
          <TextField
            fullWidth
            label="New Password"
            {...getFieldProps('newPassword')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TextsmsOutlinedIcon />
                </InputAdornment>
              )
            }}
            error={Boolean(touched.newPassword && errors.newPassword)}
            helperText={touched.newPassword && errors.newPassword}
          />
          <Button fullWidth size="large" type="submit" variant="contained">
            Update Password!
          </Button>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
