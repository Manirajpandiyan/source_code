import * as React from "react";
import PropTypes from "prop-types";
import SvgIcon from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import "./PlatformAdmin.css";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import Footer from "../../components/Footer";
import { MdOutlineNavigateNext } from "react-icons/md";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useSpring, animated } from "react-spring/";
import { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import InputField from "../../components/InputField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ImCross } from "react-icons/im";
import { TiPlus } from "react-icons/ti";
import { useCallback } from "react";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  in: PropTypes.bool,
};

const StyledTreeItemRoot = styled((props) => <TreeItem {...props} />)(
  ({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      "& .close": {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  })
);

export default function ProjectPhaseManagement() {
  const [OpenAddSubPhase, setOpenAddSubPhase] = useState(false);
  const { t } = useTranslation();
  const History = useNavigate();
  const Location = useLocation();
  const [openDelPhase, setOpenDelPhase] = useState(false);
  const [AddDelete, setAddDelete] = useState({ id: null, name: "" });
  const [treeData, setTreedata] = useState([]);
  const [errorStatus, setErrorStatus] = useState([]);
  const [phaseName, setPhaseName] = useState("");
  const [expanded, setExpanded] = useState([]);
  const [nodeList, setNodeList] = useState("");
  const handleClickOpenAddSubPhase = useCallback((id, name = "", type) => {
    setAddDelete({ id: id, name: name });
    if (type === "ADD") setOpenAddSubPhase(true);
    else setOpenDelPhase(true);
  }, []);

  const onDeteteorAdd = (type) => {
    if (type === "DELETE") {
      setOpenDelPhase(false);
      //DELETE SUBSCRIPTION
      dispatch(
        operation.user.deletePhase(
          `/classification/${Location.state.classificationId}/phase/${AddDelete?.id}`
        )
      )
        .then((res) => {
          toast.success(res?.data?.message);
          getAPIData();
        })
        .catch((e) => {
          toast.error(e?.data);
        });

      console.log(AddDelete); //DELETE id API CALL
    } else {
      setOpenAddSubPhase(false);
      const ADDPHASE_PAYLOAD = {
        parentPhaseId: AddDelete?.id,
        phaseName: phaseName,
      };
      dispatch(
        operation.user.createPhase({
          url: `/classification/${Location.state.classificationId}/phase`,
          data: ADDPHASE_PAYLOAD,
        })
      )
        .then((res) => {
          toast.success(res?.data?.message);
          clearData();
          getAPIData();
        })
        .catch((e) => {
          setErrorStatus(e?.data);
        });
      console.log(AddDelete); //ADD API CALL DELETE id API CALL
    }
  };

  const clearData = () => {
    setErrorStatus("");
    setPhaseName("");
    setAddDelete({ id: null, name: "" });
  };

  React.useEffect(() => {
    getAPIData();
  }, []);

  const getAPIData = async () => {
    try {
      const response = await dispatch(
        operation.orgAdmin.getPhase(
          `/classification/${Location.state.classificationId}/phase`
        )
      );
      const TREE_LIST = list_to_tree(
        response?.data?.data?.phaseDetailsList ?? []
      );
      setTreedata(TREE_LIST);
      setExpanded(() => {
        const UPDATED_LIST = TREE_LIST.map((item) => {
          return String(item?.phaseId);
        });
        return ["-1", ...UPDATED_LIST];
      });
    } catch (e) {
      console.log(e);
    }
  };

  const list_to_tree = (list) => {
    var map = {},
      node,
      roots = [],
      i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].phaseId] = i; // initialize the map
      list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      console.log("map 11", list[i]);
      node = list[i];
      if (node.parentPhaseId !== null) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parentPhaseId]].children.push({ ...node });
      } else {
        roots.push(node);
      }
    }
    return roots;
  };

  console.log("TREE DATA", treeData);

  const operation = useOperation();
  const dispatch = useDispatch();

  function StyledTreeItem(props) {
    const { labelInfo, labelText, ...other } = props;

    return (
      <StyledTreeItemRoot
        label={
          <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "inherit", flexGrow: 1 }}
            >
              {labelText}
            </Typography>
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          </Box>
        }
        {...other}
      />
    );
  }

  const handleToggle = (e, nodeIds) => {
    setExpanded(nodeIds);
  };

  React.useEffect(() => {
    console.log("--------->>>>");
    const getTreeItemsFromData = (treeItems) => {
      console.log("-----------------------getTreeItems");
      return treeItems.map((treeItemData) => {
        let children = undefined;
        if (treeItemData.children && treeItemData.children.length > 0) {
          children = getTreeItemsFromData(treeItemData.children);
        }
        return (
          <StyledTreeItem
            key={treeItemData.phaseId}
            nodeId={String(treeItemData.phaseId)}
            labelText={treeItemData.phaseName}
            children={children}
            labelInfo={
              <>
                <div className="PhaseSec">
                  <TiPlus
                    className="ProjectPhaseAddBtn"
                    id="ProjectPhaseManagementAddSub"
                    onClick={() =>
                      handleClickOpenAddSubPhase(
                        treeItemData.phaseId,
                        treeItemData.phaseName,
                        "ADD"
                      )
                    }
                  />
                  <ImCross
                    className="ProjectPhaseCancelBtn"
                    id="ProjectPhaseManagementCancelSub"
                    onClick={() =>
                      handleClickOpenAddSubPhase(
                        treeItemData.phaseId,
                        treeItemData.phaseName,
                        "DELETE"
                      )
                    }
                  />
                </div>
              </>
            }
          />
        );
      });
    };
    if (treeData) {
      setNodeList(getTreeItemsFromData(treeData));
    }
  }, [treeData]);

  return (
    <>
      {" "}
      <Header />
      <NavigationHeader />
      <div className="breadCrumbDiv">
        <Stack spacing={2}>
          <Breadcrumbs
            separator={<MdOutlineNavigateNext fontSize="small" />}
            aria-label="breadcrumb"
          >
            [
            <Link
              underline="hover"
              id="ProjectPhaseManagementBreadcrumbId1"
              key="1"
              color="inherit"
              onClick={() => History(PATHS.INDUSTRYCLASSIFICATION)}
            >
              {t("Industrial_Classification")}
            </Link>
            ,
            <Typography key="2" color="text.primary">
              {t("Project_Phase_Management")}
            </Typography>
            ];
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
      <div className="PhaseWholeec">
        <div
          className="proPhaseContainer"
          style={{
            display: "flex",
            alignItem: "center",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          {nodeList && (
            <TreeView
              aria-label="customized"
              expanded={expanded}
              onNodeToggle={handleToggle}
              defaultExpanded={["1"]}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              defaultEndIcon={<CloseSquare />}
              sx={{ flexGrow: 1, maxWidth: 600 }}
            >
              {/*Parrent node */}
              <StyledTreeItem
                key={-1}
                nodeId={"-1"}
                labelText={Location.state.industryName}
                labelInfo={
                  <TiPlus
                    style={{ fontSize: "18px", color: "green" }}
                    id="ProjectPhaseManagementAddSub"
                    onClick={() =>
                      handleClickOpenAddSubPhase(
                        null,
                        Location.state.industryName,
                        "ADD"
                      )
                    }
                  />
                }
              >
                {nodeList}
              </StyledTreeItem>
            </TreeView>
          )}
          {/* Open Sub Add Phase */}
        </div>
      </div>
      <Dialog open={OpenAddSubPhase}>
        <DialogTitle>
          {`Create Project Sub Phase for ${AddDelete?.name}`}{" "}
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <InputField
                name={`${t("Project_Phase")} ${"*"}`}
                value={phaseName}
                onChange={(e) => setPhaseName(e.target.value)}
                id="ProjectPhaseNameId"
              />
              <div style={{ color: "red" }}>{errorStatus?.phaseName}</div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              id="projectPhaseSubCancel"
              color="error"
              onClick={() => {
                setOpenAddSubPhase(false);
              }}
            >
              {t("Cancel")}
            </Button>
            {phaseName == null || phaseName == "" ? null : (
              <Button
                id="ProjectPhaseSubAddBtnId"
                onClick={() => {
                  onDeteteorAdd("ADD");
                }}
              >
                {t("Create")}
              </Button>
            )}
          </div>

          {/* onAddclick() */}
        </DialogActions>
      </Dialog>
      {/* Delete The Sub Phase */}
      <Dialog open={openDelPhase}>
        <DialogTitle>
          {" "}
          {`Are you sure, you want to delete ${AddDelete?.name}`}
        </DialogTitle>
        <DialogActions>
          <div>
            <Button
              onClick={() => {
                setOpenDelPhase(false);
              }}
              id="ProjectPhaseDelCancelBtnId"
            >
              {t("Cancel")}
            </Button>
            <Button
              id="ProjectPhaseYesBtnId"
              color="error"
              onClick={() => {
                onDeteteorAdd("DELETE");
              }}
            >
              {t("Delete")}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
}
