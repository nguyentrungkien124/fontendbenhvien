import { faArrowRotateLeft, faCalendar, faCalendarAlt, faChevronRight, faCircleExclamation, faCircleLeft, faCircleRight, faEnvelope, faHospital, faIdBadge, faIdCard, faMapMarkerAlt, faMedkit, faStethoscope, faTrashCan, faUndo, faUser, faUsers, faVenusMars } from "@fortawesome/free-solid-svg-icons";
import "../xacnhanthongtin/xacnhanthongtin.css";
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
    CMND:string; 
    dan_toc:string

}
const Xacnhanthongtin = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bacSiId = searchParams.get("bac_si_id") || localStorage.getItem("selectedDoctorId");
    const [appointment, setAppointment] = useState<SelectedAppointment | null>(null);
    const userId = sessionStorage.getItem("id");
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
    }, []);
    const handleBack = () => {
        navigate("/Datlich"); // Go back to the previous page
    };
    const handNext = () => {
        navigate("/Thanhtoan");
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


                                    <li>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        <div className="styles_infoHopital">
                                            Ngày khám: {appointment?.date || "Chưa chọn ngày"}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="ant_rowsx">
                        <div className="styles_chooseBookingInfo">
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
                                            <th className="styles_th_title">Chuyên khoa</th>
                                            <th className="styles_th_title">Dịch vụ</th>
                                            <th className="styles_th_title">Bác sĩ</th>
                                            <th className="styles_th_title">Thời gian khám</th>
                                            <th className="styles_th_title styles_money">Tiền khám</th>
                                            <th className="styles_action"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {appointment && (
                                            <tr className="styles_serviceDetail" style={{ border: "1px solid #e0e0e0" }}>
                                                <td className="styles_stt">
                                                    <b>1</b>
                                                </td>
                                                <td className="styles_td_sub">
                                                    {appointment.doctorSpecialty || "Chưa chọn chuyên khoa"}
                                                </td>
                                                <td className="styles_td_sub">
                                                    {"Khám dịch vụ"} {/* Thay bằng dữ liệu động nếu có */}
                                                </td>
                                                <td className="styles_td_sub">
                                                    {appointment.doctorName || "Chưa chọn bác sĩ"}
                                                </td>
                                                <td className="styles_td_sub styles_time">
                                                    <p>{appointment.shift?.gio_bat_dau} - {appointment.shift?.gio_ket_thuc}

                                                    </p>
                                                    {/* <p>{appointment.date}</p> */}
                                                </td>
                                                <td className="styles_td_sub styles_money">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(appointment.gia)}
                                                </td>

                                                <td className="styles_action">
                                                    <button className="styles_btnDelete">
                                                        <FontAwesomeIcon icon={faTrashCan} style={{ color: "rgb(0,0,0)" }} />
                                                    </button>
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

                        <div className="styles_chooseBookingInfo">
                            <div className="styles_panelsHeader1">
                                <span>
                                    <div className="styles_animationTop styles_infoBookingTitle" style={{ animationFillMode: 'forwards' }}>
                                        <span style={{ marginLeft: '-585px' }}>Thông tin bệnh nhân</span>
                                    </div>
                                </span>
                            </div>

                            <div className="styles_animationTop styles_cardBody" style={{ height: 250 }}>
                                <div className="styles_gridRows">

                                    <div className="styles_item">
                                        <div className="styles_titleInfo">
                                            <FontAwesomeIcon icon={faUser} />
                                            <span style={{ marginTop: 11 }}>Họ và tên:</span>
                                        </div>
                                        <div className="styles_content">{userInfo?.ho_ten || "Chưa cập nhật"}</div>
                                    </div>
                                    <div className="styles_item">
                                        <div className="styles_titleInfo">
                                            <FontAwesomeIcon icon={faVenusMars} />
                                            <span style={{ marginTop: 11, marginLeft: '-7px' }}>Giới tính :</span>
                                        </div>
                                        <div className="styles_content">{userInfo?.gioi_tinh || "Chưa cập nhật"}</div>
                                    </div>

                                    <div className="styles_item">
                                        <div className="styles_titleInfo">
                                            <FontAwesomeIcon icon={faCalendar} />
                                            <span style={{ marginTop: 11 }}>Ngày sinh:</span>
                                        </div>
                                        <div className="styles_content">
                                            {userInfo?.ngay_sinh
                                                ? new Date(userInfo.ngay_sinh).toLocaleDateString('vi-VN')
                                                : "Chưa cập nhật"}
                                        </div>
                                    </div>

                                    <div className="styles_item">
                                        <div className="styles_titleInfo">
                                            <FontAwesomeIcon icon={faIdBadge} />
                                            <span style={{ marginTop: 11 }}>CMND:</span>
                                        </div>
                                        <div className="styles_content">{userInfo?.CMND || "Chưa cập nhật"}</div>
                                    </div>
                                    <div className="styles_item">
                                        <div className="styles_titleInfo">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            <span style={{ marginTop: 11 }}>Email:</span>
                                        </div>
                                        <div className="styles_content">{userInfo?.email || "Chưa cập nhật"}</div>
                                    </div>
                                    <div className="styles_item">
                                        <div className="styles_titleInfo">
                                            <FontAwesomeIcon icon={faUsers} />
                                            <span style={{ marginTop: 11, marginLeft: '-7px' }}>Dân tộc:</span>
                                        </div>
                                        <div className="styles_content">{userInfo?.dan_toc || "Chưa cập nhật"}</div>
                                    </div>
                                    <div className="styles_item">
                                        <div className="styles_titleInfo">
                                            <FontAwesomeIcon icon={faIdCard} />
                                            <span style={{ marginTop: 11 }}>Mã số BHYT:</span>
                                        </div>
                                        <div className="styles_content">chưa cập nhật</div>
                                    </div>
                                    <div className="styles_item">
                                        <div className="styles_titleInfo">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            <span style={{ marginTop: 11 }}>Địa chỉ :</span>
                                        </div>
                                        <div className="styles_content">{userInfo?.dia_chi || "Chưa cập nhật"}</div>
                                    </div>
                                </div>
                                <div className="styles_attentionConfirmPayment" style={{ backgroundColor: 'rgb(255, 239, 239)' }}>
                                    <FontAwesomeIcon icon={faCircleExclamation} color="rgb(245, 34, 45)" />
                                    <p className="styles_content" >
                                        Trong thời gian quy định, nếu quý khách hủy phiếu khám sẽ được hoàn lại tiền khám và các dịch vụ đặt thêm (không bao gồm phí tiện ích).
                                    </p>
                                </div>
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
                                <div className="styles_groupButton" style={{ gap: '8px' }}>
                                    <div className="ant-space-item">
                                        <button
                                            type="button"
                                            className="styles_btnSubmit"
                                            onClick={() => {
                                                Modal.confirm({
                                                    title: 'Xác nhận thông tin',
                                                    content: 'Bạn có chắc chắn muốn xác nhận thông tin và tiếp tục thanh toán?',
                                                    okText: 'Xác nhận',
                                                    cancelText: 'Hủy',
                                                    onOk() {
                                                        navigate("/Thanhtoan");
                                                    },
                                                });
                                            }}
                                        >
                                            <span>Xác nhận</span>
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                style={{
                                                    marginLeft: '5px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Xacnhanthongtin;
