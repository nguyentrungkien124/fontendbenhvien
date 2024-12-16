import { faMagnifyingGlass, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import "../bacsikhamquavideo/bacsikhamquavideo.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface BacSi {
    
    id: string;
    ho_ten: string;
    khoa_id: number;
    chuyen_mon: string;
    so_dien_thoai: string;
    email: string;
    ngay_sinh: string;
    gioi_tinh: string;
    dia_chi: string;
    hinh_anh: string;
    mat_khau: string; // Nếu cần thiết, bạn có thể xóa nếu không sử dụng
    gia: string;
    chuc_danh: string;
    khambenh_qua_video: boolean;
    chuyen_tri?: string; // Thêm nếu có
    ten_chuyen_mon?: string; // Thêm thuộc tính mới
    ten_khoa?: string; // Thêm thuộc tính mới
}

interface ChuyenMon {
    id: number;
    ten_chuyen_mon: string;
}

interface Khoa {
    id: number;
    ten: string;
}

const Bacsikhamquavideo = function () {
    const [currentPage, setCurrentPage] = useState(1);
    const [doctors, setDoctors] = useState<BacSi[]>([]);
    const [chuyenMonList, setChuyenMonList] = useState<ChuyenMon[]>([]);
    const [khoaList, setKhoaList] = useState<Khoa[]>([]);
    const totalItems = doctors.length; // Số lượng bác sĩ hiện có
    const itemsPerPage = 10;
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const fetchChuyenMonList = async () => {
            try {
                const response = await axios.get('http://localhost:9999/api/chuyenmon/getall');
                setChuyenMonList(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách chuyên môn:', error);
            }
        };
        fetchChuyenMonList();
    }, []);

    useEffect(() => {
        const fetchKhoaList = async () => {
            try {
                const response = await axios.get('http://localhost:9999/api/khoa/getall');
                setKhoaList(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khoa:', error);
            }
        };
        fetchKhoaList();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get<BacSi[]>('http://localhost:9999/api/bacsi/getBacSiQuaVideo');
                const doctorsData = response.data.map((doctor) => {
                    const chuyenMon = chuyenMonList.find(c => c.id.toString() === doctor.chuyen_mon);
                    const khoa = khoaList.find(k => k.id === doctor.khoa_id);

                    return {
                        ...doctor,
                        ten_chuyen_mon: chuyenMon ? chuyenMon.ten_chuyen_mon : 'Không xác định',
                        ten_khoa: khoa ? khoa.ten : 'Không xác định'
                    };
                });
                setDoctors(doctorsData);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bác sĩ:', error);
            }
        };

        fetchDoctors();
    }, [chuyenMonList, khoaList]); // Chạy lại khi chuyenMonList hoặc khoaList thay đổi

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleBacSiClick1 = (bacSiId: string, hoTen: string, chuyenKhoa: string) => {
        sessionStorage.setItem('selectedDoctor', JSON.stringify({
            id: bacSiId,
            name: hoTen,
            specialty: chuyenKhoa
        }));

        sessionStorage.setItem('bacsi_id', bacSiId); // Lưu id bác sĩ
        navigate(`/Chitietthongtinbacsi?bac_si_id=${bacSiId}`); // Cập nhật đường dẫn
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const doctorsToDisplay = doctors.slice(startIndex, endIndex);
    const handleBooking = (doctor: BacSi) => {
        // Lấy ngày hiện tại
        const today = new Date();
        // Định dạng ngày theo kiểu "YYYY-MM-DD"
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        const bookingInfo = {
            bac_si_id: doctor.id,
            date: formattedDate, // Thêm ngày hiện tại vào thông tin đặt lịch
            doctorSpecialty: doctor.ten_chuyen_mon,
            doctorName: doctor.ho_ten,
            gia: doctor.gia,
            appointmentType: 'online'
        };
    
        // Lưu thông tin vào sessionStorage
        sessionStorage.setItem('selectedAppointment', JSON.stringify(bookingInfo));
    
        // Điều hướng đến trang chọn dịch vụ hoặc trang khác
        navigate("/Chondichvu");
    };
    

    // sessionStorage.setItem(
    //     "selectedAppointment",
    //     JSON.stringify({
    //         date: `${currentDate}-${month + 1}-${year}`,
    //         shift,
    //         doctorName,
    //         doctorSpecialty,
    //         gia,
    //         appointmentType: 'chuyenkhoa'
    //     })
    // );


    return (
        <div className="styles_body1">
            <div style={{ maxWidth: '100%', margin: 'auto' }}>
                <div>
                    <div className="styles_main">
                        <div className="styles_header">
                            <div className="styles_bannerWrapper">
                                <div className="styles_bannerContainer">
                                    <div className="styles_card">
                                        <div className="styles_title_content">
                                            <h1>TƯ VẤN KHÁM BỆNH QUA VIDEO</h1>
                                            <div className="styles_title_content_span">
                                                Chăm sóc sức khoẻ từ xa kết nối với Bác sĩ qua cuộc gọi Video và Nhắn Tin mọi lúc mọi nơi
                                            </div>
                                        </div>
                                        <div className="styles_advise">
                                            <p>Liên hệ <b>chuyên gia</b> để tư vấn thêm</p>
                                            <div className="styles_advise_title">
                                                <a href="styles_advise_phone">
                                                    <div className="styles_support">
                                                        <FontAwesomeIcon icon={faPhone} style={{ color: '#00b5f1' }} />
                                                    </div>

                                                </a>
                                            </div>
                                            <span>19001999</span> {/* Thêm thẻ span tại đây */}

                                        </div>
                                    </div>
                                    {/*  */}
                                </div>
                            </div>
                            <div className="styles_banner_img">
                                <span
                                    style={{
                                        boxSizing: 'border-box',
                                        display: 'block',
                                        overflow: 'hidden',
                                        width: 'initial',
                                        height: 'initial',
                                        background: 'none',
                                        opacity: 1,
                                        border: '0px',
                                        margin: '0px',
                                        padding: '0px',
                                        position: 'absolute',
                                        inset: 0
                                    }}
                                >
                                    <img
                                        alt=""
                                        src="../image/tu-van-kham-benh-qua-video.webp"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            boxSizing: 'border-box',
                                            padding: 0,
                                            border: 'none',
                                            margin: 'auto',
                                            display: 'block',
                                            width: 0,
                                            height: 0,
                                            minWidth: '34%',
                                            maxWidth: '33%',
                                            minHeight: '37%',
                                            maxHeight: '96%',
                                            marginLeft: '1001px'

                                        }}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="styles_herder" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                            {/* 1 */}
                            <div className="styles_body_search">
                                <form action="" className="styles_form">
                                    <div className="styles_formContent">
                                        <div className="styles_item">
                                            <div className="styles_inputItem">
                                                <div className="ant-form-item">
                                                    <div className="ant-row">
                                                        <div className="ant-col ant-form-item-control">
                                                            <div className="ant-form-item-control-input">
                                                                <div className="ant-form-item-control-input-content">
                                                                    <span className="styles_selectItem">
                                                                        <span className="ant-input-prefix">
                                                                            <FontAwesomeIcon icon={faMagnifyingGlass} height={20} width={20} style={{ marginLeft: '20px' }} />
                                                                        </span>
                                                                        <input className="ant-input" type="text" placeholder="Tìm kiếm dịch vụ" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            {/* 2 */}
                            <div className="styles_tag"></div>
                            {/* 3 */}
                            <div className="ant-row5" style={{ marginLeft: -10, marginRight: -10, rowGap: 30 }}>
                               {doctorsToDisplay.map((doctor) => (
                                    <div className="styles_the" style={{ paddingLeft: 0 }}>
                                        <div className="styles_content1">
                                            <div className="styles_content_title">
                                                {/* 3.1 */}
                                                <div className="styles_images">
                                                    <span style={{ boxSizing: 'border-box', display: 'block', overflow: "hidden", width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: 0, position: 'absolute', inset: 0 }}>
                                                        <img src={doctor.hinh_anh} alt="" style={{
                                                            borderRadius: '16px', position: 'absolute', inset: 0, boxSizing: 'border-box', padding: 0, border: 'none', margin: 'auto', display: 'block', width: 0, height: 0, minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%', objectFit: 'contain'
                                                        }} />
                                                    </span>
                                                    <button className="styles_btnView">
                                                        <span style={{ whiteSpace: 'nowrap' }} onClick={() => handleBacSiClick1(doctor.id, doctor.ho_ten, doctor.chuyen_mon)}>Xem chi tiết</span>
                                                    </button>
                                                    <div className="styles_rating">
                                                        {/*  */}
                                                        <div className="styles_rate">
                                                            <span>4.7</span>
                                                            <p style={{ color: 'rgb(255, 181, 74)' }}><FontAwesomeIcon icon={faStar} /></p>
                                                        </div>
                                                        {/*  */}
                                                        <div className="styles_rate">
                                                            <span>100</span>
                                                            <p style={{ color: 'rgb(255, 181, 74)' }}><FontAwesomeIcon icon={faUser} /></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* 3.2 */}
                                                <div className="styles_content_title_int">
                                                    <div className="styles_groupTitle">
                                                        <h3 className="styles_title">
                                                           {doctor.chuc_danh} <strong>{doctor.ho_ten}</strong>
                                                        </h3>
                                                    </div>
                                                    <div className="styles_time">
                                                        <span>
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: "hidden", width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: 0, position: 'relative' }}>
                                                                <span style={{ boxSizing: 'border-box', display: 'block', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: '100% 0px 0px' }}>
                                                                    <img src="../image/subject.svg" alt="" style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: 0, border: 'none', margin: 'auto', display: 'block', width: 0, height: 0, minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <div className="styles_address">
                                                            Chuyên khoa: {doctor.ten_khoa}
                                                        </div>
                                                    </div>
                                                    <div className="styles_treatment">
                                                        <span>
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: "hidden", width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: 0, position: 'relative' }}>
                                                                <span style={{ boxSizing: 'border-box', display: 'block', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: '100% 0px 0px' }}>
                                                                    <img src="../image/pin.svg" alt="" style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: 0, border: 'none', margin: 'auto', display: 'block', width: 0, height: 0, minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <div className="styles_treatmentDesc">
                                                            <p className="styles_treatmentContent">
                                                                Chuyên trị: {doctor.ten_chuyen_mon}

                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="styles_time" style={{ marginTop: -16 }}>
                                                        <span>
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: "hidden", width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: 0, position: 'relative' }}>
                                                                <span style={{ boxSizing: 'border-box', display: 'block', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: '100% 0px 0px' }}>
                                                                    <img src="../image/calendar.svg" alt="" style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: 0, border: 'none', margin: 'auto', display: 'block', width: 0, height: 0, minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <div className="styles_address">
                                                            Lịch khám : Hẹn khám
                                                        </div>
                                                    </div>
                                                    <div className="styles_time">
                                                        <span>
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: "hidden", width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: 0, position: 'relative' }}>
                                                                <span style={{ boxSizing: 'border-box', display: 'block', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: 0, margin: 0, padding: '100% 0px 0px' }}>
                                                                    <img src="../image/pay.svg" alt="" style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: 0, border: 'none', margin: 'auto', display: 'block', width: 0, height: 0, minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <div className="styles_address">
                                                            Giá khám: {parseInt(doctor.gia || "0").toLocaleString('vi-VN')} VNĐ
                                                        </div>
                                                    </div>
                                                    <div className="styles_desktop">
                                                        <div className="styles_btnControl">
                                                            <button className="styles_btnBooking"  onClick={() => handleBooking(doctor)}>
                                                                <span>Đặt khám ngay</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', marginTop: 40, marginBottom: 19 }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={itemsPerPage}
                                    total={totalItems}
                                    onChange={handlePageChange}
                                />
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default Bacsikhamquavideo;



