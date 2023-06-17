import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import "./OrgAdmin.css";
import "./AddNewUser.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from './Navbar';
import { useHistory, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import DatePicker from "@mui/lab/DatePicker";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import Link from '@mui/material/Link';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS } from "routes";
import moment from 'moment';
import toast from 'react-hot-toast';
import Loader from 'components/Loader';

import { actions as UserManagementActions } from "store/module/UserManagementModule";
const CustomTextField = styled((props) => (
    <TextField fullWidth style={{ marginTop: "50px" }} InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
    '& label.Mui-focused': {
        color: 'black',
    },
    "& .MuiFilledInput-root": {
        disableUnderline: 'true',
        border: "1px solid #f1f1f1",
        overflow: "hidden",
        borderRadius: 5,
        backgroundColor: "#f1f1f1",
        boxShadow: "5px 5px 10px #bdc0c2,-5px -5px 10px #ffffff",
        transition: theme.transitions.create([
            "border-color",
            "background-color",
            "box-shadow"
        ]),
        "&.Mui-focused": {
            disableUnderline: 'true',
            color: "#595959",
            borderColor: "#f1f1f1",
            boxShadow: "inset 5px 5px 10px #bdc0c2, inset -5px -5px 10px #ffffff"
        }
    }
}));
const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& label.Mui-focused': {
        color: 'black',
    },
    '& .MuiInputBase-input': {
        padding: '17px',
        border: "1px solid #f1f1f1",
        overflow: "hidden",
        borderRadius: 5,
        backgroundColor: "#f1f1f1",
        boxShadow: "5px 5px 10px #bdc0c2,-5px -5px 10px #ffffff",
        transition: theme.transitions.create([
            "border-color",
            "background-color",
            "box-shadow"
        ]),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            color: "#595959",
            borderColor: "#f1f1f1",
            boxShadow: "inset 5px 5px 10px #bdc0c2, inset -5px -5px 10px #ffffff"
        },
    },
}));
const TabPanel =
    (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
    },
}));



