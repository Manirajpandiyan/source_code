import * as React from "react";
import { Grid } from "@mui/material";
import "../NewBookings.css";
import { PATHS } from "../../routes/index";
import { useNavigate, useLocation } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import ManagerNavbar from "./ManagerNavbar";
import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { actions as Bookingactions } from "../../store/module/Bookingmodule";
import StaticContent from "../StatisContent";
import { httpService } from '../../api/Request/service'
import { toast } from "react-hot-toast";
import MANAGERHEADER from './ManagerAllScreenHeader';

const ManagerEditBooking = () => {
    const History = useNavigate();
    const dispatch = useDispatch();
    const Location = useLocation()
    const BookingState = useSelector(state => state.booking);

    const [bookingType, setBookingType] = React.useState('')
    const [bookingFor, setBookingFor] = React.useState('')
    const [nonMemberName, setNonMemberName] = useState('')
    const [memberName, setMemberName] = useState('')
    const [checkIn, setCheckIn] = React.useState('')
    const [checkOut, setCheckOut] = React.useState('')
    const [paymentType, setPaymentType] = React.useState('')
    const [numberOfAdults, setNumberOfAdults] = React.useState('')
    const [numberOfChildren, setNumberOfChildren] = React.useState('')
    const [errorStatus, setErrorStatus] = React.useState([]);
    const [numberOfRooms, setNumberOfRooms] = React.useState('')
    const [notes, setNotes] = React.useState('')
    //eslint-disable-next-line
    const [mebmerlistData, setMebmerlistData] = useState({});
    // const current = new Date();
    // const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

    const handleBookingSubmit = async () => {
        setErrorStatus([]);

        //console.log(bookingType, bookingFor, nonMemberName, memberName, checkIn, checkOut, paymentType, numberOfAdults, numberOfChildren, numberOfRooms)
        //History(PATHS.BOOKINGLIST);
        // const Booking_Payload = {
        //     END_POINT1: "bookings",
        //     END_POINT2: '{bookingId}',
        //     PAYLOAD_DATA: JSON.stringify(),
        // };
        let data = {
            "bookingFor": bookingFor,
            "bookingType": bookingType,
            "checkInDate": checkIn,
            "checkOutDate": checkOut,
            "guestName": memberName,
            "memberId": mebmerlistData?.memberId,
            "numOfAdults": numberOfAdults,
            "numOfChildren": numberOfChildren,
            "numOfRooms": numberOfRooms,
            "paymentType": paymentType,
            "remarks": notes,
        };

        console.log("", data)

        httpService({ url: `/bookings/${Location.state.bookingId}`, data: data, method: "PUT" })
            //eslint-disable-next-line     
            .then(res => {
                notify()
                History(PATHS.MANAGERBOOKINGMANAGEMENT);
            })
            .catch(e => {
                // eslint-disable-next-line
                setErrorStatus([...e?.error?.response?.data?.data]);
            })


        //dispatch(Bookingactions.updateBooking(Booking_Payload));

    }

    useEffect(() => {
        const BOOKING_PAYLOAD = {
            END_POINT1: 'bookings',
            END_POINT2: Location.state.bookingId,
        }
        dispatch(Bookingactions.fetchbooking(BOOKING_PAYLOAD))
    }, [])

    useEffect(() => {
        if (BookingState.viewbooking?.data.statusCode == StaticContent.Status200) {
            //console.log('BookingState', BookingState.viewbooking.data)
            setMebmerlistData(BookingState.viewbooking.data.data)
            setBookingType(BookingState.viewbooking.data.data.bookingType)
            setBookingFor(BookingState.viewbooking.data.data.bookingFor)
            setNonMemberName(BookingState.viewbooking.data.data.guestName)
            setMemberName(BookingState.viewbooking.data.data.guestName)
            setCheckIn(moment(BookingState.viewbooking.data.data.checkInDate).format('YYYY-MM-DD'))
            setCheckOut(moment(BookingState.viewbooking.data.data.checkOutDate).format('YYYY-MM-DD'))
            setNumberOfAdults(BookingState.viewbooking.data.data.numOfAdults)
            setNumberOfChildren(BookingState.viewbooking.data.data.numOfChildren)
            setPaymentType(BookingState.viewbooking.data.data.paymentType)
            setNumberOfRooms(BookingState.viewbooking.data.data.numOfRooms.toString())
            setNotes(BookingState.viewbooking.data.data.remarks)
        }
    }, [BookingState.viewbooking])

    const notify = () => toast.success(("Successfully updated the booking"), {
        duration: 4000,
        position: "top-center"
    });
    useEffect(() => {
        console.log("update response>>>", BookingState.updateBookingResonse)
        if (BookingState.updateBookingResonse?.statusCode == StaticContent.Status201) {
            dispatch(Bookingactions.resetState());
            History(PATHS.MANAGERBOOKINGMANAGEMENT);
            notify()
            // window.confirm("Successfully edited the booking")
        }
        if (BookingState.updateBookingResonse?.statusCode == StaticContent.Status403) {
            console.log("$$$$")
        }
    }, [BookingState.updateBookingResonse])
    // const onEditCheckIn = (checkin) => {

    //     if (moment(moment().format("YYYY-MM-DD")).isAfter(moment(checkin).format('YYYY-MM-DD'))) return true;
    //     else if (moment(moment().format("YYYY-MM-DD")).isSame(moment(checkin).format('YYYY-MM-DD'))) return true;
    //     else return false;

    // }

    return (

        <div>
            <ManagerNavbar />
            <MANAGERHEADER />
            <Grid container>
                <div className="newBookingsMainContainer">
                    <Grid
                        container
                        style={{ padding: "20px" }}
                        className="newBookingsContainer"
                    >
                        <Grid xs={3} className="backIconDiv">
                            <TiArrowBack onClick={() => History(PATHS.MANAGERBOOKINGMANAGEMENT)} size={30} id="editBookingsBackBtnid" />
                        </Grid>
                        <Grid xs={6}
                            style={{
                                textAlign: "center",
                                fontWeight: "900",
                                fontSize: 18,
                            }}
                        >
                            Edit Bookings
                        </Grid>
                        <Grid>
                            <ul>
                                {errorStatus.map((ele) => (
                                    <li key={ele} style={{ color: "red" }}>
                                        {'\u2022'}{'  '}{ele}
                                    </li>
                                ))}
                            </ul>
                        </Grid>
                    </Grid>
                    <Grid container className="formContainer">
                        <Grid container>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <div className="customSelect bookingType" id="editBookingBookingTypeDropdownId">
                                    <label htmlFor="bookingtype">Booking Type</label> <span className="required">*</span>
                                    <select id="newBookingsBookingTypeId" onChange={(event) => setBookingType(event.target.value)} value={bookingType} disabled>
                                        <option value="1" id="editBookingsRoomBookingID">Room Booking</option>
                                        <option value="2" id="editBookingsSpecialBookingId">Special Day Booking</option>
                                    </select>
                                </div>
                            </Grid>
                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                            <Grid
                                xs={12}
                                sm={5.5}
                                md={5.5}
                                lg={5.5}
                                xl={5.5}
                                className="paymentDetails"
                            >
                                <label htmlFor="paymentdetails">Payment Type </label>
                                <div className="customSelect typesOfPayment" id="editBookingPaymentTypeId">
                                    <input type="text" className="addUserInputField" id="editPayemntType" value={paymentType} disabled></input>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <div className="customSelect bookingType" id="editBookingBookingForDropdownId">
                                    <label htmlFor="bookingfor">Booking For</label> <span className="required">*</span>
                                    <select id="newBookingsBookingForId" onChange={(event) => setBookingFor(event.target.value)} value={bookingFor} disabled>
                                        <option value="Self" id="editBookingsSelfId">Self</option>
                                        <option value="Member" id="editBookingsMemberId">On behalf of another member</option>
                                        <option value="Non-Member" id="editBookingsNon-memberId">Non-Member</option>
                                    </select>
                                </div>
                            </Grid>
                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                            <Grid
                                xs={12}
                                sm={5.5}
                                md={5.5}
                                lg={5.5}
                                xl={5.5}
                                style={{ marginTop: "15px" }}
                            >{bookingFor == 3 ? <label htmlFor="membername">Guest Name </label> : <label htmlFor="membername">Guest Name</label>}
                                <input
                                    type="text"
                                    className="member"
                                    id="editBookingsMemberNameId"
                                    value={memberName}
                                    readOnly
                                    disabled
                                    onChange={(event) => { setMemberName(event.target.value) }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className="bookingRowAlign">
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                                <label htmlFor="bookingfrom">Check In</label><span className="required">*</span>
                                <input
                                    type="date"
                                    name="bookingfrom"
                                    id="bookingfrom"
                                    className="formdatepicker"
                                    onChange={event => setCheckIn(moment(event.target.value).format('YYYY-MM-DD'))}
                                    value={checkIn}
                                ></input>
                            </Grid>
                            {/* } */}
                            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="checkOut">
                                <label htmlFor="bookingto">Check Out</label><span className="required">*</span>
                                <input
                                    type="date"
                                    name="bookingto"
                                    id="bookingto"
                                    className="formdatepicker"
                                    onChange={event => setCheckOut(moment(event.target.value).format('YYYY-MM-DD'))}
                                    value={checkOut}
                                ></input>
                            </Grid>
                            <Grid xs={0} sm={1.5} md={1.5} lg={1.5} xl={1.5}></Grid>
                        </Grid>
                        <Grid container className="bookingRowAlign">
                            <Grid
                                xs={6}
                                sm={3}
                                md={3}
                                lg={3}
                                xl={3}
                                className="adults"
                            >
                                <div className="adultsDiv">
                                    <label htmlFor="numberofadults">No of Adults</label><span className="required">*</span>
                                    <input
                                        type="number"
                                        id="number1"
                                        className="numOfAdults"
                                        min="0"
                                        value={numberOfAdults}
                                        onChange={event => setNumberOfAdults(event.target.value)}
                                        style={{ width: "80%" }}
                                    />
                                </div>
                            </Grid>
                            <Grid
                                xs={6}
                                sm={3}
                                md={3}
                                lg={3}
                                xl={3}
                                className="children"
                            >
                                <div className="childrenDiv">
                                    <label htmlFor="numberofchildren">No of Children</label>
                                    <input
                                        type="number"
                                        id="number1"
                                        className="numOfChildren"
                                        min="0"
                                        value={numberOfChildren}
                                        style={{ width: "80%" }}
                                        onChange={event => setNumberOfChildren(event.target.value)}
                                    />
                                </div>
                            </Grid>
                            <Grid xs={0} sm={0.5} md={0.5} lg={0.5} xl={0.5}></Grid>
                            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="room">
                                <label htmlFor="numberofrooms">Number of Rooms</label><span className="required">*</span>

                                <select id="newBookinsNumberOfRoomsId" onChange={(event) => setNumberOfRooms(event.target.value)} value={numberOfRooms}>
                                    <option value="1" id="editBookingsRoom1Id">1</option>
                                    <option value="2" id="editBookingsRoom2Id">2</option>
                                    <option value="3" id="editBookingsRoom3Id">3</option>
                                    <option value="4" id="editBookingsRoom4Id">4</option>
                                </select>
                            </Grid>

                        </Grid>
                        <Grid container className="bookingRowAlign notesGrid" >
                            <label htmlFor="notes">Remarks</label>
                            <textarea
                                className="notes"
                                id="editBookingsRemarksBtnId"
                                value={notes}
                                onChange={event => setNotes(event.target.value)}
                            ></textarea>
                        </Grid>
                        <Grid container>
                            <Grid xs={12} className="bookButtonDiv">
                                <div onClick={() => History(PATHS.MANAGERBOOKINGMANAGEMENT)} id="editBookingBackBtnId" className="pointDetails_Previous">Back
                                </div>
                                <div onClick={() => handleBookingSubmit()} id="editBookingSaveBtnId" className="pointDetails_Next">Save</div>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </div>
    );
};

export default ManagerEditBooking;
