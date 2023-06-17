import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import Footer from "../../components/Footer";
import { MdAddCircle } from "react-icons/md";
import { TbSubtask } from "react-icons/tb";
import "../platformadmin/PlatformAdmin.css";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import InputField from "../../components/InputField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";

const IndustryClassification = () => {
  const [openIndustryClassification, setOpenIndustryClassification] =
    useState(false);
  const History = useNavigate();
  const { t } = useTranslation();
  const [indCode, setIndCode] = useState("");
  const [indClassification, setIndClassification] = useState("");
  const getIndustryClassificationList = useSelector(
    (state) => state.user.indclass
  );
  const [errorStatus, setErrorStatus] = useState([]);
  const [sortBy, setSortBy] = useState(false);
  const handleClickIndustrySubClassificationDialog = () => {
    setOpenIndustryClassification(true);
  };

  const clearErrorStatus = () => {
    setErrorStatus([]);
  };

  const operation = useOperation();
  const dispatch = useDispatch();

  //INDUSTRY CLASSIFICSTION TABLE API
  useEffect(() => {
    const IND_CLASS_PAYLOAD = {
      page: 1,
      size: 200,
    };
    dispatch(operation.user.indClassification(IND_CLASS_PAYLOAD));
  }, []);
  //INDUSTRY CLASSIFICSTION TABLE API

  // ON CLICK CREATE BTN
  const onClickCreateBtn = () => {
    const CREATE_IND_CLASS_PAYLOAD = {
      classificationCode: indCode,
      classificationName: indClassification,
      status: "ACTIVE",
    };
    dispatch(operation.user.postIndClass(CREATE_IND_CLASS_PAYLOAD))
      .then((res) => {
        clearData(), toast.success(res?.data?.message);
        setOpenIndustryClassification(false);
        const IND_CLASS_PAYLOAD = {
          page: 1,
          size: 200,
        };
        dispatch(operation.user.indClassification(IND_CLASS_PAYLOAD));
      })
      .catch((e) => {
        setErrorStatus(e?.data);
      });
  };
  // ON CLICK CREATE BTN

  // CLEAR DATA OF CREATE IND CLASS
  const clearData = () => {
    setIndCode("");
    setIndClassification("");
    setErrorStatus("");
  };

  //TOGGLE
  const ondisableClick = (industryClassificationId, status) => {
    const Toggle_Status_params = {
      status: status,
    };
    dispatch(
      operation.user.indClassToggle({
        url: `/classification/${industryClassificationId}`,
        params: Toggle_Status_params,
      })
    )
      .then((res) => {
        toast.success(res?.data?.message);
        const IND_CLASS_PAYLOAD = {
          page: 1,
          size: 200,
        };
        dispatch(operation.user.indClassification(IND_CLASS_PAYLOAD));
      })
      .catch((e) => {
        toast.error(e?.data?.errorTitle);
      });
  };

  //SORTING
  const onClickSort = (x) => {
    setSortBy(!sortBy);

    const DESC_IND_CLASS_PAYLOAD = {
      page: 1,
      size: 200,
      sortBy: x,
      order: "ASC",
    };
    const ASC_IND_CLASS_PAYLOAD = {
      page: 1,
      size: 200,
      sortBy: x,
      order: "DESC",
    };
    {
      sortBy == true
        ? dispatch(operation.user.indClassification(DESC_IND_CLASS_PAYLOAD))
        : dispatch(operation.user.indClassification(ASC_IND_CLASS_PAYLOAD));
    }
  };

  console.log("-------------->", getIndustryClassificationList);

  return (
    <>
      <Header />
      <NavigationHeader />
      <div className="tableHeaderActionContainer">
        <div className="tableHeaderActionDiv">
          <button
            onClick={() => handleClickIndustrySubClassificationDialog()}
            id="createIndustryClassificationBtnId"
            className="logOutYesBtn"
          >
            <MdAddCircle size={24} />
            <div className="btnText">
              &nbsp;{t("Add_Industry_Classification")}
            </div>
          </button>
        </div>
      </div>
      <Dialog open={openIndustryClassification}>
        <DialogTitle>{t("Add_Industry_Classification")}</DialogTitle>

        <DialogContent>
          <Grid container>
            <Grid xs={12}>
              <InputField
                name={`${t("Industry_Classification_Code")} ${"*"}`}
                value={indCode}
                onChange={(e) => setIndCode(e.target.value)}
                id="IndustryClassificationCodeInputId"
              />
              <div style={{ color: "red" }}>
                {errorStatus?.classificationCode}
              </div>
            </Grid>
            <Grid xs={12}>
              <InputField
                name={`${t("Industry_Classification")} ${"*"}`}
                value={indClassification}
                onChange={(e) => setIndClassification(e.target.value)}
                id="IndustryClassificationInputId"
              />
              <div style={{ color: "red" }}>
                {errorStatus?.classificationName}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              color="error"
              style={{ color: "red" }}
              id="createIndustryClassificationCancelBtnId"
              onClick={() => {
                setOpenIndustryClassification(false);
                clearErrorStatus();
                clearData();
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              id="createIndustryClassificationCreateBtnId"
              onClick={() => {
                onClickCreateBtn();
              }}
            >
              {t("Create")}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Grid className="TableGrid">
        <table>
          <thead>
            {getIndustryClassificationList?.industryClassificationlsList
              .length <= 1 ||
            getIndustryClassificationList?.industryClassificationlsList ==
              null ? (
              <tr>
                <th>{t("Industry_Code")}</th>
                <th>{t("Industry_Classification")}</th>
                <th>{t("Action")}</th>
              </tr>
            ) : (
              <tr>
                <th>
                  {t("Industry_Code")}

                  {sortBy == true ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("CLASSIFICATION_CODE")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("CLASSIFICATION_CODE")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Industry_Classification")}
                  {sortBy == true ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("CLASSIFICATION_NAME")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("CLASSIFICATION_NAME")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>{t("Action")}</th>
              </tr>
            )}
          </thead>
          {getIndustryClassificationList?.industryClassificationlsList.length ==
            0 ||
          getIndustryClassificationList?.industryClassificationlsList ==
            null ? (
            <tbody>
              <tr>
                <td
                  style={{ height: "35px" }}
                  data-column={t("Industry_Code")}
                ></td>
                <td
                  colSpan={7}
                  style={{
                    borderLeft: "solid white 1px",
                    height: "50px",
                    color: "crimson",
                    fontSize: "18px",
                    textAlign: "center",
                  }}
                  className="NoDataInMobile"
                  data-column={t("Industry_Classification")}
                >
                  {t("No_data_found")}
                </td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  className="NodataLast"
                  data-column={t("Action")}
                ></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {getIndustryClassificationList?.industryClassificationlsList?.map(
                ({
                  classificationCode,
                  classificationName,
                  classificationId,
                  status,
                }) => {
                  return (
                    <tr key={classificationId}>
                      <td data-column={t("Industry_Code")}>
                        {classificationCode}
                      </td>
                      <td data-column={t("Industry_Classification")}>
                        {classificationName}
                      </td>
                      <td
                        data-column={t("Action")}
                        className="tableActionDiv TableLastColToggle"
                      >
                        {status === "ACTIVE" ? (
                          <>
                            <Tooltip title={t("Add_Sub_Classification")}>
                              <MdAddCircle
                                id="createIndustrySubClassificationIconId"
                                onClick={() =>
                                  History(
                                    PATHS.CREATEINDUSTRYSUBCLASSIFICATION,
                                    {
                                      state: {
                                        classificationId: classificationId,
                                        industryCode: classificationCode,
                                        industryName: classificationName,
                                      },
                                    }
                                  )
                                }
                                size={24}
                                className="tableActionIcon"
                              />
                            </Tooltip>
                            <Tooltip title={t("Add_Project_Phase")}>
                              <TbSubtask
                                id="industryClassificationProjectPhaseIconId"
                                onClick={() =>
                                  History(PATHS.PROJECTPHASEMANAGEMENT, {
                                    state: {
                                      classificationId: classificationId,
                                      industryCode: classificationCode,
                                      industryName: classificationName,
                                    },
                                  })
                                }
                                size={24}
                                className="tableActionIcon"
                              />
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <MdAddCircle
                              id="createIndustrySubClassificationIconId"
                              size={24}
                              className="industryclassDisableIcon"
                            />
                            <TbSubtask
                              id="industryClassificationProjectPhaseIconId"
                              size={24}
                              className="industryclassDisableIcon"
                            />
                          </>
                        )}

                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={status === "ACTIVE" ? true : false}
                            onChange={() => {
                              ondisableClick(
                                classificationId,
                                status === "INACTIVE" ? "ACTIVE" : "INACTIVE"
                              );
                            }}
                          />
                          <span
                            className="slider round"
                            id="industryClassificationSliderIcon"
                          ></span>
                        </label>
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
};

export default IndustryClassification;
