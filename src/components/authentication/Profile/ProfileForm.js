import {useEffect, useRef, useState} from 'react';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { useNavigate } from 'react-router-dom';

// material
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {Stack, TextField, IconButton, InputAdornment, Avatar, Box} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import account from "../../../_mocks_/account";
import PopupMessageService from "../../../services/popupMessage.service";
import ProfileService from "../../../services/profile.service";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import {Global} from "../../../Global";
import CityService from "../../../services/city.service";
import CountryService from "../../../services/country.service";

// ----------------------------------------------------------------------

export default function ProfileForm() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [title, setTitle] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [profileImageFile, setProfileImageFile] = useState('');

    const [countryValue, setCountryValue] = useState(0);
    const [cityValue, setCityValue] = useState(0);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [countryId, setCountryId] = useState(0);

    const profileService = new ProfileService();
    const popupMessageService = new PopupMessageService();
    const cityService = new CityService();
    const countryService = new CountryService();
    const catchMessagee = Global.catchMessage;

    function userInfo() {
        profileService.getUserInfo().then(result => {
            if (result.data.Success) {
                let info = result.data.Data
                setFirstName(info.FirstName)
                setLastName(info.LastName)
                setCellPhone(info.CellPhone)
                setTitle(info.Title)
                setCountryValue(info.City.Country.CountryId)
                setCityValue(info.City.CityId)
            }
        })
    }

    const updateUserInfo = () => {
        let obj = {
            firstName: firstName,
            lastName: lastName,
            title: title,
            cityId: cityValue,
            countryId: countryValue,
            profileImage: profileImage,
            profileImageFile: profileImageFile,
        }
        let re = profileService.updateUserProfile(obj)
        re.then(
            (result) => {
                if (result.data.Success) {
                    userInfo()
                    popupMessageService.AlertSuccessMessage(result.data.Message)
                }
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message)
            }
        ).catch(()=> {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    const handleChange = (event) => {
        setCountryValue(event.target.value);
    };

    const handleCitiesChange = (event) => {
        setCityValue(event.target.value);
    };
    useEffect(() => {
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
        countryService.getAll().then(result => {
            let CID = result.data.Data
            setCountryId(CID.CountryId)
        })
        cityService
            .getAll(countryId)
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
    }, []);

    useEffect(() => {
        userInfo();
    }, []);


    return (
      <Stack>
          <Stack alignItems='flex-end' sx={{ marginTop: '-20%', marginBottom: '7%'}}>
              <Avatar src={account.photoURL} alt="photoURL" sx={{ width: 110, height: 110}}/>
          </Stack>
        <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
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
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineOutlinedIcon />
                                </InputAdornment>
                            )
                        }}
                    />
            </Stack>
            <Stack mb={3} justifyContent="space-around">
                <Box sx={{ minWidth: 400 }}>
                    <TextField
                        fullWidth
                        label="Cell Phone"
                        value={cellPhone}
                        onChange={(event) => setCellPhone(event.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneInTalkOutlinedIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Stack>
            <Stack mb={3} justifyContent="space-around">
                <Box sx={{ minWidth: 400 }}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SubtitlesOutlinedIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Stack>
            {countries.length > 0 ? (
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            value={countryValue}
                            key={Math.random().toString(36).substr(2, 9)}
                            label="Country"
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PublicOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                        >
                            {countries.map((item) => (
                                <MenuItem key={Math.random().toString(36).substr(2, 9)} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                </Box>
            ) : null}

            {cities.length > 0 ? (
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            value={cityValue}
                            key={Math.random().toString(36).substr(2, 9)}
                            label="City"
                            onChange={handleCitiesChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                        >
                            {cities.map((item) => (
                                <MenuItem key={Math.random().toString(36).substr(2, 9)} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                </Box>
            ) : null}

            <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={()=> updateUserInfo()}
          >
            Edit
          </LoadingButton>
        </Stack>
      </Stack>
  );
}
