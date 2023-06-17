import * as React from "react";
import { Grid } from "@mui/material";
import "../BookingList.css";
import { PATHS } from "../../routes/index";
import { useNavigate } from "react-router-dom";
import { RiHotelFill } from 'react-icons/ri';
import { GrLinkPrevious } from 'react-icons/gr';
import { GrLinkNext } from 'react-icons/gr';
import { ImCancelCircle } from 'react-icons/im';
import { MdEdit, MdFilterAlt, MdOutlineLastPage, MdOutlineFirstPage } from "react-icons/md";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MANAGERHEADER from './ManagerAllScreenHeader';
import ManagerNavbar from "./ManagerNavbar";
import { FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from "moment";
import { actions as Bookingaction } from "../../store/module/Bookingmodule";
import StaticContent from "../StatisContent";
import { toast } from "react-hot-toast";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { GiMoneyStack } from "react-icons/gi";
import { FilterStorage, httpService } from "../../api/Request/service";
import { BsFillCalendar2CheckFill } from "react-icons/bs";

const ManagerBookingManagement = () => {
  const History = useNavigate();
  const [bookingcancelopen, setBookingCancelOpen] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [errorGetStatus, setGetErrorStatus] = useState([]);
  const [cancelBookingId, setCancelBookingId] = useState('')
  const [openbookingFilter, setOpenBookingFilter] = React.useState(false);
  const [Canceldate, setCanceldate] = useState("");

  const handleBookingCancel = () => {
    setBookingCancelOpen(false);

    httpService({ url: `/bookings/${cancelBookingId}`, method: "DELETE", params: { description: description } })
      .then((res) => {
        console.log(res);
        notify();

        setBookingCancelOpen(false);
        const BOOKINGLIST_PAYLOAD = {
          END_POINT1: 'bookings',
          Query: {
            page: 1,
            size: 10
          }
        }
        setpageNo(1);
        dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD))
      }).catch(e => {
        console.log(e)
      })

  };


  const dispatch = useDispatch();
  const [pageNo, setpageNo] = useState(1);
  const BookingListState = useSelector(state => state.booking);
  const [bookinglist, setbookinglist] = useState([]);
  const [statusfilter, setstatusfilter] = useState([]);

  const [filter, setFilter] = useState({
    memberId: "",
    bookedFor: "",
    bookingType: "",
    paymentType: "",
    status: "",
    endDate: "",
    startDate: "",
  })

  const [dateFilter, setdateFilter] = useState({
    date: "",
  })

  useEffect(() => {
    let data = JSON.parse(sessionStorage.getItem(FilterStorage.BOOKING));
    if (data) {
      setFilter({
        memberId: data?.memberId,
        bookedFor: data.bookedFor,
        bookingType: data.bookingType,
        paymentType: data.paymentType,
        status: data.status,
        endDate: data.endDate,
        startDate: data.startDate,
      })
      BookingListAPI({ ...data, page: data.page })
    } else {
      BookingListAPI({ page: pageNo })
    }

  }, [])


  const BookingListAPI = (filtersparams) => {
    const BOOKINGLIST_PAYLOAD = {
      END_POINT1: 'bookings',
      Query: {
        size: 10,
        ...filtersparams
      }
    }
    dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD));
    dispatch(Bookingaction.resetState());
    sessionStorage.setItem(FilterStorage.BOOKING, JSON.stringify({ ...filter, page: filtersparams.page }));
  }


  const notify = () => toast.success(("Successfully cancelled the booking"), {
    duration: 4000,
    position: "top-center"
  });

  useEffect(() => {
    if (BookingListState.cancelBookingReponse?.statusCode == StaticContent.Status200) {
      const BOOKINGLIST_PAYLOAD = {
        END_POINT1: 'bookings',
        Query: {
          page: pageNo,
          size: 10,
          ...filter
        }
      }
      dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD))
      notify()
      dispatch(Bookingaction.resetState())
    }
  }, [BookingListState.cancelBookingReponse])


  const handleClickFilterOpen = () => {
    setOpenBookingFilter(true);
  };

  const handleFilterClose = (type) => {
    setOpenBookingFilter(false);
    let BOOKINGLIST_PAYLOAD = {}
    if (type === "OK") {
      BOOKINGLIST_PAYLOAD = {
        END_POINT1: 'bookings',
        Query: {
          page: 1,
          size: 10,
          ...filter

        }
      }
    } else if (type === "RESET") {
      BOOKINGLIST_PAYLOAD = {
        END_POINT1: 'bookings',
        Query: {
          page: 1,
          size: 10

        }
      }
      setFilter({
        memberId: "",
        bookedFor: "",
        bookingType: "",
        paymentType: "",
        status: "",
        endDate: "",
        startDate: "",
      })
    }
    if (type !== "CANCEL") {
      setpageNo(1);
      dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD))
    }
    sessionStorage.setItem(FilterStorage.BOOKING, JSON.stringify({ ...filter, page: 1 }))
  };

  const getPanaltymsg = () => {

    var given = moment(Canceldate, "YYYY-MM-DD");
    var current = moment().startOf('day');

    return moment.duration(given.diff(current)).asDays() === 1 ? "If you cancel the booking after 24 hours(calculated from when you're booked) you'll be charged penalty" : ""
  }

  const namelist = JSON.parse(sessionStorage.getItem('nameList'))

  const datefind = (startdate, enddate, status) => {
    if (status === "CANCELLED") {
      return false;
    } else {
      let endDate1 = moment(enddate, "YYYY-MM-DD").add('days', 2);
      return moment().isBetween(moment(startdate).format("YYYY-MM-DD"), moment(endDate1).format("YYYY-MM-DD"));
    }


  }

  const [openBookingStatus, setopenBookingStatus] = useState(false);
  const [availability, setAvailability] = useState([])
  const handleClickBookingOpen = () => {
    setopenBookingStatus(true);

  };

  const handleBookingClose = () => {
    setdateFilter("");
    setAvailability("")
    setopenBookingStatus(false);
    clearData1();
    setdateFilter({
      date: ""
    });
  };

  const onClickAvailability = () => {
    setGetErrorStatus([]);
    httpService({ url: `/bookingdetails`, method: "GET", params: { ...dateFilter } })
      .then((res) => {
        setAvailability([...res?.data?.data?.data])
        clearData1();
      }).catch(e => {
        setGetErrorStatus([...e?.error?.response?.data?.data])
      })

  }

  const clearData1 = () => {

    setGetErrorStatus([]);
  }

  const onCancelChange = (status, checkin) => {
    if (status === "CANCELLED") {
      return true;
    } else {
      return moment(moment().format("YYYY-MM-DD")).isAfter(moment(checkin).format('YYYY-MM-DD'))
    }
  }

  return (

    <div>
      <ManagerNavbar />
      <MANAGERHEADER />
      <div className="BookingList_MainContainer">
        <Grid xs={12} container>
          <Grid xs={3} md={5} className='BookingList_Section_Text'>
            Booking List
          </Grid>
          <Grid xs={9} sm={12} md={6} container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Grid xs={4} sm={3} md={1} className='filterDiv'>
              <div className="dropdown" id="managerBookingManagementFilterId" onClick={handleClickFilterOpen}>
                <button className="bookingFilter"><MdFilterAlt size="20" />Filter</button>
              </div>
              <Dialog open={openbookingFilter}
                onClose={handleFilterClose} >
                <DialogTitle>Filter</DialogTitle>
                <DialogContent>
                  <Grid container>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Bookings</label>
                      <div className="customSelect typesOfPayment" id="managerBookingFilterBookingId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            status: e.target.value
                          })
                        }} value={filter?.status}>
                          <option value="" diabled selected hidden >---Select---</option>
                          <option value="CONFIRMED" id="newBookingsFreeBookingsId">Confirmed Bookings</option>
                          <option value="CANCELLED" id="newBookingsCoinId"> Cancelled Bookings</option>
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Payment Method</label>
                      <div className="customSelect typesOfPayment" id="managerBookingFilterPaymentMethodId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            paymentType: e.target.value
                          })
                        }} value={filter?.paymentType}>
                          <option value="" diabled selected hidden >---Select---</option>
                          <option value="Points" id="newBookingsFreeBookingsId">Points</option>
                          <option value="Direct Payment" id="newBookingsCoinId">Direct Payment</option>
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Booking Type</label>
                      <div className="customSelect typesOfPayment" id="managerBookingFilterBookingTypeId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            bookingType: e.target.value
                          });
                        }} value={filter?.bookingType}>
                          <option value="" diabled selected hidden >---Select---</option>
                          <option value="Room" id="newBookingsFreeBookingsId">Room Booking</option>
                          <option value="Day" id="newBookingsCoinId"> Special Day Booking</option>
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Booking For</label>
                      <div className="customSelect typesOfPayment" id="managerBookingFilterBookingForId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            bookedFor: e.target.value
                          });
                        }} value={filter?.bookedFor}>
                          <option diabled selected hidden >---Select---</option>
                          <option value="Member" id="newBookingsCoinId"> Member</option>
                          <option value="Non-Member" id="newBookingsCoinId"> Non- Member</option>
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Member Name</label>
                      <div className="customSelect typesOfPayment" id="managerBookingFilterMemberNameId" >
                        <select onChange={(e) => {
                          setFilter({
                            ...filter,
                            memberId: e.target.value
                          });
                        }} value={filter?.memberId} >
                          <option value="" diabled selected hidden id="expenseofSelectId">---Select---</option>
                          {namelist && namelist.map((name) => {
                            return (
                              <option key={name} value={name.userId}>{name.firstName} {name.lastName}</option>
                            )
                          })}
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
                    <Grid xs={2}></Grid>
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
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button id="managerBookingFilterResetBtnId" onClick={() => { handleFilterClose("RESET") }} >Reset</Button>
                  <Button id="managerBookingFilterCancleBtnId" onClick={() => { handleFilterClose("CANCEL") }}>Cancel</Button>
                  <Button id="managerBookingFilterOkBtnId" onClick={() => { handleFilterClose("OK") }} variant="contained" color="success">OK</Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid xs={4} sm={5} md={4}>
              <div className="BookingList_Availability" onClick={handleClickBookingOpen} id="memberbookingNewBookingsId">
                <BsFillCalendar2CheckFill size={20} style={{ padding: "5px" }} /> <div className="bookingText" id="managerBookingAvailabilityCheckFilterId" >Booking Status</div>
              </div>
              <Dialog open={openBookingStatus}
                onClose={handleBookingClose} >
                <DialogTitle>Booking status</DialogTitle>
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
                    <Grid xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                      <label style={{ fontWeight: "bold", width: "150px" }}>Availability date</label>
                      <input type="date" name="availabilitydate" id="availabilitydate" className="formdatepicker"
                        onChange={(e) => {
                          setdateFilter({
                            ...dateFilter,
                            date: e.target.value
                          });
                        }}></input>
                    </Grid>
                    <Grid xs={12}>
                      <div className="customSelect typesOfPayment" id="newBookingsTypeOfPaymentId" >
                        {availability?.length == 0 ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10%", fontWeight: '900' }}>There are no bookings on selected date</div> :
                          <table>
                            <thead>
                              <tr>
                                <th>Number of Rooms</th>
                                <th>Booking Type</th>
                                <th>Check In</th>
                                <th>People Count</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(availability ?? []).map(ele => {
                                return (
                                  <tr key={ele?.lastname}>
                                    <td data-column="Number of Rooms">{ele?.numOfRooms}</td>
                                    <td data-column="Type">{ele?.bookingType}</td>
                                    <td data-column="Check In">{moment(ele?.date).format('DD-MM-YYYY')}</td>
                                    <td data-column="People Count">{ele?.numOfAdults} adult {ele?.numOfChildren} kid</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        }
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button id="managerBookingAvailabilityCancelBtnId" onClick={handleBookingClose} >Cancel</Button>
                  <Button id="managerBookingAvailabilitySearchBtnId" variant="contained" onClick={() => { onClickAvailability() }} color="success">Search</Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid xs={4} sm={3} md={1}>
              <div id="managerBookingManagementNewBookingId" className="bookingNewBookingDiv" onClick={() => History(PATHS.MANAGERNEWBOOKING)}>
                <RiHotelFill size={25} style={{ padding: "5px" }} /> <div className="bookingText">New Booking</div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className='BookingList_Section'>
        <Grid >
          {bookinglist?.data?.data?.bookingDetailsList.length == 0 ? <Grid className='no_data_found'>No bookings available</Grid> :
            <table>
              <thead>
                <tr>
                  <th>Booked Date</th>
                  <th>Guest Name</th>
                  <th>Type</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Number of Rooms</th>
                  <th>Payment Type</th>
                  <th>Status</th>
                  <th>Action</th>

                </tr>
              </thead>
              <tbody>
                {BookingListState.bookinglist?.data?.data?.bookingDetailsList && BookingListState.bookinglist?.data?.data?.bookingDetailsList.map(({ bookingId, bookingType, checkInDate, checkOutDate, paymentType, createdDate, guestName, memberId, numOfRooms, status }) => {
                  return (
                    <tr key={bookingId}>
                      <td data-column="Booked Date">{moment(createdDate).format('DD-MM-YYYY')}</td>
                      <td data-column="Name">{guestName}</td>
                      <td data-column="Type">{bookingType == "Day" ? "Special Day Booking" : "Room Booking"}</td>
                      <td data-column="Check In">{moment(checkInDate).format('DD-MM-YYYY')}</td>
                      <td data-column="Check Out">{moment(checkOutDate).format('DD-MM-YYYY')}</td>
                      <td data-column="Number of Rooms">{numOfRooms}</td>
                      <td data-column="Payment Type">{paymentType == "Points" ? "Points" : "Direct Payment"}</td>
                      <td data-column="Status">{status == "CANCELLED" ? <div style={{ color: "red" }}>CANCELLED</div> : <div style={{ color: "green" }}>CONFIRMED</div>}</td>
                     <td data-column="Action" className="BookingListAction">
                        <Tooltip title="View Booking" >
                          <IconButton>
                            <FaRegEye onClick={() => History(PATHS.MANAGERVIEWBOOKING, { state: { bookingId: bookingId, memberName: guestName, statusfilter: statusfilter } })} id="bookingListViewBookingBtnId" className="actionIcons" size="22" />
                          </IconButton>
                        </Tooltip>
                        {onCancelChange(status, checkOutDate) ? null :
                          <Tooltip title="Edit Booking">
                            <IconButton>

                              <MdEdit onClick={() => History(PATHS.MANAGEREDITBOOKING, { state: { bookingId: bookingId } })} id="bookingListEditBookingBtnId" className="BookingListActions_eyeIcon" />

                            </IconButton>
                          </Tooltip>
                        }


                        {datefind(checkInDate, checkOutDate, status) ?
                          <Tooltip title="Expenses">
                            <IconButton>

                              <GiMoneyStack onClick={() => History(PATHS.MANAGEREXPENSEMANAGEMENT, { state: { bookingId: bookingId, memberId: memberId, bookingType: bookingType } })} id="bookingListAddExpenseBtnId" className="BookingListActions_eyeIcon" />

                            </IconButton>
                          </Tooltip> : null
                        }
                        {onCancelChange(status, checkInDate) ? null :
                          <Tooltip title="Cancel Booking">
                            <IconButton>

                              <ImCancelCircle onClick={() => { setBookingCancelOpen(true); setCancelBookingId(bookingId); setCanceldate(moment(checkInDate).format("YYYY-MM-DD")); }} id="bookingListCancleBtnId" className="BookingListActions_eyeIcon" size={22} />

                            </IconButton>
                          </Tooltip>
                        }
                        <Dialog open={bookingcancelopen} onClose={() => setBookingCancelOpen(true)}>
                          <DialogTitle>Are you sure you want to cancel?</DialogTitle>
                          <DialogContent>
                            <Grid container>
                              <Grid xs={12}>
                                <label style={{ textAlign: "start", width: "100%" }} htmlFor="address">
                                  Reason
                                </label>

                                <textarea onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                                <div style={{ color: "red" }}>If you cancel the booking after 24 hours(calculated from when you're booked) you'll be charged penalty</div>

                              </Grid>
                            </Grid>
                          </DialogContent>
                          <DialogActions>
                            <Button id="managerBookingCancelNoBtnId" onClick={() => setBookingCancelOpen(false)}>No</Button>
                            <Tooltip title={getPanaltymsg()}>
                              <Button id="managerBookingCancelYesBtnId" onClick={() => handleBookingCancel()} variant="contained" color="success">Yes</Button>
                            </Tooltip>
                          </DialogActions>
                        </Dialog>
                      </td>
                    </tr>
                  )
                })}

              </tbody>
            </table>}

          <Grid className="Pagination_BookingList_Section" >
            {BookingListState.bookinglist?.data?.data?.pageNo > 1 ?
              <div onClick={() => { setpageNo(1); BookingListAPI({ ...filter, page: 1 }) }} className="paginationBtn" id="managerBookingFirstPageId">
                <MdOutlineFirstPage size="20" style={{ padding: "5px" }} />
              </div>
              : null}
            {BookingListState.bookinglist?.data?.data?.pageNo == 1 ? null :
              <div onClick={() => { setpageNo(BookingListState.bookinglist?.data?.data?.pageNo - 1); BookingListAPI({ ...filter, page: BookingListState.bookinglist?.data?.data?.pageNo - 1 }) }} className="paginationBtn" id="managerBookingPrevBtnId">
                <GrLinkPrevious size="20" style={{ padding: "5px" }} />
              </div>
            }
            {BookingListState.bookinglist?.data?.data?.pageNo !== BookingListState.bookinglist?.data?.data?.totalNoOfPages &&
              <div onClick={() => { setpageNo(BookingListState.bookinglist?.data?.data?.pageNo + 1); BookingListAPI({ ...filter, page: BookingListState.bookinglist?.data?.data?.pageNo + 1 }) }} className="paginationBtn" id="managerBookingNextPageId">
                <GrLinkNext size="20" style={{ padding: "5px" }} />
              </div>
            }
            {BookingListState.bookinglist?.data?.data?.totalNoOfRecords > 10 && BookingListState.bookinglist?.data?.data?.pageNo !== BookingListState.bookinglist?.data?.data?.totalNoOfPages ?
              <div onClick={() => { setpageNo(BookingListState.bookinglist?.data?.data?.totalNoOfPages); BookingListAPI({ ...filter, page: BookingListState.bookinglist?.data?.data?.totalNoOfPages }) }} className="paginationBtn" id="managerBookingLastPageId">
                <MdOutlineLastPage size="20" style={{ padding: "5px" }} />
              </div> : null}
          </Grid>
        </Grid>
      </div>
    </div>

  );
}

export default ManagerBookingManagement;
