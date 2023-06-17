import * as React from "react";
import Grid from "@mui/material/Grid";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ProjectManagerNavigationHeader from "../../components/ProjectManagerNavigationHeader";
import "../platformadmin/PlatformAdmin.css";
import "../orgadmin/OrgAdmin.css";
import "../Style.css";
import { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import DateField from "../../components/DateField";
import { PATHS } from "../../routes/index";
import { useNavigate } from "react-router-dom";
import TextArea from "../../components/TextArea";
import Typography from "@mui/material/Typography";
import CustomNumberField from "../../components/CustomNumberField";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MdOutlineNavigateNext } from "react-icons/md";
import Link from "@mui/material/Link";
import { Tooltip } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import moment from "moment";
import toast from "react-hot-toast";
import ReadOnlyField from "../../components/ReadOnlyField";
import { MdRemoveRedEye } from "react-icons/md";
import NativeSelect from "@mui/material/NativeSelect";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";

function PMExpenseManagement() {
  const History = useNavigate();
  const { t } = useTranslation();
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState("");
  const [type, setType] = useState({});
  const [transactionDate, setTransactionDate] = useState(
    moment(new Date().toLocaleDateString("en-US")).format("YYYY-MM-DD")
  );
  const [projectPhase, setProjectPhase] = useState(" ");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [cost, setCost] = useState("");
  const [vendorName, setVendorName] = useState(" ");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [addExpStatus, setAddExpStatus] = useState(" ")
  const [delExpCategory, setDelExpCategory] = useState("");
  const [editTransactionDate, setEditTransactionDate] = useState("");
  const [editExpCat, setEditExpCat] = useState("");
  const [editExpAmt, setEditExpAmt] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  // const [editStatus, setEditStatus] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editExpId, setEditExpId] = useState("");
  const [editVendorId, setEditVendorId] = useState("");
  const [editPhaseId, setEditPhaseId] = useState("");
  const [editErrorStatus, setEditErrorStatus] = useState("");
  const [addErrorStatus, setAddErrorStatus] = useState("");
  const [editStoreCode, setEditStoreCode] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const operation = useOperation();
  const dispatch = useDispatch();
  const ProjectId = sessionStorage.getItem("ProjectId");
  const ProjectName = sessionStorage.getItem("ProjectName");
  const VendorList = useSelector((state) => state.orgadmin.vendorList?.data);
  const expenseList = useSelector(
    (state) => state.orgadmin.getExpenseManagement
  );
  const [viewVendorName, setViewVendorName] = useState("");
  const [viewVendorCode, setViewVendorCode] = useState("");
  const [viewPhaseName, setViewPhaseName] = useState("");
  const PROJECT_STATUS = sessionStorage.getItem("PROJECT STATUS");
  console.log("STATUS", PROJECT_STATUS);
  const handleClickAddEditUser = (
    type,
    tDate,
    expCat,
    cost,
    startDate,
    endDate,
    description,
    expId,
    vendorId,
    vendorName,
    code,
    projectPhaseId,
    phaseName
  ) => {
    setOpenAddUser(true);
    setType(type);
    setEditTransactionDate(tDate);
    setEditExpCat(expCat);
    setEditExpAmt(cost);
    setEditStartDate(startDate);
    setEditEndDate(endDate);
    setEditDesc(description);
    setEditExpId(expId);
    setEditVendorId(vendorId);
    setViewVendorName(vendorName);
    setViewVendorCode(code);
    setEditPhaseId(projectPhaseId);
    setViewPhaseName(phaseName);
    dispatch(operation.orgAdmin.vendorList(`/org/${UserData?.orgId}/vendor`));
    dispatch(
      operation.orgAdmin.getProjectPhase(
        `/org/${UserData?.orgId}/project/${ProjectId}/phases`
      )
    );

    if (type === "EDIT") {
      setEditStoreCode(code);
    }
    console.log("VENDOR CODE", code);
  };
  const handleClickOpenDel = (expenseId, category) => {
    setOpenDel(true);
    setDeleteExpenseId(expenseId);
    setDelExpCategory(category);
  };

  //SESSION STORAGE GET USER DATA
  const UserData = JSON.parse(sessionStorage.getItem("UserData"));
  const PROJECT_PHASE = useSelector((state) => state.orgadmin.getProjectPhase);
  //GET EXPENSE LIST
  React.useEffect(() => {
    dispatch(
      operation.orgAdmin.getExpenseList({
        url: `/org/${UserData?.orgId}/project/${ProjectId}/expense`,
      })
    );
  }, []);

  const onClickDeleteBtn = () => {
    dispatch(
      operation.orgAdmin.deleteExpense(
        `/org/${UserData?.orgId}/project/${ProjectId}/expense/${deleteExpenseId}`
      )
    ).then((res) => {
      setOpenDel(false);
      toast.success(res?.data?.message);
      //AFTER DELETE TABLE

      dispatch(
        operation.orgAdmin.getExpenseList({
          url: `/org/${UserData?.orgId}/project/${ProjectId}/expense`,
        })
      );
    });
  };
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      onClick={() => {
        History(PATHS.PMPROJECTMANAGEMENT);
      }}
    >
      {t("Project_Management")}
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      onClick={() => {
        History(PATHS.PMCOSTMANAGEMENT);
      }}
    >
      {t("Cost_Management")}
    </Link>,
    <Typography key="2" color="text.primary">
      {t("Expense_Management")}
    </Typography>,
  ];

  //POST EXPENSE
  const postExpense = () => {
    let POST_EXPENSE_PAYLOAD = {
      cost: cost,
      currency: "JPY",
      description: description,
      endDate: endDate,
      expenseCategory: expenseCategory,
      expenseTransactionDate: transactionDate,
      projectPhaseId: projectPhase,
      startDate: startDate,
      status: "ACTIVE",
      vendorId: vendorName,
    };
    dispatch(
      operation.orgAdmin.postExpense({
        url: `/org/${UserData?.orgId}/project/${ProjectId}/expense`,
        data: POST_EXPENSE_PAYLOAD,
      })
    )
      .then((res) => {
        setOpenAddUser(false);
        toast.success(res?.data?.message);
        clearData();
        //AFTER ADD TABLE

        dispatch(
          operation.orgAdmin.getExpenseList({
            url: `/org/${UserData?.orgId}/project/${ProjectId}/expense`,
          })
        ).then(() => {
          setAddErrorStatus("");
        });
      })
      .catch((e) => setAddErrorStatus(e?.data));
  };

  const clearData = () => {
    setTransactionDate(
      moment(new Date().toLocaleDateString("en-US")).format("YYYY-MM-DD")
    );
    setProjectPhase("");
    setExpenseCategory("");
    setCost("");
    setEndDate("");
    setVendorName("");
    setStartDate("");
    setDescription("");
  };

  //EDIT EXPENSE
  const editExpense = (editExpId) => {
    let EDIT_EXPENSE_PAYLOAD = {
      cost: editExpAmt,
      currency: "JPY",
      description: editDesc,
      endDate: editEndDate,
      expenseCategory: editExpCat,
      expenseTransactionDate: editTransactionDate,
      projectPhaseId: editPhaseId,
      startDate: editStartDate,
      vendorId: editVendorId,
    };
    dispatch(
      operation.orgAdmin.editExpense({
        url: `/org/${UserData?.orgId}/project/${ProjectId}/expense/${editExpId}`,
        data: EDIT_EXPENSE_PAYLOAD,
      })
    )
      .then((res) => {
        toast.success(res?.data?.message), setEditErrorStatus("");
        setOpenAddUser(false);
        dispatch(
          operation.orgAdmin.getExpenseList({
            url: `/org/${UserData?.orgId}/project/${ProjectId}/expense`,
          })
        );
      })
      .catch((e) => {
        setEditErrorStatus(e?.data);
      });
  };

  return (
    <>
      <Header />
      <ProjectManagerNavigationHeader />

      <div className="breadCrumbDiv">
        <Stack spacing={2}>
          <Breadcrumbs
            separator={<MdOutlineNavigateNext fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </div>

      <div className="tableHeaderActionContainer">
        <div className="tableHeaderActionDiv">
          {PROJECT_STATUS != "CANCELLED" ? (
            <div
              className="addOrgButton"
              id="PMExpenseManagementAddExpenseBtnId"
              onClick={() => handleClickAddEditUser("ADD")}
            >
              <GiExpense style={{ margin: "5px" }} size={20} />
              <div className="btnText">{t("Add_Expense")}</div>
            </div>
          ) : null}
        </div>
      </div>
      <Dialog open={openAddUser}>
        <DialogTitle>
          {type === "ADD"
            ? t("Add_Expense")
            : type === "EDIT"
            ? t("Edit_Expense")
            : t("View_Expense")}{" "}
          <strong> {ProjectName} </strong>
        </DialogTitle>

        <DialogContent>
          <Grid container>
            <Grid container>
              {type == "ADD" ? (
                <div
                  style={{
                    color: "red",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {addErrorStatus?.errorTitle}
                </div>
              ) : null}
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                {type === "VIEW" ? (
                  <ReadOnlyField
                    name={t("Transaction_Date")}
                    id="viewExpTrnsDateId"
                    value={editTransactionDate?.split("T")[0]}
                  />
                ) : (
                  <DateField
                    name={t("Transaction_Date")}
                    id="orgExpTransactionDate"
                    value={
                      type === "ADD"
                        ? transactionDate
                        : editTransactionDate?.split("T")[0]
                    }
                    onChange={
                      type === "ADD"
                        ? (e) => setTransactionDate(e.target.value)
                        : (e) => setEditTransactionDate(e.target.value)
                    }
                  />
                )}
                {type === "EDIT" ? (
                  <div style={{ color: "red" }}>
                    {editErrorStatus?.expenseTransactionDate}
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    {addErrorStatus?.expenseTransactionDate}
                  </div>
                )}
              </Grid>
              <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                <div>
                  {type === "VIEW" ? (
                    <ReadOnlyField
                      name={t("Project_Phase")}
                      value={viewPhaseName}
                    />
                  ) : (
                    <FormControl
                      variant="standard"
                      style={{ width: "98%", marginTop: "20px" }}
                    >
                      <InputLabel>{t("Project_Phase")} *</InputLabel>
                      <NativeSelect
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={
                          type === "ADD"
                            ? (e) => setProjectPhase(e.target.value)
                            : (e) => setEditPhaseId(e.target.value)
                        }
                        id="orgProjectSelectProjectPhaseId"
                        value={type === "ADD" ? projectPhase : editPhaseId}
                      >
                        <option diabled selected hidden>
                          {t("---select---")}
                        </option>
                        {PROJECT_PHASE?.data.map((item) => {
                          return (
                            <option
                              key={item?.projectPhaseId}
                              value={item?.projectPhaseId}
                              id="orgProjectPhase1"
                            >
                              {item?.phaseName}
                            </option>
                          );
                        })}
                      </NativeSelect>
                    </FormControl>
                  )}
                </div>
                {type === "EDIT" ? (
                  <div style={{ color: "red" }}>
                    {editErrorStatus?.projectPhaseId}
                  </div>
                ) : type === "VIEW" ? null : (
                  <div style={{ color: "red" }}>
                    {addErrorStatus?.projectPhaseId}
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                {type === "VIEW" ? (
                  <ReadOnlyField
                    name={t("Expense_Category")}
                    id="viewExpExpCatId"
                    value={
                      editExpCat == "Purchase"
                        ? t("Purchase")
                        : t("Outsourcing")
                    }
                  />
                ) : (
                  <FormControl
                    variant="standard"
                    style={{ width: "98%", marginTop: "20px" }}
                  >
                    <InputLabel>{`${t("Expense_Category")} ${"*"}`}</InputLabel>
                    <NativeSelect
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={
                        type === "ADD"
                          ? (e) => setExpenseCategory(e.target.value)
                          : (e) => setEditExpCat(e.target.value)
                      }
                      id="orgExpCatId"
                      value={type === "ADD" ? expenseCategory : editExpCat}
                    >
                      <option diabled selected hidden>
                        {t("---select---")}
                      </option>
                      <option value="Outsourcing" id="orgExpenseOutsourcing">
                        {t("Outsourcing")}
                      </option>
                      <option value="Purchase" id="orgExpensePurchase">
                        {t("Purchase")}
                      </option>
                    </NativeSelect>
                  </FormControl>
                )}
                {type === "EDIT" ? (
                  <div style={{ color: "red" }}>
                    {editErrorStatus?.expenseCategory}
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    {addErrorStatus?.expenseCategory}
                  </div>
                )}
              </Grid>
              <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                {type === "VIEW" ? (
                  <ReadOnlyField
                    name={t("Cost")}
                    id="pmViewExpCostId"
                    value={editExpAmt}
                  />
                ) : type === "ADD" ? (
                  <CustomNumberField
                    name={t("Cost_1")}
                    value={cost}
                    id="pmExpCostId"
                    onChange={(e) => {
                      if (
                        e.target.value === "" ||
                        e.target.value.match(/^[0-9]{1,100000}$/g)
                      )
                        setCost(e.target.value);
                    }}
                  />
                ) : (
                  <CustomNumberField
                    name={t("Cost_1")}
                    value={editExpAmt}
                    id="pmExpCostId"
                    onChange={(e) => {
                      if (
                        e.target.value === "" ||
                        e.target.value.match(/^[0-9]{1,100000}$/g)
                      )
                        setEditExpAmt(e.target.value);
                    }}
                  />
                )}
                {type === "EDIT" ? (
                  <div style={{ color: "red" }}>{editErrorStatus?.cost}</div>
                ) : (
                  <div style={{ color: "red" }}>{addErrorStatus?.cost}</div>
                )}
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                {type === "VIEW" ? (
                  <ReadOnlyField
                    name={t("Start_Date")}
                    id="pmViewExpStartDate"
                    value={editStartDate?.split("T")[0]}
                  />
                ) : (
                  <DateField
                    name={`${t("Start_Date")} ${"*"}`}
                    id="orgExpEndDateId"
                    inputProps={{ max: endDate }}
                    value={
                      type === "ADD" ? startDate : editStartDate?.split("T")[0]
                    }
                    onChange={
                      type === "ADD"
                        ? (e) => setStartDate(e.target.value)
                        : (e) => setEditStartDate(e.target.value)
                    }
                  />
                )}
                {/*  */}
                {type === "EDIT" ? (
                  <div style={{ color: "red" }}>
                    {editErrorStatus?.startDate}
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    {addErrorStatus?.startDate}
                  </div>
                )}
              </Grid>
              <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                {type === "VIEW" ? (
                  <ReadOnlyField
                    name={t("End_Date")}
                    id="pmViewExpEndDateId"
                    value={editEndDate?.split("T")[0]}
                  />
                ) : (
                  <DateField
                    name={`${t("End_Date")} ${"*"}`}
                    id="orgExpEndDateId"
                    inputProps={{ min: startDate }}
                    value={
                      type === "ADD" ? endDate : editEndDate?.split("T")[0]
                    }
                    onChange={
                      type === "ADD"
                        ? (e) => setEndDate(e.target.value)
                        : (e) => setEditEndDate(e.target.value)
                    }
                  />
                )}
                {/*  */}
                {type === "EDIT" ? (
                  <div style={{ color: "red" }}>{editErrorStatus?.endDate}</div>
                ) : (
                  <div style={{ color: "red" }}>{addErrorStatus?.endDate}</div>
                )}
                {/*  */}
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                <div>
                  {type === "VIEW" ? (
                    <ReadOnlyField
                      name={t("Vendor_Name")}
                      value={viewVendorName}
                    />
                  ) : (
                    <FormControl
                      variant="standard"
                      style={{ width: "98%", marginTop: "20px" }}
                    >
                      <InputLabel>{`${t("Vendor_Name")} ${"*"}`}</InputLabel>
                      <Select
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={
                          type === "ADD"
                            ? (e, child) => {
                                setVendorName(e.target.value),
                                  setVendorCode(child.props["menu-id"]);
                              }
                            : (e, child) => {
                                setEditVendorId(e.target.value),
                                  setEditStoreCode(child.props["menu-id"]);
                              }
                        }
                        id="orgExpVendorNameSelectId"
                        value={type === "ADD" ? vendorName : editVendorId}
                      >
                        <MenuItem diabled selected hidden>
                          {t("---select---")}
                        </MenuItem>
                        {VendorList?.filter((item) => {
                          return item?.status == "ACTIVE";
                        })?.map((item) => {
                          return (
                            <MenuItem
                              key={item?.vendorId}
                              menu-id={item?.vendorCode}
                              value={item?.vendorId}
                            >
                              {item?.vendorName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </div>
                {type === "EDIT" ? (
                  <div style={{ color: "red" }}>
                    {editErrorStatus?.vendorId}
                  </div>
                ) : (
                  <div style={{ color: "red" }}>{addErrorStatus?.vendorId}</div>
                )}
              </Grid>
              <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                {type === "VIEW" ? (
                  <ReadOnlyField
                    name={t("Vendor_Code")}
                    id="viewOrgExpVendorCode"
                    value={viewVendorCode}
                  />
                ) : type === "ADD" ? (
                  <ReadOnlyField
                    name={t("Vendor_Code")}
                    id="orgExpVendorCodeId"
                    value={vendorCode}
                  />
                ) : (
                  type === "EDIT" && (
                    <ReadOnlyField
                      name={t("Vendor_Code")}
                      id="orgExpVendorCodeId"
                      value={editStoreCode}
                    />
                  )
                )}
                {/*  */}
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12}>
                {type === "VIEW" ? (
                  <ReadOnlyField name={t("Description")} value={editDesc} />
                ) : (
                  <TextArea
                    name={`${t("Description")} ${"*"}`}
                    id="orgExpDescId"
                    helperText={
                      type === "ADD"
                        ? `${description.length}/500`
                        : `${editDesc.length}/500`
                    }
                    value={type === "ADD" ? description : editDesc}
                    onChange={
                      type === "ADD"
                        ? (e) => setDescription(e.target.value)
                        : (e) => setEditDesc(e.target.value)
                    }
                  />
                )}
                {type === "EDIT" ? (
                  <div style={{ color: "red" }}>
                    {editErrorStatus?.description}
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    {addErrorStatus?.description}
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="PMExpenseManagementAddExpenseCancelBtnId"
            color="error"
            style={{ color: "red" }}
            onClick={() => {
              setOpenAddUser(false),
                setEditErrorStatus(""),
                setAddErrorStatus(""),
                clearData();
            }}
          >
            {t("Cancel")}
          </Button>
          {type === "ADD" ? (
            <Button
              id="orgAddExpAddBtnId"
              onClick={() => {
                postExpense();
              }}
            >
              {t("Create")}
            </Button>
          ) : null}
          {type === "EDIT" ? (
            <Button
              id="orgAddExpEditBtnId"
              onClick={() => {
                editExpense(editExpId);
              }}
            >
              {t("Save")}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
      <Grid>
        <table style={{ marginBottom: "5.5%" }}>
          {/* */}
          <thead>
            <tr>
              <th>{t("Transaction_Date")}</th>
              <th>{t("Expense_Category")}</th>
              <th>{t("Vendor_Name")}</th>
              <th>{t("Vendor_Code")}</th>
              <th>{t("Cost")}</th>
              <th>{t("Created_By")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          {expenseList?.data?.length === 0 ? (
            <tbody>
              <tr>
                <td
                  style={{ height: "35px" }}
                  data-column={t("Transaction_Date")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Expense_Category")}
                ></td>
                <td
                  style={{
                    borderLeft: "solid white 1px",
                    height: "35px",
                    color: "crimson",
                    fontSize: "18px",
                    textAlign: "right",
                  }}
                  className="NoDataInMobile TabViewAlignTable"
                  data-column={t("Vendor_Name")}
                >
                  {t("No_data_found")}
                </td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Vendor_Code")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Cost")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Created_By")}
                ></td>
                <td
                  style={{
                    borderLeft: "solid white 1px",
                    paddingBottom: "30px",
                  }}
                  data-column={t("Action")}
                  className="NodataLast"
                ></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {expenseList?.data?.map(
                ({
                  expenseId,
                  cost,
                  startDate,
                  endDate,
                  expenseCategory,
                  expenseTransactionDate,
                  vendorName,
                  vendorCode,
                  status,
                  vendorId,
                  phaseName,
                  description,
                  projectPhaseId,
                  createdName,
                }) => {
                  return (
                    <tr key={expenseId}>
                      <td data-column={t("Transaction_Date")}>
                        {expenseTransactionDate?.split("T")[0]}
                      </td>
                      <td data-column={t("Expense_Category")}>
                        {expenseCategory == "Purchase"
                          ? t("Purchase")
                          : t("Outsourcing")}
                      </td>
                      <td data-column={t("Vendor_Name")}>{vendorName}</td>
                      <td data-column={t("Vendor_Code")}>{vendorCode}</td>
                      <td data-column={t("Cost")}>¥ {cost}</td>
                      <td data-column={t("Created_By")}>{createdName}</td>
                      <td
                        data-column={t("Action")}
                        style={{ marginBottom: "20px" }}
                        className="tableActionDiv"
                      >
                        <Tooltip title={t("View_Expense")}>
                          <MdRemoveRedEye
                            size={24}
                            id="pmViewExpId"
                            onClick={() =>
                              handleClickAddEditUser(
                                "VIEW",
                                expenseTransactionDate,
                                expenseCategory,
                                cost,
                                startDate,
                                endDate,
                                description,
                                expenseId,
                                vendorId,
                                vendorName,
                                vendorCode,
                                projectPhaseId,
                                phaseName
                              )
                            }
                            className="tableActionIcon"
                          />
                        </Tooltip>
                        {status != "DELETED" ? (
                          <>
                            {PROJECT_STATUS != "CANCELLED" ? (
                              <Tooltip title={t("Edit_Expense")}>
                                <MdModeEdit
                                  onClick={() =>
                                    handleClickAddEditUser(
                                      "EDIT",
                                      expenseTransactionDate,
                                      expenseCategory,
                                      cost,
                                      startDate,
                                      endDate,
                                      description,
                                      expenseId,
                                      vendorId,
                                      vendorName,
                                      vendorCode,
                                      projectPhaseId,
                                      phaseName
                                    )
                                  }
                                  size={24}
                                  id="PMExpenseManagementEditIcon"
                                  className="tableActionIcon"
                                />
                              </Tooltip>
                            ) : null}
                            {PROJECT_STATUS != "CANCELLED" ? (
                              <Tooltip title={t("Delete_Expense")}>
                                <MdDelete
                                  size={24}
                                  id="userManagementDeleteIcon"
                                  onClick={() =>
                                    handleClickOpenDel(
                                      expenseId,
                                      expenseCategory
                                    )
                                  }
                                  className="tableActionIcon"
                                />
                              </Tooltip>
                            ) : null}
                          </>
                        ) : null}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          )}
        </table>

        {/* DELETE EXPENSE DIALOG BOX */}
        <Dialog
          open={openDel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("Are_you_sure_you_want_to_delete_this")}{" "}
              <strong>{delExpCategory}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="deleteExpCancelBtnId" onClick={() => setOpenDel(false)}>
              {t("Cancel")}
            </Button>
            <Button
              color="error"
              id="deleteExpDeleteBtnId"
              style={{ color: "red" }}
              onClick={() => {
                onClickDeleteBtn();
              }}
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

export default PMExpenseManagement;
