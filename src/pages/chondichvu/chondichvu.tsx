import { faArrowRotateLeft, faCalendar, faCalendarAlt, faChevronRight, faCircleExclamation, faCircleLeft, faCircleRight, faEnvelope, faHospital, faIdBadge, faIdCard, faMapMarkerAlt, faMedkit, faStethoscope, faTrashCan, faUndo, faUser, faUsers, faVenusMars } from "@fortawesome/free-solid-svg-icons";
import "../chondichvu/chondichvu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from 'antd';
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface Shift {
    gio_bat_dau: string;
    gio_ket_thuc: string;
}
interface DoctorInfo {
    id: number;
    name: string;
    specialty: string;
}

interface SelectedAppointment {
    date: string;
    shift: Shift;
    doctorName: string;
    doctorSpecialty: string;
    gia: number
}

interface UserInfo {
    id: number;
    ho_ten: string;
    email: string;
    mat_khau: string;
    so_dien_thoai: string;
    ngay_sinh: string;
    gioi_tinh: string;
    dia_chi: string;
    hinh_anh: string;
    CMND: string;
    dan_toc: string

}
const Chondichvu = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bacSiId = searchParams.get("bac_si_id") || localStorage.getItem("selectedDoctorId");
    const [appointment, setAppointment] = useState<SelectedAppointment | null>(null);
    const userId = sessionStorage.getItem("id");
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [bookingInfo, setBookingInfo] = useState<any>(null); // Khai báo cho bookingInfo

    useEffect(() => {
        if (userId) {
            axios
                .get(`http://localhost:9999/api/user/getthongtinbyId/${userId}`)
                .then((response) => {
                    setUserInfo(response.data[0]);
                    console.log(response.data)
                })
                .catch((error) => {
                    console.error("Error fetching user info:", error);
                });
        }
    }, [userId]);


    useEffect(() => {
        // Lấy dữ liệu từ sessionStorage
        const appointmentData = sessionStorage.getItem("selectedAppointment");
        if (appointmentData) {
            setAppointment(JSON.parse(appointmentData));
        }
   
        // Lấy thông tin booking từ sessionStorage
        const bookingData = sessionStorage.getItem("bookingInfo");
        if (bookingData) {
            setBookingInfo(JSON.parse(bookingData));
        }
    }, []);
    const handleBack = () => {
        navigate("/Bacsikhamquavideo"); // Go back to the previous page
    };
    const handNext = () => {
        navigate("/Xacnhanthongtin");
    }

    return (
        <div className="styles_body2">
            <div className="styles_breadcrumb">
                <div className="styles_containerPartner">
                    <ul className="styles_breadcrumbs">
                        <li><a href="/">Trang chủ</a></li>
                        <li>
                            <span className="styles_text">
                                <FontAwesomeIcon icon={faChevronRight} width="1em" height='10px' fontSize={13} style={{ marginBottom: '-3px' }} />
                                <a href="/">Bác sĩ Chuyên Khoa</a>
                            </span>
                        </li>
                        <li className="styles_last">
                            <span className="styles_text">
                                <FontAwesomeIcon icon={faChevronRight} width="1em" height='10px' fontSize={13} style={{ marginBottom: '-3px' }} />
                                <a href="/">Xác nhận thông tin</a>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="styles_container1">
                <div className="ant-row">
                    <div className="ant-rows" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                        {/* Content */}
                        <div className="styles_panelsHeader">
                            <div className="styles_infoBookingTitle">
                                <span>Thông tin cơ sở y tế</span>
                            </div>
                            <div className="styles_cardBody">
                                <ul>
                                    <li>
                                        <FontAwesomeIcon icon={faHospital} />
                                        <div className="styles_infoHopital">
                                            <span></span>
                                            Bệnh viện Khoái Châu
                                            <p className="styles_address">Ngã tư Huyện Khoái Châu Tỉnh Hưng Yên</p>
                                        </div>
                                    </li>


                                    <li >
                                        <FontAwesomeIcon icon={faMedkit} />
                                        <div className="styles_infoHopital">
                                            Chuyên khoa: {bookingInfo ? bookingInfo.specialty : 'Chưa xác định'}
                                        </div>
                                    </li>

                                    <li style={{ marginTop: 10 }}>
                                        <FontAwesomeIcon icon={faStethoscope} />
                                        <div className="styles_infoHopital">
                                            Bác sĩ: {bookingInfo ? bookingInfo.doctorName : 'Chưa xác định'}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="ant_rowsx">
                        <div className="styles_chooseBookingInfo" >
                            <div className="styles_panelsHeader1">
                                <span>
                                    <div className="styles_animationTop styles_infoBookingTitle" style={{ animationFillMode: 'forwards' }}>
                                        <span style={{ marginLeft: '-550px' }}>Xác nhận thông tin khám</span>
                                    </div>
                                </span>
                            </div>

                            <div className="styles_animationTop styles_cardBody">

                                <table className="styles_serviceTable" style={{ borderCollapse: 'collapse', borderSpacing: 0 }}>
                                    <thead>
                                        <tr>
                                            <th className="styles_stt">#</th>
                                            <th className="styles_th_title">Tên dịch vụ</th>

                                            <th className="styles_th_title styles_money">Giá tiền</th>
                                            <th className="styles_action"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {appointment && (
                                            <tr className="styles_serviceDetail" style={{ border: "1px solid #e0e0e0" }}>
                                                <td className="styles_stt">
                                                    <b>1</b>
                                                </td>
                                                <td className="styles_td_sub" style={{ fontWeight: 500 }}>
                                                    Tư vấn ngay online 01 lần
                                                </td>

                                                
                                                    <td className="styles_td_sub styles_money">
                                                        {bookingInfo.price}
                                                    </td>

                                                    <td className="styles_action">
                                                        <div className="styles_groupButton">
                                                            <button className="styles_chooseDetailButton">
                                                                <span>Chi tiết</span>
                                                            </button>
                                                            <button className="styles_chooseServiceButton"onClick={handNext} >
                                                                <span >Đặt khám ngay</span>
                                                            </button>
                                                        </div>
                                                    </td>


                                            </tr>
                                        )}
                                        {!appointment && (
                                            <tr>
                                                <td colSpan={7} className="styles_td_sub">
                                                    Chưa có dữ liệu đặt lịch
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>


                        </div>


                        <div className="styles_mobile">
                            <div className="styles_buttons">
                                <button className="styles_btnBack" style={{ fontWeight: '500', background: '#e8f2f7', border: 'none' }} onClick={handleBack}>
                                    <span>Quay lại</span>
                                    <div className="styles_icon">
                                        <FontAwesomeIcon icon={faArrowRotateLeft} style={{ fontSize: '16px', color: 'rgb(0, 53, 83)' }} />
                                    </div>
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chondichvu;
