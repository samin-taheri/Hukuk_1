import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeOutline from '@iconify/icons-eva/eye-outline';
import eyeOffOutline from '@iconify/icons-eva/eye-off-outline';
import { useNavigate } from 'react-router-dom';
import NumberFormat from 'react-number-format';

// material
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';

import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Modal,
  Box,
  Typography,
  Button
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import CityService from '../../../services/city.service';
import authService from '../../../services/auth.service';
import { BlogPosts } from '../../_dashboard/blog';
import CountryService from '../../../services/country.service';
import PopupMessageService from '../../../services/popupMessage.service';
import {app, Global} from '../../../Global';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [open, setOpen] = useState(false);
  const [openIfUnvalidated, setOpenIfUnvalidated] = useState(false);
  const [unValidateMessage, setUnValidateMessage] = useState('');

  const [valueR, setValueR] = useState('');
  const [cityValue, setCityValue] = useState(0);
  const [isCountrySelected, setIsCountrySelected] = useState(false);
    const catchMessagee = Global.catchMessage;
    const popupMessageService = new PopupMessageService();
  const handleClose = () => setOpen(false);

  const handleCloseValid = () => setOpenIfUnvalidated(false);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const handleChange = (event) => {
    setValueR(event.target.value);
    setIsCountrySelected(true);
    const cityService = new CityService();
    cityService
      .getAll(event.target.value)
      .then((result) => {
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
      .catch((errors) => {
          popupMessageService.AlertErrorMessage(catchMessagee)
      });
  };

  const handleCitiesChange = (event) => {
    setCityValue(event.target.value);
  };
  useEffect(() => {
    const countryService = new CountryService();
    countryService
      .getAll()
      .then((result) => {
        setCountries(result.data.Data);

        const countriesFromApi = result.data.Data;
        const list = [];
        // eslint-disable-next-line no-restricted-syntax,guard-for-in
        countriesFromApi.forEach((item) => {
          list.push({
            value: item.CountryId,
            label: item.CountryName,
            key: item.CountryName
          });
        });
        setCountries(list);
      })
      .catch((errors) => {
          popupMessageService.AlertErrorMessage(catchMessagee)
      });
  }, []);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    title: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Title is required'),
    phone: Yup.string().required('Cell phone is required'),
    password: Yup.string().required('Password is required'),
    passwordAgain: Yup.string().required('Password confirmation is required')
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      title: '',
      phone: '',
      password: '',
      passwordAgain: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      const popupMessageService = new PopupMessageService();
      if (formik.values.password !== formik.values.passwordAgain) {
        setOpenIfUnvalidated(true);
        setUnValidateMessage('Password and Confirm password have to be same!');
      }
      if (app.item !== null) {
        popupMessageService.AlertErrorMessage('This account already exists!');
        navigate('/login');
      } else {
        authService
          .register(
            formik.values.phone,
            formik.values.password,
            formik.values.firstName,
            formik.values.lastName,
            formik.values.title,
            cityValue
          )
          .then(
            (response) => {
              if (response.data.Success) {
                // if response is 200 (Ok)
                console.log(response.data);
                popupMessageService.AlertSuccessMessage('Registration was successful!');
                navigate('/login');
              } else {
                console.log(response.data.Message);
                popupMessageService.AlertErrorMessage(response.data.Message);
              }
            },
            (error) => {
              if (error.response.data.SituationCode === 3) {
                navigate('/approveUser');
              } else {
                console.log(error.response.data);
                popupMessageService.AlertErrorMessage(error.response.data.Message);
              }
            }
          )
          .catch(() => {
              popupMessageService.AlertErrorMessage(catchMessagee)
          });
      }
    }
  });

  const formikConfirm = useFormik({
    initialValues: {
      phoneConfirm: '',
      SMSCode: ''
    },
    onSubmit: () => {
      authService
        .approvingUser(formik.values.phoneConfirm, formik.values.SMSCode)
        .then((response) => {
          console.log(response.data.Message);
          // navigate('/dashboard', { replace: true });
          // { Licences: response.data.Data, User: formik.values }
        })
        .catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const { handleSubmitConfirm, getFieldPropsConfirm } = formikConfirm;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First Name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Last Name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                )
              }}
            />
          </Stack>

          <TextField
            fullWidth
            label="Title"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SubtitlesOutlinedIcon />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            type="number"
            label="Cell phone"
            placeholder="(xxx) xxx-xxxx"
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlinedIcon />
                </InputAdornment>
              )
            }}
          />
          {/* <BlogPosts options={countries} onSort={handleChange} /> */}
          {countries.length > 0 ? (
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  value={valueR}
                  key={Math.random().toString(36).substr(2, 9)}
                  label="Select Country"
                  onChange={handleChange}
                >
                  {countries.map((item) => (
                    <MenuItem key={Math.random().toString(36).substr(2, 9)} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : null}

          {cities.length > 0 && isCountrySelected ? (
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  value={cityValue}
                  key={Math.random().toString(36).substr(2, 9)}
                  label="Select City"
                  onChange={handleCitiesChange}
                >
                  {cities.map((item) => (
                    <MenuItem key={Math.random().toString(36).substr(2, 9)} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : null}

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeOutline : eyeOffOutline} />
                  </IconButton>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlinedIcon />
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            {...getFieldProps('passwordAgain')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPasswordAgain((prev) => !prev)}>
                    <Icon icon={showPasswordAgain ? eyeOutline : eyeOffOutline} />
                  </IconButton>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlinedIcon />
                </InputAdornment>
              )
            }}
            error={Boolean(touched.passwordAgain && errors.passwordAgain)}
            helperText={touched.passwordAgain && errors.passwordAgain}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Sign Up!
          </LoadingButton>

          <Modal
            open={openIfUnvalidated}
            onClose={handleCloseValid}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #fff',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
              }}
            >
              <Stack spacing={2.5}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {unValidateMessage}
                </Typography>
              </Stack>
            </Box>
          </Modal>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #fff',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
              }}
            >
              <Stack spacing={2.5}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {message}
                </Typography>
                <TextField
                  fullWidth
                  type="phone"
                  label="Cell phone"
                  {...getFieldProps('phoneConfirm')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
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
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Button fullWidth size="large" type="submit" variant="contained" loading={false}>
                  Confirm!
                </Button>
              </Stack>
            </Box>
          </Modal>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
