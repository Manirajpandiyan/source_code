import React, { useEffect, useState } from 'react'
import Navbar from "./Navbar";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { GrLinkPrevious } from 'react-icons/gr';
import { GrLinkNext } from 'react-icons/gr';
import Header from '../components/AllScreenHeader';
import { actions as Transactionaction } from "../store/module/Pointmodule";
import moment from 'moment';
import { httpService } from '../api/Request/service';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { FaRegEye } from "react-icons/fa";
import { MdFilterAlt, MdOutlineFirstPage, MdOutlineLastPage } from "react-icons/md";
import { actions as Expenseactions } from "../store/module/Expensemodule";


function SuperAdminAccount() {
  const dispatch = useDispatch();
  const TransactionState = useSelector((state) => state.point);
  const [pageNo, setpageNo] = useState(1);
  const [ExpCat, setExpCat] = useState([]);
  const [openfilter, setOpenFilter] = useState(false);
  const [openTransactionDetails, setopenTransactionDetails] = useState(false);
  const [TransactionId, setTransactionDetailId] = useState("");
  const ExpenseState = useSelector((state) => state.expenses);
  console.log("TransactionId", TransactionId)

  useEffect(() => {
    const TRANSACTION_PAYLOAD = {
      END_POINT1: 'transactions',
      Query: {
        "memberId": 1,
        "page": pageNo,
        "size": 10,
        ...filter
      }
    }
    dispatch(Transactionaction.transaction(TRANSACTION_PAYLOAD))
  }, [pageNo])

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
  })

  const handleFilterOK = () => {
    setOpenFilter(false);
    const TRANSACTION_PAYLOAD = {
      END_POINT1: 'transactions',
      Query: {
        "memberId": 1,
        "page": pageNo,
        "size": 10,
        ...filter
      }
    }
    dispatch(Transactionaction.transaction(TRANSACTION_PAYLOAD))
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

  const superAdminResetFilter = () => {
    setFilter({
      expenseCategoryId: "",
      transactionType: "",
      startDate: "",
      endDate: "",
    })

    setOpenFilter(false);

    const TRANSACTION_PAYLOAD = {
      END_POINT1: 'transactions',
      Query: {
        "memberId": 1,
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
      <div className="PointDetailsContainer">
        <Grid container xs={12} style={{ padding: "15px" }}>
          <Grid xs={4} className='userListText' >
            Super Admin Transaction
          </Grid>
          <Grid xs={8} container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Grid className='filterDiv' >
              <div className="dropdown" id="superAdminTransactionFilterBtnId" onClick={handleClickStatusFilterOpen}>
                <button className="bookingFilter"><MdFilterAlt size="20" />Filter</button>
              </div>
              <Dialog open={openfilter}
                onClose={handleStatusFilterClose} >
                <DialogTitle>Filter</DialogTitle>
                <DialogContent>
                  <Grid container>


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
                    <Grid xs={12}>
                      <label htmlFor="Status">
                        Transaction Type
                      </label>
                      <div className="customSelect typesOfPayment" id="disputeStatusDropDownId" >
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
                      <div className="customSelect typesOfPayment" id="disputeStatusDropDownId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            expenseCategoryId: e.target.value
                          })
                        }} value={filter?.expenseCategoryId}>
                          <option value="" diabled selected hidden id="expenseofSelectId">---Select---</option>
                          {/* onChange={e => setExpenseFor(e.target.value)} */}
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
                  <Button id="superAdminFilterResetBtnId" onClick={() => { superAdminResetFilter() }}>Reset</Button>
                  <Button id="superAdminFilterCancelBtnId" onClick={handleStatusFilterClose} >Cancel</Button>
                  <Button id="superAdminFIlterOkBtnId" onClick={handleFilterOK} variant="contained" color="success">OK</Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} className='filterDiv'>

        </Grid>
        {TransactionState?.transaction?.data?.data?.transactionList?.length == 0 ? <Grid className='no_data_found'>No transaction available</Grid> :
          <table id="pointDetailHeader">
            <thead >
              <tr>
                <th>Transaction Date</th>
                <th>Transaction Type</th>
                <th>Expense Category</th>
                <th>Points</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {TransactionState.transaction?.data?.data?.transactionList.map(({ transactionDate, transactionType, points, expenseCategory, transactionId }) => {
                return (
                  <tr key={transactionId} style={{ backgroundColor: transactionType != "DEBIT" ? "#ff8080" : "#66ff66" }}>
                    <td data-column="Transaction Date">{moment(transactionDate).format('DD-MM-YYYY')}</td>
                    <td data-column="Transaction Type">{transactionType == "DEBIT" ? "Added Points" : "Deducted Points"}</td>
                    <td data-column="Expense Category">{expenseCategory == null ? "NA" : expenseCategory}</td>
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
                <DialogContent>
                  <Grid container>
                    <Grid xs={12}>
                      <label htmlFor="firstname" >
                        Transaction Date
                      </label>

                      <input
                        type="text"
                        className="addUserInputField"
                        id="superAdminViewTransactionTransactionDateId"
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
                        id="superAdminViewTransactionExpCatId"
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
                      id="superAdminViewTransactionExpTypeId"
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
                        id="superAdminViewTransactionBalanceId"
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
                        id="superAdminViewTransactionPointId"
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
                        id="superAdminViewTransactionExpTypeId"
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
                        id="superAdminViewTransactionDescriptionId"
                        value={ExpenseState?.viewtransaction?.description}
                        readOnly
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button id="superAdminViewTransactionCancelBtnId" onClick={() => { handleClickTransactionDetailsClose() }} >Cancel</Button>
                </DialogActions>
              </Dialog>
            </tbody>
          </table>
        }
        <Grid className="Pagination_BookingList_Section" >
          {TransactionState?.transaction?.data?.data?.pageNo > 1 ?
            <div onClick={() => setpageNo(1)} className="paginationBtn" id="superAdminTransactionFirstPageId">
              <MdOutlineFirstPage size="20" style={{ padding: "5px" }} />
            </div>
            : null}
          {TransactionState?.transaction?.data?.data?.pageNo == 1 ? null :
            <div onClick={() => setpageNo(TransactionState?.transaction?.data?.data?.pageNo - 1)} className="paginationBtn" id="superAdminTransactionPrevBtnId">
              <GrLinkPrevious size="20" style={{ padding: "5px" }} />
            </div>
          }
          {TransactionState?.transaction?.data?.data?.pageNo !== TransactionState?.transaction?.data?.data?.totalNoOfPages && <div onClick={() => setpageNo(TransactionState?.transaction?.data?.data?.pageNo + 1)} id="superAdminTransactionNxtBtnId" className="paginationBtn">
            <GrLinkNext size="20" style={{ padding: "5px" }} />
          </div>
          }
          {TransactionState?.transaction?.data?.data?.totalNoOfRecords > 10 && TransactionState?.transaction?.data?.data?.pageNo !== TransactionState?.transaction?.data?.data?.totalNoOfPages ?
            <div onClick={() => setpageNo(TransactionState?.transaction?.data?.data?.totalNoOfPages)} className="paginationBtn" id="superAdminTransactionLastPageId">
              <MdOutlineLastPage size="20" style={{ padding: "5px" }} />
            </div> : null}
        </Grid>
      </div>
    </div>
  )
}

export default SuperAdminAccount