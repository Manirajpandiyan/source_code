import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import "../BookingList.css";
import { PATHS } from "../../routes/index";
import { useNavigate } from "react-router-dom";
import { RiHotelFill } from 'react-icons/ri';
import { GrLinkPrevious } from 'react-icons/gr';
import { GrLinkNext } from 'react-icons/gr';
import { ImCancelCircle } from 'react-icons/im';
import { MdEdit, MdOutlineLastPage, MdOutlineFirstPage } from "react-icons/md";
import Button from '@mui/material/Button';
import { actions as Bookingaction } from "../../store/module/Bookingmodule"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FaRegEye } from "react-icons/fa";
import MemberNavbar from "./MemberNavbar";
import MemberHeader from "./MemberHeader";
import StaticContent from "../StatisContent";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import moment from "moment";
import { toast } from "react-hot-toast";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { GiMoneyStack } from "react-icons/gi";
import { httpService } from "../../api/Request/service";


const MemberBookingManagement = () => {

  const History = useNavigate();
  const [bookingcancelopen, setBookingCancelOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [cancelBookingId, setCancelBookingId] = useState('');
  const [errorGetStatus, setGetErrorStatus] = useState([]);
  const dispatch = useDispatch();
  const BookingListState = useSelector(state => state.booking);
  const [bookinglist, setbookinglist] = useState([])
  const [pageNo, setpageNo] = useState(1);


  const [Canceldate, setCanceldate] = useState("");

  const handleBookingCancel = () => {
    setBookingCancelOpen(false);

    httpService({ url: `/bookings/${cancelBookingId}`, method: "DELETE", data: { description: description } })
      .then((res) => {
        console.log(res);
        setBookingCancelOpen(false);
        notify()
        const BOOKINGLIST_PAYLOAD = {
          END_POINT1: 'bookings',
          Query: {
            page: pageNo,
            size: 10
          }
        }
        dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD))
      }).catch(e => {
        console.log(e)

      })

  };

  useEffect(() => {
    const BOOKINGLIST_PAYLOAD = {
      END_POINT1: 'bookings',
      Query: {
        page: pageNo,
        size: 10
      }
    }
    dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD))
  }, [pageNo])

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
          size: 10
        }
      }
      dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD))
      notify()
      dispatch(Bookingaction.resetState())
    }
  }, [BookingListState.cancelBookingReponse])

  useEffect(() => {
    if (BookingListState.bookinglist?.statusCode == StaticContent.Status200) {
      setbookinglist(BookingListState.bookinglist?.data.bookingDetailsVO)
    }
  }, [BookingListState.bookinglist])


  const getPanaltymsg = () => {

    var given = moment(Canceldate, "YYYY-MM-DD");
    var current = moment().startOf('day');

    return moment.duration(given.diff(current)).asDays() === 1 ? "If you cancel the booking after 24 hours(calculated from when you're booked) you'll be charged penalty" : ""
  }

  const [dateFilter, setdateFilter] = useState({
    date: "",
  })

  const [openBookingStatus, setopenBookingStatus] = useState(false);
  const [availability, setAvailability] = useState([])
  const handleClickBookingOpen = () => {
    setopenBookingStatus(true);

  };

  const handleBookingClose = () => {
    setopenBookingStatus(false);
    setdateFilter("");
    clearData1();
    setdateFilter({
      date: ""
    })
    setAvailability([])
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

    <div className="BoxContainer">
      <MemberNavbar />
      <MemberHeader />
      <div className="BookingList_MainContainer">
        <Grid xs={12} container>
          <Grid xs={4} md={5} className='BookingList_Section_Text'>
            Booking List
          </Grid>
          <Grid xs={8} sm={12} md={6} container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Grid xs={6} sm={5} md={4}>
              <div onClick={handleClickBookingOpen} className="BookingList_Availability" id="memberbookingNewBookingsId">
                <BsFillCalendar2CheckFill size={20} style={{ padding: "5px" }} /> <div className="bookingText" >Booking status</div>
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
                      <input type="date" name="bookingstatusdate" id="bookingstatusdate"
                        onChange={(e) => {
                          setdateFilter({
                            ...dateFilter,
                            date: e.target.value
                          });
                        }}></input>
                    </Grid>
                    <Grid xs={12}>
                      <div className="customSelect typesOfPayment" id="noNewBookingsAvailabilityId" >
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
                  <Button onClick={handleBookingClose} >Cancel</Button>
                  <Button variant="contained" onClick={() => { onClickAvailability() }} color="success">Search</Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid xs={6} sm={3} md={1}>
              <div className="bookingNewBookingDiv" id="memberbookingNewBookingsId" onClick={() => History(PATHS.MEMBERNEWBOOKING)}>
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
                  <th>Number of Rooms</th>
                  <th>Type</th>
                  <th>Number of Guest</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Payment Type</th>
                  <th>Status</th>
                  <th>Action</th>

                </tr>
              </thead>
              <tbody>

                {BookingListState.bookinglist?.data?.data?.bookingDetailsList && BookingListState.bookinglist?.data?.data?.bookingDetailsList.map(({ memberName, status, bookingId, bookingType, checkInDate, checkOutDate, numOfRooms, numOfAdults, numOfChildren, paymentType }) => {
                  return (
                    <tr key={bookingId}>

                      <td data-column="Number of Rooms">{numOfRooms}</td>
                      <td data-column="Type">{bookingType == "Day" ? "Special Day Booking" : "Room Booking"}</td>
                      <td data-column="Number of Guest">{numOfAdults}{""}Adults, {numOfChildren}{""}Kids</td>
                      <td data-column="Check In">{moment(checkInDate).format('DD-MM-YYYY')}</td>
                      <td data-column="Check Out">{moment(checkOutDate).format('DD-MM-YYYY')}</td>
                      <td data-column="Payment Type">{paymentType == "Points" ? "Points" : "Direct Payment"}</td>
                      <td data-column="Status">{status == "CANCELLED" ? <div style={{ color: "red" }}>CANCELLED</div> : <div style={{ color: "green" }}>CONFIRMED</div>}</td>
                      <td data-column="Action" className="BookingListAction">
                        <Tooltip title="View Booking">
                          <IconButton>
                            <FaRegEye onClick={() => History(PATHS.MEMBERVIEWBOOKING, { state: { bookingId: bookingId, memberName: memberName } })} id="memberBookingListViewBookingBtnId" className="actionIcons" size="22" />
                          </IconButton>
                        </Tooltip>
                        {onCancelChange(status, checkOutDate) ? null :
                          <Tooltip title="Edit Booking">
                            <IconButton>
                              <MdEdit onClick={() => History(PATHS.MEMBEREDITBOOKING, { state: { bookingId: bookingId, memberName: memberName } })} id="memberBookingListEditBookingBtnId" className="BookingListActions_eyeIcon" />
                            </IconButton>
                          </Tooltip>}
                        {status == "CANCELLED" ? null :
                          <Tooltip title="Expenses">
                            <IconButton>

                              <GiMoneyStack onClick={() => History(PATHS.MEMBEREXPENSEMANAGEMENT, { state: { bookingId: bookingId } })} id="memberBookingListExpenseBtnId" className="BookingListActions_eyeIcon" />

                            </IconButton>
                          </Tooltip>}
                        {onCancelChange(status, checkInDate) ? null :
                          <Tooltip title="Cancel Booking">
                            <IconButton>
                              <ImCancelCircle onClick={() => { setBookingCancelOpen(true); setCancelBookingId(bookingId); setCanceldate(moment(checkInDate).format("YYYY-MM-DD")); }} id="memberBookingListCancelBtnId" className="BookingListActions_eyeIcon" size={22} />
                            </IconButton>
                          </Tooltip>}

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
                                <div style={{ color: "red" }}>{getPanaltymsg()}</div>
                              </Grid>
                            </Grid>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setBookingCancelOpen(false)}>No</Button>
                            <Tooltip title={getPanaltymsg()}>
                              <Button onClick={() => handleBookingCancel()} variant="contained" color="success">Yes</Button>
                            </Tooltip>
                          </DialogActions>
                        </Dialog>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          }

          <Grid className="Pagination_BookingList_Section" >
            {BookingListState.bookinglist?.data?.data?.pageNo > 1 ?
              <div onClick={() => setpageNo(1)} className="paginationBtn" id="bookingsNextBtnId">
                <MdOutlineFirstPage size="20" style={{ padding: "5px" }} />
              </div>
              : null}
            {BookingListState.bookinglist?.data?.data?.pageNo == 1 ? null :
              <div onClick={() => setpageNo(BookingListState.bookinglist?.data?.data?.pageNo - 1)} className="paginationBtn">
                <GrLinkPrevious size="20" style={{ padding: "5px" }} />
              </div>
            }
            {BookingListState.bookinglist?.data?.data?.pageNo !== BookingListState.bookinglist?.data?.data?.totalNoOfPages && <div onClick={() => setpageNo(BookingListState.bookinglist?.data?.data?.pageNo + 1)} className="paginationBtn">
              <GrLinkNext size="20" style={{ padding: "5px" }} />
            </div>
            }
            {BookingListState.bookinglist?.data?.data?.totalNoOfRecords > 10 && BookingListState.bookinglist?.data?.data?.pageNo !== BookingListState.bookinglist?.data?.data?.totalNoOfPages ?
              <div onClick={() => setpageNo(BookingListState.bookinglist?.data?.data?.totalNoOfPages)} className="paginationBtn" id="bookingNextBtnId">
                <MdOutlineLastPage size="20" style={{ padding: "5px" }} />
              </div> : null}
          </Grid>
        </Grid>
      </div>
    </div>

  );
}

export default MemberBookingManagement;