const UserManagementEditFacilitator = (props) => {

  

    const History = useHistory();
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    const [lang, setLang] = useState("en");
    const { value } = useContext(ThemeContext);

    const [Firstname, setFirstname] = React.useState("")
    const [Lastname, setLastname] = React.useState("")
    const [Dateofbirth, setDateofbirth] = React.useState("")
    const [Gender, setGender] = React.useState('');
    const [Email, setEmail] = React.useState("")
    const [Grade, setGrade] = React.useState("")
    const [Mobilenumber, setMobilenumber] = React.useState("")
    const [Country, setCountry] = React.useState('');
    const [Prefecture, setPrefecture] = React.useState('');
    const [Major, setMajor] = React.useState('');
    const [Moreinfo, setMoreinfo] = React.useState('');
    const [Dateofjoining, setDateofjoining] = React.useState('');
    const [apihitcount, setapihitcount] = React.useState(1)
    const [isMounted, setisMounted] = useState(false)
    const [loading,setloading] =React.useState(false)
    const UserManagementState = useSelector(state => state.usermanagement)
    const location = useLocation()
    const dispatch = useDispatch()

    const changeLanguageHandler = ({ target }) => {
        setLang(target.value1);
        i18n.changeLanguage(target.value1);
    };

    const handlePrefectureChange = (event) => {
        setPrefecture(event.target.value);
    };

    const handleCountryChange = (event) => {
        console.log("handleCountryChange====>", event.target.value);
        setCountry(event.target.value);
        const Prefecture_Payload = {
            END_POINT1: 'country',
            END_POINT2: event.target.value,
            END_POINT3: 'prefectures',
            Query: {
                "countryId": event.target.value
            }

        }
        dispatch(UserManagementActions.getPrefecturelist(Prefecture_Payload))
    };


   
  {/* ***************************GET SPECIFIC USER OF THE ORG******************************* */ }

    useEffect(() => {
        const UserManagementEditFacilitator_Payload = {
            END_POINT1: 'org',
            END_POINT2: sessionStorage.getItem('Org_ID'),
            END_POINT3: 'user',
            END_POINT4: location.state.userId,
        }

        dispatch(UserManagementActions.getOrgUserById(UserManagementEditFacilitator_Payload))
    }, [])

    useEffect(() => {
        if (UserManagementState?.getorguserbyid) {
            setFirstname(UserManagementState.getorguserbyid?.firstName)
            setLastname(UserManagementState.getorguserbyid?.lastName)
            setDateofbirth(UserManagementState.getorguserbyid?.dateOfBirth)
            setGender(UserManagementState.getorguserbyid?.gender)
            setEmail(UserManagementState.getorguserbyid?.primaryEmailId)
            setGrade(UserManagementState.getorguserbyid?.grade)
            setMobilenumber(UserManagementState.getorguserbyid?.primaryMobileNo)
            setCountry(UserManagementState.getorguserbyid?.countryId)
            setPrefecture(UserManagementState.getorguserbyid?.prefectureId)
            setMajor(UserManagementState.getorguserbyid?.major)
            setMoreinfo(UserManagementState.getorguserbyid?.moreInfo)
            setDateofjoining(UserManagementState.getorguserbyid?.dateOfJoining)

        }
        console.log("UserManagementsingleuserdataaa*******----------", UserManagementState?.getorguserbyid?.countryName);
    }, [UserManagementState?.getorguserbyid])

      {/* ***************************GET COUNTRY******************************* */ }


    useEffect(() => {
        if (apihitcount < 3) {
            const Country_Payload = {
                END_POINT1: 'country',
            }
            dispatch(UserManagementActions.getCountrylist(Country_Payload))
        }
        setapihitcount(5)
    })

          {/* ***************************GET PREFECTURE******************************* */ }

    useEffect(() => {
        if (apihitcount < 5) {
            const Prefecture_Payload = {
                END_POINT1: 'country',
                END_POINT2: location.state.countryId,
                END_POINT3: 'prefectures',
                Query: {
                    "countryId": location.state.countryId,
                }
            }
            dispatch(UserManagementActions.getPrefecturelist(Prefecture_Payload))
        }
    })

        {/* ***************************EDIT FACILITATOR******************************* */ }


    const editFacilitatorInfo = () => {
        const UpdateUserDetails_Payload = {
            END_POINT1: 'org',
            END_POINT2: sessionStorage.getItem('Org_ID'),
            END_POINT3: 'user',
            END_POINT4: location.state.userId,
            Query: {
                "firstName": Firstname,
                "lastName": Lastname,
                "major": Major,
                "dateOfBirth":moment(Dateofbirth).format('YYYY/MM/DD'),
                "primaryMobileNo": Mobilenumber,
                "primaryEmailId": Email,
                "gender": Gender,
                "grade": Grade,
                "prefectureId": Prefecture,
                "countryId": Country,
                "roleId":2,
                "moreInfo": Moreinfo,
                "dateOfJoining":moment(Dateofjoining).format('YYYY/MM/DD'),  
            }
        }
        dispatch(UserManagementActions.editFacilitatorDetails(UpdateUserDetails_Payload))
    }
    const notify = () => toast.success(t("Successfully_updated_Facilitator"), {
        duration: 4000,
        position: 'top-center',
    });
    const notifyError = () => toast.error(t(UserManagementState.editfacilitatordetails?.data), {
        duration: 4000,
        position: 'top-center',
      });


    useEffect(() => {
        console.log('UserManagementState', UserManagementState);
        if (UserManagementState.editfacilitatordetails?.statusCode == 201) {
            notify()
            dispatch(UserManagementActions.resetState())
            History.push(PATHS.USERMANAGEMENT)
        }
        else if (UserManagementState.editfacilitatordetails?.statusCode == 403) {
            setloading(false)
            notifyError()
        }
        else if (UserManagementState.editfacilitatordetails?.statusCode == 10201) {
            setloading(false)
            notifyError()
        }
    }, [UserManagementState.editfacilitatordetails])

    const breadcrumbs = [
        <Link onClick={() => History.push(PATHS.USERMANAGEMENT)} fontSize="13px" underline="hover" key="1" color="inherit">
            {t("Facilitator")}
        </Link>,
        <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
            {t("Edit_Facilitator")}
        </Typography>,
    ];

    return (
        <div className="orgadminTop">
            <Navbar />
            <Grid className="orgAdminContainer">
            <Loader load={loading} />
                <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid className="orgAdminHeader">
                        <Grid container direction="row" className="orgAdminBtnDiv" spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="orgAdminHeadings" >
                                <div>{t("User_Management")}</div>
                                <div>
                                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                                        {breadcrumbs}
                                    </Breadcrumbs>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{ width: "100%", }} className="inputContainerBox">
                        <Grid container justifyContent="space-evenly" xs={12} sm={12} md={12} lg={12} xl={12} >
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                                <CustomTextField
                                    label={t("FirstName")}
                                    id="Firstname"
                                    variant="filled"
                                    value={Firstname}
                                    onChange={(event) => { setFirstname(event.target.value) }}
                                />
                            </Grid>
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                                <CustomTextField
                                    label={t("LastName")}
                                    id="Lastname"
                                    variant="filled"
                                    value={Lastname}
                                    onChange={(event) => { setLastname(event.target.value) }}

                                />
                            </Grid>
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                                <CustomTextField
                                    label={t("Email")}
                                    id="Email"
                                    variant="filled"
                                    value={Email}
                                />
                            </Grid>
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                                <CustomTextField
                                    label={t("Grade")}
                                    id="Grade"
                                    variant="filled"
                                    value={Grade}
                                    onChange={(event) => { setGrade(event.target.value) }} />
                            </Grid>

                            <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        InputProps={{
                                            disableUnderline: true,
                                        }} disableFuture
                                        label={t("Date_Of_Joining")}
                                        views={["year", "month", "day"]}
                                        value={Dateofjoining}
                                        onChange={(newValue) => {
                                            setDateofjoining(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                label={t("Date_Of_Joining")}
                                                id="DateOfJoining"
                                                variant="filled"
                                              
                                                {...params}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5} style={{ marginTop: "50px" }}>
                                <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-filled-label">{t("Gender")}</InputLabel>
                                    <Select
                                        value={Gender}
                                        onChange={(event) => { setGender(event.target.value) }}
                                        input={<BootstrapInput id="demo-simple-select-filled" />}
                                    >
                                        
                                        <MenuItem value="M">{t("Male")}</MenuItem>
                                        <MenuItem value="F">{t("Female")}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                                <CustomTextField
                                    label={t("Mobile_No")}
                                    id="EditFacilitatorMobileno"
                                    variant="filled"
                                    value={Mobilenumber}
                                    onChange={(event) => { setMobilenumber(event.target.value) }} />
                            </Grid>
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5} style={{ marginTop: "50px" }}>
                                <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-filled-label">{t("Country")}</InputLabel>
                                    <Select
                                        value={Country}
                                        onChange={handleCountryChange}
                                        input={<BootstrapInput id="demo-simple-select-filled"
                                        />}
                                    >
                                         {UserManagementState.countrylist && UserManagementState.countrylist?.data?.filter((e) => e.countryName != 'GLOBAL').map(({ countryId, countryName }) => {
                                            return (
                                                <MenuItem value={countryId}>{countryName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5} style={{ marginTop: "50px" }}>
                                <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-filled-label">{t("Prefecture")}</InputLabel>
                                    <Select
                                        value={Prefecture}
                                        onChange={handlePrefectureChange}
                                        input={<BootstrapInput id="demo-simple-select-filled"
                                        />}
                                    >
                                        {UserManagementState.prefecturelist && UserManagementState.prefecturelist?.data.map(({ prefectureId, prefectureName }) => {
                                            return (
                                                <MenuItem value={prefectureId}>{prefectureName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                                <CustomTextField
                                    label={t("Major")}
                                    id="Major"
                                    variant="filled"
                                    value={Major}
                                    onChange={(event) => { setMajor(event.target.value) }}
                                />
                           
                            </Grid>
                            <Grid xs={11} sm={10.75} md={10.75} lg={10.75} xl={10.75}>
                                <CustomTextField
                                    label={t("More_Info")}
                                    id="EditMoreInfo"
                                    variant="filled"
                                    value={Moreinfo}
                                    onChange={(event) => { setMoreinfo(event.target.value) }}
                                />
                            </Grid>
                            <Grid container justifyContent="flex-end" style={{ marginTop: "50px" }} xs={11}>
                                <Button className="orgAdminDialogBtns" style={{ marginRight: "15px" }} onClick={() => History.push(PATHS.USERMANAGEMENT)}>{t("CANCEL")}</Button>
                                <Button className="orgAdminDialogBtns" onClick={() => editFacilitatorInfo()}>{t("SAVE")}</Button>
                            </Grid>
                        </Grid>

                    </Box>

                </Grid>
            </Grid>
        </div>
    );
};

export default UserManagementEditFacilitator;
