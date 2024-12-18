import { faCalendarDays, faChevronDown, faChevronRight, faDollarSign, faHospital, faMagnifyingGlass, faMedkit, faPhone, faSearch, faStethoscope, faUser, faVenusMars } from "@fortawesome/free-solid-svg-icons";
import "../bacsi/bacsi.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    mat_khau: string;
    gia: string;
    khambenh_qua_video: boolean;
    chuc_danh: string
}

interface ChuyenMon {
    id: number;
    ten_chuyen_mon: string;
}

interface Khoa {
    id: number;
    ten: string;
    mo_ta?: string;
    hinh_anh?: any;
}

const ChonBacSi = function () {
    const [searchParams] = useSearchParams();
    const khoa_id = searchParams.get('khoa_id');
    const navigate = useNavigate();
    const [bacSiList, setBacSiList] = useState<BacSi[]>([]);
    const [chuyenMonList, setChuyenMonList] = useState<ChuyenMon[]>([]);
    const [khoaList, setKhoaList] = useState<Khoa[]>([]);
    const [academicTitle, setAcademicTitle] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        const fetchBacSiList = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/api/bacsi/searchBacSiTheoKhoa/${khoa_id}/1/10`);
                console.log(response.data)
                if (response.data && response.data.length > 0) {
                    setBacSiList(response.data);
                } else {
                    setBacSiList([]);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bác sĩ:', error);
            }
        };

        fetchBacSiList();
    }, [khoa_id]);

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

    const getChuyenMonName = (id: number) => {
        const chuyenMon = chuyenMonList.find(cm => cm.id === id);
        return chuyenMon ? chuyenMon.ten_chuyen_mon : 'Không xác định';
    };

    const getKhoaName = (id: number) => {
        const khoa = khoaList.find(k => k.id === id);
        return khoa ? khoa.ten : 'Không xác định';
    };

    const handleBacSiClick = (bacSiId: string, hoTen: string, chuyenKhoa: string, gia: string) => {
        sessionStorage.setItem('selectedDoctor', JSON.stringify({
            id: bacSiId,
            name: hoTen,
            specialty: chuyenKhoa,
            gia: gia
        }));
        navigate(`/Datlich?bac_si_id=${bacSiId}`);
    };

    const handleBacSiClick1 = (bacSiId: string, hoTen: string, chuyenKhoa: string) => {
        sessionStorage.setItem('selectedDoctor', JSON.stringify({
            id: bacSiId,
            name: hoTen,
            specialty: chuyenKhoa
        }));

        sessionStorage.setItem('bacsi_id', bacSiId);
        navigate(`/Chitietthongtinbacsi?bac_si_id=${bacSiId}`);
    };

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

            <div>
                <div className="styles_container1">
                    <div className="ant-row">
                        <div className="ant-rows" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
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
                                            <span>
                                                <FontAwesomeIcon icon={faMedkit} />
                                            </span>
                                            {bacSiList.length > 0 ? (
                                                <div className="styles_infoHopital">
                                                    <span style={{ marginLeft: '-22px' }}>Chuyên khoa: </span>
                                                    {getKhoaName(bacSiList[0].khoa_id)}
                                                </div>
                                            ) : (
                                                <p>Không có bác sĩ nào được tìm thấy.</p>
                                            )}
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
                                            <span>Vui lòng chọn Bác sĩ </span>
                                        </div>
                                    </span>
                                </div>

                                <div className="styles_chooseDate">
                                    <div className="styles_cardBody1">
                                        <div>
                                            <div>
                                                <div className="styles_animationTop" style={{ animationFillMode: 'forwards', marginTop: '40px', marginLeft: '20px' }}>
                                                    <span className="ant-input-group-wrapper" style={{ width: '100%' }}>
                                                        <span className="ant-input-group">
                                                            <span className="ant-input-affix-wrapper-lg">
                                                                <input type="text" placeholder="Tìm nhanh bác sĩ " className="ant-input ant-input-lg" />
                                                            </span>
                                                            <span className="ant-input-group-addon">
                                                                <button className="search-btn" style={{ marginLeft: '750px', marginTop: '-25px' }}>
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                </button>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="styles_animationTop styles_selectFilter" style={{ animationFillMode: 'forwards', marginLeft: '12px' }}>
                                                    {/* Dropdown for Academic Title */}
                                                    <div className="ant-select styles_filterItem" style={{ position: 'relative' }}>
                                                        <select
                                                            className="ant-select-selector"
                                                            style={{
                                                                background: 'linear-gradient(83.63deg, #00b5f1 33.34%, #00e0ff 113.91%)',
                                                                borderRadius: 5,
                                                                border: 'none',
                                                                outline: 'none',
                                                                paddingRight: '30px', // Increase padding to the right for the arrow
                                                                appearance: 'none', // Remove default arrow
                                                                color: '#fff', // Ensure text color is white for visibility
                                                                fontSize: '16px', // Adjust font size if necessary
                                                            }}
                                                            value={academicTitle}
                                                            onChange={(e) => setAcademicTitle(e.target.value)}
                                                        >
                                                            <option value="" style={{color:'black'}}>Học hàm / học vị</option>
                                                            <option value="TS .BS" style={{color:'black'}}>Tiến Sĩ</option>
                                                            <option value="Ths BS."style={{color:'black'}}>Thạc Sĩ</option>
                                                            <option value="BS" style={{color:'black'}}>Bác Sĩ</option>
                                                        </select>
                                                        <span className="ant-select-arrow" style={{
                                                            position: 'absolute',
                                                            right: '10px', // Position the arrow
                                                            top: '67%', // Center it vertically
                                                            transform: 'translateY(-50%)', // Adjust for perfect centering
                                                            zIndex: 1, // Ensure it appears above the select
                                                            color: '#fff', // Match the text color for consistency
                                                        }}>
                                                            <FontAwesomeIcon icon={faChevronDown} />
                                                        </span>
                                                    </div>

                                                    {/* Dropdown for Gender */}
                                                    <div className="ant-select styles_filterItem">
                                                        <select
                                                            className="ant-select-selector"
                                                            value={gender}
                                                            onChange={(e) => setGender(e.target.value)}
                                                        >
                                                            <option value="">Giới tính</option>
                                                            <option value="Nam">Nam</option>
                                                            <option value="Nữ">Nữ</option>
                                                            {/* Add more options as needed */}
                                                        </select>
                                                        <span className="ant-select-arrow">
                                                            <FontAwesomeIcon icon={faChevronDown} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="styles_animationTop styles_listDoctorCard" style={{ animationFillMode: 'forwards' }}>
                                                {bacSiList
                                                    .filter(bacSi =>
                                                        (academicTitle ? bacSi.chuc_danh === academicTitle : true) &&
                                                        (gender ? bacSi.gioi_tinh === gender : true)
                                                    )
                                                    .map((bacSi: BacSi) => {
                                                        const tenChuyenMon = chuyenMonList.find(chuyenMon => chuyenMon.id === Number(bacSi.chuyen_mon))?.ten_chuyen_mon || 'Không xác định';

                                                        return (
                                                            <div className="styles_doctorInfo" style={{ marginLeft: '16px' }} key={bacSi.id}>
                                                                <div className="styles_cardBody" onClick={() => handleBacSiClick(bacSi.id, bacSi.ho_ten, tenChuyenMon, bacSi.gia)}>
                                                                    <div className="styles_highlight styles_infoLine">
                                                                        <span>
                                                                            <FontAwesomeIcon icon={faUser} />
                                                                        </span>
                                                                        TS BS {bacSi.ho_ten}
                                                                    </div>
                                                                    <div className="styles_infoLine">
                                                                        <span>
                                                                            <FontAwesomeIcon icon={faVenusMars} />
                                                                        </span>
                                                                        Giới tính: {bacSi.gioi_tinh}
                                                                    </div>
                                                                    <div className="styles_infoLine">
                                                                        <span>
                                                                            <FontAwesomeIcon icon={faStethoscope} />
                                                                        </span>
                                                                        Chuyên môn: {tenChuyenMon}
                                                                    </div>
                                                                    <div className="styles_infoLine">
                                                                        <span>
                                                                            <FontAwesomeIcon icon={faCalendarDays} />
                                                                        </span>
                                                                        Lịch khám: Thứ 3 Thứ 5
                                                                    </div>
                                                                    <div className="styles_infoLine" style={{ color: 'red' }}>
                                                                        <span>
                                                                            <FontAwesomeIcon icon={faDollarSign} />
                                                                        </span>
                                                                        Giá khám: {parseInt(bacSi.gia).toLocaleString('vi-VN')} VNĐ
                                                                    </div>
                                                                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleBacSiClick1(bacSi.id, bacSi.ho_ten, tenChuyenMon);
                                                                            }}
                                                                            className="view-details-btn"
                                                                            style={{
                                                                                backgroundColor: '#808080',
                                                                                color: '#fff',
                                                                                border: 'none',
                                                                                padding: '5px 10px',
                                                                                borderRadius: '5px',
                                                                                cursor: 'pointer',
                                                                                fontSize: '14px',
                                                                                marginRight: -10
                                                                            }}
                                                                        >
                                                                            Xem Chi Tiết
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
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
}

export default ChonBacSi;