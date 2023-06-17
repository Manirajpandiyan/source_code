import * as React from 'react';
import { Grid } from '@mui/material';
import '../EditProfile.css'
import "../AddUser.css";
import { PATHS } from "../../routes/index";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from 'react-icons/ti';
import { useState } from 'react';
import { actions as Loginactions } from "../../store/module/Loginmodule";
import { httpService } from '../../api/Request/service';
import MemberHeader from "./MemberHeader";
import MemeberNavbar from "./MemberNavbar";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { actions as Useractions } from "../../store/module/Usermodule";
import moment from 'moment';
import { toast } from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';


const MemberEditProfile = () => {
    const dispatch = useDispatch();
    const [errorStatus, setErrorStatus] = useState([]);
    const History = useNavigate();
    const UserState = useSelector(state => state.user);
    const [document, setdocument] = useState({ preview: "", raw: "" });
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    const handleCapture = ({ target }) => {
        var idxDot = target.files[0].name.lastIndexOf(".") + 1;
        var extFile = target.files[0].name.substr(idxDot, target.files[0].name.length).toLowerCase();
        console.log('image ext', extFile);

        setdocument({
            preview: URL.createObjectURL(target.files[0]),
            raw: target.files[0]
        });
    };

    const [userdetails, setuserdetails] = React.useState({
        "firstName": UserState.viweUser?.data.firstName,
        "lastName": UserState.viweUser?.data.lastName,
        "dateOfBirth": moment(UserState.viweUser?.data.dateOfBirth).format('YYYY-MM-DD'),
        "gender": UserState.viweUser?.data.gender,
        "address": UserState.viweUser?.data.address,
        "mobileNumber": UserState.viweUser?.data.mobileNumber,
        "emailAddress": UserState.viweUser?.data.emailAddress,
        "aadhaarNo": UserState.viweUser?.data.aadhaarNo,
        "password": UserState.viweUser?.data.password,
        "confirmPassword": UserState.viweUser?.data.confirmPassword,
        "status": UserState.viweUser?.data.status,
        "roleId": UserState.viweUser?.data.roleId
    })

    let formData = new FormData();


    const edituserprofile = async () => {
        if (document.preview != "") {
            formData.append('document', document.raw, document.raw.name)

        }
        const PROFILEIMAGE_PAYLOAD = {
            END_POINT1: 'userImage',
            END_POINT2: userData.userId,
            PAYLOAD_DATA: formData

        }
        await dispatch(Loginactions.userProfileImage(PROFILEIMAGE_PAYLOAD))
    }


    const changeDetails = (key, value) => {
        const details = {
            "firstName": key == 'firstname' ? value : userdetails.firstName,
            "lastName": key == 'lastname' ? value : userdetails.lastName,
            "dateOfBirth": key == 'dob' ? moment(new Date(value)).format('YYYY-MM-DD') : userdetails.dateOfBirth,
            "gender": key == 'gender' ? value : userdetails.gender,
            "address": key == 'address' ? value : userdetails.address,
            "mobileNumber": key == 'primarymobile' ? value : userdetails.mobileNumber,
            "emailAddress": key == 'primaryemail' ? value : userdetails.emailAddress,
            "aadhaarNo": key == 'aadhar' ? value : userdetails.aadhaarNo,
            "password": key == 'password' ? value : userdetails.password,
            "confirmPassword": key == 'confirmpassword' ? value : userdetails.confirmPassword,
            "status": key == 'status' ? value : userdetails.status,
            "roleId": key == 'role' ? value : userdetails.roleId
        }

        setuserdetails(details)
    }


    const onSaveClick = async () => {
        setErrorStatus([]);
        if (document.preview != '') {
            await edituserprofile();
        }
        console.log(userdetails)
        httpService({
            url: `/user/${userData?.userId}`, method: "PUT", data: {
                ...userdetails, password: userdetails?.password === "" ? null : userdetails?.password,
                confirmPassword: userdetails?.confirmPassword === "" ? null : userdetails?.confirmPassword
            }
        })
            .then(res => {
                console.log(res);
                notify()
                History(PATHS.MEMBERMYPROFILE)
            }).catch(e => {
                setErrorStatus([...e?.error?.response?.data?.data]);
            })
    }


    const notify = () => toast.success(("Successfully updated profile"), {
        duration: 4000,
        position: "top-center"
    });


    useEffect(() => {
        const VIEWUSER_PAYLOAD = {
            END_POINT1: 'users',
            END_POINT2: userData.userid
        }
        dispatch(Useractions.user(VIEWUSER_PAYLOAD))
        console.log('location', location);
    }, [])


    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleKeypress = e => {
        console.log(e)
    };

    return (
        <Grid>
            <MemeberNavbar />
            <MemberHeader />
            <div className="addUserMainContainer">
                <Grid container className="addUserContainer">
                    <Grid container style={{ padding: "20px" }}>
                        <Grid xs={5} sm={5} md={5} lg={5.5} xl={5} className="backIconDiv">
                            <TiArrowBack onClick={() => History(PATHS.MEMBERMYPROFILE)} id="editProfileBackBtnId" size={30} />
                        </Grid>
                        <Grid
                            xs={7} sm={7} md={7} lg={5.5} xl={7}
                            style={{
                                textAlign: "start",
                                fontWeight: "900",
                                fontSize: 18,
                            }}
                        > Edit Profile
                        </Grid>
                        <Grid>
                            <ul>
                                {errorStatus.map((ele) => (
                                    <li key={ele} style={{ color: "red", paddingTop: "15px" }}>
                                        {'\u2022'}{'  '}{ele}
                                    </li>
                                ))}
                            </ul>
                        </Grid>
                    </Grid>
                    <Grid container className="formContainer">
                        <Grid container>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <label htmlFor="firstname">
                                    First Name<span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    className="addUserInputField"
                                    id="editProfileFirstnameId"
                                    name="firstname"
                                    value={userdetails.firstName}
                                    onChange={(event) => { changeDetails('firstname', event.target.value) }}
                                ></input>
                            </Grid>
                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <label htmlFor="lastname">
                                    Last Name<span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    className="addUserInputField"
                                    id="editProfileLastNameId"
                                    name="lastname"
                                    value={userdetails.lastName}
                                    onChange={(event) => { changeDetails('lastname', event.target.value) }}

                                ></input>
                            </Grid>
                        </Grid>
                        <Grid container className="rowContainer">
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <label htmlFor="dateofbirth">
                                    Date Of Birth<span className="required">*</span>
                                </label>
                                <input type="date" value={moment(userdetails.dateOfBirth).format('YYYY-MM-DD')} name="dateofbirth" id="dateofbirth"
                                    onChange={(event) => { changeDetails('dob', event.target.value) }}
                                    className="formdatepicker"
                                ></input>
                            </Grid>

                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                            <Grid
                                xs={12}
                                sm={5.5}
                                md={5.5}
                                lg={5.5}
                                xl={5.5}
                                className="gender"
                            >
                                <label htmlFor="gender">
                                    Gender<span className="required">*</span>
                                </label>
                                <div className="custom_radio">
                                    <input
                                        type="radio"
                                        className="radioBtn"
                                        id="featured-1"
                                        name="featured"
                                        onChange={() => { changeDetails('gender', "M") }}

                                        checked={userdetails.gender == 'M' ? true : false}
                                    />
                                    <label htmlFor="featured-1">Male</label>

                                    <input
                                        type="radio"
                                        className="radioBtn"
                                        id="featured-2"
                                        name="featured"
                                        onChange={() => { changeDetails('gender', "F") }}

                                        checked={userdetails.gender == 'F' ? true : false}


                                    />
                                    <label htmlFor="featured-2">Female</label>
                                </div>
                            </Grid>
                        </Grid>

                        <Grid container className="rowContainer">
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <label htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    className="addUserInputField"
                                    id="email"
                                    name="email"
                                    value={userdetails.emailAddress}
                                    onChange={(event) => { changeDetails('primaryemail'), event.target.value }}
                                ></input>
                            </Grid>
                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <label htmlFor="mobile">
                                    Mobile<span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    className="addUserInputField"
                                    id="mobile"
                                    name="mobile"
                                    maxLength={10}
                                    value={userdetails.mobileNumber}
                                    onChange={(event) => { changeDetails('primarymobile', event.target.value) }}

                                ></input>
                            </Grid>
                        </Grid>
                        <Grid container className="rowContainer">
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <label htmlFor="role">Role</label>
                                <div className="customSelect" id="editProfileRoleId">

                                    <input type="text" className='addUserInputField' value={userdetails.roleId == 1 ? "Admin" : userdetails.roleId == 2 ? "Manager" : "Member"} readOnly disabled></input>
                                </div>
                            </Grid>

                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} style={{ display: "flex", flexDirection: "column" }}>

                                <label htmlFor='profileImage'>Profile Image : </label>
                                <input
                                    accept="image"
                                    title="select image"
                                    id="contained-button-file"
                                    onChange={handleCapture}
                                    type="file"
                                    className="profileImgInput"
                                />


                            </Grid>
                        </Grid>
                        <Grid container className="rowContainer">
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} >
                                <label htmlFor="aadhar">
                                    Password
                                </label>
                                <div className="wrapper">
                                    <span className="eye">{values.showPassword ? <FaRegEye onClick={handleClickShowPassword} /> : <FaRegEyeSlash onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword} />}</span>
                                    <input
                                        autoComplete="off"
                                        onKeyPress={handleKeypress}
                                        type={values.showPassword ? "text" : "password"}
                                        value={userdetails.password}
                                        className="addUserPasswordField"
                                        id="addUserPasswordFieldId"
                                        onChange={(event) => { changeDetails('password', event.target.value) }}
                                    ></input>

                                </div>
                            </Grid>

                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>

                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} style={{ display: "flex", flexDirection: "column" }}>
                                <label htmlFor="aadhar">
                                    Confirm Password
                                </label>
                                <div className="wrapper">
                                    <span className="eye">{values.showPassword ? <FaRegEye onClick={handleClickShowPassword} /> : <FaRegEyeSlash onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword} />}</span>
                                    <input
                                        autoComplete="off"
                                        onKeyPress={handleKeypress}
                                        type={values.showPassword ? "text" : "password"}
                                        value={userdetails.confirmPassword}
                                        className="addUserPasswordField"
                                        id="addUserPasswordFieldId"
                                        onChange={(event) => { changeDetails('confirmpassword', event.target.value) }}
                                    ></input>

                                </div>

                            </Grid>
                        </Grid>
                        <Grid container className="rowContainer">
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} >

                            </Grid>
                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} >

                            </Grid>
                        </Grid>
                        <Grid xs={12} style={{ marginTop: "15px" }}>
                            <label style={{ textAlign: "start", width: "100%" }} htmlFor="address">
                                Address<span className="required">*</span>
                            </label>

                            <textarea
                                value={userdetails.address}
                                onChange={(event) => { changeDetails('address', event.target.value) }}

                            ></textarea>
                        </Grid>
                        <Grid xs={12} className="editProfileBtn_Section" >
                            <div onClick={() => History(PATHS.MEMBERMYPROFILE)} id="editProfileCancleBtnId" className="pointDetails_Previous">
                                Cancel
                            </div>
                            <div onClick={() => {
                                onSaveClick();
                                if (document.preview != '') {
                                    edituserprofile()
                                }
                            }} id="editProfileSaveBtnId" className="pointDetails_Next">
                                Save
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

            </div>
        </Grid>
    );
}
export default MemberEditProfile;