import React, { useEffect, useState } from 'react';
import { Card, Result, Button, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Thanhcong: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // Đếm ngược 5 giây

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1); // Giảm 1 giây mỗi lần
    }, 1000);

    const timeout = setTimeout(() => {
      navigate('/'); // Chuyển hướng sau 5 giây
    }, 5000);

    // Dọn dẹp khi component bị hủy
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom right, #f0f8ff, #e6f7ff)',
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Đặt lịch thành công!"
          subTitle={`Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Bạn sẽ được chuyển về trang chủ sau ${countdown} giây.`}
          style={{ textAlign: 'center' }}
        />
        <Space
          direction="vertical"
          size="middle"
          style={{ width: '100%', textAlign: 'center' }}
        >
          <Button
            style={{
              borderRadius: '8px',
              fontSize: '16px',
              padding: '8px 24px',
            }}
            onClick={handleGoHome}
          >
            Quay về trang chủ ngay
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Thanhcong;
