import { faArrowRotateLeft, faCalendar, faCalendarAlt, faChevronRight, faCircleExclamation, faCircleLeft, faCircleRight, faClock, faCreditCard, faEnvelope, faHospital, faIdBadge, faIdCard, faLocationDot, faMapMarkerAlt, faMedkit, faMobile, faNotesMedical, faStethoscope, faTrashCan, faUndo, faUser, faUserDoctor, faUsers, faVenusMars } from "@fortawesome/free-solid-svg-icons";
import "../thanhtoan/thanhtoan.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message, Modal } from 'antd';
import io from 'socket.io-client';

interface Shift {
    gio_bat_dau: string;
    gio_ket_thuc: string;
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

}
interface SelectedAppointment {
    date: string;
    shift: Shift;
    doctorName: string;
    doctorSpecialty: string;
    gia: number
}

// Thêm interface BookingData sau các interface hiện có
interface BookingData {
    nguoi_dung_id: number;
    bac_si_id: string;
    goi_kham_id: string;
    ngay_hen: string;
    ca_dat: string;
    trang_thai: string;
    ghi_chu: string;
    ngay_tao: string;
}

const socket = io('http://localhost:9999');

const Thanhtoan = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bacSiId = searchParams.get("bac_si_id") || localStorage.getItem("selectedDoctorId");
    const [appointment, setAppointment] = useState<SelectedAppointment | null>(null);
    const userId = sessionStorage.getItem("id");
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [paidAppointments, setPaidAppointments] = useState<number[]>([]); // Danh sách các ca đã thanh toán

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
        navigate("/Xacnhanthongtin"); // Go back to the previous page
    };
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

    const paymentMethods = [
        { id: 1, title: "VietQR", description: "Thanh toán Chuyển khoản bằng các ứng dụng Ngân hàng/Ví điện tử" },
        { id: 2, title: "Thẻ quốc tế Visa, Master, JCB", description: "Một số ngân hàng phải đăng kí (thanh toán Online) khi sử dụng thanh toán bằng thẻ tín dụng" },
        { id: 3, title: "Thẻ ATM nội địa/Internet Banking", description: "Một số ngân hàng phải đăng kí (Online/Internet banking) khi thanh toán bằng thẻ ATM" },
        { id: 4, title: "Thanh toán hộ", description: "Chia sẻ link thanh toán cho người thân" },
        { id: 5, title: "VNPAY OR", description: "Ngân hàng có hỗ trợ VNPAY OR" },
        { id: 6, title: "Thanh toán tại bệnh viện", description: "" },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePayment = () => {
        if (!selectedMethod) {
            message.error({
                content: 'Vui lòng chọn hình thức thanh toán',
                style: {
                    marginTop: '20px',
                },
            });
            document.querySelector('.styles_PaymentMethods')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setIsModalOpen(true);
    };

    const handleConfirmPayment = async () => {
        try {
            setLoading(true);

            const doctorData = JSON.parse(sessionStorage.getItem("selectedAppointment") || "{}");
            const bacSiId = doctorData?.bac_si_id || "";
            const gia = doctorData?.gia || "";
            const chuyen_khoa = doctorData?.doctorSpecialty || "";

            if (!appointment?.date) {
                throw new Error('Ngày hẹn không hợp lệ');
            }

            console.log("Appointment Data:", appointment);
            console.log("User ID:", userId);
            console.log("Bac Si ID:", bacSiId);

            // Chuyển đổi định dạng ngày
            const dateParts = appointment.date.split("-");
            if (dateParts.length !== 3) {
                throw new Error('Định dạng ngày không hợp lệ');
            }

            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            console.log("Formatted Date:", formattedDate);

            // Định dạng ca đặt
            const startTime = appointment?.shift?.gio_bat_dau;
            const endTime = appointment?.shift?.gio_ket_thuc;

            // Nếu không có thời gian hợp lệ, để ca đặt là rỗng
            const formattedShift = startTime && endTime ? `${startTime}-${endTime}` : '';

            const bookingData = {
                nguoi_dung_id: parseInt(userId || "0"),
                bac_si_id: bacSiId,
                goi_kham_id: "2",
                ngay_hen: appointment.date,
                ca_dat: formattedShift || "Khám online 1h", // Để rỗng nếu không có thời gian hợp lệ
                trang_thai: "1",
                gia: gia,
                chuyen_khoa: chuyen_khoa,
                ly_do: "",
                ghi_chu: "Đặt lịch khám qua website",
                ngay_tao: new Date().toISOString().split('T')[0]
            };

            console.log("Booking Data to be sent:", bookingData);

            // Kiểm tra các giá trị bắt buộc
            if (!bookingData.nguoi_dung_id || !bookingData.bac_si_id || !bookingData.ngay_hen || !bookingData.chuyen_khoa || !bookingData.gia) {
                throw new Error('Thiếu thông tin bắt buộc để đặt lịch');
            }

            const response = await axios.post('http://localhost:9999/api/datlich/them', bookingData);
            console.log("API Response:", response.data);

            if (response.data) {
                socket.emit('new_appointment', {
                    ...bookingData,
                    patient_name: userInfo?.ho_ten,
                    doctor_name: appointment?.doctorName,
                    appointment_time: formattedShift || "Đang chờ", // Để hiển thị trạng thái nếu không có ca đặt
                });

                setIsModalOpen(false);
                message.success({
                    content: 'Đặt lịch khám thành công!',
                    style: { marginTop: '20px' },
                });

                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                console.error("No data returned from API");
            }
        } catch (error: any) {
            console.error('Lỗi chi tiết:', error);
            message.error({
                content: error.message || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!',
                style: { marginTop: '20px' },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="styles_body2">
                <div className="styles_breadcrumb">
                    <div className="styles_containerPartner">
                        <ul className="styles_breadcrumbs">
                            <li><a href="/">Trang chủ</a></li>
                            <li>
                                <span className="styles_text">
                                    <FontAwesomeIcon icon={faChevronRight} width="1em" height='10px' fontSize={13} style={{ marginBottom: '0px' }} />
                                    <a href="">Bệnh viện Khoái Châu</a>
                                </span>
                            </li>
                            <li className="styles_last">
                                <span className="styles_text">
                                    <FontAwesomeIcon icon={faChevronRight} width="1em" height='10px' fontSize={13} style={{ marginBottom: '0px' }} />
                                    <a href="">Thanh toán</a>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="styles_container1">
                    <div className="ant-row">
                        <div className="ant-rows" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                            {/* Content */}
                            <div className="styles_panelsHeader" style={{ height: '250px' }}>
                                <div className="styles_infoBookingTitle">
                                    <span>Thông tin bệnh nhân </span>
                                </div>
                                <div className="styles_cardBody">
                                    <ul>
                                        <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                                            <FontAwesomeIcon icon={faUser} />
                                            <div className="styles_infoHopital" style={{ marginLeft: "10px" }}>
                                                <span></span>
                                                {userInfo?.ho_ten || "Chưa cập nhật"}
                                            </div>
                                        </li>

                                        <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                                            <FontAwesomeIcon icon={faMobile} />
                                            <div className="styles_infoHopital" style={{ marginLeft: "10px" }}>
                                                <span></span>
                                                {userInfo?.so_dien_thoai || "Chưa cập nhật"}
                                            </div>
                                        </li>

                                        <li style={{ marginBottom: "10px" }}>
                                            <FontAwesomeIcon icon={faLocationDot} />
                                            <div className="styles_infoHopital" style={{ marginLeft: "10px" }}>
                                                <span></span>
                                                {userInfo?.dia_chi || "Chưa cập nhật"}
                                            </div>
                                        </li>

                                        <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            <div className="styles_infoHopital" style={{ marginLeft: "10px" }}>
                                                Ngày khám: {appointment?.date || "Chưa chọn ngày"}
                                            </div>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                            <div className="styles_panelsHeader" style={{ marginTop: 30 }}>
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

                                        {/* <li>
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            <div className="styles_infoHopital">
                                                Ngày khám: {appointment?.date || "Chưa chọn ngày"}
                                            </div>
                                        </li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="ant_rowsx">
                            <div className="styles_chooseBookingInfo">
                                <div className="styles_panelsHeader1">
                                    <span>
                                        <div className="styles_animationTop styles_infoBookingTitle" style={{ animationFillMode: 'forwards' }}>
                                            <span>Chọn phương thức thanh toán</span>
                                        </div>
                                    </span>
                                </div>

                                <div className="card-body">
                                    <div className="ant-row" style={{ marginLeft: '-15px', marginRight: '-15px' }}>
                                        <div className="styles_colPayments" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                            <div className="styles_animationTop">
                                                <div className="styles_PaymentMethods">
                                                    <div className="styles_listPayment">
                                                        {paymentMethods.map((method) => (
                                                            <div key={method.id} className="styles_panel">
                                                                <label className="radio-label">
                                                                    <input
                                                                        type="radio"
                                                                        name="paymentMethod"
                                                                        className="radio-button"
                                                                        value={method.id}
                                                                        checked={selectedMethod === method.id}
                                                                        onChange={() => {
                                                                            setSelectedMethod(method.id);
                                                                        }}
                                                                    />
                                                                    <div style={{ marginLeft: '28px', marginTop: -41 }}>
                                                                        <p className="styles_contentMethod">{method.title}</p>
                                                                        <p className="styles_descriptionHeader">{method.description}</p>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles_colBill" style={{ paddingLeft: '15px', padding: '15px' }}>
                                            <div className="styles_animationTop">
                                                <div className="styles_paymentTitle">
                                                    <FontAwesomeIcon icon={faCreditCard} className="styles_paymentTitleIcon" style={{ color: 'rgb(17, 162, 243)' }} />
                                                    <h3>Thông tin thanh toán</h3>
                                                </div>

                                                <div className="styles_cardView">
                                                    <ul className="styles_listBill">
                                                        <div className="styles_paymentInfo">
                                                            <li>
                                                                <div className="styles_itemSubject">
                                                                    <p className="styles_itemKeys">
                                                                        <FontAwesomeIcon icon={faMedkit} style={{ color: 'rgb(177, 177, 177)' }} className="styles_itemIcon" />
                                                                        <span style={{ fontWeight: 500, marginLeft: '2px' }}>Chuyên khoa</span>
                                                                    </p>
                                                                    <p className="styles_itemValues">
                                                                        {appointment?.doctorSpecialty || "Chưa có thông tin"}
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="styles_itemDoctor">
                                                                    <p className="styles_itemKeys">
                                                                        <FontAwesomeIcon icon={faUserDoctor} style={{ color: 'rgb(177, 177, 177)' }} className="styles_itemIcon" />
                                                                        <span style={{ fontWeight: 500, marginLeft: '5px' }}>Bác sĩ</span>
                                                                    </p>
                                                                    <p className="styles_itemValues">
                                                                        {appointment?.doctorName || "Chưa có thông tin"}
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li >
                                                                <div className="styles_itemService">
                                                                    <p className="styles_itemKeys">
                                                                        <FontAwesomeIcon icon={faNotesMedical} style={{ color: 'rgb(177, 177, 177)' }} className="styles_itemIcon" />
                                                                        <span style={{ fontWeight: 500, marginLeft: '5px' }}>Dịch vụ</span>
                                                                    </p>
                                                                    <p className="styles_itemValues">
                                                                        Khám dịch vụ
                                                                    </p>

                                                                </div>
                                                            </li>
                                                            <li >
                                                                <div className="styles_itemService">
                                                                    <p className="styles_itemKeys">
                                                                        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'rgb(177, 177, 177)' }} className="styles_itemIcon" />
                                                                        <span style={{ fontWeight: 500, marginLeft: '5px' }}>Ngày khám</span>
                                                                    </p>
                                                                    <p className="styles_itemValues">
                                                                        {appointment?.date || "Chưa có thông tin"}
                                                                    </p>

                                                                </div>
                                                            </li>
                                                            <li >
                                                                <div className="styles_itemService">
                                                                    <p className="styles_itemKeys">
                                                                        <FontAwesomeIcon icon={faClock} style={{ color: 'rgb(177, 177, 177)' }} className="styles_itemIcon" />
                                                                        <span style={{ fontWeight: 500, marginLeft: '5px' }}>Giờ khám</span>
                                                                    </p>
                                                                    <p className="styles_itemValues">
                                                                        {appointment?.shift?.gio_bat_dau && appointment?.shift?.gio_ket_thuc
                                                                            ? `${appointment.shift.gio_bat_dau.substring(0, 5)} - ${appointment.shift.gio_ket_thuc.substring(0, 5)}`
                                                                            : "Khám online 1h"}
                                                                    </p>

                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="styles_itemMoney">
                                                                    <p className="styles_itemKeys">

                                                                        <span style={{ fontWeight: 500, marginLeft: '5px' }}>Tiền khám</span>
                                                                    </p>
                                                                    <p className="styles_itemValues">
                                                                        {appointment?.gia
                                                                            ? new Intl.NumberFormat('vi-VN', {
                                                                                style: 'currency',
                                                                                currency: 'VND',
                                                                            }).format(Number(appointment.gia))
                                                                            : "Chưa có thông tin"}
                                                                    </p>

                                                                </div>
                                                            </li>
                                                        </div>
                                                    </ul>
                                                    <ul className="styles_listPayment">
                                                        <li>
                                                            <div className="styles_itemFee">
                                                                <p>Phí tiện ích + Phí TGTT
                                                                    <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'rgb(18, 38, 63)' }} />
                                                                    :
                                                                </p>
                                                                <span>0 đ</span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="styles_itemTotal">
                                                                <p>Tổng cộng: </p>
                                                                <span> {appointment?.gia
                                                                    ? new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    }).format(Number(appointment.gia))
                                                                    : "Chưa có thông tin"}</span>
                                                            </div>
                                                        </li>
                                                    </ul>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="styles_btnFooter">
                                        <button
                                            type="button"
                                            className="styles_btnSubmit"
                                            style={{ float: 'right', fontWeight: '500' }}
                                            onClick={handlePayment}
                                        >
                                            <span>Thanh toán</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div className="styles_mobile">
                                <div className="styles_buttons">
                                    <button className="styles_btnBack" style={{ fontWeight: '500', background: '#e8f2f7', border: 'none' }} onClick={handleBack} >
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
            <Modal
                title="Xác nhận thanh toán"
                open={isModalOpen}
                onOk={handleConfirmPayment}
                onCancel={() => setIsModalOpen(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={loading}
            >
                <p>Bạn có chắc chắn muốn thanh toán với thông tin sau:</p>
                <ul style={{ marginTop: '10px' }}>
                    <li>Bác sĩ: {appointment?.doctorName}</li>
                    <li>Chuyên khoa: {appointment?.doctorSpecialty}</li>
                    <li>Ngày khám: {appointment?.date}</li>
                    <li>Giờ khám:  {appointment?.shift?.gio_bat_dau && appointment?.shift?.gio_ket_thuc
                        ? `${appointment.shift.gio_bat_dau.substring(0, 5)} - ${appointment.shift.gio_ket_thuc.substring(0, 5)}`
                        : "Khám online 1h"}</li>
                    <li>Tổng tiền:  {appointment?.gia
                        ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(Number(appointment.gia))
                        : "Chưa có thông tin"}</li>
                    <li>Phương thức thanh toán: {paymentMethods.find(m => m.id === selectedMethod)?.title}</li>
                </ul>
            </Modal>
        </>
    );
};

export default Thanhtoan;
