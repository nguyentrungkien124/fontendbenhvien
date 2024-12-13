import { faMagnifyingGlass, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import "../bacsikhamquavideo/bacsikhamquavideo.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from 'antd';
import React, { useState } from 'react';

const Bacsikhamquavideo = function () {
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = 100;
    const itemsPerPage = 4;

    const handlePageChange = (page:any) => {
        setCurrentPage(page);
    };

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
                        <div className="styles_herder"  style={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'stretch'}}>
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
                                                                            <FontAwesomeIcon icon={faMagnifyingGlass} height={20} width={20} style={{marginLeft:'20px'}} />
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
                            <div className="ant-row5" style={{marginLeft:-10,marginRight:-10,rowGap:0}}>
                                <div className="styles_the" style={{paddingLeft:0}}>
                                    <div className="styles_content">
                                        <div className="styles_content_title">
                                            {/* 3.1 */}
                                            <div className="styles_images">
                                                <span style={{boxSizing:'border-box',display:'block',overflow:"hidden",width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:0,position:'absolute',inset:0}}>
                                                    <img src="../image/bacsiquavideo1.webp" alt="" style={{borderRadius:'16px',position:'absolute',inset:0,boxSizing:'border-box',padding:0,border:'none',margin:'auto',display:'block',width:0,height:0,minWidth:'100%',maxWidth:'100%',minHeight:'100%',maxHeight:'100%',objectFit:'contain'
                                                    }} />
                                                </span>
                                                <button className="styles_btnView">
                                                    <span style={{whiteSpace:'nowrap'}}>Xem chi tiết</span>
                                                </button>
                                                <div className="styles_rating">
                                                    {/*  */}
                                                    <div className="styles_rate">
                                                        <span>4.7</span>
                                                        <p style={{color:'rgb(255, 181, 74)'}}><FontAwesomeIcon icon={faStar} /></p>
                                                    </div>
                                                    {/*  */}
                                                    <div className="styles_rate">
                                                        <span>100</span>
                                                        <p style={{color:'rgb(255, 181, 74)'}}><FontAwesomeIcon icon={faUser} /></p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 3.2 */}
                                            <div className="styles_content_title_int">
                                                <div className="styles_groupTitle">
                                                    <h3 className="styles_title">
                                                    Ths BS. <strong>Lương Kim Khánh - ĐH Y khoa Phạm Ngọc Thạch</strong>
                                                    </h3>
                                                </div>
                                                <div className="styles_time">
                                                    <span>
                                                        <span style={{boxSizing:'border-box',display:'block',overflow:"hidden",width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:0,position:'relative'}}>
                                                            <span  style={{boxSizing:'border-box',display:'block',width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:'100% 0px 0px'}}>
                                                                <img src="../image/subject.svg" alt="" style={{position:'absolute',inset:0,boxSizing:'border-box',padding:0,border:'none',margin:'auto',display:'block',width:0,height:0,minWidth:'100%',maxWidth:'100%',minHeight:'100%',maxHeight:'100%'}} />
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <div className="styles_address">
                                                    Chuyên khoa: Da liễu
                                                    </div>
                                                </div>
                                                <div className="styles_treatment">
                                                    <span>
                                                        <span style={{boxSizing:'border-box',display:'block',overflow:"hidden",width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:0,position:'relative'}}>
                                                            <span  style={{boxSizing:'border-box',display:'block',width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:'100% 0px 0px'}}>
                                                                <img src="../image/pin.svg" alt="" style={{position:'absolute',inset:0,boxSizing:'border-box',padding:0,border:'none',margin:'auto',display:'block',width:0,height:0,minWidth:'100%',maxWidth:'100%',minHeight:'100%',maxHeight:'100%'}} />
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <div className="styles_treatmentDesc">
                                                        <p className="styles_treatmentContent">
                                                        Chuyên trị: Da liễu
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="styles_time" style={{marginTop:-16}}>
                                                    <span>
                                                        <span style={{boxSizing:'border-box',display:'block',overflow:"hidden",width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:0,position:'relative'}}>
                                                            <span  style={{boxSizing:'border-box',display:'block',width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:'100% 0px 0px'}}>
                                                                <img src="../image/calendar.svg" alt="" style={{position:'absolute',inset:0,boxSizing:'border-box',padding:0,border:'none',margin:'auto',display:'block',width:0,height:0,minWidth:'100%',maxWidth:'100%',minHeight:'100%',maxHeight:'100%'}} />
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <div className="styles_address">
                                                    Lịch khám : Hẹn khám
                                                    </div>
                                                </div>
                                                <div className="styles_time">
                                                    <span>
                                                        <span style={{boxSizing:'border-box',display:'block',overflow:"hidden",width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:0,position:'relative'}}>
                                                            <span  style={{boxSizing:'border-box',display:'block',width:'initial',height:'initial',background:'none',opacity:1,border:0,margin:0,padding:'100% 0px 0px'}}>
                                                                <img src="../image/pay.svg" alt="" style={{position:'absolute',inset:0,boxSizing:'border-box',padding:0,border:'none',margin:'auto',display:'block',width:0,height:0,minWidth:'100%',maxWidth:'100%',minHeight:'100%',maxHeight:'100%'}} />
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <div className="styles_address">
                                                    Giá khám: 150.000đ
                                                    </div>
                                                </div>
                                                <div className="styles_desktop">
                                                    <div className="styles_btnControl">
                                                        <button className="styles_btnBooking">
                                                            <span>Đặt khám ngay</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div style={{textAlign:'center',display:'flex',justifyContent:'center',marginTop:40,marginBottom:19}}>
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



