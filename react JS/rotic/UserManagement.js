import * as React from "react";
import Grid from "@mui/material/Grid";
import { MdModeEdit, MdDelete } from "react-icons/md";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import "./PlatformAdmin.css";
import "../Style.css";
import { MdPersonAddAlt1 } from "react-icons/md";
import { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import InputField from "../../components/InputField";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import ReadOnlyField from "../../components/ReadOnlyField";
import NativeSelect from "@mui/material/NativeSelect";

function UserManagement() {
  const { t } = useTranslation();
  const operation = useOperation();
  const dispatch = useDispatch();
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [roleId, setRoleId] = useState("1");
  const [language, setLanguage] = useState("");
  const [editMail, setEditMail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editLang, setEditLang] = useState("");
  const [editUserId, setEditUserId] = useState("");
  const [delUserId, setDelUserId] = useState("");
  const [delFirstName, setDelFirstName] = useState("");
  const [delLastName, setDelLastName] = useState("");
  const getUserList = useSelector((state) => state.user.users);
  const [errorStatus, setErrorStatus] = useState([]);
  const [editErrorStatus, setEditErrorStatus] = useState([]);
  const [filter, setFilter] = useState([]);

  const clearErrorStatus = () => {
    setErrorStatus([]);
    clearData();
  };

  const handleClickAddUser = () => {
    setOpenAddUser(true);
  };

  //GET FOR EDIT USER
  const handleClickEditUser = (userId) => {
    setOpenEditUser(true);
    languageList();
    dispatch(operation.user.getUser(`/user/${userId}`))
      .then((res) => {
        setEditFirstName(res?.data?.data?.firstName),
          setEditLastName(res?.data?.data?.lastName),
          setEditMail(res?.data?.data?.emailAddress),
          setEditLang(res?.data?.data?.languageId),
          setEditUserId(res?.data?.data?.userId);
      })
      .catch(() => {});
  };

  //DELETE USER
  const handleClickOpenDel = (userId, firstName, lastName) => {
    setOpenDel(true);
    setDelUserId(userId);
    setDelFirstName(firstName);
    setDelLastName(lastName);
  };

  // CLEAR DATA FOR CREATE USER
  const clearData = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setRoleId("");
    setErrorStatus("");
    setLanguage("");
  };

  // USER LIST
  useEffect(() => {
    dispatch(operation.user.users());
  }, []);

  //SELECT LANGUAGE LIST
  const languageList = () => {
    dispatch(operation.user.languageAPI()).then(() => {
      setFilter([
        { id: 1, value: "日本語" },
        { id: 2, value: "English" },
      ]);
    });
  };

  // CREATE USER
  const onClickAddUser = () => {
    let ADD_USER_PAYLOAD = {
      emailAddress: email,
      firstName: firstName,
      languageId: language,
      lastName: lastName,
      roleId: 1,
    };
    dispatch(operation.user.addUser({ url: `/user`, data: ADD_USER_PAYLOAD }))
      .then((res) => {
        setOpenAddUser(false);
        toast.success(res?.data?.message);
        clearData();
        dispatch(operation.user.users());
      })
      .catch((e) => {
        setErrorStatus(e?.data);
      });
  };

  // EDIT PARTICULAR USER
  const editUserByPlatFormAdmin = (userId) => {
    const EDIT_USER_PAYLOAD = {
      emailAddress: editMail,
      firstName: editFirstName,
      lastName: editLastName,
      languageId: editLang,
      roleId: 1,
    };
    dispatch(
      operation.user.editUser({
        url: `/user/${userId}`,
        data: EDIT_USER_PAYLOAD,
      })
    )
      .then((res) => {
        toast.success(res?.data?.message);
        setOpenEditUser(false);
        dispatch(operation.user.users());
      })
      .catch((e) => {
        setEditErrorStatus(e?.data);
      });
  };

  //DELETE USER
  const onClickDeleteBtn = (userId) => {
    dispatch(operation.user.deleteUser(`/user/${userId}`))
      .then((res) => {
        toast.success(res?.data?.message);
        setOpenDel(false);
        dispatch(operation.user.users());
      })
      .catch((e) => {
        toast.error(e?.data);
        setOpenDel(false);
        dispatch(operation.user.users());
      });
  };

  return (
    <>
      <Header />
      <NavigationHeader />
      <div className="addUserButtonDiv" id="userManagementAddUserBtnId">
        <div
          className="addUserButton"
          onClick={() => {
            handleClickAddUser();
            languageList();
          }}
        >
          <MdPersonAddAlt1 style={{ margin: "5px" }} size={20} />
          <div className="btnText">{t("Add_User")}</div>
        </div>
      </div>
      <Dialog open={openAddUser}>
        <DialogTitle>{t("Add_User")}</DialogTitle>
        <div style={{ color: "red", textAlign: "center" }}>
          {errorStatus?.errorTitle}
        </div>
        <DialogContent>
          <Grid container>
            <Grid xs={12}>
              <InputField
                name={`${t("First_Name")} ${"*"}`}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                id="usermanagementFirstNameId"
              />
              <div style={{ color: "red" }}>{errorStatus?.firstName}</div>
            </Grid>
            <Grid xs={12}>
              <InputField
                name={`${t("Last_Name")} ${"*"}`}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                id="userManagementLastNameId"
              />
              <div style={{ color: "red" }}>{errorStatus?.lastName}</div>
            </Grid>
            <Grid xs={12}>
              <InputField
                name={`${t("Email_ID")} ${"*"}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id="userManagementEmailId"
              />
              <div style={{ color: "red" }}>{errorStatus?.emailAddress}</div>
            </Grid>
            <Grid xs={12}>
              <ReadOnlyField
                name={t("Role")}
                value={t("Platform_Admin")}
                id="addUserRoleId"
              />
              <div style={{ color: "red" }}>{errorStatus?.role}</div>
            </Grid>
            <Grid xs={12}>
              <div>
                <FormControl
                  variant="standard"
                  style={{ width: "98%", marginTop: "20px" }}
                >
                  <InputLabel id="userManagementLanguageId">{`${t(
                    "Language"
                  )} ${"*"}`}</InputLabel>
                  <NativeSelect
                    InputLabelProps={{ shrink: true }}
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                    }}
                    id="addUserLanguagesSelectId"
                  >
                    <option diabled selected hidden>
                      {t("---select---")}
                    </option>
                    {filter.map((ele, index) => (
                      <option
                        key={index}
                        value={ele?.id}
                        id={`addUserLanguage${index}`}
                      >
                        {ele?.value}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              </div>
              <div style={{ color: "red" }}>{errorStatus?.language}</div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              color="error"
              style={{ color: "red" }}
              id="userManagementAddUserCancelBtnId"
              onClick={() => {
                setOpenAddUser(false);
                clearErrorStatus();
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              id="userManagementAddUserAddBtnId"
              onClick={() => {
                onClickAddUser();
              }}
            >
              {t("Create")}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Grid className="TableGridWithOutPagination">
        <table>
          <thead>
            <tr>
              <th>{t("First_Name")}</th>
              <th>{t("Last_Name")}</th>
              <th>{t("Email_ID")}</th>
              <th>{t("Role")}</th>
              <th>{t("Status")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          {getUserList?.data?.length == 0 || getUserList?.data == null ? (
            <tbody>
              <tr>
                <td
                  style={{ height: "35px" }}
                  data-column={t("First_Name")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Last_Name")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Email_ID")}
                ></td>
                <td
                  colSpan={7}
                  style={{
                    borderLeft: "solid white 1px",
                    height: "35px",
                    color: "crimson",
                    fontSize: "18px",
                  }}
                  data-column={t("Role")}
                  className="NoDataInMobile"
                >
                  {t("No_data_found")}
                </td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Status")}
                  className="TableLastData"
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Action")}
                  className="NodataLast"
                ></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {getUserList?.data?.map(
                ({
                  emailAddress,
                  lastName,
                  firstName,
                  status,
                  roleId,
                  userId,
                }) => {
                  return (
                    <tr key={userId}>
                      <td data-column={t("First_Name")}>{firstName}</td>
                      <td data-column={t("Last_Name")}>{lastName}</td>
                      <td data-column={t("Email_ID")}>{emailAddress}</td>
                      <td data-column={t("Role")}>
                        {roleId == null ? "NA" : t("Platform_Admin")}
                      </td>
                      <td data-column={t("Status")}>
                        {status == "ACTIVE"
                          ? t("Active")
                          : t("Pending Activation")}
                      </td>
                      <td data-column={t("Action")}>
                        <Tooltip title={t("Edit_User")}>
                          <MdModeEdit
                            size={24}
                            id="userManagementEditIconId"
                            onClick={() => handleClickEditUser(userId)}
                            className="tableActionIcon"
                          />
                        </Tooltip>
                        {getUserList?.data?.length === 1 ? null : (
                          <Tooltip title={t("Delete_User")}>
                            <MdDelete
                              size={24}
                              id="userManagementDeleteIcon"
                              onClick={() =>
                                handleClickOpenDel(userId, firstName, lastName)
                              }
                              className="tableActionIcon"
                            />
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          )}
        </table>
        {/* EDIT DIALOG */}
        <Dialog open={openEditUser}>
          <DialogTitle>{t("Edit_User")}</DialogTitle>
          <div style={{ color: "red", textAlign: "center" }}>
            {editErrorStatus?.errorTitle}
          </div>
          <DialogContent>
            <Grid container>
              <Grid xs={12}>
                <InputField
                  name={`${t("First_Name")} ${"*"}`}
                  id="usermanagementFirstNameId"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
                <div style={{ color: "red" }}>{editErrorStatus?.firstName}</div>
              </Grid>
              <Grid xs={12}>
                <InputField
                  name={`${t("Last_Name")} ${"*"}`}
                  id="userManagementLastNameId"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
                <div style={{ color: "red" }}>{editErrorStatus?.lastName}</div>
              </Grid>
              <Grid xs={12}>
                <ReadOnlyField
                  name={t("Email_ID")}
                  id="userManagementEmailId"
                  value={editMail}
                  onChange={(e) => setEditMail(e.target.value)}
                />
                <div style={{ color: "red" }}>
                  {editErrorStatus?.emailAddress}
                </div>
              </Grid>
              <Grid xs={12}>
                {/* <div >
                  <FormControl variant="standard" style={{ width: "98%", marginTop: "20px" }} >
                    <InputLabel id="userManagementEditUserRo" >{t("Role_1")}</InputLabel>
                    <Select
                      id="adduserRoleSelectId"
                      value={1}
                      onChange={e => setEditRole(e.target.value)}
                    >
                      <MenuItem value="1" id="userManagementAddUserOrgAdminId">Platform Admin</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div style={{ color: "red" }}>{editErrorStatus?.role}</div> */}
                <ReadOnlyField
                  name={t("Role")}
                  value={t("Platform_Admin")}
                  id="platformAdminEditUserRoleId"
                />
              </Grid>
              <Grid xs={12}>
                <div>
                  <FormControl
                    variant="standard"
                    style={{ width: "98%", marginTop: "20px" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">{`${t(
                      "Language"
                    )} ${"*"}`}</InputLabel>
                    <NativeSelect
                      InputLabelProps={{ shrink: true }}
                      id="editUserLanguagesSelectId"
                      value={editLang}
                      onChange={(e) => setEditLang(e.target.value)}
                    >
                      {filter.map((ele, index) => (
                        <option
                          key={index}
                          value={ele?.id}
                          id={`editUserLanguage${index}`}
                        >
                          {ele?.value}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </div>
                <div style={{ color: "red" }}>{editErrorStatus?.language}</div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <div>
              <Button
                id="userManagementEditUserCancelBtnId"
                style={{ color: "red" }}
                onClick={() => {
                  setOpenEditUser(false);
                  setEditErrorStatus("");
                }}
                color="error"
              >
                {t("Cancel")}
              </Button>
              <Button
                id="userManagementEditUserSaveBtnId"
                onClick={() => {
                  editUserByPlatFormAdmin(editUserId);
                  setEditErrorStatus("");
                }}
              >
                {t("Save")}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
        {/* DELETE USER DIALOG BOX */}
        <Dialog
          open={openDel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("Are_you_sure_you_want_to_delete_this")}{" "}
              <strong>
                {delFirstName} {delLastName}
              </strong>
              ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              id="deleteUserCancelBtnId"
              onClick={() => setOpenDel(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => onClickDeleteBtn(delUserId)}
              style={{ color: "red" }}
              color="error"
              id="deleteUserDeleteBtnId"
            >
              {t("Delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Footer />
    </>
  );
}

export default UserManagement;
