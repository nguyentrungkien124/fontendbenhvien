import { faArrowRight, faCalendar } from "@fortawesome/free-solid-svg-icons";
import "../tintuc/tintuc.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactHtmlParser from 'html-react-parser'; // Đảm bảo import đúng

interface BaiViet {
    id: number;
    id_admin: number | null;
    tieu_de: string;
    noi_dung: string;
    hinh_anh: string;
    loai_bai_viet: number;
    trang_thai: number;
    luot_xem: number | null;
    ngay_dang: string;
    created_at: string;
    updated_at: string;
}

const Chitiettintuc = () => {
    const [newsDetail, setNewsDetail] = useState<BaiViet | null>(null); // Dữ liệu bài viết chi tiết
    const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const selectedNews = sessionStorage.getItem("selectedNews");
                if (selectedNews) {
                    const response = await axios.get(`http://localhost:9999/api/baiviet/getbaivietbyID/${selectedNews}`);
                    console.log("API Response:", response.data);
                    // Lấy phần tử đầu tiên của mảng
                    const newsData = response.data[0];
                    console.log("Nội dung:", newsData.noi_dung);
                    setNewsDetail(newsData);
                }
            } catch (error) {
                console.error("Error fetching news detail", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchNewsDetail();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!newsDetail) {
        return <div>Không có dữ liệu bài viết nào được tìm thấy.</div>;
    }

    // Định dạng ngày giờ


    return (
        <div className="styles_body2">
            <div style={{ background: "rgb(255, 255, 255)" }}>
                <div className="styles_news">
                    {newsDetail.noi_dung ? ReactHtmlParser(newsDetail.noi_dung) : 'Không có nội dung'}
                    {newsDetail.tieu_de}
                </div>
            </div>
        </div>
    );
};

export default Chitiettintuc;
