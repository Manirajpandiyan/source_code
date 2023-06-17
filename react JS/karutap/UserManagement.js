import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { useDispatch, useSelector } from 'react-redux';
import { styled } from "@mui/material/styles";
import "./OrgAdmin.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from './Navbar';
import { useHistory,useRouteMatch } from "react-router-dom";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { BsToggleOn } from 'react-icons/bs';
import Dialog from '@mui/material/Dialog';
import Link from '@mui/material/Link';
import FormControl from "@mui/material/FormControl";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Switch from '@mui/material/Switch';
import { FaFilter } from 'react-icons/fa';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { BsFillEyeFill } from 'react-icons/bs';
import { tableIcons } from "../utils";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { actions as UserManagementActions } from "store/module/UserManagementModule";
import Request from '../../api/Request';
import StaticContent from 'components/StaticContent';
import Loader from 'components/Loader';
import { PATHS } from "routes";

const Input = styled('input')({
  display: '',
});
const CustomTextField = styled((props) => (
  <TextField fullWidth style={{ marginTop: "30px" }} InputProps={{ disableUnderline: true }} {...props} />
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
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#3498db',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
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
const UserManagement = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openfacilitator, setOpenfacilitator] = React.useState(false);
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const [DeleteOpen, setDeleteOpen] = React.useState(false);
  const [DeleteFacilitatorOpen, setDeleteFacilitatorOpen] = React.useState(false);
  const [filteropen, setFilteropen] = React.useState(false);
  const [BulkStudentOpen, setBulkStudentOpen] = React.useState(false);
  const [BulkFacilitatorOpen, setBulkFacilitatorOpen] = React.useState(false);
  const [daily, setDaily] = useState(true);
  const [Grade, setGrade] = React.useState('');
  const [Facilitatorgender, setFacilitatorgender] = React.useState('');
  const [Facilitatorgrade, setFacilitatorgrade] = React.useState('');
  const [Gender, setgender] = React.useState('');
  const [document, setdocument] = useState({ preview: "", raw: "" });
  const [age, setAge] = React.useState('');
  console.log({ value });
  let { path, url } = useRouteMatch();
  const [value1, setValue] = React.useState(0);
  const [hide, setHide] = useState(true)
  const dispatch = useDispatch()
  const [userlist, setuserlist] = useState([])
  const [UserDelete, setUserDelete] = React.useState('');
  const [FacilitatorDelete, setFacilitatorDelete] = React.useState('');
  const [FacilitatorName, setFacilitatorName] = React.useState('');
  const [UserName, setUserName] = React.useState('');
  const [UserDisable, setUserDisable] = React.useState('');
  const [UserStatus, setUserStatus] = React.useState('');
  const [facilitatorlist, setfacilitatorlist] = useState([])
  const [apihitcount, setapihitcount] = React.useState(1)
  const [inputpath,setinputpath]=React.useState('')
  const [faciinputpath,setfaciinputpath]=React.useState('')
  const [loading,setloading] =React.useState(false)

  const UserManagementState = useSelector(state => state.usermanagement)

  const deletenotify = () => toast.success(t("Successfully_Deleted_User"), {
    duration: 4000,
    position: 'top-center',
  });
  const deletefacilitatornotify = () => toast.success(t("Successfully_Deleted_Facilitator"), {
    duration: 4000,
    position: 'top-center',
  });
  const togglenotify = () => toast.success(t("Successfully_updated_the_org_user_status"), {
    duration: 4000,
    position: 'top-center',
  });
  const notify = () => toast.success(t("Successfully_Uploaded"), {
    duration: 4000,
    position: 'top-center',
});
const notifyError = () => toast.error(t(UserManagementState.bulkUploadResponse?.data.data), {
  duration: 4000,
  position: 'top-center',
});
const notifyBulkError = () => toast.error(t(UserManagementState.bulkUploadResponse?.data.message), {
  duration: 4000,
  position: 'top-center',
});

  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenFacilitator = () => {
    setOpenfacilitator(true);
  };
  const handleCloseFacilitator = () => {
    setOpenfacilitator(false);
  };
  const handleFacilitatorgenderChange = (event) => {
    setFacilitatorgender(event.target.value);
  };
  const handleGenderChange = (event) => {
    setgender(event.target.value);
  };
  const handleFacilitatorgradeChange = (event) => {
    setFacilitatorgrade(event.target.value);
  };
  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };
  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteFacilitatorOpen = () => {
    setDeleteFacilitatorOpen(true);
  };
  const handleDeleteFacilitatorClose = () => {
    setDeleteFacilitatorOpen(false);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleClickFilterOpen = () => {
    setFilteropen(true);
  };

  const handleClickFilterClose = () => {
    setFilteropen(false);
    setgender('');
    setAge('');
    setGrade('');
    setFacilitatorgrade('');
    setFacilitatorgender('');
  };
  const HandleBulkStudentOpen = () => {
    setBulkStudentOpen(true);
  };
  const BulkStudentClose = () => {
    setBulkStudentOpen(false);
    setinputpath('')
    setdocument({ preview: "", raw: "" })
   
  };

  
  const HandleBulkFacilitatorOpen = () => {
    setBulkFacilitatorOpen(true);
  };
  const BulkFacilitatorClose = () => {
    setBulkFacilitatorOpen(false);
    setfaciinputpath('')
    setdocument({ preview: "", raw: "" })

  };
  const handleCaptureStudent = ({ target }) => {
    console.log('target',target.value);
    setinputpath(target.value)
    if (target.files.length) {
      if (target.files[0].size > 7000000) {
        alert(t("Please_Use_Image_Less_than_700Kb"))
        setdocument({ preview: "", raw: "" })
      }
      else if (!(/\.(csv)$/i).test(target.files[0].name)) {
        alert(t("Use_only_CSV_formats"))
        setdocument({ preview: "", raw: "" })
      }
      else {
        setdocument({
          preview: URL.createObjectURL(target.files[0]),
          raw: target.files[0]
        });
      }

    }
  };
  const onsubmitBulkStudent = async () => {
    
    if (document.preview != "") {
      let formData = new FormData();
      formData.append('document', document.raw, document.raw.name)
      console.log("imagepayloadstudent", formData);
      const Postbulkuser_Payload = {
        END_POINT1: 'org',
        END_POINT2: sessionStorage.getItem('Org_ID'),
        END_POINT3: 'role',
        END_POINT4: 3,
        END_POINT5: 'bulkupload',
       
        PAYLOAD_DATA: formData
    }
        await dispatch(UserManagementActions.postBulkupload(Postbulkuser_Payload))
        await facilitatorListing()
        await userListing()
        BulkStudentClose()
      
    }
  }
  const onsubmitBulkFacilitator = async () => {
    let formData = new FormData();
    if (document.preview != "") {
     
      formData.append('document', document.raw, document.raw.name)
      console.log("imagepayloadfacilitator", formData);}
      const Postbulkfacilitator_Payload = {
        END_POINT1: 'org',
        END_POINT2: sessionStorage.getItem('Org_ID'),
        END_POINT3: 'role',
        END_POINT4: 2,
        END_POINT5: 'bulkupload',
       
        PAYLOAD_DATA: formData
    }
        await dispatch(UserManagementActions.postBulkupload(Postbulkfacilitator_Payload))
        await facilitatorListing()
        await userListing()
        BulkFacilitatorClose()
       
    
  }
  const handleCaptureFacilitator = ({ target }) => {
    setfaciinputpath(target.value)
    if (target.files.length) {
      if (target.files[0].size > 7000000) {
        alert(t("Please_Use_Image_Less_than_700Kb"))
      }
      else if (!(/\.(csv)$/i).test(target.files[0].name)) {
        alert(t("Use_only_CSV_formats"))
      }
      else {
        setdocument({
          preview: URL.createObjectURL(target.files[0]),
          raw: target.files[0]
        });
      }

    }
  };

  const onremoveuserclick = (userId, firstName) => {
    setUserDelete(userId)
    setUserName(firstName)
    handleDeleteOpen()
  }

  const onremovefacilitatorclick = (userId, firstName) => {
    setFacilitatorDelete(userId)
    setFacilitatorName(firstName)
    handleDeleteFacilitatorOpen()
  }


  {/* ***************************GET ORG GRADE******************************* */ }

  const getOrgGrade = () => {
    const Orggrade_Payload = {
        END_POINT1: 'org',
        END_POINT2: sessionStorage.getItem('Org_ID'),
        END_POINT3: 'grade',
      }
      dispatch(UserManagementActions.getOrgGrade(Orggrade_Payload))
      }

  {/* ***************************FILTER******************************* */ }

  const filterOrgUser = async () => {
    const FilterUser_Payload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'users',
      END_POINT4: 'filter',
      Query: {
        "list": 'Users',
        "grade": Grade,
        "age": age,
        "gender": Gender,
        "roleId": 3,
        "page": 1,
        "size": 1000000,
      }
    }
      if (!(/^[0-9]*$/.test(age))) {
        alert (t("Please_enter_a_valid_number"))    
      }
    else {
      dispatch(UserManagementActions.getUserOfOrg(FilterUser_Payload))
      await facilitatorListing();
      await getOrgGrade()
      setTimeout(() => {
        setFilteropen(false);
      }, 100);
    }    
  }

  const filterOrgFacilitator = async () => {
    const FilterFacilitator_Payload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'users',
      END_POINT4: 'filter',
      Query: {
        "list": 'Facilitators',
        "grade": Facilitatorgrade,
        "gender": Facilitatorgender,
        "roleId": 2,
        "page": 1,
        "size": 1000000,
      }
    }
    dispatch(UserManagementActions.getFacilitatorOfOrg(FilterFacilitator_Payload))
    await userListing();    
    await getOrgGrade()
    setTimeout(() => {
      setFilteropen(false);
    }, 100);
  }

  {/* ***************************TOGGLE******************************* */ }

  const ondisableclick = (userId, orgUserStatus) => {
    const userStatus_Payload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'user',
      END_POINT4: userId,
      Query: {
        status: orgUserStatus,
      }
    }
    dispatch(UserManagementActions.orgUserStatus(userStatus_Payload))
  }

  useEffect(async () => {
    if (UserManagementState.orguserstatus?.data.statusCode == 200) {
      await togglenotify()
      await userListing()
      await facilitatorListing()
      dispatch(UserManagementActions.resetState())
    }
    else if (UserManagementState.orguserstatus?.data.statusCode == "SUCCESS_CODE") {
      await togglenotify()
      await userListing()
      await facilitatorListing()
      dispatch(UserManagementActions.resetState())
    }
  }, [UserManagementState.orguserstatus])

  {/* ***************************GET USER AND FACILITATOR DATA******************************* */ }

  useEffect(() => {
    setTimeout(() => {
    const userpayload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'users',
      END_POINT4: 'filter',
      Query: {
        "roleId": 3,
        "page": 1,
        "list": 'Users',
        "size": 1000000,
      }
    }
    dispatch(UserManagementActions.getUserOfOrg(userpayload))

    const payload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'users',
      END_POINT4: 'filter',
      Query: {
        "roleId": 2,
        "page": 1,
        "list": 'Facilitators',
        "size": 1000000,
      }
    }
    dispatch(UserManagementActions.getFacilitatorOfOrg(payload))
    getOrgGrade()
  }, 200);
  }, [])

  {/* ***************************DELETE USER******************************* */ }

  const deleteUser = () => {
    const deleteUser_Payload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'user',
      END_POINT4: UserDelete,
      Query: {
        status: 'DELETED',
      }
    }
    dispatch(UserManagementActions.deleteUserFromOrg(deleteUser_Payload))
    setTimeout(() => {
      setDeleteOpen(false);
    }, 100);
  }
  const userListing = () => {
    const UserDetails_Payload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'users',
      END_POINT4: 'filter',
      Query: {
        roleId: 3,
        page: 1,
        list: 'Users',
        size: 1000000,
      }
    }
    dispatch(UserManagementActions.getUserOfOrg(UserDetails_Payload))
  }

  useEffect(async () => {
    if (UserManagementState.deleteusersuccess?.data.statusCode == 200) {
      deletenotify()
      await userListing()
      await facilitatorListing()
    }
  }, [UserManagementState.deleteusersuccess])

  {/* ***************************DELETE FACILITATOR******************************* */ }


  const deleteFacilitator = () => {
    const deleteFacilitator_Payload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'user',
      END_POINT4: FacilitatorDelete,
      Query: {
        status: 'DELETED',
      }
    }
    dispatch(UserManagementActions.deleteFacilitatorFromOrg(deleteFacilitator_Payload))
    setTimeout(() => {
      setDeleteFacilitatorOpen(false);
    }, 100);
  }
  const facilitatorListing = () => {
    const FacilitatorDetails_Payload = {
      END_POINT1: 'org',
      END_POINT2: sessionStorage.getItem('Org_ID'),
      END_POINT3: 'users',
      END_POINT4: 'filter',
      Query: {
        roleId: 2,
        page: 1,
        list: 'Facilitators',
        size: 1000000,
      }
    }
    dispatch(UserManagementActions.getFacilitatorOfOrg(FacilitatorDetails_Payload))
  }

  useEffect(async () => {
    if (UserManagementState.deletefacilitatorsuccess?.data.statusCode == 200) {
      deletefacilitatornotify()
      handleDeleteFacilitatorClose()
      await facilitatorListing()
      await userListing()
      dispatch(UserManagementActions.resetState())

    }
  }, [UserManagementState.deletefacilitatorsuccess])


  {/* ***************************USER DATA MAPPING******************************* */ }


  useEffect(() => {
    if (!UserManagementState.fetching) {
      const user_list = UserManagementState.getuseroforgsuccess?.userProfile?.map(({ firstName, userId, grade, gender, age, primaryEmailId, orgUserStatus }) => {

        return (
          {
            name: firstName,
            grade: grade,
            gender: gender == 'M' ? t("Male") : gender == 'F' ? t("Female") : "",
            age: age,
            email: primaryEmailId,
            internal_action:
              <Grid className='orgAdminTableToggleIcons'>
                <Grid style={{ marginRight: "10px" }}>
                  <AntSwitch
                    defaultChecked={orgUserStatus === 'DISABLED' ? false : true}
                    onChange={(e) => { setDaily(e.target.checked); ondisableclick(userId, orgUserStatus === 'DISABLED' ? 'ACTIVE' : 'DISABLED') }}
                    inputProps={{ 'aria-label': 'ant design' }} /></Grid>
                <BsFillEyeFill title='View'
                  onClick={() => History.push({
                    pathname: PATHS.USERMANAGEMENTVIEWUSER,
                    search: `?userId=${userId}`,
                    state: { userId: userId }
                  })}
                  className="orgAdminTableIcons" />

                <MdEdit title='Edit'
                  onClick={() => History.push({
                    pathname: PATHS.USERMANAGEMENTEDITUSER,
                    search: `?userId=${userId}`,
                    state: { userId: userId }
                  })}
                  className="orgAdminTableIcons" />

                <MdDelete title='Delete'
                  onClick={() => onremoveuserclick(userId, firstName)}
                  className="adminTableDeleteIcon" />

              </Grid>
          }
        )

      })
      setuserlist(user_list)
    }
  }, [UserManagementState, value,])

  const columns = [
    { title: t("NAME"), field: "name" },
    { title: t("GRADE"), field: "grade" },
    { title: t("GENDER"), field: "gender" },
    { title: t("AGE"), field: "age" },
    { title: t("EMAIL"), field: "email" },
    {
      title: t("ACTION"),
      field: "internal_action",
      editable: false,
    }

  ];

  {/* ***************************FACILITATOR DATA MAPPING******************************* */ }

  useEffect(() => {
    console.log("the userdetails lissttttt----" + UserManagementState.userdetails);
    if (!UserManagementState.fetching) {
      const facilitator_list = UserManagementState.getfacilitatoroforgsuccess?.userProfile?.map(({ firstName, major, primaryMobileNo, userId, countryId, orgUserStatus, countryName, prefectureName, grade, gender, age, primaryEmailId }) => {

        return (
          {
            name: firstName,
            grade: grade,
            gender: gender == 'M' ? t("Male") : gender == 'F' ? t("Female") : "",
            major: major,
            mobilenumber: primaryMobileNo,
            age: age,
            email: primaryEmailId,
            internal_action:
              <Grid className='orgAdminTableToggleIcons'>
                <Grid style={{ marginRight: "10px" }}>
                  <AntSwitch
                    defaultChecked={orgUserStatus === 'DISABLED' ? false : true}
                    onChange={(e) => { setDaily(e.target.checked); ondisableclick(userId, orgUserStatus === 'DISABLED' ? 'ACTIVE' : 'DISABLED') }}
                    inputProps={{ 'aria-label': 'ant design' }} /></Grid>
                <BsFillEyeFill title='View'
                  onClick={() => History.push({
                    pathname: PATHS.USERMANAGEMENTVIEWFACILITATOR,
                    search: `?userId=${userId}`,
                    state: { userId: userId }
                  })}
                  className="orgAdminTableIcons" />

                <MdEdit title='Edit'
                  onClick={() => History.push({
                    pathname: PATHS.USERMANAGEMENTEDITFACILITATOR,
                    search: `?userId=${userId}`,
                    state: { userId: userId, countryId: countryId, countryName: countryName, prefectureName: prefectureName }
                  })}
                  className="orgAdminTableIcons" />

                <MdDelete title='Delete'
                  onClick={() => onremovefacilitatorclick(userId, firstName)}
                  className="adminTableDeleteIcon" />
              </Grid>

          }
        )

      })
      setfacilitatorlist(facilitator_list)
    }
  }, [UserManagementState, value,])

  useEffect(async () => {
    if (UserManagementState.bulkUploadResponse?.data.statusCode == 200) {
        notify() 
         await facilitatorListing()
        await userListing()
        History.push({pathname:PATHS.USERMANAGEMENT})
    }
    else if (UserManagementState.bulkUploadResponse?.data.statusCode == 403) {
      setloading(false)
      notifyError()
    }
    else if (UserManagementState.bulkUploadResponse?.data.statusCode == 10201) {
      setloading(false)
      notifyBulkError()
  }
  },[UserManagementState.bulkUploadResponse])
  const columns2 = [
    { title: t("NAME"), field: "name" },
    { title: t("GRADE"), field: "grade" },
    { title: t("GENDER"), field: "gender" },
    { title: t("MAJOR"), field: "major" },
    { title: t("EMAIL"), field: "email" },
    { title: t("MOBILE_NO"), field: "mobilenumber" },
    {
      title: t("ACTION"),
      field: "internal_action",
      editable: false,
    }
  ];
  useEffect(() => {
    const downloadcsv_Payload = {
      END_POINT1: 'documents',
      END_POINT2: 6,
      END_POINT3: 3,
   
    }
    dispatch(UserManagementActions.dowloadCSV(downloadcsv_Payload))
  },[])
  useEffect(() => {
    const downloadfaccsv_Payload = {
      END_POINT1: 'documents',
      END_POINT2: 6,
      END_POINT3: 2,
   
    }
    dispatch(UserManagementActions.dowloadCSVfac(downloadfaccsv_Payload))
  },[])

  const downloadcsv =  () => {
    const downloadfaccsv_Payload = {
      END_POINT1: 'documents',
      END_POINT2: 6,
      END_POINT3: 3,
    }
    dispatch(UserManagementActions.dowloadCSV(downloadfaccsv_Payload))
     facilitatorListing()
     userListing()
  }

  const downloadcsvfaci =  () => {
    const downloadfaccsv_Payload = {
      END_POINT1: 'documents',
      END_POINT2: 6,
      END_POINT3: 2,
    }
    dispatch(UserManagementActions.dowloadCSVfac(downloadfaccsv_Payload))
     facilitatorListing()
     userListing()
  }
