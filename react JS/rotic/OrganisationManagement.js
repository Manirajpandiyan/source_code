import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import { MdModeEdit, MdRemoveRedEye } from "react-icons/md";
import PaginationWithRows from "../../components/PaginationWithRows";
import { MdPersonAddAlt1, MdPayment } from "react-icons/md";
import { PATHS } from "../../routes/index";
import { useNavigate } from "react-router-dom";
import { AiFillFilter } from "react-icons/ai";
import "../Style.css";

import { BiReset } from "react-icons/bi";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import DateField from "../../components/DateField";
import { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { useOperation } from "../../redux/operations";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  isRegisterEmailValid,
  orgSessionStorage,
  orgSessionStorageEdit,
} from "../../utility/validation";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";
import NativeSelect from "@mui/material/NativeSelect";
import { useLocation } from "react-router-dom";
import moment from "moment";

const OrganisationManagement = () => {
  const History = useNavigate();
  const { t } = useTranslation();
  const Location = useLocation();
  const orgList = useSelector((state) => state.user.orgs);
  const orgsFilter = useSelector((state) => state.user.orgsFilter);
  const [isFilter, setIsFilter] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [totalNoPages, setTotalNoPages] = useState();
  const [recordsPerPages, setRecordsPerPages] = useState();
  const [sortBy, setSortBy] = useState({ sortBy: "ORG_NAME", order: "DESC" });
  const [pageSize, setPageSize] = useState(5);
  const [pageuseeffect, setPageUseEffect] = useState(false);
  console.log("LOCATION IN GET", Location?.state?.pageNo);
  const handleClickFilterOpen = () => {
    setOpenFilter(true);
    const ORGS_PAYLOAD = {
      pageNumber: 1,
      pageSize: 1000,
    };
    dispatch(operation.user.getOrgFilter(ORGS_PAYLOAD));
  };
  const operation = useOperation();
  const dispatch = useDispatch();
  console.log("PAGE----------------->", page);
  // ORG LIST
  useEffect(() => {
    const LocalStoragePage = localStorage.getItem("orgPage");
    const LocationPage = Location?.state?.pageNo;
    console.log("LOCATION PAGE", LocationPage, typeof LocationPage);
    console.log("STORAGE", LocalStoragePage, typeof LocalStoragePage);
    localStorage.removeItem("orgPage");
    const UPDATED_PAGE = Location?.state?.pageNo
      ? Location?.state?.pageNo
      : LocalStoragePage
      ? LocalStoragePage
      : 1;
    setPage(+UPDATED_PAGE);

    const LocalFilter = JSON.parse(localStorage.getItem("Filter"));
    let ORGS_PAYLOAD = {
      ...sortBy,
      pageNumber: Location?.state?.pageNo ? Location?.state?.pageNo : 1,
      pageSize: pageSize,
    };
    if (LocalFilter) {
      setFilter(LocalFilter);
      localStorage.removeItem("Filter");
      if (
        LocalFilter?.orgId != "" ||
        LocalFilter?.status != "" ||
        LocalFilter?.subscriptionEndDate != "" ||
        LocalFilter?.subscriptionType != ""
      ) {
        setIsFilter(true);
      }

      ORGS_PAYLOAD = {
        ...ORGS_PAYLOAD,
        ...LocalFilter,
      };
    }

    console.log("PAGE", page);
    dispatch(operation.user.orgs(ORGS_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
  }, []);
  useEffect(() => {
    const LocalStoragePage = localStorage.getItem("orgPage");
    const LocationPage = Location?.state?.pageNo;
    console.log("LOCATION PAGE", LocationPage, typeof LocationPage);
    console.log("STORAGE", LocalStoragePage, typeof LocalStoragePage);
    localStorage.removeItem("orgPage");
    const UPDATED_PAGE = Location?.state?.pageNo
      ? Location?.state?.pageNo
      : LocalStoragePage
      ? LocalStoragePage
      : 1;
    setPage(+UPDATED_PAGE);
    console.log("PAGE", page);
    const ORGS_PAYLOAD = {
      ...sortBy,
      pageNumber: Location?.state?.pageNo ? Location?.state?.pageNo : 1,
      pageSize: pageSize,
      ...filter,
    };
    {
      pageuseeffect == true &&
        dispatch(operation.user.orgs(ORGS_PAYLOAD)).then((res) => {
          setTotalNoPages(res?.data?.data.totalNoOfPages);
          setRecordsPerPages(res?.data?.data.totalNoOfRecords);
        });
    }
  }, [pageSize]);

  // ORGANISATION
  const [filter, setFilter] = useState({
    orgId: "",
    subscriptionType: "",
    subscriptionEndDate: "",
    status: "",
  });

  const onClickFilterOrg = () => {
    setIsFilter(true);
    setPage(1);
    const ORGS_PAYLOAD = {
      ...sortBy,
      pageNumber: 1,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.orgs(ORGS_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
    setOpenFilter(false);
  };
  //RESET FILTER BTN
  const onClickResetFilter = () => {
    setIsFilter(false);
    setFilter({
      orgId: "",
      subscriptionType: "",
      subscriptionEndDate: "",
      status: "",
    });
    setPage(1);
    const ORGS_PAYLOAD = {
      pageNumber: 1,
      pageSize: pageSize,
      ...sortBy,
    };
    dispatch(operation.user.orgs(ORGS_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
  };

  const handleChange = (event, value) => {
    setPage(value);
    const ORGS_PAYLOAD = {
      ...sortBy,
      pageNumber: value,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.orgs(ORGS_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  };

  const onEdit = (data) => {
    sessionStorage.setItem("orgEdit", JSON.stringify(data));
    const addOrg = {
      description: data?.description,
      emailAddress: data?.emailAddress,
      languageId: data?.languageId,
      languagename: data?.languagename,
      maxUsers: data?.maxUsers,
      orgName: data?.orgName,
      orgUrl: data?.orgUrl,
    };
    let industry = [];
    const subClassification = {};
    for (let ele of data?.classificationVOList) {
      industry.push({
        classificationId: ele["id"],
        classificationName: ele["name"],
      });
      let li = [];
      for (let sublist of ele?.subClassificationVOList) {
        li.push({
          subClassificationId: sublist?.id,
          checkStatus: true,
          subClassificationName: sublist?.name,
          industryname: ele["name"],
        });
      }
      subClassification[ele?.id] = li;
    }
    orgSessionStorage("addOrg", "SAVE", addOrg);
    orgSessionStorage("industry", "SAVE", { industry: industry });
    orgSessionStorage("classification", "SAVE", subClassification);
    History(PATHS.ADDORG);
  };

  const getClassificationId = (list) => {
    let data = {};
    list?.forEach((ele) => {
      let li = [];
      ele?.subClassificationVOList?.forEach((sublist) => {
        li.push(sublist?.id);
      });
      data[ele?.id] = li;
    });
    return data;
  };

  const disableOrganisation = (
    userId,
    orgName,
    emailAddress,
    maxUsers,
    languageId,
    description,
    classificationId,
    orgId,
    subscriptionId,
    orgUrl,
    status,
    page
  ) => {
    const DISABLE_ORGANISATION_PAYLOAD = {
      classificationList: getClassificationId(classificationId),
      description: description,
      emailAddress: emailAddress,
      languageId: languageId,
      maxUsers: maxUsers,
      orgId: orgId,
      orgName: orgName,
      orgUrl: orgUrl,
      status: status,
      subscriptionId: subscriptionId,
      userId: userId,
      toggle: 1,
    };
    dispatch(
      operation.user.editOrganisation({
        orgId: orgId,
        data: DISABLE_ORGANISATION_PAYLOAD,
      })
    )
      .then((res) => {
        const ORGS_PAYLOAD = {
          ...sortBy,
          pageNumber: page,
          pageSize: pageSize,
          ...filter,
        };
        dispatch(operation.user.orgs(ORGS_PAYLOAD)).then((res) => {
          setTotalNoPages(res?.data?.data.totalNoOfPages);
          setRecordsPerPages(res?.data?.data.totalNoOfRecords);
        });
        toast.success(res?.data?.message);
      })
      .catch((e) => {
        toast.error(e?.data);
      });
  };

  //SORTING
  const onClickSort = (sort, type) => {
    setSortBy({
      sortBy: sort,
      order: type,
    });
    const ASC_ORGS_PAYLOAD = {
      sortBy: sort,
      order: type,
      pageNumber: page,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.orgs(ASC_ORGS_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
  };

  return (
    <>
      <Header />
      <NavigationHeader />
      <div>
        <div className="tableHeaderActionContainer">
          <div className="tableHeaderActionDiv">
            <div
              className="addOrgButton"
              id="orgManagementManualPaymentBtnId"
              onClick={() => History(PATHS.MANUALPAYMENT)}
            >
              <MdPayment style={{ margin: "5px" }} size={20} />{" "}
              <div className="btnText">{t("Manual_Payment")}</div>
            </div>
            <div
              className="addUserButton"
              id="orgManagementFilterBtnId"
              onClick={() => handleClickFilterOpen()}
            >
              <AiFillFilter style={{ margin: "5px" }} size={20} />{" "}
              <div className="btnText">{t("Filter")}</div>
            </div>
            {isFilter == true ? (
              <div
                className="addUserButton"
                style={{ backgroundColor: "crimson" }}
                onClick={() => {
                  onClickResetFilter();
                }}
                id="orgManagementResetBtn"
              >
                <BiReset style={{ margin: "5px" }} size={20} />
                <div className="btnText">{t("Reset")}</div>
              </div>
            ) : null}
            <div
              className="addOrgButton"
              id="orgManagementAddOrgBtnId"
              onClick={() => {
                sessionStorage.removeItem("orgStorage");
                sessionStorage.removeItem("orgEdit");
                sessionStorage.setItem("type", "ADD");
                History(PATHS.ADDORG);
              }}
            >
              <MdPersonAddAlt1 style={{ margin: "5px" }} size={20} />
              <div className="btnText">{t("Add_Organisation")}</div>
            </div>
          </div>
        </div>
        {/* Filter Dialaog Box */}
        <Dialog open={openFilter}>
          <DialogTitle>{t("Organisation_Management_Filter")}</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid xs={12}>
                <FormControl
                  variant="standard"
                  style={{ width: "98%", marginTop: "20px" }}
                >
                  <InputLabel id="orgManagementOrgNameId">
                    {t("Organisation_Name")}
                  </InputLabel>
                  <NativeSelect
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="orgManagementFilterSelectNameId"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        orgId: e.target.value,
                      });
                    }}
                    value={filter?.orgId}
                  >
                    <option diabled selected hidden>
                      {t("---select---")}
                    </option>
                    {orgsFilter?.organization
                      .filter(
                        (value, index, self) =>
                          index ===
                          self.findIndex((t) => t.orgId === value.orgId)
                      )
                      .map((name, i) => {
                        return (
                          <option
                            key={i}
                            value={name?.orgId}
                            id="orgMgtOrgNameFilterId"
                          >
                            {name?.orgName}
                          </option>
                        );
                      })}
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <div>
                  <FormControl
                    variant="standard"
                    style={{ width: "98%", marginTop: "20px" }}
                  >
                    <InputLabel id="orgManagementSubTypeId">
                      {t("Subscription_Type")}
                    </InputLabel>
                    <NativeSelect
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setFilter({
                          ...filter,
                          subscriptionType: e.target.value,
                        });
                      }}
                      value={filter?.subscriptionType}
                      id="orgManagementSelectTypeId"
                    >
                      <option diabled selected hidden>
                        {t("---select---")}
                      </option>
                      <option value="TRIAL" id="orgManagementPaidId">
                        {t("Trial")}
                      </option>
                      <option value="PAID" id="orgManagementFreeId">
                        {t("Paid")}
                      </option>
                    </NativeSelect>
                  </FormControl>
                </div>
              </Grid>
              <Grid xs={12}>
                <DateField
                  name={t("Subscription_End_Date")}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      subscriptionEndDate: e.target.value,
                    });
                  }}
                  value={filter?.subscriptionEndDate}
                  id="orgManagementFilterToId"
                />
              </Grid>
              <Grid xs={12}>
                <div>
                  <FormControl
                    variant="standard"
                    style={{ width: "98%", marginTop: "20px" }}
                  >
                    <InputLabel id="orgManagementStatusId">
                      {t("Status")}
                    </InputLabel>
                    <NativeSelect
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setFilter({
                          ...filter,
                          status: e.target.value,
                        });
                      }}
                      value={filter?.status}
                      id="orgManagementStatusSelectId"
                    >
                      <option diabled selected hidden>
                        {t("---select---")}
                      </option>
                      <option value="VERIFIED">{t("Verified")}</option>
                      <option value="DISABLED">{t("Disabled")}</option>
                      <option value="PENDING_ACTIVATION">
                        {t("Pending Activation")}
                      </option>
                    </NativeSelect>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <div>
              <Button
                color="error"
                id="orgManagementFilterCancelBtnId"
                onClick={() => {
                  setOpenFilter(false);
                }}
              >
                {t("Cancel")}
              </Button>
              <Button
                id="orgManagementFilterApplyBtnId"
                onClick={() => {
                  onClickFilterOrg();
                }}
              >
                {t("Apply")}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
        <table>
          <thead>
            {orgList?.organization.length <= 1 ||
            orgList?.organization == null ? (
              <tr>
                <th>{t("Organisation_Name")}</th>
                <th>{t("Email_Id")}</th>
                <th>{t("Maximum_No_of_Users")}</th>
                <th>{t("Subscription_Type")}</th>
                <th>{t("Subscription_End_Date")}</th>
                <th>{t("Status")}</th>
                <th>{t("Action")}</th>
              </tr>
            ) : (
              <tr>
                <th>
                  {t("Organisation_Name")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("ORG_NAME", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("ORG_NAME", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Email_Id")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("EMAIL_ADDRESS", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("EMAIL_ADDRESS", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Maximum_No_of_Users")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("MAX_USERS", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("MAX_USERS", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Subscription_Type")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("SUBSCRIPTION_TYPE", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("SUBSCRIPTION_TYPE", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Subscription_End_Date")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() =>
                        onClickSort("SUBSCRIPTION_END_DATE", "ASC")
                      }
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() =>
                        onClickSort("SUBSCRIPTION_END_DATE", "DESC")
                      }
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Status")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("ORGANIZATION_STATUS", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("ORGANIZATION_STATUS", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>{t("Action")}</th>
              </tr>
            )}
          </thead>
          {orgList?.organization.length == 0 ||
          orgList?.organization == null ? (
            <tbody>
              <tr>
                <td
                  style={{ height: "35px" }}
                  data-column={t("Organisation_Name")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Email_Id")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Maximum_No_of_Users")}
                ></td>
                <td
                  colSpan={7}
                  style={{
                    borderLeft: "solid white 1px",
                    height: "35px",
                    color: "crimson",
                    fontSize: "18px",
                  }}
                  data-column={t("Subscription_Type")}
                  className="NoDataInMobile"
                >
                  {t("No_data_found")}
                </td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Subscription_End_Date")}
                  className="TableLastData"
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Status")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  className="NodataLast"
                  data-column={t("Action")}
                ></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {orgList?.organization?.map((ele) => {
                return (
                  <tr key={ele.orgId}>
                    <td data-column={t("Organisation_Name")}>{ele.orgName}</td>
                    <td data-column={t("Email_Id")}>{ele.emailAddress}</td>
                    <td data-column={t("Maximum_No_of_Users")}>
                      {ele.maxUsers}
                    </td>
                    <td data-column={t("Subscription_Type")}>
                      {ele.subscriptionType == "TRIAL" ? t("Trial") : t("Paid")}
                    </td>
                    <td data-column={t("Subscription_End_Date")}>
                      {moment(ele.subscriptionEndDate.toLocaleString()).format(
                        "YYYY-MM-DD"
                      )}
                    </td>
                    <td data-column={t("Status")}>
                      {ele.status == "VERIFIED"
                        ? t("Verified")
                        : ele.status == "PENDING_ACTIVATION"
                        ? t("Pending Activation")
                        : t("Disabled")}
                    </td>
                    <td
                      data-column={t("Action")}
                      className="tableActionDiv TableLastColToggle"
                    >
                      <Tooltip title={t("View_Organisation")}>
                        <MdRemoveRedEye
                          size={24}
                          id="orgManagementViewBtnId"
                          onClick={() =>
                            History(PATHS.VIEWORGANISATIONSUMMARY, {
                              state: { orgId: ele?.orgId, page: page },
                            })
                          }
                          className="tableActionIcon"
                        />
                      </Tooltip>
                      <Tooltip title={t("Edit_Organisation")}>
                        <MdModeEdit
                          size={24}
                          id="orgManagementEditBtnId"
                          className="tableActionIcon"
                          onClick={() => {
                            onEdit(ele);
                            sessionStorage.removeItem("type", "ADD");
                            sessionStorage.setItem(
                              "subscriptionStatus",
                              ele.status
                            );
                            localStorage.setItem("orgPage", page),
                              localStorage.setItem(
                                "Filter",
                                JSON.stringify(filter)
                              );
                          }}
                        />
                      </Tooltip>
                      {ele.status === "PENDING_ACTIVATION" ? null : (
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={ele.status === "VERIFIED" ? true : false}
                            onChange={() => {
                              disableOrganisation(
                                ele.userId,
                                ele.orgName,
                                ele.emailAddress,
                                ele.maxUsers,
                                ele.languageId,
                                ele.description,
                                ele.classificationVOList,
                                ele.orgId,
                                ele.subscriptionId,
                                ele.orgUrl,
                                ele.status === "DISABLED"
                                  ? "VERIFIED"
                                  : "DISABLED",
                                page
                              );
                            }}
                          />
                          <span className="slider round"></span>
                        </label>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
        <div className="LastRowPaginationContainer">
          <div className="LastRowSections">
            {recordsPerPages <= 5 ? null : (
              <FormControl style={{ width: "40%" }}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  {t("Rows_per_page")}
                </InputLabel>
                <NativeSelect
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value, sortBy), setPageUseEffect(true);
                  }}
                  inputProps={{
                    name: "RowsPerPage",
                    id: "uncontrolled-native",
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </NativeSelect>
              </FormControl>
            )}
          </div>
          <div className="LastPaginationSections">
            {recordsPerPages <= pageSize ? null : (
              <PaginationWithRows
                count={totalNoPages}
                onChange={handleChange}
                page={page}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrganisationManagement;
