import React, { useState } from "react";
import { BsFillGeoAltFill } from "react-icons/bs";
import { MdCall, MdEmail } from "react-icons/md";
import Navbar from "./Navbar";
import { Grid } from "@mui/material";
import "./Myprofile.css";
import { RiFileEditFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes";
import { actions as Useractions } from "../store/module/Usermodule";
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from "./ProfileHeader";
import { useEffect, } from 'react';
import { MdFamilyRestroom, MdDelete } from 'react-icons/md';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { actions as Familymemberactions } from "../store/module/Familymembermodule";
import { httpService } from '../api/Request/service'
import moment from "moment";
import { toast } from "react-hot-toast";
import { editfamilyMember } from "../api/Api";
import StaticContent from "./StatisContent";

const MyProfile = () => {
  const History = useNavigate();
  const dispatch = useDispatch();
  const [openDel, setOpenDel] = React.useState(false);
  const [openEditfamily, setopenEditfamily] = React.useState(false);
  const UserState = useSelector(state => state.user);
  const FamilymemberState = useSelector((state) => state.familymember);
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  const [open, setOpen] = useState(false);
  const [familyMemberName, setfamilyMemberName] = useState("");
  const [DateofBirth, setDateofBirth] = useState("");
  const [gender, setgender] = useState("");
  const [relationship, setrelationship] = useState("");
  const [familyMemberId, setfamilyMemberId] = useState([]);
  const [editFamilyMember, seteditFamilyMember] = useState("");
  const [postErrorStatus, setPostErrorStatus] = useState([]);
  const [putErrorStatus, setPutErrorStatus] = useState([]);
  const [document, setdocument] = useState({ preview: "", raw: "" });
  const handleCapture = ({ target }) => {
    var idxDot = target.files[0].name.lastIndexOf(".") + 1;
    var extFile = target.files[0].name.substr(idxDot, target.files[0].name.length).toLowerCase();
    console.log('image ext', extFile);

    setdocument({
      preview: URL.createObjectURL(target.files[0]),
      raw: target.files[0]
    });
  };
  useEffect(() => {
    const VIEWUSER_PAYLOAD = {
      END_POINT1: 'users',
      END_POINT2: userData.userId,
    }
    dispatch(Useractions.user(VIEWUSER_PAYLOAD))
  }, [])
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenAddExp = (id) => {
    setfamilyMemberId(id)
    setOpen(true);
  };
  const handleClickOpenDel = (id) => {
    setfamilyMemberId(id)
    setOpenDel(true);
  };
  const handleCloseDel = () => {
    setOpenDel(false);
  };

  const handleClickEditfamilymemberOpen = (id) => {
    setfamilyMemberId(id)

    httpService({ url: `/user/${userData.userId}/family/${id}`, method: "GET" })
      .then((res) => {
        let dataValue = res?.data?.data?.data;
        setopenEditfamily(true);
        seteditFamilyMember({
          familyMemberName: dataValue?.familyMemberName,
          dateOfBirth: dataValue?.dateOfBirth,
          gender: dataValue?.gender,
          relationship: dataValue?.relationship,
          docUrl: dataValue?.docUrl

        });
        console.log("dataValue", dataValue)
      })
      .catch(e => {
        console.log("-->", e)
      })
  }


  const handleCloseEditfamilymember = () => {
    setopenEditfamily(false);
  };

  useEffect(() => {

    const FAMILY_MEMBER_PAYLOAD = {
      END_POINT1: 'user',
      END_POINT2: userData.userId,
      END_POINT3: 'family',
    }
    console.log("FamilymemberState----", FamilymemberState.family_members_list?.data)
    dispatch(Familymemberactions.fetchfamilyMembers(FAMILY_MEMBER_PAYLOAD))
  }, []);


  let formData = new FormData();

  const onClickAddFamilyMember = async () => {
    setPostErrorStatus([]);
    if (document.preview != "") {
      formData.append('document', document.raw, document.raw.name)

    }

    httpService({ url: `/user/${userData.userId}/family`, data: formData, params: { "familyMemberName": familyMemberName, "dateOfBirth": DateofBirth, "gender": gender, "relationship": relationship }, method: "POST" })
      .then(res => {
        console.log(res);
        setOpen(false);

        const FAMILY_MEMBER_PAYLOAD = {
          END_POINT1: 'user',
          END_POINT2: userData.userId,
          END_POINT3: 'family',
        }
        dispatch(Familymemberactions.fetchfamilyMembers(FAMILY_MEMBER_PAYLOAD));
        notify()
        clearData();
      })
      .catch(e => {
        setPostErrorStatus([...e?.error?.response?.data?.data]);
      })
  }

  const onSaveEditUser = (id) => {
    setPutErrorStatus([]);
    setfamilyMemberId(id)
    if (document.preview != "") {
      formData.append('document', document.raw, document.raw.name)

    }
    const Edit_payload = {
      END_POINT1: 'user',
      END_POINT2: userData.userId,
      END_POINT3: "family",
      END_POINT4: familyMemberId,
      PAYLOAD_DATA: formData,
      Query: {
        "familyMemberName": editFamilyMember.familyMemberName,
        "dateOfBirth": editFamilyMember.dateOfBirth,
        "gender": editFamilyMember.gender,
        "relationship": editFamilyMember.relationship,
      }
    }

    editfamilyMember(Edit_payload)
      .then(res => {
        notify()
        clearData();
        setopenEditfamily(false);
        console.log("res", res);
        const FAMILY_MEMBER_PAYLOAD = {
          END_POINT1: 'user',
          END_POINT2: userData.userId,
          END_POINT3: 'family',
        }
        console.log("FamilymemberState----", FamilymemberState.family_members_list?.data)
        dispatch(Familymemberactions.fetchfamilyMembers(FAMILY_MEMBER_PAYLOAD))
      })
      .catch(e => {
        setPutErrorStatus([...e?.error?.response?.data?.data]);
      });

  }
  const clearData = () => {
    setPutErrorStatus([]);
    setPostErrorStatus([]);
  }
  const onClickDeleteFamilymember = () => {
    httpService({ url: `/user/${userData.userId}/family/${familyMemberId}`, method: "DELETE" })
      .then((res) => {
        console.log(res);
        setOpenDel(false);
        const FAMILY_MEMBER_PAYLOAD = {
          END_POINT1: 'user',
          END_POINT2: userData.userId,
          END_POINT3: 'family',
        }
        dispatch(Familymemberactions.fetchfamilyMembers(FAMILY_MEMBER_PAYLOAD))
        deletenotify()
      })
      .catch(e => {
        console.log("Visitor_Payload", e, e?.error?.response?.data?.data)
      })
  }



  const notify = () => toast.success(("Successfully added the family details"), {
    duration: 4000,
    position: "top-center"
  });
  const deletenotify = () => toast.success(("Successfully delted the family member"), {
    duration: 4000,
    position: "top-center"
  });
  return (
    <Grid>
      <ProfileHeader />
      <Navbar />
      <div className="Myprofile_container" style={{marginTop:"35px"}}>
        <Grid className="MyProfile_profile_container">
          <Grid className="MyProfile_profile_Sub_container">
            <Grid className="MyProfile_CoverImage">
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "end",
                  margin: "10px",
                }}
              
              >
                <span style={{ float: "left" }}>
                  <Grid className="MyProfile_CoverImage_Edit">
                    <RiFileEditFill
                      id="myProfileEditProfileBtnId"
                      onClick={() => History(PATHS.EDITPROFILE, { state: { userid: userData.userId, username: userData.firstName } })}
                      className="MyProfile_CoverImage_CameraIcon"
                    />
                  </Grid>
                </span>
              </div>
              <span>
                <label htmlFor="edit_file">
                  <Grid className="MyProfile_Cover_Profile">
                    <Grid className="MyProfile_ProfileImage">
                      {UserState?.viweUser?.data?.docUrl &&
                        <img
                          src={StaticContent.imageUrl + UserState?.viweUser?.data?.docUrl}
                          className="MyProfile_ProfileImage MyProfile_ProfileImage_image"
                        />
                      }
                    </Grid>
                  </Grid>
                </label>
              </span>
            </Grid>
            <Grid className="MyProfile_Profile">
              <text className="MyProfile_ProfileText">
                {UserState.viweUser?.data.firstName + " " + UserState.viweUser?.data.lastName}
              </text>
              <h3>Contact Details</h3>
              <div className="MyProfile_Profile_Icon MyProfile_Profile">
                <i>
                  <MdEmail size={20} />
                </i>{" "}
                <span className="MyProfile_Profile MyProfile_Profile_ProfileText">
                  {UserState.viweUser?.data.emailAddress}
                </span>
              </div>
              <div className="MyProfile_Profile_Icon MyProfile_Profile">
                <i>
                  {" "}
                  <MdCall size={20} />
                </i>{" "}
                <span className="MyProfile_Profile MyProfile_Profile_ProfileText">
                  {UserState.viweUser?.data.mobileNumber}
                </span>
              </div>
              <div className="MyProfile_Profile_Icon MyProfile_Profile">
                <BsFillGeoAltFill size={20} />{" "}
                <span className="MyProfile_Profile MyProfile_Profile_ProfileText">
                  {UserState.viweUser?.data.address}
                </span>
              </div>
            </Grid>
          </Grid>
          <Grid className="">
            <div className="Family_Member_Section wrap w-100">
              <Grid container style={{ marginBottom: "20px" }}>
                <Grid xs={6} sm={6} md={3} lg={3} textAlign="start">
                  <h3>Family Members</h3>
                </Grid>
                <Grid xs={6} sm={6} md={6.5} lg={6.5} style={{ display: "flex", justifyContent: "flex-end", alignContent: "center", alignItems: "center" }}>
                  <div onClick={() => { handleClickOpenAddExp(familyMemberId) }} className="familyBtnDiv" id="profileAddFamilyMemberId">
                    <MdFamilyRestroom size="20" style={{ padding: "5px" }} /> <div className="addUserText">Add Family Member</div>
                  </div>
                </Grid>
              </Grid>
              {FamilymemberState?.family_members_list?.data?.map(({ familyMemberId, familyMemberName, gender, relationship, dateOfBirth, docUrl }) => {
                return (
                  <div key={familyMemberId} className="Family_Member_Section--item">
                    <div id="Profile_icons">
                      <MdDelete onClick={() => handleClickOpenDel(familyMemberId)} className="IconRight delete_icon" />
                      <RiFileEditFill onClick={() => handleClickEditfamilymemberOpen(familyMemberId)} color={"#4b4b4b"} size={25} className="IconLeft " />
                    </div>
                    <div className="Profile_Details">
                      <div id="Family_Members_Img">
                        <img className="Family_Members_Img"
                          src={StaticContent.imageUrl + docUrl}
                          alt="" />
                      </div>
                      <div className="mb"> <label>{familyMemberName}</label></div>
                      <div className="mb"> <label style={{ color: "green" }}>({relationship})</label></div>
                      <div className="mb"> <label>Gender : <span>{gender == "M" ? "Male" : "Female"}</span></label></div>
                      <div className="mb"> <label>Date of Birth : <span>{moment(dateOfBirth).format("DD-MM-YYYY")}</span></label></div>
                    </div>
                  </div>
                )
              })}

            </div>

            <Dialog open={open} >
              <DialogTitle>Add Family Member</DialogTitle>
              <DialogContent>
                <Grid container>
                  <Grid xs={12}>
                    <ul>
                      {postErrorStatus.map((ele) => (
                        <li key={ele} style={{ color: "red", paddingTop: "15px" }}>
                          {'\u2022'}{'  '}{ele}
                        </li>
                      ))}
                    </ul>
                  </Grid>
                  <Grid xs={12}>
                    <label htmlFor="firstname">
                      Family Member Name<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="addUserInputField"
                      id="addFamilyMemberFirstNameId"
                      name="firstname"
                      onChange={(event) => { setfamilyMemberName(event.target.value) }}
                    /> </Grid>
                  <Grid xs={12}>
                    <div className="customSelect bookingType">
                      <label htmlFor="expenseof">Gender</label><span className="required">*</span>
                      <select
                        onChange={(event) => setgender(event.target.value)}
                      >
                        <option value="" diabled selected hidden id="expenseofSelectId">---Select---</option>
                        <option value="M" id="addFamilyMemberMaleId">Male</option>
                        <option value="F" id="addFamilyMemberFemaleId">Female</option>
                      </select>
                    </div>
                  </Grid>
                  <Grid xs={12}>

                    <label htmlFor="dateofbirth">
                      Date Of Birth<span className="required">*</span>
                    </label>
                    <input type="date"
                      name="dateofbirth" id="adddateofbirth"
                      onChange={(event) => { setDateofBirth(moment(event.target.value).format('YYYY-MM-DD')) }}
                      className="dialogueformdatepicker"
                    />
                  </Grid>
                  <Grid container className="rowContainer">
                    <Grid xs={12} style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
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
                  <Grid xs={12}>
                    <label htmlFor="role">Relationship With Member<span className="required">*</span></label>
                    <select
                      onChange={(event) => { setrelationship(event.target.value) }}

                    >
                      <option value="" diabled selected hidden id="addFamilyMemberSelectId">---Select---</option>
                      <option value="Father" id="addFamilyMemberFatherId">Father</option>
                      <option value="Mother" id="addFamilyMemberMotherId">Mother</option>
                      <option value="Parent" id="addFamilyMemberParentId">Parent</option>
                      <option value="Son" id="addFamilyMemberSonId">Son</option>
                      <option value="Daughter" id="addFamilyMemberDaughterId">Daughter</option>
                      <option value="Child" id="addFamilyMemberFChildId">Child</option>
                      <option value="Husband" id="addFamilyMemberHusbandId">Husband</option>
                      <option value="Wife" id="addFamilyMemberWifeId">Wife</option>
                      <option value="Brother" id="addFamilyMemberBrotherId">Brother</option>
                      <option value="Sister" id="addFamilyMemberSisterId">Sister</option>
                      <option value="Sibling" id="addFamilyMemberSiblingId">Sibling</option>
                      <option value="Grandfather" id="addFamilyMemberGrandfatherId">Grandfather</option>
                      <option value="Grandmother" id="addFamilyMemberGrandMotherId">Grandmother</option>
                      <option value="Grandparents" id="addFamilyMemberGrandParentsId">Grandparents</option>
                      <option value="Grandson" id="addFamilyMemberGrandSonId">Grandson</option>
                      <option value="Granddaughter" id="addFamilyMemberGrandDaughterId">Granddaughter</option>
                      <option value="Grandchild" id="addFamilyMemberGrandChildId">Grandchild</option>
                      <option value="Uncle" id="addFamilyMemberUncleId">Uncle</option>
                      <option value="Aunt" id="addFamilyMemberAuntId">Aunt</option>
                      <option value="Parent's sibling" id="addFamilyMemberParentSiblingId">Parent's sibling</option>
                      <option value="Nephew" id="addFamilyMemberNephewId">Nephew</option>
                      <option value="Niece" id="addFamilyMemberNieceId">Niece</option>
                      <option value="Sibling's child" id="addFamilyMemberSiblingChildId">Sibling's child</option>
                      <option value="Cousin" id="addFamilyMemberCousinId">Cousin</option>
                      <option value="Aunt's/Uncle's child" id="addFamilyMemberAuntChildId">Aunt's/Uncle's child</option>
                    </select>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleClose(); clearData() }}
                >Cancel</Button>
                <Button
                  variant="contained" onClick={() => { onClickAddFamilyMember() }} color="success">Add</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openEditfamily} >
              <DialogTitle>Edit Family Member</DialogTitle>
              <DialogContent>
                <Grid container>
                  <Grid xs={12}>
                    <ul>
                      {putErrorStatus.map((ele) => (
                        <li key={ele} style={{ color: "red", paddingTop: "15px" }}>
                          {'\u2022'}{'  '}{ele}
                        </li>
                      ))}
                    </ul>
                  </Grid>
                  <Grid xs={12}>
                    <label htmlFor="firstname">
                      Family Member Name<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="addUserInputField"
                      id="editFamilyMemberFirstNameId"
                      name="firstname"
                      value={editFamilyMember?.familyMemberName}
                      onChange={(event) => {
                        seteditFamilyMember({
                          ...editFamilyMember,
                          familyMemberName: event.target.value
                        })
                      }}
                    /> </Grid>
                  <Grid xs={12}>
                    <div className="customSelect bookingType">
                      <label htmlFor="expenseof">Gender</label><span className="required">*</span>
                      <select
                        value={editFamilyMember?.gender}
                        onChange={(event) => {
                          seteditFamilyMember({
                            ...editFamilyMember,
                            gender: event.target.value
                          })
                        }}
                      >
                        <option value="" diabled selected hidden id="expenseofSelectId">---Select---</option>
                        <option value="M" id="editFamilyMemberMaleId">Male</option>
                        <option value="F" id="">Female</option>
                      </select>
                    </div>
                  </Grid>
                  <Grid xs={12}>

                    <label htmlFor="dateofbirth">
                      Date Of Birth<span className="required">*</span>
                    </label>
                    <input type="date"
                      value={editFamilyMember?.dateOfBirth}
                      onChange={(event) => {
                        seteditFamilyMember({
                          ...editFamilyMember,
                          dateOfBirth: event.target.value
                        })
                      }}
                      name="dateofbirth" id="editdateofbirth" className="dialogueformdatepicker"
                    />
                  </Grid>
                  <Grid container className="rowContainer">
                    <Grid xs={12} style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
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
                  <Grid xs={12}>
                    <label htmlFor="role">Relationship With Member<span className="required">*</span></label>
                    <select
                      value={editFamilyMember?.relationship}
                      onChange={(event) => {
                        seteditFamilyMember({
                          ...editFamilyMember,
                          relationship: event.target.value
                        })
                      }}

                    >
                      <option value="" diabled selected hidden id="editFamilyMemberSelectId">---Select---</option>
                      <option value="Father" id="editFamilyMemberFatherId">Father</option>
                      <option value="Mother" id="editFamilyMemberMotherId">Mother</option>
                      <option value="Parent" id="editFamilyMemberParentId">Parent</option>
                      <option value="Son" id="editFamilyMemberSonId">Son</option>
                      <option value="Daughter" id="editFamilyMemberDaughterId">Daughter</option>
                      <option value="Child" id="editFamilyMemberFChildId">Child</option>
                      <option value="Husband" id="editFamilyMemberHusbandId">Husband</option>
                      <option value="Wife" id="editFamilyMemberWifeId">Wife</option>
                      <option value="Brother" id="editFamilyMemberBrotherId">Brother</option>
                      <option value="Sister" id="editFamilyMemberSisterId">Sister</option>
                      <option value="Sibling" id="editFamilyMemberSiblingId">Sibling</option>
                      <option value="Grandfather" id="editFamilyMemberGrandfatherId">Grandfather</option>
                      <option value="Grandmother" id="editFamilyMemberGrandMotherId">Grandmother</option>
                      <option value="Grandparents" id="editFamilyMemberGrandParentsId">Grandparents</option>
                      <option value="Grandson" id="editFamilyMemberGrandSonId">Grandson</option>
                      <option value="Granddaughter" id="editFamilyMemberGrandDaughterId">Granddaughter</option>
                      <option value="Grandchild" id="editFamilyMemberGrandChildId">Grandchild</option>
                      <option value="Uncle" id="editFamilyMemberUncleId">Uncle</option>
                      <option value="Aunt" id="editFamilyMemberAuntId">Aunt</option>
                      <option value="Parent's sibling" id="editFamilyMemberParentSiblingId">Parent's sibling</option>
                      <option value="Nephew" id="editFamilyMemberNephewId">Nephew</option>
                      <option value="Niece" id="editFamilyMemberNieceId">Niece</option>
                      <option value="Sibling's child" id="editFamilyMemberSiblingChildId">Sibling's child</option>
                      <option value="Cousin" id="editFamilyMemberCousinId">Cousin</option>
                      <option value="Aunt's/Uncle's child" id="editFamilyMemberAuntChildId">Aunt's/Uncle's child</option>
                    </select>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleCloseEditfamilymember(); clearData() }}
                >Cancel</Button>
                <Button
                  variant="contained" color="success" onClick={() => { onSaveEditUser() }}>Add</Button>
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
                  Are you sure you want to delete?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button id="deleteFamilyMemberNoBtnId" onClick={() => handleCloseDel()}>No</Button>
                <Button id="deleteFamilyMemberYesBtnId" onClick={() => onClickDeleteFamilymember(FamilymemberState?.family_members_list?.data?.familyMemberId)} variant="contained" color="warning">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};
export default MyProfile;