useEffect(() => {
  console.log("docfaciii",StaticContent.Card_Url + UserManagementState.encrptdDocExresFac);
})
  return (
    <div className="orgadminTop">
      <Navbar />
      {/* *************************delete user********************************* */}
      <Dialog open={DeleteOpen} onClose={handleDeleteClose}>
        <DialogContent className='orgAdminDeleteConfimationDialog'>
          <DialogTitle> {UserName} {t("You_want_to_delete_the")}</DialogTitle>
          <Grid container justifyContent="flex-end" style={{ marginTop: "50px" }} xs={11}>
            <Button className="orgAdminDialogBtns" onClick={handleDeleteClose} style={{ marginRight: "15px" }}>{t("CANCEL")}</Button>
            <Button className="orgAdminDialogBtns" onClick={() => deleteUser()}>{t("DELETE")}</Button>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* *************************delete facilitator********************************* */}

      <Dialog open={DeleteFacilitatorOpen} onClose={handleDeleteFacilitatorClose}>
        <DialogContent className='orgAdminDeleteConfimationDialog'>
          <DialogTitle>{FacilitatorName} {t("You_want_to_delete_the")} </DialogTitle>
          <Grid container justifyContent="flex-end" style={{ marginTop: "50px" }} xs={11}>
            <Button className="orgAdminDialogBtns" onClick={handleDeleteFacilitatorClose} style={{ marginRight: "15px" }}>{t("CANCEL")}</Button>
            <Button className="orgAdminDialogBtns" onClick={() => deleteFacilitator()}>{t("DELETE")}</Button>
          </Grid>
        </DialogContent>
      </Dialog>



      <Grid className="orgAdminContainer">
      <Loader load={loading} />
        <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
          <Grid className="orgAdminHeader">
            {value1 == 0 ?
              <Grid container direction="row" className="orgAdminBtnDiv" spacing={2}>
                <Grid item xs={3} sm={3} md={3} lg={6} xl={3} className="orgAdminHeadings" >
                  <div>{t("User_Management")}</div>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={2} xl={3} >
                  <Button className="orgAdminHeaderBtn" onClick={handleClickFilterOpen}>
                    <FaFilter className="orgAdminHeaderIcons" />
                    <Grid className="orgAdminHeaderText">{t("FILTER")}</Grid>
                  </Button>
                  <Dialog open={filteropen} onClose={handleClickFilterClose}>
                    <DialogContent className='orgAdminDeleteConfimationDialog'>
                      <DialogTitle>{t("FILTER")}</DialogTitle>
                      <Grid container justifyContent="space-evenly" xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Grid xs={10} sm={10} md={10} lg={10} xl={10}>
                          <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">{t("Grade")}</InputLabel>
                            <Select
                              value={Grade}
                              onChange={handleGradeChange}
                              input={<BootstrapInput />}
                            >
                              {UserManagementState.getorggrade && UserManagementState.getorggrade?.data.map(({ grade, gradeId }) => {
                                return (
                                  <MenuItem value={grade}>{grade}</MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid xs={10} sm={10} md={10} lg={10} xl={10} style={{ marginTop: "30px" }}>
                          <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">{t("Gender")}</InputLabel>
                            <Select
                              labelId="demo-simple-select-filled-label"
                              id="demo-simple-select-filled"
                              value={Gender}
                              onChange={handleGenderChange}
                              input={<BootstrapInput />}
                            >
                              <MenuItem value="">
                                <em>{t("Select")}</em>
                              </MenuItem>
                              <MenuItem value="M">{t("Male")}</MenuItem>
                              <MenuItem value="F">{t("Female")}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid xs={10} sm={10} md={10} lg={10} xl={10}>
                          <CustomTextField
                            label={t("Age")}
                            id="age"
                            variant="filled"
                            value={age}
                            onChange={handleAgeChange}
                          />
                        </Grid>
                      </Grid>
                      <Grid container justifyContent="flex-end" style={{ marginTop: "50px" }} xs={12}>
                        <Button className="orgAdminFilterBtn" onClick={() => { setGrade(''); setgender(''); setAge('') }} style={{ marginRight: "15px" }}>{t("RESET")}</Button>
                        <Button className="orgAdminFilterBtn" onClick={handleClickFilterClose} style={{ marginRight: "15px" }}>{t("CANCEL")}</Button>
                        <Button className="orgAdminFilterBtn" onClick={() => filterOrgUser()} >{t("CONFIRM")}</Button>
                      </Grid>
                    </DialogContent>
                  </Dialog>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={2} xl={3} >
                  <Button className="orgAdminHeaderBtn" onClick={() => History.push(PATHS.ADDNEWUSER)} >
                    <BsFillPlusCircleFill className="orgAdminHeaderIcons" />
                    <Grid className="orgAdminHeaderText">{t("ADD_NEW_USER")}</Grid>
                  </Button>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={2} xl={3} >
                  <Button className="orgAdminHeaderBtn" onClick={HandleBulkStudentOpen}>
                    <BsFillPlusCircleFill className="orgAdminHeaderIcons" />
                    <Grid className="orgAdminHeaderText" onClick={() => downloadcsv()}>{t("ADD_BULK_USER")}</Grid>
                  </Button>
                </Grid>
              </Grid>
              :
              <Grid container direction="row" className="orgAdminBtnDiv" spacing={2}>
                <Grid item xs={3} sm={3} md={3} lg={6} xl={3} className="orgAdminHeadings" >
                  <div>{t("User_Management")}</div>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={2} xl={3} >
                  <Button className="orgAdminHeaderBtn" onClick={handleClickFilterOpen}>
                    <FaFilter className="orgAdminHeaderIcons" />
                    <Grid className="orgAdminHeaderText">{t("FILTER")}</Grid>
                  </Button>
                  <Dialog open={filteropen} onClose={handleClickFilterClose}>
                    <DialogContent className='orgAdminDeleteConfimationDialog'>
                      <DialogTitle>{t("FILTER")}</DialogTitle>
                      <Grid container justifyContent="space-evenly" xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Grid xs={10} sm={10} md={10} lg={10} xl={10}>
                          <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">{t("Grade")}</InputLabel>
                            <Select
                              value={Facilitatorgrade}
                              onChange={handleFacilitatorgradeChange}
                              input={<BootstrapInput />}
                            >
                              {UserManagementState.getorggrade && UserManagementState.getorggrade?.data?.map(({ grade, gradeId }) => {
                                return (
                                  <MenuItem value={grade}>{grade}</MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid xs={10} sm={10} md={10} lg={10} xl={10} style={{ marginTop: "30px" }}>
                          <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">{t("Gender")}</InputLabel>
                            <Select
                              labelId="demo-simple-select-filled-label"
                              id="demo-simple-select-filled"
                              value={Facilitatorgender}
                              onChange={handleFacilitatorgenderChange}
                              input={<BootstrapInput />}
                            >
                              <MenuItem value="">
                                <em>{t("Select")}</em>
                              </MenuItem>
                              <MenuItem value="M">{t("Male")}</MenuItem>
                              <MenuItem value="F">{t("Female")}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container justifyContent="flex-end" style={{ marginTop: "50px" }} xs={12}>
                        <Button className="orgAdminFilterBtn" onClick={() => { setFacilitatorgrade(""); setFacilitatorgender('') }} style={{ marginRight: "15px" }}>{t("RESET")}</Button>
                        <Button className="orgAdminFilterBtn" onClick={handleClickFilterClose} style={{ marginRight: "15px" }}>{t("CANCEL")}</Button>
                        <Button className="orgAdminFilterBtn" onClick={() => filterOrgFacilitator()}>{t("CONFIRM")}</Button>
                      </Grid>
                    </DialogContent>
                  </Dialog>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={2} xl={3} >
                  <Button className="orgAdminHeaderBtn" onClick={() => History.push(PATHS.ADDNEWFACILITATOR)} >
                    <BsFillPlusCircleFill className="orgAdminHeaderIcons" />
                    <Grid className="orgAdminHeaderText">{t("ADD_NEW_FACILITATOR")}</Grid>
                  </Button>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={2} xl={3} >
                  <Button className="orgAdminHeaderBtn" onClick={HandleBulkFacilitatorOpen}>
                    <BsFillPlusCircleFill className="orgAdminHeaderIcons" />
                    <Grid className="orgAdminHeaderText" onClick={() => downloadcsvfaci()}>{t("ADD_BULK_FACILITATOR")}</Grid>
                  </Button>
                </Grid>
              </Grid>
            }

          </Grid>
          <Grid xs={12} sm={12} md={12} lg={12} xl={12} >

            <Box sx={{ width: "100%", }} className="TableBox">
              <Box sx={{ borderBottom: 2, borderColor: "divider" }}>

                <Tabs
                  value={value1}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label={t("USER")}
                    onClick={() => { setGrade(''); setgender(''); setAge(''); setFacilitatorgrade(''); setFacilitatorgender('');userListing();getOrgGrade()}}
                    {...a11yProps(0)} />
                  <Tab label={t("FACILITATOR")}
                    onClick={() => { setGrade(''); setgender(''); setAge(''); setFacilitatorgrade(''); setFacilitatorgender('');facilitatorListing();getOrgGrade();}}
                    {...a11yProps(1)} />
                </Tabs>
              </Box>
              {value1 === 0 ?
                <TabPanel value={value1} index={0}>
                  <Grid className="materialTableContainer">
                    <MaterialTable className="materialTable" style={{ backgroundColor: 'transparent' }} icons={tableIcons} columns={columns} data={userlist}
                      title={t("USER_INFO")}
                      options={{
                        paginationType: 'stepped',
                        pageSizeOptions: [],
                        pageSize: 4,
                        headerStyle: { backgroundColor: "transparent" },
                      }}
                      localization={{
                        body: { emptyDataSourceMessage: <div className="tableNoRecordDiv" >{t("No_records_to_display")}</div> },
                        toolbar: { searchPlaceholder: t("Search"), searchTooltip: t("Search") }, pagination: { firstTooltip: t("First_page"), previousTooltip: t("Previous_page"), nextTooltip: t("Next_page"), lastTooltip: t("Last_page") }
                      }}
                    />
                  </Grid>
                </TabPanel>
                :
                <TabPanel value={value1} index={1}>
                  <Grid className="materialTableContainer">
                    <MaterialTable className="materialTable" style={{ backgroundColor: 'transparent' }} icons={tableIcons} columns={columns2} data={facilitatorlist}
                      title={t("FACILITATOR_INFO")}
                      options={{
                        paginationType: 'stepped',
                        actionsColumnIndex: -1,
                        pageSizeOptions: [],
                        pageSize: 4,
                        headerStyle: {
                          backgroundColor: "transparent",
                        },

                      }}
                      localization={{
                        header: { actions: '' }, body: { emptyDataSourceMessage: <div className="tableNoRecordDiv" >{t("No_records_to_display")}</div> },
                        toolbar: { searchPlaceholder: t("Search"), searchTooltip: t("Search") }, pagination: { firstTooltip: t("First_page"), previousTooltip: t("Previous_page"), nextTooltip: t("Next_page"), lastTooltip: t("Last_page") }
                      }}
                    />
                  </Grid>
                </TabPanel>
              }
            </Box>

          </Grid>
          <Dialog open={BulkStudentOpen} onClose={BulkStudentClose} className=''>
            <DialogContent className='FilterDialog'>
              <DialogTitle>{t("UPLOAD_BULK_USER")}</DialogTitle>
              <label htmlFor="contained-button-file">
                <Input accept=".csv" id="contained-button-file" multiple type="file" onChange={handleCaptureStudent} value={inputpath}/>
              </label>
              {/* <Link fontSize="13px" >
                Download CSV Templete
              </Link> */}
              <a href={UserManagementState.encrptdDocExres && StaticContent.Card_Url + UserManagementState.encrptdDocExres?.data} download>
              {t("Download_CSV_Templete")}</a>



              <DialogActions>
                <Grid container justifyContent="flex-end" style={{ marginTop: "40px" }} xs={11}>
                  <Button onClick={BulkStudentClose} title='cancel'
                    className='orgAdminFilterBtn' style={{ marginRight: "10px" }}>
                    <text>{t("CANCEL")}</text>
                  </Button>
                  <Button disabled={!document.preview} onClick={() => { onsubmitBulkStudent() }} title='confirm'
                    className='orgAdminFilterBtn'>
                    {t("CONFIRM")}
                  </Button>
                </Grid>
              </DialogActions>
            </DialogContent>

          </Dialog>

          <Dialog open={BulkFacilitatorOpen} onClose={BulkFacilitatorClose} className=''>
            <DialogContent className='FilterDialog'>
              <DialogTitle>{t("UPLOAD_BULK_FACILITATOR")}</DialogTitle>
              <label htmlFor="contained-button-file">
                <Input accept=".csv" id="contained-button-file" multiple type="file"onChange={handleCaptureFacilitator} value={faciinputpath} />
              </label>
                    <a href={UserManagementState.encrptdDocExresFac && StaticContent.Card_Url + UserManagementState.encrptdDocExresFac} download>
                    {t("Download_CSV_Templete")}</a>


              <DialogActions>
                <Grid container justifyContent="flex-end" style={{ marginTop: "40px" }} xs={11}>
                  <Button onClick={BulkFacilitatorClose} title='cancel'
                    className='orgAdminFilterBtn' style={{ marginRight: "10px" }}>
                    <text>{t("CANCEL")}</text>
                  </Button>
                  <Button disabled={!document.preview} onClick={() => { onsubmitBulkFacilitator() }} title='confirm'
                    className='orgAdminFilterBtn'>
                    {t("CONFIRM")}
                  </Button>
                </Grid>
              </DialogActions>
            </DialogContent>

          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserManagement;
