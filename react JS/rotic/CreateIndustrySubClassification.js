import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavigationHeader from "../../components/NavigationHeader";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { MdOutlineNavigateNext, MdAddCircle } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import InputField from "../../components/InputField";
import { TiPlus } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { useEffect } from "react";
import { useOperation } from "../../redux/operations";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/exports";
import { useLocation } from "react-router-dom";
import PaginationWithRows from "../../components/PaginationWithRows";
import { toast } from "react-hot-toast";
import DialogContentText from "@mui/material/DialogContentText";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";
import NativeSelect from "@mui/material/NativeSelect";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";

const CreateIndustrySubClassification = () => {
  const History = useNavigate();
  const { t } = useTranslation();
  const Location = useLocation();
  const [openIndustrySubClassification, setOpenIndustrySubClassification] =
    useState(false);
  const [subCode, setSubCode] = useState("");
  const [subName, setSubName] = useState("");
  const [createMetaDataOpen, setCreateMetaDataOpen] = useState(false);
  const [subErrorStatus, setSubErrorStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalNoPages, setTotalNoPages] = useState();
  const [recordsPerPages, setRecordsPerPages] = useState();
  console.log("record per page.....>>>", recordsPerPages);
  console.log("page", page);
  const [metaDataClassId, setMetaDataClassId] = useState("");
  const [metaDataSubClassId, setMetaDataSubClassId] = useState("");
  const [metaDataError, setMetaDataError] = useState("");
  const [getMetaData, setGetMetaData] = useState([]);
  const [openDel, setOpenDel] = useState(false);
  const [delMetaDataId, setDelMetaDataId] = useState("");
  const [delClassificationId, setDelClassificationId] = useState("");
  const [delSubClassificationId, setDelSubClassificationId] = useState("");
  const [delMetaName, setDelMetaName] = useState("");
  const [sortBy, setSortBy] = useState({
    sortBy: "SUB_CLASSIFICATION_NAME",
    order: "DESC",
  });
  const [pageSize, setPageSize] = useState(5);
  const [pageuseeffect, setPageUseEffect] = useState(false);

  //ADD SUB CLASSIFICATION:
  const handleClickIndustrySubClassificationDialog = () => {
    setOpenIndustrySubClassification(true);
  };

  const clearData = () => {
    setSubCode("");
    setSubName("");
  };

  //DELETE META DATA
  const handleClickOpenDel = (mid, classId, subClassId, mname) => {
    setOpenDel(true);
    setDelMetaDataId(mid);
    setDelClassificationId(classId), setDelSubClassificationId(subClassId);
    setDelMetaName(mname);
  };

  const onClickDelbBtn = () => {
    const DELETE_PARAMS = {
      status: "INACTIVE",
    };
    dispatch(
      operation.user.delMetaData({
        url: `/classification/${delClassificationId}/subclassification/${delSubClassificationId}/metadata/${delMetaDataId}`,
        params: DELETE_PARAMS,
      })
    ).then((res) => {
      console.log(res), setOpenDel(false), toast.success(res?.data?.message);
      const IND_SUBCLASS_PAYLOAD = {
        page: page,
        size: pageSize,
      };
      dispatch(
        operation.user.getIndustrySubClassification({
          url: `/classification/${Location.state.classificationId}/subclassification`,
          params: IND_SUBCLASS_PAYLOAD,
        })
      ).then((res) => {
        setTotalNoPages(res?.data?.data.totalNoOfPages);
        setRecordsPerPages(res?.data?.data.totalNoOfRecords);
        dispatch(
          operation.user.getMetaData(
            `/classification/${metaDataClassId}/subclassification/${metaDataSubClassId}/metadata`
          )
        ).then((res) => {
          console.log("---->", res);
          setGetMetaData(res?.data?.data?.metadataList);
        });
      });
    });
  };

  //ONCLICK ADD BTN
  const onClickCreateBtn = () => {
    const POST_SUB_CLASSIFICATION_PAYLOAD = {
      status: "ACTIVE",
      subClassificationCode: subCode,
      subClassificationName: subName,
    };
    dispatch(
      operation.user.postIndSubClass({
        url: `/classification/${Location.state.classificationId}/subclassification`,
        data: POST_SUB_CLASSIFICATION_PAYLOAD,
      })
    )
      .then((res) => {
        setOpenIndustrySubClassification(false);
        setSubErrorStatus("");
        toast.success(res?.data?.message);
        clearData();
        const IND_SUBCLASS_PAYLOAD = {
          page: page,
          size: pageSize,
          ...sortBy,
        };
        dispatch(
          operation.user.getIndustrySubClassification({
            url: `/classification/${Location.state.classificationId}/subclassification`,
            params: IND_SUBCLASS_PAYLOAD,
          })
        ).then((res) => {
          console.log("RES", res);

          setTotalNoPages(res?.data?.data.totalNoOfPages);
          setRecordsPerPages(res?.data?.data.totalNoOfRecords);
        });
      })
      .catch((e) => {
        setSubErrorStatus(e?.data);
      });
  };

  const [inputList, setInputList] = useState([
    { isRequired: 1, metadataName: "", type: "STANDARD" },
  ]);
  // handle input change
  const handleInputChange = (e, index) => {
    setInputList((prev) => {
      return prev.map((item, i) => {
        if (index === i) {
          return { ...item, [e.target.name]: e.target.value };
        }
        return item;
      });
    });
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([
      ...inputList,
      { metadataName: "", type: "STANDARD", isRequired: 1 },
    ]);
    setMetaDataError("");
  };
  const handleClickCreateMetaDataOpen = (
    classificationId,
    subClassificationId
  ) => {
    setCreateMetaDataOpen(true);
    setMetaDataClassId(classificationId);
    setMetaDataSubClassId(subClassificationId);
    dispatch(
      operation.user.getMetaData(
        `/classification/${classificationId}/subclassification/${subClassificationId}/metadata`
      )
    ).then((res) => {
      console.log("---->", res);
      setGetMetaData(res?.data?.data?.metadataList);
    });
  };

  const submit = () => {
    dispatch(
      operation.user.metaData({
        url: `/classification/${metaDataClassId}/subclassification/${metaDataSubClassId}/metadata`,
        data: [
          ...getMetaData.map((item) => {
            return {
              isRequired: 1,
              metadataName: item?.metadataName,
              type: item?.type,
              metadataId: item?.metadataId,
            };
          }),
          ...inputList,
        ],
      })
    )
      .then((res) => {
        toast.success(res?.data?.message),
          setCreateMetaDataOpen(false),
          setInputList([{ isRequired: 1, metadataName: "", type: "STANDARD" }]);
        setMetaDataError("");
      })
      .catch((e) => {
        setMetaDataError(e?.data);
        console.log("dropDownList", e?.data, inputList);
        const Error = e?.data ?? {};
        Object.keys(Error).map((ele) => {
          if (ele.includes(".")) {
            const index = +ele.split(".")[0];

            if (getMetaData?.length > index) {
              console.log("dropDownList", getMetaData[index]);
              getMetaData[index]["error"] = Error[ele];
            } else {
              console.log("dropDownList", index, getMetaData.length);
              inputList[index - getMetaData?.length]["error"] = Error[ele];
            }
          }
        });
        console.log("INPUT LIST--->", inputList);
        setInputList(inputList);
        setGetMetaData(getMetaData);
      });
  };

  const operation = useOperation();
  const dispatch = useDispatch();

  //SUB CLASSIFICATION LIST REDUCER
  const subClassificationList = useSelector(
    (state) => state.user.getIndustrySubClassification?.data
  );

  useEffect(() => {
    const IND_SUBCLASS_PAYLOAD = {
      ...sortBy,
      page: page,
      size: pageSize,
    };
    dispatch(
      operation.user.getIndustrySubClassification({
        url: `/classification/${Location.state.classificationId}/subclassification`,
        params: IND_SUBCLASS_PAYLOAD,
      })
    ).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
  }, []);

  useEffect(() => {
    setPage(1);
    const IND_SUBCLASS_PAYLOAD = {
      ...sortBy,
      page: 1,
      size: pageSize,
    };
    {
      pageuseeffect == true &&
        dispatch(
          operation.user.getIndustrySubClassification({
            url: `/classification/${Location.state.classificationId}/subclassification`,
            params: IND_SUBCLASS_PAYLOAD,
          })
        ).then((res) => {
          setTotalNoPages(res?.data?.data.totalNoOfPages);
          setRecordsPerPages(res?.data?.data.totalNoOfRecords);
        });
    }
  }, [pageSize]);
  //SORTING
  const onClickSort = (sort, type) => {
    setSortBy({
      sortBy: sort,
      order: type,
    });
    const ASC_IND_SUBCLASS_PAYLOAD = {
      page: page,
      size: pageSize,
      order: type,
      sortBy: sort,
    };
    dispatch(
      operation.user.getIndustrySubClassification({
        url: `/classification/${Location.state.classificationId}/subclassification`,
        params: ASC_IND_SUBCLASS_PAYLOAD,
      })
    ).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
  };

  const handleChange = (event, value) => {
    setPage(value);
    const IND_SUBCLASS_PAYLOAD = {
      ...sortBy,
      page: value,
      size: pageSize,
    };
    dispatch(
      operation.user.getIndustrySubClassification({
        url: `/classification/${Location.state.classificationId}/subclassification`,
        params: IND_SUBCLASS_PAYLOAD,
      })
    ).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      id="IndustrialSubClassificationBreadcrumbId1"
      key="1"
      color="inherit"
      onClick={() => {
        History(PATHS.INDUSTRYCLASSIFICATION);
      }}
    >
      {t("Industrial_Classification")}
    </Link>,
    <Typography key="2" color="text.primary">
      {t("Industrial_Sub_Classification")}
    </Typography>,
  ];

  //TOGGLE

  const [switchToggle, setSwitchToggle] = useState(true);

  const ondisableClick = (
    industryClassificationId,
    industrySubClassificationId,
    status
  ) => {
    const Toggle_Status_params = {
      status: status,
    };
    dispatch(
      operation.user.indSubClassToggle({
        url: `/classification/${industryClassificationId}/subclassification/${industrySubClassificationId}`,
        params: Toggle_Status_params,
      })
    )
      .then((res) => {
        toast.success(res?.data?.message);
        const IND_SUBCLASS_PAYLOAD = {
          ...sortBy,
          page: page,
          size: pageSize,
        };
        dispatch(
          operation.user.getIndustrySubClassification({
            url: `/classification/${Location.state.classificationId}/subclassification`,
            params: IND_SUBCLASS_PAYLOAD,
          })
        );
      })
      .catch((e) => {
        toast.error(e?.message);
      });
  };

  console.log("----->", getMetaData);

  const changeMetaData = (id, value) => {
    setGetMetaData((prev) => {
      return prev.map((item) => {
        if (item.metadataId === id) {
          return {
            ...item,
            metadataName: value,
          };
        }
        return item;
      });
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
      <div style={{ textAlign: "center" }}>
        <p className="industrialSubClassificationtext">
          {t("Industry_Code")} :{" "}
          <span style={{ fontWeight: "400" }}>
            {Location.state.industryCode}
          </span>
        </p>
        <p className="industrialSubClassificationtext">
          {t("Industry_Classification")} :{" "}
          <span style={{ fontWeight: "400" }}>
            {Location.state.industryName}
          </span>
        </p>
      </div>
      <div className="tableHeaderActionContainer">
        <div className="tableHeaderActionDiv">
          <button
            id="createIndustrySubClassificationCreateBtnId"
            onClick={() => handleClickIndustrySubClassificationDialog()}
            className="logOutYesBtn"
          >
            <MdAddCircle size={24} />
            <div className="btnText"> {t("Add_Sub_Classification")}</div>
          </button>
        </div>
      </div>
      <Dialog open={openIndustrySubClassification}>
        <DialogTitle>{t("Create_Sub_Classification")}</DialogTitle>

        <DialogContent>
          <div style={{ color: "red" }}>{subErrorStatus?.errorTitle}</div>
          <Grid container>
            <Grid xs={12}>
              <InputField
                name={`${t("Industry_Sub_Classification_Code")} ${"*"}`}
                value={subCode}
                onChange={(e) => setSubCode(e.target.value)}
                id="IndustrySubClassificationCodeInputId"
              />
              <div style={{ color: "red" }}>
                {subErrorStatus?.subClassificationCode}
              </div>
            </Grid>
            <Grid xs={12}>
              <InputField
                name={`${t("Industry_Sub_Classification")} ${"*"}`}
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                id="IndustrySubClassificationInputId"
              />
              <div style={{ color: "red" }}>
                {subErrorStatus?.subClassificationNmae}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              id="createIndSubClassCancelBtnId"
              color="error"
              style={{ color: "red" }}
              onClick={() => {
                setOpenIndustrySubClassification(false),
                  setSubErrorStatus(""),
                  clearData();
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              id="createIndSubClassCreateBtnId"
              onClick={() => {
                onClickCreateBtn();
              }}
            >
              {t("Create")}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <table>
        <thead>
          {subClassificationList?.subClassificationList?.length === 0 ||
          subClassificationList?.subClassificationList?.length === 1 ? (
            <tr>
              <th>{t("Industry_Sub_Code_1")}</th>
              <th>{t("Industry_Sub_Classification")}</th>
              <th>{t("Action")}</th>
            </tr>
          ) : (
            <tr>
              <th>
                {t("Industry_Sub_Code_1")}

                {sortBy?.order == "DESC" ? (
                  <HiOutlineArrowNarrowDown
                    className="TbHeaderFilter"
                    onClick={() =>
                      onClickSort("SUB_CLASSIFICATION_CODE", "ASC")
                    }
                  />
                ) : (
                  <HiOutlineArrowNarrowUp
                    onClick={() =>
                      onClickSort("SUB_CLASSIFICATION_CODE", "DESC")
                    }
                    className="TbHeaderFilter"
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
                    onClick={() =>
                      onClickSort("SUB_CLASSIFICATION_NAME", "DESC")
                    }
                    className="TbHeaderFilter"
                  />
                )}
              </th>
              <th>{t("Action")}</th>
            </tr>
          )}
        </thead>
        {subClassificationList?.subClassificationList?.length === 0 ? (
          <tbody>
            <tr>
              <td
                style={{ height: "35px" }}
                data-column={t("Industry_Sub_Code_1")}
              ></td>
              <td
                style={{
                  borderLeft: "solid white 1px",
                  height: "35px",
                  color: "crimson",
                  fontSize: "18px",
                  textAlign: "center",
                }}
                className="NoDataInMobile TabViewAlignTable"
                data-column={t("Industry_Sub_Classification")}
              >
                {t("No_data_found")}
              </td>
              <td
                style={{ borderLeft: "solid white 1px", paddingBottom: "20px" }}
                data-column={t("Action")}
                className="tableActionDiv TableLastColToggle NodataLast"
              ></td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {subClassificationList?.subClassificationList?.map(
              ({
                subClassificationCode,
                subClassificationName,
                subClassificationId,
                status,
                classificationId,
              }) => {
                return (
                  <tr key={subClassificationId}>
                    <td data-column={t("Industry_Sub_Code_1")}>
                      {subClassificationCode}
                    </td>
                    <td data-column={t("Industry_Sub_Classification")}>
                      {subClassificationName}
                    </td>
                    <td
                      data-column={t("Action")}
                      className="tableActionDiv TableLastColToggle"
                    >
                      {status == "INACTIVE" ? (
                        <TiDocumentText
                          id="createMetaDataIconId"
                          size={24}
                          className="tableActionDisableIcon"
                        />
                      ) : (
                        <Tooltip title={t("Add_Project_Meta_Data")}>
                          <TiDocumentText
                            id="createMetaDataIconId"
                            onClick={() =>
                              handleClickCreateMetaDataOpen(
                                classificationId,
                                subClassificationId
                              )
                            }
                            size={24}
                            className="tableActionIcon"
                          />
                        </Tooltip>
                      )}
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={status === "INACTIVE" ? false : true}
                          onChange={(e) => {
                            setSwitchToggle(e.target.checked);
                            ondisableClick(
                              classificationId,
                              subClassificationId,
                              status === "INACTIVE" ? "ACTIVE" : "INACTIVE"
                            );
                          }}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        )}
      </table>
      <Dialog open={createMetaDataOpen}>
        <DialogTitle style={{ marginRight: "200px" }}>
          {t("Add_Project_Meta_Data")}
        </DialogTitle>

        <DialogContent>
          <div
            style={{ color: "red", display: "flex", justifyContent: "center" }}
          >
            {metaDataError?.errorTitle}
          </div>
          <div style={{ color: "red" }}>{metaDataError?.metadataName}</div>
          <form>
            {getMetaData
              ?.filter((item) => {
                return item?.status == "ACTIVE";
              })
              ?.map((item) => {
                return (
                  <Grid key={item?.metadataId} container>
                    <Grid xs={11}>
                      <InputField
                        name={t("Project_Meta_Data")}
                        label="metadataName"
                        value={item?.metadataName}
                        onChange={(e) => {
                          changeMetaData(item?.metadataId, e.target.value);
                        }}
                        id="usermanagementFirstNameId"
                      />
                      {item?.error !== "" && (
                        <p style={{ color: "red" }}>{item?.error}</p>
                      )}
                    </Grid>
                    <Grid xs={1}>
                      <ImCross
                        size={15}
                        onClick={() =>
                          handleClickOpenDel(
                            item?.metadataId,
                            item?.classificationId,
                            item?.subClassificationId,
                            item?.metadataName
                          )
                        }
                        style={{
                          color: "red ",
                          marginLeft: "20px",
                          marginTop: "44px",
                        }}
                      />
                    </Grid>
                  </Grid>
                );
              })}

            <Dialog
              open={openDel}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {t("Are_you_sure_you_want_to_delete_this")}{" "}
                  <strong>{delMetaName}</strong>?
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
                  onClick={() => onClickDelbBtn()}
                  style={{ color: "red" }}
                  color="error"
                  id="deleteUserDeleteBtnId"
                >
                  {t("Delete")}
                </Button>
              </DialogActions>
            </Dialog>
            {inputList.map((input, index) => {
              return (
                <div key={index} className="projectMetaDataContainer">
                  <div style={{ width: "100%" }}>
                    <InputField
                      name={`${t("Project_Meta_Data")} ${"*"}`}
                      label="metadataName"
                      id="usermanagementFirstNameId"
                      value={input.metadataName}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                    {input?.error !== "" && (
                      <p style={{ color: "red" }}>{input?.error}</p>
                    )}
                  </div>
                  {getMetaData?.length !== null
                    ? inputList?.length >= 1 && (
                        <div onClick={() => handleRemoveClick(index)}>
                          {" "}
                          <ImCross
                            size={15}
                            style={{
                              color: "red ",
                              marginLeft: "20px",
                              marginTop: "44px",
                            }}
                          />
                        </div>
                      )
                    : inputList?.length !== 1 && (
                        <div onClick={() => handleRemoveClick(index)}>
                          {" "}
                          <ImCross
                            size={15}
                            style={{
                              color: "red ",
                              marginLeft: "20px",
                              marginTop: "44px",
                            }}
                          />
                        </div>
                      )}
                  {inputList.length - 1 === index && (
                    <div onClick={handleAddClick}>
                      <TiPlus
                        size={23}
                        style={{ color: "green", margin: "40px 0px -3px 20px" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </form>
        </DialogContent>

        <DialogActions>
          <Button
            color="error"
            id="createIndustrySubClassificationCancelBtnId"
            onClick={() => {
              setCreateMetaDataOpen(false),
                setMetaDataError(""),
                setInputList([
                  { isRequired: 1, metadataName: "", type: "STANDARD" },
                ]);
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            id="createIndustrySubClassificationApplyBtnId"
            onClick={() => {
              submit();
            }}
          >
            {t("Create")}
          </Button>
        </DialogActions>
      </Dialog>
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
                  setPageSize(e.target.value), setPageUseEffect(true);
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
      <Footer />
    </>
  );
};

export default CreateIndustrySubClassification;
