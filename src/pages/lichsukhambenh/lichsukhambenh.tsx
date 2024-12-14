import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, message, Button, Space, Modal, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
const { Title } = Typography;

const Lichsudadatlich = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]); // Lưu thông tin bác sĩ
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [cancelReason, setCancelReason] = useState(''); // Lý do hủy
  const [selectedPhieuId, setSelectedPhieuId] = useState<number | null>(null); // ID phiếu khám cần hủy
  const userId = sessionStorage.getItem('id');

  // Hàm mở modal khi nhấn nút hủy
  const showModal = (id: number) => {
    if (id !== undefined && id !== null) {
      setSelectedPhieuId(id);
      sessionStorage.setItem('selectedPhieuId', id.toString());
      setIsModalVisible(true);
    } else {
      message.error('Không tìm thấy ID phiếu khám.');
    }
  };
  

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi nhấn "Đồng ý"
  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      message.error('Bạn cần nhập lý do hủy!');
      return;
    }

    try {
      const idToCancel = sessionStorage.getItem('selectedPhieuId'); // Lấy ID từ sessionStorage
      if (!idToCancel) {
        message.error('Không tìm thấy ID phiếu khám.');
        return;
      }

      const response = await fetch('http://localhost:9999/api/datlich/HuyPhieuKham', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idToCancel, // Dùng ID lấy từ sessionStorage
          ghi_chu: cancelReason,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        message.success('Hủy phiếu khám thành công!');
        setIsModalVisible(false); // Đóng modal sau khi thành công
        fetchData(); // Tải lại dữ liệu sau khi hủy
      } else {
        message.error(data.message || 'Có lỗi xảy ra khi hủy phiếu khám.');
      }
    } catch (error) {
      message.error('Lỗi kết nối, không thể hủy phiếu khám.');
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
      // Fetch lịch khám
      const response = await fetch(`http://localhost:9999/api/datlich/getLichKhamByNguoiDung/${userId}/1/1000`);
      console.log(data)
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();

      // Fetch danh sách bác sĩ
      const doctorResponse = await fetch('http://localhost:9999/api/bacsi/getall');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctors');
      const doctorData = await doctorResponse.json();
      setDoctors(doctorData);

      // Map ID bác sĩ thành tên bác sĩ
      const dataWithDoctorName = result.map((item: any) => {
        const doctor = doctorData.find((doc: any) => doc.id === item.bac_si_id);
        return {
          ...item,
          ten_bac_si: doctor ? doctor.ho_ten : 'Không xác định', // Dùng 'Không xác định' nếu không tìm thấy bác sĩ
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

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      key: 'stt',
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Bác sĩ ',
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
        const date = new Date(text); // Chuyển chuỗi thành kiểu ngày
        return date.toLocaleDateString('vi-VN'); // Định dạng theo kiểu ngày tháng năm
      },
    },
    {
      title: 'Ca đặt',
      dataIndex: 'ca_dat',
      key: 'ca_dat',
      align: 'center',
      render: (text: string) => {
          if (!text || typeof text !== 'string' || !text.includes('-')) return 'Khám online 1h'; // Giá trị mặc định
  
          const times = text.split('-'); // Tách chuỗi tại dấu '-'
          
          const formatTime = (time: string) => {
              const [hours, minutes] = time.split(':');
              return `${hours}:${minutes}`;
          };
  
          // Kiểm tra xem times có đủ 2 phần không
          if (times.length !== 2) return 'Khám online 1h'; // Giá trị mặc định nếu không đủ thời gian
  
          return `${formatTime(times[0])}-${formatTime(times[1])}`;
      },
  },
    {
        title: 'Chuyên khoa ',
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
        const date = new Date(text); // Chuyển chuỗi thành kiểu ngày
        return date.toLocaleDateString('vi-VN'); // Định dạng theo kiểu ngày tháng năm
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
    },
    {
      title: 'Chức năng',
      key: 'actions',
      align: 'center',
      render: (record: any) => (
        <Space size="middle">
          <Button type="primary" danger onClick={() => showModal(record.id)}>
            Hủy
          </Button>
          
        </Space>
      ),
    },
  ];

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
          <Title level={3} style={{ textAlign: 'center', marginBottom: '20px', color: '#1890ff' }}>Danh sách phiếu khám bệnh </Title>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={data}
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
    </div>
  );
};

export default Lichsudadatlich;
