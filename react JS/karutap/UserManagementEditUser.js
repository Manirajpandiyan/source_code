import React, { useState, useContext ,useEffect} from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import "./OrgAdmin.css";
import "./AddNewUser.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from './Navbar';
import { useHistory,useLocation} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import toast from 'react-hot-toast';
import { actions as UserManagementActions } from "store/module/UserManagementModule";
import Loader from 'components/Loader';
import { PATHS } from "routes";

const CustomTextField = styled((props) => (
  <TextField fullWidth style={{marginTop:"50px"}} InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  '& label.Mui-focused': {
      color: 'black',
    },
  "& .MuiFilledInput-root": {
    disableUnderline:'true',
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
    
    "& .MuiInput-underline:after": {
      borderBottomColor: "green"
    },
    "&.Mui-focused": {
      disableUnderline:'true',
      color: "#595959",
      borderColor: "#f1f1f1",
      boxShadow: "inset 5px 5px 10px #bdc0c2, inset -5px -5px 10px #ffffff"
    }
  }
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
const UserManagementEditUser = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  console.log({ value }); 
  const [value1, setValue] = React.useState(0);
  const [Email,setEmail]=React.useState("")
  const [Grade,setGrade]=React.useState("")
  const [isMounted, setisMounted] = useState(false)
  const [Moreinfo,setMoreinfo]=React.useState("")
  const [Firstname,setFirstname]=React.useState("")
    const [Lastname,setLastname]=React.useState("")
    const [Dateofbirth,setDateofbirth]=React.useState("")
    const [Gender,setGender]=React.useState("")
    const [RoleId,setRoleId]=React.useState("")
    const [Mobilenumber,setMobilenumber]=React.useState("")
    const [CountryId,setCountryId]=React.useState("")
    const [PrefectureId,setPrefectureId]=React.useState("")
    const [Dateofjoining,setDateofjoining]=React.useState("")
    const [getgrade,setgetgrade]=React.useState("")
    const [loading,setloading] =React.useState(false)



  const UserManagementState = useSelector(state => state.usermanagement)
  const location = useLocation()
  const dispatch= useDispatch()
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };

  const breadcrumbs = [
    <Link onClick={() => History.push(PATHS.USERMANAGEMENT)} fontSize="13px" underline="hover" key="1" color="inherit">
      {t("User")}
    </Link>,
    <Typography style={{fontSize:"13px"}} key="2" color="text.primary">
    {t("Edit_User")}
  </Typography>,
  ];

  useEffect(() => {
    const UserManagementViewUser_Payload={
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'user',
      END_POINT4: location.state.userId,        
    }

    dispatch(UserManagementActions.getOrgUserById(UserManagementViewUser_Payload))
  },[])

  useEffect(() => {
    if (UserManagementState?.getorguserbyid) {
        setFirstname(UserManagementState.getorguserbyid?.firstName)
        setLastname(UserManagementState.getorguserbyid?.lastName)
        setGender(UserManagementState.getorguserbyid?.gender)
        setMobilenumber(UserManagementState.getorguserbyid?.primaryMobileNo)
        setEmail(UserManagementState.getorguserbyid?.primaryEmailId)
        setGrade(UserManagementState.getorguserbyid?.grade)
        setCountryId(UserManagementState.getorguserbyid?.countryId)
        setPrefectureId(UserManagementState.getorguserbyid?.prefectureId)
        setMoreinfo(UserManagementState.getorguserbyid?.moreInfo)
        setDateofjoining(UserManagementState.getorguserbyid?.dateOfJoining)
        setDateofbirth(UserManagementState.getorguserbyid?.dateOfBirth)

 
    }
    console.log("UserManagementsingleuserdataaa*******----------",UserManagementState?.getorguserbyid);
  }, [UserManagementState?.getorguserbyid])
  


  const editUserInfo = () => {
    const UpdateUserDetails_Payload={
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'user',
      END_POINT4: location.state.userId,
      Query: {
        "grade": Grade,
         "moreInfo": Moreinfo,
      }
    }
        dispatch(UserManagementActions.editUserDetails(UpdateUserDetails_Payload))
    }   


const notify = () => toast.success(t("Successfully_updated_user"), {
    duration: 4000,
    position: 'top-center',
});

const notifyError = () => toast.error(t(UserManagementState.edituserdetails?.data), {
  duration: 4000,
  position: 'top-center',
});
useEffect(() => {
    console.log('UserManagementState', UserManagementState);
    if (UserManagementState.edituserdetails?.statusCode == 201) {
        notify()
        History.push(PATHS.USERMANAGEMENT)
    }
    else if (UserManagementState.edituserdetails?.statusCode == 403) {
      setloading(false)
      notifyError()
    }
    else if (UserManagementState.edituserdetails?.statusCode == 10201) {
      setloading(false)
      notifyError()
    }
},[UserManagementState.edituserdetails])

  return (
    <div className="orgadminTop">
      <Navbar/>
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
        disabled
        label={t("Email")}
        id="EditEmail"
        variant="filled"
        value={Email}

      />
        </Grid>
        <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
        <CustomTextField
        label={t("Grade")}
        id="EditGrade"
        variant="filled"
        value={Grade}
        onChange={(event)=>{setGrade(event.target.value)}}

      />
        </Grid>
        <Grid xs={11} sm={10.75} md={10.75} lg={10.75} xl={10.75}>
        <CustomTextField
        label={t("More_Info")}
        id="EditMoreInfo"
        variant="filled"
        value={Moreinfo}
        onChange={(event)=>{setMoreinfo(event.target.value)}}


      />
        </Grid>
        <Grid container justifyContent="flex-end" style={{marginTop:"50px"}} xs={11}>
        <Button className="orgAdminCancelBtn" style={{marginRight:"15px"}} onClick={() => History.push(PATHS.USERMANAGEMENT)} >{t("CANCEL")}</Button>
        <Button className="orgAdminSaveBtn" onClick={() =>editUserInfo()}>{t("SAVE")}</Button>
        </Grid>
        </Grid>
        
    </Box>
        
      </Grid>
      </Grid>
    </div>
  );
};

export default UserManagementEditUser;
