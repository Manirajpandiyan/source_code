import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import moment from 'moment';
import "./UserList.css";
import { PATHS } from "../routes/index";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { MdPersonAddAlt1 } from 'react-icons/md';
import Loader from './Loader';
import { FaRegEye } from 'react-icons/fa';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Header from '../components/AllScreenHeader';
import { useDispatch, useSelector } from 'react-redux';
import { actions as Useractions } from "../store/module/Usermodule";
import StaticContent from "./StatisContent";
import { toast } from "react-hot-toast";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { postExpenseForParticularBooking } from "../api/Api";



const UserList = () => {
  const History = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openDel, setOpenDel] = React.useState(false);
  const dispatch = useDispatch();
  const UserState = useSelector(state => state.user);
  const [userlist, setuserlist] = useState([])
  const [userId, setuserId] = useState('')
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [statusfilter, setstatusfilter] = useState('')
  const [errorStatus, setErrorStatus] = useState([]);
  const [rolefilter, setrolefilter] = useState('0')
  const [loading, setloading] = useState(false)
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionDate, setTransactionDate] = useState(moment());
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const expenseState = useSelector((state) => state.expenses);
  const handleClickOpenDel = (id, name, lname) => {

    setuserId(id);
    setfirstName(name);
    setlastName(lname);
    setOpenDel(true);
  };

  const handleCloseDel = () => {
    setOpenDel(false);
  };

  const handleClickOpen = (id, name, lname) => {
    setuserId(id);
    setfirstName(name);
    setlastName(lname);
    setOpen(true);
  };


  useEffect(() => {
    const USER_LIST_PAYLOAD = {
      END_POINT1: 'users',
    }
    dispatch(Useractions.userlist(USER_LIST_PAYLOAD))
    console.log("--------------->", expenseState)
  }, [])

  useEffect(() => {
    if (UserState.userlist?.statusCode == StaticContent.Status200) {
      let namelist = []
      if (statusfilter == '' && rolefilter == '0') {
        setuserlist(UserState.userlist?.data)
        UserState.userlist?.data.map(({ firstName, lastName }, i) => {
          namelist[i] = firstName, lastName
        })
        sessionStorage.setItem('nameList', JSON.stringify(namelist))
      }
      else if (statusfilter != '' && rolefilter == '0') {
        setuserlist(UserState.userlist?.data?.userProfile)
        UserState.userlist?.data?.userProfile.map(({ firstName, lastName }, i) => {
          namelist[i] = firstName, lastName
        })
        sessionStorage.setItem('nameList', JSON.stringify(namelist))
      }
      else if (statusfilter == '' && rolefilter != '0') {
        setuserlist(UserState.userlist?.data?.userProfile)
        UserState.userlist?.data?.userProfile.map(({ firstName, lastName }, i) => {
          namelist[i] = firstName, lastName
        })
        sessionStorage.setItem('nameList', JSON.stringify(namelist))
      }
      else if (statusfilter != '' && rolefilter != '0') {
        setuserlist(UserState.userlist?.data?.userProfile)
        UserState.userlist?.data?.userProfile.map(({ firstName, lastName }, i) => {
          namelist[i] = firstName, lastName
        })
        sessionStorage.setItem('nameList', JSON.stringify(namelist))
      }
    }
    let listData = [];
    (UserState?.userlist?.data ?? []).map(ele => {
      if (ele?.roleId !== 4 && ele?.roleId !== 2) {
        listData.push({ userId: ele?.userId, firstName: ele?.firstName, lastName: ele?.lastName })
      }
    });
    sessionStorage.setItem('nameList', JSON.stringify(listData))
  }, [UserState.userlist])


  const notify = () => toast.success(("Successfully removed the user"), {
    duration: 4000,
    position: "top-center"
  });

  useEffect(() => {
    if (UserState.deleteuser?.statusCode == StaticContent.Status200) {

      const USER_LIST_PAYLOAD = {
        END_POINT1: 'users',
      }
      dispatch(Useractions.userlist(USER_LIST_PAYLOAD))
      setOpenDel(false)
      notify()
      dispatch(Useractions.resetState())


    }
  }, [UserState.deleteuser])

  const onClickDelete = () => {

    const DELETE_USER_PAYLOAD = {
      END_POINT1: 'user',
      END_POINT2: userId,
    }
    dispatch(Useractions.deleteUser(DELETE_USER_PAYLOAD))
  }
  const postNotify = () => toast.success(("Successfully added the points"), {
    duration: 4000,
    position: "top-center"
  });
  const onClickPostPoint = () => {
    setloading(true)
    const POST_BOOKING_EXPENSE_PAYLOAD = {
      END_POINT1: "transactions",
      Query: {

        "description": description,
        "memberId": userId,
        "points": parseInt(points),
        "transactionDate": moment(transactionDate).format('YYYY-MM-DD'),
        "transactionType": transactionType,
        "expenseCategoryId": 1,

      },
    };
    postExpenseForParticularBooking(POST_BOOKING_EXPENSE_PAYLOAD)
      .then(res => {
        postNotify()
        setOpen(false)
        setloading(false)
        const VIEWUSER_PAYLOAD = {
          END_POINT1: 'users',
          END_POINT2: userData.userId,
        }
        dispatch(Useractions.user(VIEWUSER_PAYLOAD))
        console.log("res", res);
        const USER_LIST_PAYLOAD = {
          END_POINT1: 'users',
        }
        dispatch(Useractions.userlist(USER_LIST_PAYLOAD))
      })
      .catch(e => {
        setErrorStatus([...e?.status?.errorMessage])
        console.log("error", e)
        setloading(false)
      });
  }

  const clearData = () => {
    setErrorStatus([]);
  }




  return (
    <div>
      <Navbar />
      <Header />
      <Loader load={loading} />
      <div className="userListMainContainer">
        <Grid xs={12} container>
          <Grid xs={6} className='userListText'>
            User List
          </Grid>
          <Grid xs={6} style={{ display: "grid", alignItems: "center", justifyContent: "end" }}>
            <div className="userAddIconDiv" id="userListAddUserId" onClick={() => History(PATHS.ADDUSER)}>
              <MdPersonAddAlt1 size="20" style={{ padding: "5px" }} /> <div className="addUserText">Add User</div>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className='UserListing_section'>
        <Grid >
          {userlist?.length == 0 ? <Grid className='no_data_found'>Currently no users Available</Grid> :
            <table>
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Available Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>


                {UserState.userlist && userlist?.filter(ele => ele.status !== "DELETE" && ele.roleId !== 4).map(({ userId, firstName, lastName, mobileNumber, status, roleId, balance }) => {
                  return (
                    <tr key={userId}>
                      <td data-column="Name">{firstName + " " + lastName}</td>
                      <td data-column="Phone number">{mobileNumber}</td>
                      <td data-column="Role">{roleId == 1 ? "Admin" : roleId == 2 ? "Manager" : roleId == 3 ? "Member" : "Super Admin"}</td>
                      <td data-column="Status">{status.replaceAll("_", " ")}</td>
                      <td data-column="Balance">{balance == "0" ? "NA" : balance}</td>
                      <td data-column="Action" className="BookingListAction">
                        {roleId == 4 ? null :
                          <Tooltip title="View User">
                            <IconButton>
                              <FaRegEye id="userListViewUserBtnId" onClick={() => History(PATHS.VIEWUSER, { state: { userid: userId, username: firstName } })} className="actionIcons" size="22" />
                            </IconButton>
                          </Tooltip>
                        }
                        {roleId == 4 || status != "ACTIVE" ? null :
                          <Tooltip title="Edit User">
                            <IconButton>

                              <MdEdit id="userListEditUserBtnId" onClick={() => History(PATHS.EDITUSER, { state: { userid: userId, username: firstName } })} className="actionIcons" size="22" />

                            </IconButton>
                          </Tooltip>
                        }
                        {roleId == 2 || roleId == 4 ? null :
                          <Tooltip title="Add Points" >
                            <IconButton>
                              <HiOutlineCurrencyRupee onClick={() => (handleClickOpen(userId, firstName, lastName))} id="pointManagementAddPointsBtnId" className="actionIcons" size="25" />
                            </IconButton>
                          </Tooltip>

                        }
                        {roleId == 4 ? null :
                          <Tooltip title="Delete User">
                            <IconButton>
                              <MdOutlineDelete id="userListDelteBtnId" onClick={() => (handleClickOpenDel(userId, firstName, lastName))} className="actionIcons" size="22" />
                            </IconButton>
                          </Tooltip>
                        }



                      </td>

                    </tr>
                  )
                })}

              </tbody>
            </table>}
        </Grid>
      </div>
      <Dialog open={open} >
        <DialogTitle>Add Points to {firstName} </DialogTitle>

        <DialogContent>
          <Grid>
            <ul>
              {errorStatus.map((ele) => (
                <li key={ele} style={{ color: "red", paddingTop: "15px" }}>
                  {'\u2022'}{'  '}{ele}
                </li>
              ))}
            </ul>
          </Grid>
          <Grid container>
            <Grid xs={12}>
              <label htmlFor="transactiondate">
                Transaction Date
              </label>
              <input
                type="date"
                name="transactiondate"
                id="transactiondate"
                value={moment(transactionDate).format("YYYY-MM-DD")}
                onChange={(event) => {
                  setTransactionDate(event.target.value);
                }}
                className="dialogueformdatepicker"
              />
            </Grid>
            <Grid xs={12}>
              <label htmlFor="transactionType">
                Transaction Type<span className="required">*</span>
              </label>
              <select onChange={(event) => {
                setTransactionType(event.target.value);
              }}>
                <option value="" disabled selected>---Select---</option>
                <option value="DEBIT" id="addPointsId">Add Points</option>
                <option value="CREDIT" id="deductPointsId">Deduct Points</option>
              </select>
            </Grid>
            <Grid xs={12}>
              <label htmlFor="firstname">
                Enter the Points<span className="required">*</span>
              </label>

              <input
                style={{ width: "95.5%" }}
                type="number"
                className="numOfAdults"
                id="enterThePointsId"
                maxLength={10}
                placeholder="Max. Amt.19,999"
                onChange={(event) => {
                  setPoints(event.target.value);
                }}
              ></input>
            </Grid>
            <Grid xs={12}>
              <label style={{ textAlign: "start", width: "100%" }} htmlFor="address">
                Description<span className="required">*</span>
              </label>

              <textarea
                id="pointsDescriptionId"
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              ></textarea>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button id="pointsCancelBtnId" onClick={() => { setOpen(false); clearData() }} >Cancel</Button>
          <Button id="pointsSubmitBtnId" onClick={() => onClickPostPoint()} variant="contained" color="success">Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDel}
        onClose={handleCloseDel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to delete <strong> "{firstName} {lastName}" </strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="userDeleteNoBtnId" onClick={handleCloseDel}>No</Button>
          <Button id="userDeleteYesBtnId" onClick={() => onClickDelete()} variant="contained" color="success">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default UserList;