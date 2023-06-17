import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import "./PlatformAdmin.css";
import "../Style.css";
import { MdOutlineNavigateNext } from "react-icons/md";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { PATHS } from "../../routes";
import { useNavigate } from "react-router-dom";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import { AiFillFilter } from "react-icons/ai";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useOperation } from "../../redux/operations";
import { useEffect } from "react";
import NativeSelect from "@mui/material/NativeSelect";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";

function IndustrialClassification() {
  const History = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const operation = useOperation();
  const [classificationReportList, setClassificationReportList] = useState([]);
  const [classificationList, setClassificationList] = useState([]);
  const [subClassificationList, setSubClassificationList] = useState([]);
  const [filterPayment, setFilterPayment] = useState(false);
  const [classificationId, setClassificationId] = useState("");
  const [subClassificationId, setSubClassificationId] = useState("");
  const [subClassDropDown, setSubCalssDropDown] = useState(false);
  const [filterError, setFilterError] = useState("");
  const [sortBy, setSortBy] = useState({ sortBy: "ORG_NAME", order: "DESC" });
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      onClick={() => History(PATHS.REPORTS)}
    >
      {t("Reports")}
    </Link>,
    <Typography underline="hover" key="3" color="text.primary">
      {t("Industry_Classification")}
    </Typography>,
  ];

  const handelClickFilterIndustrialClassification = () => {
    setFilterPayment(true);

    //CLASSIFICATION
    const IND_CLASS_PAYLOAD = {
      page: 1,
      size: 500,
    };
    dispatch(operation.user.indClassification(IND_CLASS_PAYLOAD)).then(
      (res) => {
        setClassificationList(res?.data?.data?.industryClassificationlsList);
      }
    );
  };

  useEffect(() => {
    const IND_SUBCLASS_PAYLOAD = {
      ...sortBy,
      page: 1,
      size: 10,
    };
    {
      subClassDropDown == true &&
        dispatch(
          operation.user.getIndustrySubClassification({
            url: `/classification/${classificationId}/subclassification`,
            params: IND_SUBCLASS_PAYLOAD,
          })
        ).then((res) => {
          setSubClassificationList(res?.data?.data?.subClassificationList);
        });
    }
  }, [classificationId]);
  console.log("CLASSIFICATION ID ", classificationId, subClassDropDown);

  // INDUSTRY CLASSIFICATION REPORT
  useEffect(() => {
    const CLASSIFICAIONREPORT_PARAMS = {
      classificationId: classificationId,
      subClassificationId: subClassificationId,
    };
    {
      classificationId != null ||
        (" " && subClassificationId != null) ||
        (" " &&
          dispatch(
            operation.user.classificationReportList(CLASSIFICAIONREPORT_PARAMS)
          ).then((res) => {
            setClassificationReportList(res?.data?.data);
          }));
    }
  }, [classificationId]);

  //SORTING
  const onClickSort = (sort, type) => {
    setSortBy({
      sortBy: sort,
      order: type,
    });
    const ASC_CLASSIFICAIONREPORT_PARAMS = {
      classificationId: classificationId,
      subClassificationId: subClassificationId,
      sortBy: sort,
      order: type,
    };
    dispatch(
      operation.user.classificationReportList(ASC_CLASSIFICAIONREPORT_PARAMS)
    ).then((res) => {
      setClassificationReportList(res?.data?.data);
    });
  };

  const onClickFilterButton = () => {
    const CLASSIFICAIONREPORT_PARAMS = {
      ...sortBy,
      classificationId: classificationId,
      subClassificationId: subClassificationId,
    };
    dispatch(
      operation.user.classificationReportList(CLASSIFICAIONREPORT_PARAMS)
    )
      .then((res) => {
        setClassificationReportList(res?.data?.data);
        setFilterPayment(false);

        setFilterError("");
      })
      .catch((e) => {
        setFilterError(e?.data);
      });
  };

  return (
    <>
      <Header />
      <NavigationHeader />
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
          <div
            className="addUserButton"
            id="indClassFilterBtnId"
            onClick={() => handelClickFilterIndustrialClassification()}
          >
            <AiFillFilter style={{ margin: "5px" }} size={20} />{" "}
            <div className="btnText">{t("Filter")}</div>
          </div>
        </div>
      </div>

      <Dialog open={filterPayment}>
        <DialogTitle>{t("Industrial_Classification_Filter")}</DialogTitle>

        <DialogContent>
          {filterError != "" && (
            <>
              <div style={{ color: "red", padding: "10px" }}>
                {filterError[0]}
              </div>
              <div style={{ color: "red", padding: "10px" }}>
                {filterError[1]}
              </div>
            </>
          )}
          <Grid container>
            <Grid xs={12}>
              <FormControl
                variant="standard"
                style={{ width: "98%", marginTop: "20px" }}
              >
                <InputLabel>{t("Industry_Classification")}</InputLabel>
                <NativeSelect
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="orgManagementFilterIndClassificationSelectId"
                  onChange={(e) => {
                    setClassificationId(e.target.value),
                      setSubCalssDropDown(true);
                  }}
                  value={classificationId}
                >
                  <option diabled selected hidden>
                    {t("---select---")}
                  </option>
                  {classificationList.map(
                    ({ classificationId, classificationName }) => {
                      return (
                        <option
                          key={classificationId}
                          value={classificationId}
                          id="IndClassSlctId1"
                        >
                          {classificationName}
                        </option>
                      );
                    }
                  )}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              {classificationId != " " && subClassDropDown == true ? (
                <div>
                  {subClassificationList?.length != 0 ? (
                    <FormControl
                      variant="standard"
                      style={{ width: "98%", marginTop: "20px" }}
                    >
                      <InputLabel id="orgManagemenetIndSubId">
                        {t("Industry_Sub_Classification")}
                      </InputLabel>
                      <NativeSelect
                        InputLabelProps={{
                          shrink: true,
                        }}
                        id="orgManagementSubSelctId"
                        onChange={(e) => setSubClassificationId(e.target.value)}
                        value={subClassificationId}
                      >
                        <option diabled selected hidden>
                          {t("---select---")}
                        </option>
                        {subClassificationList.map(
                          ({ subClassificationId, subClassificationName }) => {
                            return (
                              <option
                                key={subClassificationId}
                                value={subClassificationId}
                                id="IndClassSlctId1"
                              >
                                {subClassificationName}
                              </option>
                            );
                          }
                        )}
                      </NativeSelect>
                    </FormControl>
                  ) : (
                    <div
                      style={{
                        color: "red",
                        marginTop: "45px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      {t("No_data_found_under_this_classification")}{" "}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <FormControl
                    variant="standard"
                    style={{ width: "98%", marginTop: "20px" }}
                    disabled
                  >
                    <InputLabel id="orgManagemenetIndSubId">
                      {t("Industry_Sub_Classification")}
                    </InputLabel>
                    <NativeSelect
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="orgManagementSubSelctId"
                      onChange={(e) => setSubClassificationId(e.target.value)}
                      value={subClassificationId}
                    >
                      <option diabled selected hidden>
                        {t("---select---")}
                      </option>
                      {subClassificationList.map(
                        ({ subClassificationId, subClassificationName }) => {
                          return (
                            <option
                              key={subClassificationId}
                              value={subClassificationId}
                              id="IndClassSlctId1"
                            >
                              {subClassificationName}
                            </option>
                          );
                        }
                      )}
                    </NativeSelect>
                  </FormControl>
                </div>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              id="cancelFilterIndustrialClassificationId"
              color="error"
              onClick={() => {
                setFilterPayment(false), setFilterError("");
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              id="applyFilterIndustrialClassificationId"
              onClick={() => {
                onClickFilterButton();
              }}
            >
              {t("Apply")}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Grid className="TableGridWithOutPagination">
        <table>
          {classificationReportList?.length <= 1 ||
          classificationReportList == null ? (
            <thead>
              <tr>
                <th>{t("Organisation_Name")}</th>
                <th>{t("Registered_Date")}</th>
                <th>{t("Active_Subscription")}</th>
                <th>{t("Cost")}</th>
                <th>{t("Industry_Classification")}</th>
                <th>{t("Industry_Sub_Classification")}</th>
                <th style={{ paddingLeft: "23px" }}>
                  {t("Maximum_No_of_Users")}
                </th>
              </tr>
            </thead>
          ) : (
            <thead>
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
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("ORG_NAME", "DESC")}
                    />
                  )}
                </th>
                <th>
                  {t("Registered_Date")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("REGISTERED_DATE", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("REGISTERED_DATE", "DESC")}
                    />
                  )}
                </th>
                <th>
                  {t("Active_Subscription")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("SUBSCRIPTION_PLAN", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("SUBSCRIPTION_PLAN", "DESC")}
                    />
                  )}
                </th>
                <th>
                  {t("Cost")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("AMOUNT", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("AMOUNT", "DESC")}
                    />
                  )}
                </th>
                <th>
                  {t("Industry_Classification")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("CLASSIFICATION_NAME", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("CLASSIFICATION_NAME", "DESC")}
                    />
                  )}
                </th>
                <th>
                  {t("Industry_Sub_Classification")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() =>
                        onClickSort("SUB_CLASSIFICATION_NAME", "ASC")
                      }
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      className="TbHeaderFilter"
                      onClick={() =>
                        onClickSort("SUB_CLASSIFICATION_NAME", "DESC")
                      }
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
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("MAX_USERS", "DESC")}
                    />
                  )}
                </th>
              </tr>
            </thead>
          )}
          {classificationReportList?.length == 0 ||
          classificationReportList == null ? (
            <tbody>
              <tr>
                <td
                  style={{ paddingTop: "5px", height: "30px" }}
                  data-column={t("Organisation_Name")}
                ></td>
                <td
                  style={{
                    borderLeft: "solid white 1px",
                    paddingTop: "5px",
                    height: "30px",
                  }}
                  data-column={t("Registered_Date")}
                ></td>
                <td
                  style={{
                    borderLeft: "solid white 1px",
                    paddingTop: "5px",
                    height: "30px",
                  }}
                  data-column={t("Active_Subscription")}
                ></td>
                <td
                  colSpan={7}
                  style={{
                    borderLeft: "solid white 1px",
                    color: "crimson",
                    fontSize: "18px",
                    height: "30px",
                  }}
                  className="NoDataInMobile"
                >
                  {t("No_data_found")}
                </td>
                <td
                  style={{
                    borderLeft: "solid white 1px",
                    paddingTop: "5px",
                    height: "30px",
                    marginBottom: "10px",
                  }}
                  data-column={t("Industry_Classification")}
                  className="TableLastData"
                ></td>
                <td
                  style={{
                    borderLeft: "solid white 1px",
                    paddingTop: "5px",
                    height: "30px",
                  }}
                  data-column={t("Industry_Sub_Classification")}
                ></td>
                <td
                  style={{
                    borderLeft: "solid white 1px",
                    paddingBottom: "10px",
                    height: "30px",
                    paddingTop: "15px",
                  }}
                  className="TableLastData NodataLast classMaxUser"
                ></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {classificationReportList?.map(
                (
                  {
                    orgName,
                    planName,
                    createdDate,
                    amount,
                    maxUsers,
                    subClassificationName,
                    classificationName,
                  },
                  i
                ) => {
                  return (
                    <tr key={i}>
                      <td data-column={t("Organisation_Name")}>{orgName}</td>
                      <td data-column={t("Registered_Date")}>{createdDate}</td>
                      <td data-column={t("Active_Subscription")}>{planName}</td>
                      <td data-column={t("Cost")}>
                        {"¥"} {amount}
                      </td>
                      <td data-column={t("Industry_Classification")}>
                        {classificationName}
                      </td>
                      <td data-column={t("Industry_Sub_Classification")}>
                        {subClassificationName}
                      </td>
                      <td
                        data-column={t("Maximum_No_of_Users")}
                        className="TableLastData"
                      >
                        {maxUsers}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          )}
        </table>
      </Grid>
      <Footer />
    </>
  );
}

export default IndustrialClassification;
