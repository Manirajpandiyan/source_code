import React, { useEffect, useState } from 'react'
import Navbar from "./Navbar";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { GrLinkPrevious } from 'react-icons/gr';
import { GrLinkNext } from 'react-icons/gr';
import Header from '../components/AllScreenHeader';
import { actions as Transactionaction } from "../store/module/Pointmodule";
import moment from 'moment';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MdDownload } from "react-icons/md";
import Loader from './Loader';
import { getDownloadFile } from '../api/Request/service';
import toast from 'react-hot-toast';
import { postExpenseForParticularBooking } from '../api/Api';
import { GiMoneyStack } from "react-icons/gi";
import { FaRegEye } from "react-icons/fa";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { httpService } from '../api/Request/service';
import { MdFilterAlt, MdOutlineFirstPage, MdOutlineLastPage } from "react-icons/md";
import { actions as Expenseactions } from "../store/module/Expensemodule";


const AdminCoconestAccount = () => {
  const dispatch = useDispatch();
  const TransactionState = useSelector((state) => state.point);
  const ExpenseState = useSelector((state) => state.expenses);
  const [pageNo, setpageNo] = useState(1);
  const [OpenDownload, setOpenDownload] = useState(false);
  const [startDate, setStartDate] = useState('')
  const [endDate, setendDate] = useState('')
  const [openExp, setOpenExp] = useState(false);
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [loading, setloading] = useState(false)
  const [transactionDate, setTransactionDate] = useState(moment());
  const [name, setname] = useState('');
  const namelist = JSON.parse(sessionStorage.getItem('nameList'))
  const [ExpCat, setExpCat] = useState([]);
  const [openfilter, setOpenFilter] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [openTransactionDetails, setopenTransactionDetails] = useState(false);
  const [errorStatus, setErrorStatus] = useState([]);
  const [errorGetStatus, setGetErrorStatus] = useState([]);
  const [TransactionId, setTransactionDetailId] = useState("");


  const [viewTransaction,] = useState(""); //setviewTransaction

  useEffect(() => {
    const TRANSACTION_PAYLOAD = {
      END_POINT1: 'transactions',
      Query: {
        "memberId": userData.userId,
        "page": pageNo,
        "size": 10,
        ...filter
      }
    }
    dispatch(Transactionaction.transaction(TRANSACTION_PAYLOAD))

  }, [pageNo])

  const postNotify = () => toast.success(("Successfully created the transaction"), {
    duration: 4000,
    position: "top-center"
  });

  const notify = () => toast.success(("Transaction history downloaded"), {
    duration: 4000,
    position: "top-center"
  });
  const handleClickTransactionDetailsOpen = (id) => {
    setTransactionDetailId(id)
    const VIEWTRANSACTION_PAYLOAD = {
      END_POINT1: "transactions",
      END_POINT2: id,
    }
    dispatch(Expenseactions.viewtransaction(VIEWTRANSACTION_PAYLOAD))
    setopenTransactionDetails(true);
  }
  const handleClickTransactionDetailsClose = () => {
    setopenTransactionDetails(false);
  }

  const handleClickOpenAddExp = () => {
    setOpenExp(true);
  };
  const onClickDownload = () => {
    setGetErrorStatus([]);
    getDownloadFile({ url: "/transactions/download", method: "GET", params: { "startDate": startDate, "endDate": endDate, } })
      .then((res) => {
        setOpenDownload(false);
        clearData1();
        notify();
        setExpCat([...res?.data?.data?.data])
      })
      .catch(e => {
        setGetErrorStatus([...e?.error?.response?.data?.data])
      })

  }
  const clearData1 = () => {
    setStartDate("");
    setendDate("");
    setGetErrorStatus([]);
  }

  const handleDownloadClose = () => {
    setOpenDownload(false);
    clearData1();
  };

  const handleClickFilterOpen = () => {
    setOpenDownload(true);
  };

  const onClickPostExpense = () => {
    setloading(true)
    const POST_BOOKING_EXPENSE_PAYLOAD = {
      END_POINT1: "transactions",
      Query: {
        "description": description,
        "expenseCategoryId": parseInt(expenseCategory),
        "memberId": name,
        "points": parseInt(points),
        "transactionDate": moment(transactionDate).format('YYYY-MM-DD'),
        "transactionType": "CREDIT"
      },
    };

    postExpenseForParticularBooking(POST_BOOKING_EXPENSE_PAYLOAD)
      .then(res => {
        postNotify()
        setOpenExp(false)
        setloading(false)
        clearData()
      })
      .catch(e => {
        setErrorStatus([...e?.status?.errorMessage])
        setloading(false)
      });
  }
  const clearData = () => {
    setDescription("");
    setExpenseCategory("");
    setTransactionDate("");
    setPoints("");
    setErrorStatus([]);
    setname("");
  }


  useEffect(() => {
    httpService({ url: `/expenseCategory/`, method: "GET" })
      .then((res) => {
        setExpCat([...res?.data?.data?.data])
      })
      .catch(e => {
        console.log("-->", e?.error?.response?.data?.data)
      })
  }, [])

  const handleClickStatusFilterOpen = () => {
    setOpenFilter(true);
  };

  const handleStatusFilterClose = () => {
    setOpenFilter(false);
  };

  const [filter, setFilter] = useState({
    expenseCategoryId: "",
    transactionType: "",
    startDate: "",
    endDate: "",
    status: "",
  })

  const handleFilterOK = () => {
    setOpenFilter(false);
    const TRANSACTION_PAYLOAD = {
      END_POINT1: 'transactions',
      Query: {
        "page": pageNo,
        "size": 10,
        ...filter
      }
    }
    dispatch(Transactionaction.transaction(TRANSACTION_PAYLOAD))
  }


  useEffect(() => {
    console.log("-->", TransactionState)
  })
  const transactionResetFilter = () => {
    setFilter({
      expenseCategoryId: "",
      transactionType: "",
      startDate: "",
      endDate: "",
      status: "",
    })
    setOpenFilter(false);
    const TRANSACTION_PAYLOAD = {
      END_POINT1: 'transactions',
      Query: {
        "memberId": userData.userId,
        "page": pageNo,
        "size": 10,

      }
    }
    dispatch(Transactionaction.transaction(TRANSACTION_PAYLOAD))
  }



  return (
    <div>
      <Navbar />
      <Header />
      <Loader load={loading} />
      <div className="PointDetailsContainer">
        <Grid xs={12} container style={{ marginBottom: "35px" }}>
          <Grid xs={4} md={5} className='userListText'>
            Transaction List
          </Grid>
          <Grid xs={8} sm={12} md={6} container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Grid className='filterDiv' sm={3} md={1} >
              <div className="dropdown" id="transactionFilterBtnId" onClick={handleClickStatusFilterOpen}>
                <button className="bookingFilter"><MdFilterAlt size="20" />Filter</button>
              </div>
              <Dialog open={openfilter}
                onClose={handleStatusFilterClose} >
                <DialogTitle>Filter</DialogTitle>
                <DialogContent>
                  <Grid container>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Member Name</label>
                      <div className="customSelect typesOfPayment" id="transactionFilterMemberNameId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            memberId: e.target.value
                          });
                        }} value={filter?.memberId} >
                          <option value="" diabled selected hidden >---Select---</option>
                          {namelist && namelist.map((name) => {
                            return (
                              <option key={name} value={name.userId}>{name.firstName} {name.lastName}</option>
                            )
                          })}
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="Status">
                        Status
                      </label>
                      <div className="customSelect typesOfPayment" id="transactionFilterStatusId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            status: e.target.value
                          })
                        }} value={filter?.status}>
                          <option value="" diabled selected hidden >---Select---</option>
                          <option value=" " id="newBookingsFreeBookingsId">All</option>
                          <option value="DISPUTE_ACCEPTED" id="newBookingsFreeBookingsId">Dispute Accepted</option>
                          <option value="DISPUTE_REJECTED" id="newBookingsCoinId">Dispute Rejected</option>
                          <option value="DISPUTE_PARTIALLY_ACCEPTED" id="newBookingsCoinId">Dispute Partially Accepted</option>
                          <option value="DISPUTE_SETTLEMENT" id="newBookingsCoinId">Dispute Settlement</option>
                          <option value="DISPUTED" id="newBookingsCoinId">Disputed</option>
                        </select>
                      </div>
                    </Grid>


                    <Grid xs={5}>
                      <label htmlFor="filterstartdate">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="filterstartdate"
                        id="filterstartdate"
                        onChange={(e) => {
                          setFilter({
                            ...filter,
                            startDate: e.target.value
                          });
                        }} value={filter?.startDate}
                        className="dialogueboxdatepicker"
                      />
                    </Grid>
                    <Grid xs={1.75}></Grid>
                    <Grid xs={5}>
                      <label htmlFor="filterenddate">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="filterenddate"
                        id="filterenddate"
                        onChange={(e) => {
                          setFilter({
                            ...filter,
                            endDate: e.target.value
                          });
                        }} value={filter?.endDate}
                        className="dialogueboxdatepicker"
                      />
                    </Grid>
                    <Grid xs={12} style={{ marginTop: "15px" }}>
                      <label htmlFor="Status">
                        Transaction Type
                      </label>
                      <div className="customSelect typesOfPayment" id="transactionFilterTypeId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            transactionType: e.target.value
                          })
                        }} value={filter?.transactionType}>
                          <option value="" diabled selected hidden >---Select---</option>
                          <option value="CREDIT" id="newBookingsCoinId"> Deducted Points</option>
                          <option value="DEBIT" id="newBookingsFreeBookingsId">Added Points</option>

                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="Status">
                        Expense Category
                      </label>
                      <div className="customSelect typesOfPayment" id="transactionExpCatId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            expenseCategoryId: e.target.value
                          })
                        }} value={filter?.expenseCategoryId}>
                          <option value="" diabled selected hidden id="expenseofSelectId">---Select---</option>
                          {(ExpCat ?? []).filter(ele => ele.expenseCategoryId !== 1).map(ele => {
                            return (
                              <option key={ele?.expenseCategoryId} value={ele?.expenseCategoryId}>{ele?.expenseCategory}</option>
                            )
                          })}

                        </select>

                      </div>
                    </Grid>
                  </Grid>


                </DialogContent>
                <DialogActions>
                  <Button id="transactionResetBtnId" onClick={() => { transactionResetFilter() }}>Reset</Button>
                  <Button id="transactionCancelBtnId" onClick={handleStatusFilterClose} >Cancel</Button>
                  <Button id="transactionOkBtnId" onClick={handleFilterOK} variant="contained" color="success">OK</Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid className='filterDiv' sm={5} md={4} >
              <div className="dropdown" id="transactionDownloadBtnId" onClick={handleClickFilterOpen}>
                <button className="bookingFilter"><MdDownload size="20" />Download</button>
              </div>
            </Grid>
            <Grid className='filterDiv' sm={3} md={1}>
              <div className="SettingsEditBtn" onClick={() => { handleClickOpenAddExp() }} id="transactionAddExpenseIcon">
                <GiMoneyStack size={25} style={{ padding: "5px" }} /> <div className="bookingText" id="transactionAddExpBtnId">Add Expense </div>
              </div>
              {/* <----------------------------------------Download--------------------------------> */}
              <Dialog open={OpenDownload}
                onClose={handleDownloadClose} >
                <DialogTitle>Download Your Transaction History</DialogTitle>
                <DialogContent>
                  <Grid container>
                    <Grid style={{ width: "100%" }}>
                      <ul>
                        {errorGetStatus.map((ele) => (
                          <li key={ele} style={{ color: "red", paddingTop: "15px" }}>
                            {'\u2022'}{'  '}{ele}
                          </li>
                        ))}
                      </ul>
                    </Grid>
                    <Grid xs={5}>
                      <label htmlFor="downloadstartdate">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="downloadstartdate"
                        id="downloadstartdate"
                        onChange={event => setStartDate(moment(event.target.value).format('YYYY-MM-DD'))}
                        className="dialogueboxdatepicker"
                      />
                    </Grid>
                    <Grid xs={1.75}></Grid>
                    <Grid xs={5}>
                      <label htmlFor="downloadenddate">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="downloadenddate"
                        id="downloadenddate"
                        onChange={event => setendDate(moment(event.target.value).format('YYYY-MM-DD'))}
                        className="dialogueboxdatepicker"
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button id="transactionDownloadCancelBtnId" onClick={handleDownloadClose}>Cancel</Button>
                  <Button id="transactionDownloadOkBtnId" variant="contained" onClick={() => { onClickDownload(); }} color="success">OK</Button>
                </DialogActions>
              </Dialog>
              {/* <----------------------------------------Add expense--------------------------------> */}
              <Dialog open={openExp} >
                <DialogTitle>Add Expense </DialogTitle>
                <DialogContent>
                  <Grid container>
                    <div style={{ width: "100%" }}>
                      <ul>
                        {errorStatus.map((ele) => (
                          <li key={ele} style={{ color: "red", paddingTop: "15px" }}>
                            {'\u2022'}{'  '}{ele}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Member Name<span className="required">*</span> </label>
                      <div className="customSelect typesOfPayment" id="transactionAddExpMemberNameId" >

                        <select onChange={(event) => { setname(event.target.value) }}>
                          <option value="" diabled selected hidden id="visitorManagementAddVisitorMember">---Select---</option>
                          {namelist && namelist.map((name) => {
                            return (
                              <option key={name} value={name.userId}>{name.firstName} {name.lastName}</option>
                            )
                          })}
                        </select>


                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="dateOfVisit">
                        Transaction Date
                      </label><span className="required">*</span>
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
                      <div className="customSelect bookingType">
                        <label htmlFor="expenseof">Expense Category</label><span className="required">*</span>
                        <select onChange={(event) => setExpenseCategory(event.target.value)} >
                          <option value="" diabled selected hidden id="expenseofSelectId">---Select---</option>
                          {(ExpCat ?? []).filter(ele => ele.expenseCategoryId !== 1).map(ele => {
                            return (
                              <option key={ele?.expenseCategoryId} value={ele?.expenseCategoryId}>{ele?.expenseCategory}</option>
                            )
                          })}

                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="expensePoints">
                        Expense (Points)<span className="required">*</span>
                      </label>
                      <input type="number" id="number1"
                        className="numOfAdults" maxLength="10"
                        style={{ width: "95%" }}
                        onChange={(event) => {
                          setPoints(event.target.value);
                        }}></input>
                    </Grid>
                    <Grid xs={12}>
                      <label style={{ textAlign: "start", width: "100%" }} htmlFor="address">
                        Description<span className="required">*</span>
                      </label>

                      <textarea
                        id="transactionAddExpDescriptionId"
                        onChange={(event) => {
                          setDescription(event.target.value);
                        }}
                      ></textarea>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button id="addExpCancelBtnId" onClick={() => { setOpenExp(false); clearData() }} >Cancel</Button>
                  <Button id="addExpAddBtnId" onClick={() => onClickPostExpense()} variant="contained" color="success">Add</Button>
                  {/* onAddclick() */}
                </DialogActions>
              </Dialog>

            </Grid>
          </Grid>
        </Grid>

        {TransactionState?.transaction?.data?.data?.transactionList.length == 0 ? <Grid className='no_data_found'>No transaction available</Grid> :
          <table id="pointDetailHeader">
            <thead >
              <tr>
                <th>Transaction Date</th>
                <th>Member Name</th>
                <th>Expense Category</th>
                <th>Transaction Type</th>
                <th>Points</th>
                <th>Action</th>

              </tr>
            </thead>
            <tbody>
              {TransactionState.transaction?.data?.data?.transactionList.filter(ele => ele.memberId !== 1).map(({ transactionDate, memberFullName, transactionType, points, expenseCategory, transactionId }) => {
                return (
                  <tr key={transactionId} style={{ backgroundColor: transactionType != "DEBIT" ? "#ff8080" : "#66ff66" }}>
                    <td data-column="Transaction Date">{moment(transactionDate).format('DD-MM-YYYY')}</td>
                    <td data-column="Name">{memberFullName}</td>
                    <td data-column="Category">{expenseCategory == null ? "NA" : expenseCategory}</td>
                    <td data-column="Transaction Type">{transactionType == "DEBIT" ? "Added Points" : "Deducted Points"}</td>
                    <td data-column="Points">{points}</td>
                    <td data-column="Action" className="BookingListAction">

                      <Tooltip title="View Transaction">
                        <IconButton>
                          <FaRegEye id="disputeManagementEditBtnId" onClick={() => handleClickTransactionDetailsOpen(transactionId)} className="actionIcons" size="22" />
                        </IconButton>
                      </Tooltip>
                    </td>

                  </tr>
                )
              })}
              <Dialog open={openTransactionDetails} >
                <DialogTitle>View Transaction</DialogTitle>
                {/* {userNameId.userName} */}
                <DialogContent>
                  <Grid container>
                    <Grid xs={12}>
                      <label htmlFor="firstname" >
                        Member Name
                      </label>

                      <input
                        type="text"
                        className="addUserInputField"
                        id="viewTransactionMemberNameId"
                        value={(namelist ?? []).filter((ele) => { if (ele?.userId == ExpenseState?.viewtransaction?.memberId) return ele })[0]?.firstName + " " + (namelist ?? []).filter((ele) => { if (ele?.userId == ExpenseState?.viewtransaction?.memberId) return ele })[0]?.lastName}
                        readOnly
                      />
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="firstname" >
                        Transaction Date
                      </label>

                      <input
                        type="text"
                        className="addUserInputField"
                        id="viewTransactionTransactionDateId"
                        value={moment(ExpenseState?.viewtransaction?.transactionDate).format('DD-MM-YYYY')}
                        readOnly
                      />
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="firstname" >
                        Expense Category
                      </label>

                      <input
                        type="text"
                        className="addUserInputField"
                        id="viewTransactionExpCatId"
                        value={ExpenseState?.viewtransaction?.expenseCategory}
                        readOnly
                      />
                    </Grid>
                  </Grid>

                  <Grid xs={12}>
                    <label htmlFor="firstname" >
                      Expense Type
                    </label>

                    <input
                      type="text"
                      className="addUserInputField"
                      id="viewTransactionExpTypeId"
                      value={ExpenseState?.viewtransaction?.transactionType}
                      readOnly
                    />
                  </Grid>
                  <Grid container>

                    <Grid xs={12}>
                      <label htmlFor="firstname" >
                        Balance
                      </label>

                      <input
                        type="text"
                        className="addUserInputField"
                        id="viewTransactionBalanceBtnId"
                        value={ExpenseState?.viewtransaction?.balance}
                        readOnly
                      />
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="firstname" >
                        Points
                      </label>

                      <input
                        type="text"
                        className="addUserInputField"
                        id="viewDisputePointsBtnId"
                        value={ExpenseState?.viewtransaction?.points}
                        readOnly
                      />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid xs={12}>
                      <label htmlFor="firstname" >
                        Expense Type
                      </label>

                      <input
                        type="text"
                        className="addUserInputField"
                        id="viewDisputeExpTypeId"
                        value={ExpenseState?.viewtransaction?.transactionType}
                        readOnly
                      />
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="firstname" >
                        Description
                      </label>

                      <input
                        type="text"
                        className="addUserInputField"
                        id="viewTransactionDescriptionId"
                        value={ExpenseState?.viewtransaction?.description}
                        readOnly
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button id="viewTransactionCancelBtnId" onClick={() => { handleClickTransactionDetailsClose() }} >Cancel</Button>
                </DialogActions>
              </Dialog>
            </tbody>
          </table>
        }
        <Grid className="Pagination_BookingList_Section" >
          {TransactionState?.transaction?.data?.data?.pageNo > 1 ?
            <div onClick={() => setpageNo(1)} className="paginationBtn" id="transactionFirstPageId">
              <MdOutlineFirstPage size="20" style={{ padding: "5px" }} />
            </div>
            : null}
          {TransactionState?.transaction?.data?.data?.pageNo == 1 ? null :
            <div onClick={() => setpageNo(TransactionState?.transaction?.data?.data?.pageNo - 1)} className="paginationBtn" id="transactionPrevBtnId">
              <GrLinkPrevious size="20" style={{ padding: "5px" }} />
            </div>
          }
          {TransactionState?.transaction?.data?.data?.pageNo !== TransactionState?.transaction?.data?.data?.totalNoOfPages && <div onClick={() => setpageNo(TransactionState?.transaction?.data?.data?.pageNo + 1)} className="paginationBtn" id="transactionNxtBtnId">
            <GrLinkNext size="20" style={{ padding: "5px" }} />
          </div>
          }
          {TransactionState?.transaction?.data?.data?.totalNoOfRecords > 10 && TransactionState?.transaction?.data?.data?.pageNo !== TransactionState?.transaction?.data?.data?.totalNoOfPages ?
            <div onClick={() => setpageNo(TransactionState?.transaction?.data?.data?.totalNoOfPages)} className="paginationBtn" id="transactionLastPageBtnId">
              <MdOutlineLastPage size="20" style={{ padding: "5px" }} />
            </div> : null}
        </Grid>
      </div>
    </div>
  )
}

export default AdminCoconestAccount