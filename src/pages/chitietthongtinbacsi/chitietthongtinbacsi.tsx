import { faArrowRight, faCalendar, faChevronRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "../chitietthongtinbacsi/chitietthongtinbacsi.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "antd";
import ReactHtmlParser from 'html-react-parser'; // Đảm bảo import đúng
import { url } from "inspector";
import { useParams } from "react-router-dom";

interface bacsi {
    id?: number;
    ho_ten?: string;
    chuyen_mon?: string;
    khoa_id?: string;
    so_dien_thoai?: string;
    email?: string;
    ngay_sinh?: string;
    gioi_tinh?: string;
    dia_chi?: string;
    gia?: string;
    mat_khau: string;
    hinh_anh?: any;
    khambenh_qua_video: boolean;
    chuc_danh: string;
    kinh_nghiem: string;
    gioi_thieu: string;
    chuyen_tri: string;
  }
const Chitietthongtinbacsi = () => {
    const [doctorData, setDoctorData] = useState<bacsi | null>(null);

    useEffect(() => {
        const bacsiId = sessionStorage.getItem('bacsi_id'); // Lấy id bác sĩ từ sessionStorage

        const fetchDoctorData = async () => {
            if (bacsiId) { // Kiểm tra xem bacsiId có tồn tại không
                try {
                    const response = await axios.get(`http://localhost:9999/api/bacsi/getbacsibyID/${bacsiId}`);
                    setDoctorData(response.data[0]);
                    console.log(response.data);
                } catch (error) {
                    console.error("Error fetching doctor data:", error);
                }
            }
        };

        fetchDoctorData();
    }, []);


    return (
        <div className="styles_body2">
            {/* {doctorData && (
                <div>
                    <h1>{doctorData.ho_ten}</h1>
                </div>
            )} */}
            <div className="styles_breadcrumb">
                <div className="styles_containerPartner">
                {doctorData && (
                    <ul className="styles_breadcrumbs">
                        <li><a href="/">Trang chủ</a></li>
                        <li>
                            <span className="styles_text">
                                <FontAwesomeIcon icon={faChevronRight} width="1em" height='10px' fontSize={13} style={{ marginBottom: '-3px' }} />
                                <a href="/">Bác sĩ </a>
                            </span>
                        </li>
                        <li className="styles_last">
                            <span className="styles_text">
                                <FontAwesomeIcon icon={faChevronRight} width="1em" height='10px' fontSize={13} style={{ marginBottom: '-3px' }} />
                                <a href="/">{doctorData.chuc_danh}{doctorData.ho_ten}</a>
                            </span>
                        </li>
                        
                    </ul>
                )}
                </div>
            </div>
            <div className="styles_container1">
                <div>
                    <div className="styles_container">
                        {/* Phần I */}
                        <div className="styles_cardDoctor">
                            {/* phần 1 */}
                            <div className="ant-row">
                            {doctorData && (
                                <div className="styles_leftGroup">
                                    <div className="styles_logoImg" style={{ marginLeft: 20 }}>
                                        <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                            <img src={doctorData.hinh_anh} alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                                        </span>
                                    </div>
                                    <div className="styles_groupInfo" style={{ marginTop: '-20px' }}>
                                        <h1>{doctorData.chuc_danh}{doctorData.ho_ten}</h1>
                                        <div className="styles_info_General">
                                            <label>Chuyên khoa</label>
                                            <span>{doctorData.chuyen_mon}</span>
                                        </div>
                                        <div className="styles_info_General">
                                            <label>Chuyên trị</label>
                                            <div style={{marginTop:-14}}>
                                                <div className="ant-typography">
                                                    <span>{doctorData.chuyen_tri ? ReactHtmlParser(doctorData.chuyen_tri) : 'Không có nội dung'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles_info_General">
                                            <label>Giá khám</label>
                                            <span>{parseInt(doctorData.gia || "0").toLocaleString('vi-VN')} VNĐ</span>
                                        </div>
                                        <div className="styles_info_General">
                                            <label>Lịch khám</label>
                                            <span>Hẹn khám</span>
                                        </div>
                                    </div>
                                </div>
                               )}
                            </div>
                            {/* phần 2 */}
                            <div className="styles_frame">
                                {/* 2.1 */}
                                <div className="styles_bottomLeft">
                                    <FontAwesomeIcon icon={faLocationDot} className="styles_linear-location" />
                                    <div className="styles_groupAddress">
                                        <p className="styles_hopital">
                                            Bác sĩ Chuyên Khoa
                                        </p>
                                        <p className="styles_address" style={{ marginTop: 1 }}>Bệnh viện Khoái Châu-Hưng Yên</p>
                                    </div>
                                </div>
                                {/* 2.2 */}
                                <div className="styles_bottomRight">
                                    <button className="styles_btnBooking">
                                        <span>Đặt khám ngay</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Phần II */}
                        <div className="styles_introDoctor">
                            <div className="styles_row-doctor" style={{ marginLeft: '-10px', marginRight: '-10px', rowGap: '20px' }}>
                                {/* 1 */}
                                <div className="styles_col-intro-doctor" style={{ paddingLeft: 10, paddingRight: 10 }}>
                            {doctorData && (
                                    <div>
                                        {/* 1.1 */}
                                        <div className="styles_intro">
                                            <p className="styles_introIntroduce">
                                                Giới thiệu
                                            </p>
                                            <div>
                                                 <p>{doctorData.gioi_thieu ? ReactHtmlParser(doctorData.gioi_thieu) : 'Không có nội dung'}</p>
                                            </div>
                                        </div>
                                        {/* 1.2 */}
                                        <div className="styles_timeline">
                                            <div>
                                               
                                                {doctorData.kinh_nghiem ? ReactHtmlParser(doctorData.kinh_nghiem) : 'Không có nội dung'}
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                {/* 2 */}
                                <div className="styles_col-intro-doctor_right" style={{ paddingLeft: 5, paddingRight: 5 }}>
                                    <div className="styles_colNews">
                                        <p>Bài viết liên quan</p>
                                        <div className="styles_boxNews">
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title" style={{width:250}}>
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y t��</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles_newItem">
                                                <div className="styles_cardItem">
                                                    <div className="styles_cards">
                                                        <div className="styles_image">
                                                            <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'absolute', inset: '0px' }}>
                                                                <img sizes="100vw" src="../image/1733190956884_2269c9f458.webp" alt="" style={{ borderRadius: '8px', position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%' }} />
                                                            </span>
                                                        </div>
                                                        <div className="content">
                                                            <div className="styles_categories">
                                                                <div className="styles_icon">
                                                                    <span className="styles_icon">
                                                                        <svg
                                                                            width="6"
                                                                            height="7"
                                                                            viewBox="0 0 6 7"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="3"
                                                                                cy="3.23877"
                                                                                r="3"
                                                                                fill="#FFB54A"
                                                                                id="Ellipse_1880"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    <div style={{ marginLeft: 5 }}>Tin y tế</div>
                                                                </div>
                                                            </div>
                                                            <div className="styles_title">
                                                                Medpro đặt khám nhanh đã có mặt trên Zalopay
                                                            </div>
                                                            <div className="styles_tag">
                                                                <div className="styles_icon">
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                </div>
                                                                <span >02/12/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Phần III */}
                        <div className="styles_doctorWrapper">
                            <h2 className="styles_headerTitle">Bác sĩ cùng cơ sở y tế </h2>
                            <div className="styles_listDoctor" style={{ marginLeft: '-10px', marginRight: '-10px', rowGap: '20px', display: 'flex', flexWrap: 'wrap' }}>
                                <div className="styles_cardItem" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                    <div className="styles_cardDoctor">
                                        <div className="styles_leftGroup">
                                            <div className="styles_logoImg">
                                                <div className="styles_Avatar">
                                                    
                                                </div>
                                                <a href="" className="styles_detailDoctor">Xem chi tiết</a>
                                            </div>
                                            <div className="styles_groupInfo">
                                                <h3>BS CKI. Nguyễn Trí Khoa -  Bệnh Viện Bình Chánh  | Nhi Khoa</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="styles_cardItem" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                    <div className="styles_cardDoctor">
                                        <div className="styles_leftGroup">
                                            <div className="styles_logoImg">
                                                <div className="styles_Avatar">
                                                    
                                                </div>
                                                <a href="" className="styles_detailDoctor">Xem chi tiết</a>
                                            </div>
                                            <div className="styles_groupInfo">
                                                <h3>BS CKI. Nguyễn Trí Khoa -  Bệnh Viện Bình Chánh  | Nhi Khoa</h3>
                                            </div>
                                        </div>
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

export default Chitietthongtinbacsi;
