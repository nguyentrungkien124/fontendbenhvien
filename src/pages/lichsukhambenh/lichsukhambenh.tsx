import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, message, Button, Space, Modal, Input, Rate } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const { Title } = Typography;
// Định nghĩa kiểu dữ liệu cho phiếu khám
interface DatLich {
  id: number;
  bac_si_id: number;
  ten_bac_si: string;
  ngay_hen: string;
  ca_dat: string;
  chuyen_khoa: string;
  gia: number;
  ghi_chu: string;
  ngay_tao: string;
  trang_thai: number;
  da_danh_gia: boolean;
}
const Lichsudadatlich = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedPhieuId, setSelectedPhieuId] = useState<number | null>(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [filter, setFilter] = useState<number | null>(null);
  const userId = sessionStorage.getItem('id');

  // Hàm mở modal hủy
// Hàm mở modal hủy
const showModal = (id: number) => {
  if (id) {
    setSelectedPhieuId(id);
    setIsModalVisible(true);
  } else {
    message.error('ID phiếu không hợp lệ!');
  }
};
  // Hàm mở modal đánh giá
  const showReviewModal = (doctorId: number, phieuId: number) => {
    setSelectedDoctorId(doctorId);
    setSelectedPhieuId(phieuId);
    setIsReviewModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setCancelReason('');
  };

  const handleReviewCancel = () => {
    setIsReviewModalVisible(false);
    setReview('');
    setRating(0);
  };

  // Hàm xử lý khi nhấn "Đồng ý" hủy
  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      message.error('Bạn cần nhập lý do hủy!');
      return;
    }

    try {
      const idToCancel = selectedPhieuId;
      const response = await fetch('http://localhost:9999/api/datlich/HuyPhieuKham', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idToCancel,
          ghi_chu: cancelReason,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        message.success('Hủy phiếu khám thành công!');
        handleCancel();
        fetchData();
      } else {
        message.error(data.message || 'Có lỗi xảy ra khi hủy phiếu khám.');
      }
    } catch (error) {
      message.error('Lỗi kết nối, không thể hủy phiếu khám.');
    }
  };

  console.log(selectedPhieuId)
  // Hàm xử lý gửi đánh giá
  const handleSubmitReview = async () => {
    if (!selectedPhieuId) {
      message.error('Không tìm thấy phiếu để đánh giá!');
      return;
    }
  
    if (rating < 1 || rating > 5) {
      message.error('Vui lòng chọn đánh giá từ 1 đến 5 sao.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:9999/api/danhgia/themdanhgia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datlich_id: selectedPhieuId,
          nguoi_dung_id: userId,
          bac_si_id: selectedDoctorId,
          so_sao: rating,
          nhan_xet: review,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Lưu ID phiếu đã đánh giá vào localStorage
        localStorage.setItem(`evaluated-${selectedPhieuId}`, 'true');
        
        message.success('Đánh giá thành công!');
        handleReviewCancel();
        fetchData();
      } else {
        message.error(data.message || 'Có lỗi xảy ra khi gửi đánh giá.');
      }
    } catch (error) {
      message.error('Lỗi kết nối, không thể gửi đánh giá.');
    }
  };

  // Hàm để lấy dữ liệu lịch khám và bác sĩ
  const fetchData = async () => {
    if (!userId) {
      message.error('Không tìm thấy ID người dùng trong session');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9999/api/datlich/getLichKhamByNguoiDung/${userId}/1/1000`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      
    
      const doctorResponse = await fetch('http://localhost:9999/api/bacsi/getall');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctors');
      const doctorData = await doctorResponse.json();
      setDoctors(doctorData);

      const dataWithDoctorName = result.map((item: any) => {
        const doctor = doctorData.find((doc: any) => doc.id === item.bac_si_id);
        return {
          ...item,
          ten_bac_si: doctor ? doctor.ho_ten : 'Không xác định',
          da_danh_gia: item.da_danh_gia || false, // Giả sử API trả về trường này
        };
      });

      setData(dataWithDoctorName);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  // Hàm lọc dữ liệu theo trạng thái
  const filterData = () => {
    if (filter === null) return data;
    return data.filter((item: DatLich) => item.trang_thai === filter); // Sử dụng kiểu dữ liệu
  };

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      key: 'stt',
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'ten_bac_si',
      key: 'ten_bac_si',
      align: 'center',
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'ngay_hen',
      key: 'ngay_hen',
      align: 'center',
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      title: 'Ca đặt',
      dataIndex: 'ca_dat',
      key: 'ca_dat',
      align: 'center',
      render: (text: string) => {
        if (!text || typeof text !== 'string' || !text.includes('-')) return 'Khám online 1h';
        const times = text.split('-');
        const formatTime = (time: string) => {
          const [hours, minutes] = time.split(':');
          return `${hours}:${minutes}`;
        };
        if (times.length !== 2) return 'Khám online 1h';
        return `${formatTime(times[0])}-${formatTime(times[1])}`;
      },
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'chuyen_khoa',
      key: 'chuyen_khoa',
      align: 'center',
    },
    {
      title: 'Giá',
      dataIndex: 'gia',
      key: 'gia',
      align: 'center',
      render: (gia: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghi_chu',
      key: 'ghi_chu',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngay_tao',
      key: 'ngay_tao',
      align: 'center',
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      align: 'center',
      render: (text: number) => {
        let color = '';
        let label = '';
        switch (text) {
          case 1:
            color = 'orange';
            label = 'Chờ xác nhận';
            break;
          case 2:
            color = 'green';
            label = 'Đã xác nhận';
            break;
          case 3:
            color = 'blue';
            label = 'Đã khám';
            break;
          case 0:
            color = 'red';
            label = 'Hủy khám bệnh';
            break;
          default:
            color = 'gray';
            label = 'Không xác định';
        }
        return <span style={{ color, fontWeight: 'bold' }}>{label}</span>;
      },
      sorter: (a, b) => a.trang_thai - b.trang_thai,
    },
    {
      title: 'Chức năng',
      key: 'actions',
      align: 'center',
      render: (record: DatLich) => (
        <Space size="middle">
          {record.trang_thai === 3 && !localStorage.getItem(`evaluated-${record.id}`) && ( // Kiểm tra đã đánh giá chưa
            <Button 
              type="primary" 
              onClick={() => showReviewModal(record.bac_si_id, record.id)}
            >
              Đánh giá
            </Button>
          )}
          {(record.trang_thai !== 0 && record.trang_thai !== 3) && (
            <Button type="primary" danger onClick={() => showModal(record.id)}>
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const getButtonStyle = (status: number | null) => {
    return status === filter ? { backgroundColor: 'lightblue' } : {};
  };

  return (
    <div className="styles_body2">
      <div className="styles_breadcrumb">
        <div className="styles_containerPartner">
          <ul className="styles_breadcrumbs">
            <li><a href="/">Trang chủ</a></li>
            <li>
              <span className="styles_text">
                <FontAwesomeIcon icon={faChevronRight} width="1em" height="10px" fontSize={13} style={{ marginBottom: '-3px' }} />
                <a href="/" style={{ color: '#00b5f1' }}>Lịch sử phiếu đã đặt</a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="styles_container1" style={{ height: 700 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '20px', color: '#1890ff' }}>Danh sách phiếu khám bệnh</Title>

          {/* Nút lọc trạng thái */}
          <Space style={{ marginBottom: '20px' }}>
            <Button onClick={() => setFilter(1)} style={getButtonStyle(1)}>Chờ xác nhận</Button>
            <Button onClick={() => setFilter(2)} style={getButtonStyle(2)}>Đã xác nhận</Button>
            <Button onClick={() => setFilter(3)} style={getButtonStyle(3)}>Đã khám</Button>
            <Button onClick={() => setFilter(0)} style={getButtonStyle(0)}>Hủy khám bệnh</Button>
            
            <Button onClick={() => setFilter(4)} style={getButtonStyle(4)}>Bác sĩ từ chối khám</Button>
         
            <Button onClick={() => setFilter(null)} style={getButtonStyle(null)}>Tất cả</Button>
          </Space>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filterData()}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              bordered
              style={{ backgroundColor: '#fff' }}
            />
          )}
        </div>
      </div>

      {/* Modal hủy phiếu khám */}
      <Modal
        title="Lý do hủy phiếu khám"
        visible={isModalVisible}
        onOk={handleConfirmCancel}
        onCancel={handleCancel}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Nhập lý do hủy phiếu khám"
        />
      </Modal>

      {/* Modal đánh giá bác sĩ */}
      <Modal
        title="Đánh giá bác sĩ"
        visible={isReviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={handleReviewCancel}
        okText="Gửi"
        cancelText="Hủy"
      >
        <div>
          <span>Đánh giá:</span>
          <Rate value={rating} onChange={setRating} />
          <Input.TextArea
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Nhập nhận xét của bạn"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Lichsudadatlich;