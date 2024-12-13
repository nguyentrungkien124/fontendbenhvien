import { faCalendarAlt, faChevronRight, faCircleLeft, faCircleRight, faHospital, faMedkit, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import "../datlich/datlich.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import io from "socket.io-client";

interface Shift {
    gio_bat_dau: string;
    gio_ket_thuc: string;
    id: number;
    trang_thai: number;
    gia:string// Thêm id để xác định ca khám
}

interface DoctorInfo {
    id: number;
    name: string;
    specialty: string;
    gia:string;
}

const socket = io('http://localhost:9999'); // Kết nối với server Socket.IO

const Datlich = () => {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [currentDate, setCurrentDate] = useState(new Date().getDate());
    const [availableDays, setAvailableDays] = useState<number[]>([]);
    const [shiftData, setShiftData] = useState<Shift[]>([]);
    const [paidShifts, setPaidShifts] = useState<number[]>([]); // Danh sách các ca đã thanh toán
    const today = new Date();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bacSiId = searchParams.get("bac_si_id") || localStorage.getItem("selectedDoctorId");
    const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
    const [noShiftsMessage, setNoShiftsMessage] = useState<string | null>(null);
    useEffect(() => {
        const fetchAvailableDays = async () => {
            if (!bacSiId) return;

            try {
                const response = await axios.get(
                    `http://localhost:9999/api/lichlamviec/getlichlamviecbyidbs/${bacSiId}`,
                    {
                        params: { month: month + 1, year },
                    }
                );

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const futureAvailableDays = response.data.filter((item: any) => {
                    const ngayLamViec = new Date(item.ngay_lam_viec);
                    ngayLamViec.setHours(0, 0, 0, 0);
                    return ngayLamViec >= today;
                });

                const daysInCurrentMonth = futureAvailableDays
                    .filter((item: any) => {
                        const ngayLamViec = new Date(item.ngay_lam_viec);
                        return (
                            ngayLamViec.getMonth() === month &&
                            ngayLamViec.getFullYear() === year
                        );
                    })
                    .map((item: any) => new Date(item.ngay_lam_viec).getDate());

                setAvailableDays(daysInCurrentMonth);
            } catch (error) {
                console.error("Error fetching available days:", error);
            }
        };

        fetchAvailableDays();
    }, [bacSiId, month, year]);

    const fetchShiftData = async (day: number) => {
        if (!bacSiId) return;

        try {
            const response = await axios.get(
                `http://localhost:9999/api/lichlamviec/getLichLamViecByBacSiAndDate/${bacSiId}/${year}-${month + 1}-${day}/1/10`
            );

            // Kiểm tra dữ liệu trả về
            console.log("Shift data response:", response.data);

            // Kiểm tra xem response.data có phải là mảng không
            if (Array.isArray(response.data)) {
                const filteredShifts = response.data.filter(
                    (shift: Shift) => shift.trang_thai === 0 && !paidShifts.includes(shift.id) // Chỉ lấy ca có trạng thái = 0
                );

                // Kiểm tra ca làm đã lọc
                console.log("Filtered shifts:", filteredShifts);

                setShiftData(filteredShifts);

                // Cập nhật thông báo nếu không có ca làm việc nào
                if (filteredShifts.length === 0) {
                    setNoShiftsMessage("Ngày làm việc hôm nay đã hết ca làm việc. Vui lòng chọn ngày khác!!");
                } else {
                    setNoShiftsMessage(null); // Xóa thông báo nếu có ca làm việc
                }
            } else {
                // Nếu không phải là mảng, kiểm tra thông điệp lỗi
                console.error("Error: ", response.data.message);
                setShiftData([]); // Đặt shiftData thành mảng rỗng nếu không có ca làm
                setNoShiftsMessage("Ngày làm việc hôm nay đã hết ca làm việc."); // Hiển thị thông báo
            }
        } catch (error) {
            console.error("Error fetching shift data:", error);
        }
    };
    const handleDayClick = (day: number) => {
        setCurrentDate(day);
        fetchShiftData(day);
    };

    const handleMonthChange = (direction: "prev" | "next") => {
        setMonth((prevMonth) => {
            if (direction === "prev") {
                if (prevMonth === 0) {
                    setYear((prevYear) => prevYear - 1);
                    return 11;
                }
                return prevMonth - 1;
            } else {
                if (prevMonth === 11) {
                    setYear((prevYear) => prevYear + 1);
                    return 0;
                }
                return prevMonth + 1;
            }
        });
    };

    const renderDays = () => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfWeek = new Date(year, month, 1).getDay();
        const lastDayOfWeek = new Date(year, month, daysInMonth).getDay();
        const previousMonthDays = new Date(year, month, 0).getDate();
        const nextMonthDays = 6 - lastDayOfWeek;

        const renderPreviousMonthDays = () =>
            Array.from({ length: firstDayOfWeek }, (_, i) => {
                const prevMonthDay = previousMonthDays - firstDayOfWeek + i + 1;
                return (
                    <div key={`prev-${prevMonthDay}`} className="styles_dayCell empty">
                        <span className="styles_previousMonthDay">{prevMonthDay}</span>
                    </div>
                );
            });

        const renderCurrentMonthDays = () =>
            Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = day === currentDate;
                const isAvailable = availableDays.includes(day);

                return (
                    <div
                        key={day}
                        className={`styles_dayCell ${isToday ? "styles_NowDay" : ""} ${isSelected ? "styles_SelectedDay" : ""} ${isAvailable ? "styles_availableDay" : ""}`}
                        onClick={() => isAvailable && handleDayClick(day)}
                    >
                        <span>{day}</span>
                    </div>
                );
            });

        const renderNextMonthDays = () =>
            Array.from({ length: nextMonthDays }, (_, i) => {
                const nextMonthDay = i + 1;
                return (
                    <div key={`next-${nextMonthDay}`} className="styles_dayCell empty">
                        <span className="styles_nextMonthDay">{nextMonthDay}</span>
                    </div>
                );
            });

        return [
            ...renderPreviousMonthDays(),
            ...renderCurrentMonthDays(),
            ...renderNextMonthDays(),
        ];
    };

    const filterShiftsByTime = (startHour: number, endHour: number) =>
        shiftData.filter((shift) => {
            const hour = parseInt(shift.gio_bat_dau.split(":")[0], 10);
            return hour >= startHour && hour < endHour;
        });

    const morningShifts = filterShiftsByTime(6, 12);
    const afternoonShifts = filterShiftsByTime(12, 18);

    const renderShiftList = (shifts: Shift[]) => (
        <ul className="giokham_listShifts">
            {shifts.map((shift) => {
                const startHour = shift.gio_bat_dau.split(":")[0].padStart(2, "0");
                const startMinute = shift.gio_bat_dau.split(":")[1];
                const endHour = shift.gio_ket_thuc.split(":")[0].padStart(2, "0");
                const endMinute = shift.gio_ket_thuc.split(":")[1];

                return (
                    <li key={shift.id}>
                        <button
                            className="giokham_btnTime"
                            style={{ background: "#fff" }}
                            onClick={() => handleShiftClick(shift)}
                        >
                            <span>{`${startHour}:${startMinute} - ${endHour}:${endMinute}`}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );

    const handleShiftClick = (shift: Shift) => {
        const userLoggedIn = sessionStorage.getItem("ho_ten");

        if (!userLoggedIn) {
            navigate("/Dangnhap");
            return;
        }

        const doctorName = doctorInfo?.name || "Chưa chọn bác sĩ";
        const doctorSpecialty = doctorInfo?.specialty || "Chưa chọn chuyên khoa";
        const gia = doctorInfo?.gia
        sessionStorage.setItem(
            "selectedAppointment",
            JSON.stringify({
                date: `${currentDate}-${month + 1}-${year}`,
                shift,
                doctorName,
                doctorSpecialty,
                gia
            })
        );

        navigate(`/Xacnhanthongtin?bac_si_id=${bacSiId}`);
    };

    useEffect(() => {
        const doctorData = sessionStorage.getItem("selectedDoctor");
        if (doctorData) {
            setDoctorInfo(JSON.parse(doctorData));
        }

        // Lắng nghe sự kiện từ Socket.IO
        socket.on('appointment_booked', (data) => {
            console.log('Received appointment_booked event:', data); // Log sự kiện
            // Cập nhật danh sách ca đã thanh toán
            setPaidShifts((prev) => [...prev, data.id]); // Giả sử data.id là id của ca đã đặt
            fetchShiftData(currentDate); // Gọi lại fetchShiftData để cập nhật danh sách ca
        });

        // Dọn dẹp khi component unmount
        return () => {
            socket.off('appointment_booked');
        };
    }, [currentDate]);

    useEffect(() => {
        console.log("Paid shifts updated:", paidShifts);
    }, [paidShifts]);

    return (
        <div className="styles_body2">
            <div className="styles_breadcrumb">
                <div className="styles_containerPartner">
                    <ul className="styles_breadcrumbs">
                        <li><a href="/">Trang chủ</a></li>
                        <li>
                            <span className="styles_text">
                                <FontAwesomeIcon icon={faChevronRight} width="1em" height='10px' fontSize={13} style={{ marginBottom: '-3px' }} />
                                <a href="">Bệnh viện Khoái Châu Chọn Bác Sĩ</a>
                            </span>
                        </li>
                        <li className="styles_last">
                            <span className="styles_text">
                                <FontAwesomeIcon icon={faChevronRight} width="1em" height='10px' fontSize={13} style={{ marginBottom: '-3px' }} />
                                <a href="">Chọn Bác Sĩ</a>
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

                                    <li style={{ marginBottom: 15 }}>
                                        <FontAwesomeIcon icon={faMedkit} />
                                        <div className="styles_infoHopital">
                                            <span></span>
                                            Chuyên khoa: {doctorInfo?.specialty || "Chưa chọn bác sĩ"}
                                        </div>
                                    </li>

                                    <li>
                                        <FontAwesomeIcon icon={faStethoscope} />
                                        <div className="styles_infoHopital">
                                            <span></span>
                                            Bác sĩ: {doctorInfo?.name || "Chưa chọn bác sĩ"}
                                        </div>
                                    </li>

                                    <li>
                                        <FontAwesomeIcon icon={faStethoscope} />
                                        <div className="styles_infoHopital">
                                            <span></span>
                                            Bác sĩ: {doctorInfo?.gia || "Chưa chọn bác sĩ"}
                                        </div>
                                    </li>

                                    <li style={{ marginTop: 15 }}>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        <div className="styles_infoHopital">
                                            <span></span>
                                            Ngày khám: {currentDate}/{month + 1}/{year}
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
                                        <span>Vui lòng chọn ngày khám</span>
                                    </div>
                                </span>
                            </div>
                            <div className="styles_chooseDate">
                                <div className="styles_dateAndTime">
                                    <div className="styles_thoigian">
                                        <div className="styles_calendar">
                                            <div className="styles_animationTop styles_header">
                                                <div className="ant-space-align-center" style={{ gap: '8px' }}>
                                                    <div className="ant-space-item">
                                                        <button className="ant-btn-icon-only" style={{ color: 'rgb(149, 165, 166)' }} onClick={() => handleMonthChange('prev')}>
                                                            <FontAwesomeIcon icon={faCircleLeft} style={{}} />
                                                        </button>
                                                    </div>
                                                    <div className="ant-space-item">
                                                        <div className="styles_datetime">
                                                            Tháng {month + 1}-{year}
                                                        </div>
                                                    </div>
                                                    <div className="ant-space-item">
                                                        <button className="ant-btn-icon-only" style={{ color: 'rgb(0, 181, 241)' }} onClick={() => handleMonthChange('next')}>
                                                            <FontAwesomeIcon icon={faCircleRight} style={{}} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_animationTop styles_weekContainer" style={{ marginTop: '-20px' }}>
                                                {['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'].map((day, index) => (
                                                    <div
                                                        key={day}
                                                        className="styles_weekCell"
                                                        style={index === 6 ? { color: "#faa01f" } : {}}
                                                    >
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="styles_animationTop">
                                                <div className="styles_dayContainer">
                                                    {renderDays()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="styles_dateTimeDivider">
                                        <div className="styles_divider"></div>
                                    </div>
                                    <div className="giokham_time">
                                        <div className="giokham_shifts">
                                            {morningShifts.length > 0 && (
                                                <h1 style={{ fontSize: "1.17em" }}>Buổi sáng</h1>
                                            )}
                                            {renderShiftList(morningShifts)}
                                        </div>
                                        <div className="giokham_shifts">
                                            {afternoonShifts.length > 0 && (
                                                <h1 style={{ fontSize: "1.17em" }}>Buổi chiều</h1>
                                            )}
                                            {renderShiftList(afternoonShifts)}
                                        </div>
                                        {/* Hiển thị thông báo nếu không có ca làm việc */}
                                        {noShiftsMessage && (
                                            <div className="no-shifts-message" style={{ color: 'red', marginTop: '10px' }}>
                                                {noShiftsMessage}
                                            </div>
                                        )}
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

export default Datlich;