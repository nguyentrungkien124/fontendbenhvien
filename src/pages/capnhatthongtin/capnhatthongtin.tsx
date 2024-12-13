
import { Form, Input, Select, DatePicker, Button, Row, Col, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // Để sử dụng cho DatePicker
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;
const Capnhatthongtinnguoidung = () => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState<any>(null);  // Lưu trữ dữ liệu người dùng
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const id = sessionStorage.getItem("id");
            if (!id) {
                message.error("Không tìm thấy ID người dùng");
                return;
            }
            try {
                const response = await fetch(`http://localhost:9999/api/user/getthongtinbyId/${id}`);
                const data = await response.json();
                const newsData = data[0]; // Lấy dữ liệu người dùng từ API
                console.log(newsData); // Kiểm tra dữ liệu trong console
                if (newsData) {
                    setUserData(newsData); // Lưu dữ liệu vào state
                    form.setFieldsValue({
                        ho_ten: newsData.ho_ten,
                        email: newsData.email,
                        so_dien_thoai: newsData.so_dien_thoai,
                        nghe_nghiep: newsData.nghe_nghiep,
                        CMND: newsData.CMND,
                        dan_toc: newsData.dan_toc,
                        ngay_sinh: newsData.ngay_sinh ? moment(newsData.ngay_sinh) : moment(), // Hiển thị ngày sinh nếu có, nếu không thì dùng ngày hiện tại
                        gioi_tinh: newsData.gioi_tinh,
                        dia_chi: newsData.dia_chi,
                        mat_khau: newsData.mat_khau
                    });
                }
            } catch (error) {
                message.error("Lỗi khi tải thông tin người dùng");
            }
        };
    
        fetchUserData();
    }, [form]);


    const onFinish = async (values: any) => {
        const id = sessionStorage.getItem("id");
        if (!id) {
            message.error("Không tìm thấy ID người dùng");
            return;
        }

        // Format ngay_sinh before sending to the server
        const formattedValues = {
            ...values,
            ngay_sinh: values.ngay_sinh ? moment(values.ngay_sinh).format('YYYY-MM-DD') : null, // Format lại ngày sinh
            id, // Bao gồm ID trong dữ liệu gửi lên
        };
        

        try {
            const response = await fetch("http://localhost:9999/api/user/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                
                body: JSON.stringify(formattedValues),
            });
            console.log(response)
            if (response.ok) {
                message.success("Cập nhật thông tin thành công");
                navigate(""); // Redirect after success
            } else {
                throw new Error("Cập nhật không thành công");
            }
        } catch (error) {
            message.error("Lỗi khi cập nhật thông tin");
        }
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
                                <a href="/" style={{ color: '#00b5f1' }}>Cập nhật thông tin</a>
                            </span>
                        </li>


                    </ul>
                </div>
            </div>
            <div className="styles_container1">
                <div>
                    <div className="styles_container" style={{ height: 800 }}>
                        <div
                            style={{
                                backgroundColor: "#f0f8ff",
                                padding: "30px",
                                maxWidth: "900px",
                                margin: "0 auto",
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <h2
                                style={{
                                    textAlign: "center",
                                    color: "#007bff",
                                    marginBottom: "20px",
                                    fontSize: "24px",
                                }}
                            >
                                Cập nhật thông tin
                            </h2>
                            <p style={{ textAlign: "center", color: "#6c757d", marginBottom: "30px" }}>
                                Vui lòng cung cấp thông tin chính xác để được phục vụ tốt nhất. Trong trường hợp cung cấp sai thông tin, việc xác nhận cuộc hẹn sẽ không hiệu lực.
                            </p>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                style={{ maxWidth: "100%" }}
                            >
                                <Row gutter={[24, 16]}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="ho_ten"
                                            label="Họ và tên (có dấu)"
                                            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                                            style={{ marginBottom: "10px" }}  // Giảm khoảng cách giữa label và input
                                        >
                                            <Input
                                                placeholder={userData?.ho_ten || "Nguyễn Trung Kiên"}
                                                style={{
                                                    height: "40px",
                                                    borderRadius: "6px",
                                                    textIndent: "10px"  // Giảm khoảng cách ở phía trên Input
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={7} >
                                        <Form.Item
                                            name="ngay_sinh"
                                            label={<b>Ngày sinh (năm/tháng/ngày) <span style={{ color: "red" }}></span></b>}
                                            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                                        >
                                            <DatePicker
                                                style={{ width: "100%", borderRadius: "6px", height: "40px", textIndent: "10px" }}
                                                format="YYYY/MM/DD"
                                                value={userData?.ngay_sinh ? moment(userData.ngay_sinh) : moment()} // Nếu có ngày sinh thì hiển thị, nếu không thì hiển thị ngày hiện tại
                                            />


                                        </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ marginLeft: 45 }}>
                                        <Form.Item
                                            name="gioi_tinh"
                                            label={<b>Giới tính <span style={{ color: "red" }}></span></b>}
                                            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                                        >
                                            <Select
                                                placeholder={userData?.gioi_tinh || "Nam"}
                                                style={{ borderRadius: "6px", height: "40px" }}
                                            >
                                                <Option value="nam">Nam</Option>
                                                <Option value="nu">Nữ</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: 60 }}>
                                        <Form.Item
                                            name="so_dien_thoai"
                                            label={<b>Số điện thoại <span style={{ color: "red" }}></span></b>}
                                            rules={[
                                                { required: true, message: "Vui lòng nhập số điện thoại!" },
                                                { pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ!" },
                                            ]}
                                        >
                                            <Input
                                                placeholder={userData?.so_dien_thoai || "0345971525"}
                                                style={{ borderRadius: "6px", height: "40px", textIndent: "10px" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={7}>
                                        <Form.Item
                                            name="nghe_nghiep"
                                            label={<b>Nghề nghiệp <span style={{ color: "red" }}></span></b>}
                                            rules={[{ required: true, message: "Vui lòng nhập nghề nghiệp!" }]}
                                        >
                                            <Input placeholder={userData?.nghe_nghiep || "0345971525"} style={{ borderRadius: "6px", height: "40px", textIndent: "10px" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ marginLeft: 45 }}>
                                        <Form.Item
                                            name="CMND"
                                            label={<b>Số CCCD/Passport <span style={{ color: "red" }}></span></b>}
                                            rules={[{ required: true, message: "Vui lòng nhập số CCCD/Passport!" }]}
                                        >
                                            <Input placeholder={userData?.CMND} style={{ borderRadius: "6px", height: "40px", textIndent: "10px" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: 60 }}>
                                        <Form.Item
                                            name="email"
                                            label={<b>Địa chỉ Email <span style={{ color: "red" }}></span></b>}
                                            rules={[
                                                { required: true, message: "Vui lòng nhập email!" },
                                                { type: "email", message: "Email không hợp lệ!" },
                                            ]}
                                        >
                                            <Input placeholder={userData?.email} style={{ borderRadius: "6px", height: "40px", textIndent: "10px" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={7}>
                                        <Form.Item
                                            name="dan_toc"
                                            label={<b>Dân tộc <span style={{ color: "red" }}></span></b>}
                                            rules={[{ required: true, message: "Vui lòng chọn dân tộc!" }]}
                                        >
                                            <Input placeholder={userData?.dan_toc} style={{ borderRadius: "6px", height: "40px", textIndent: "10px" }}>

                                            </Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ marginLeft: 45 }}>
                                        <Form.Item
                                            name="dia_chi"
                                            label={<b>Địa chỉ hiện tại <span style={{ color: "red" }}></span></b>}
                                            rules={[{ required: true, message: "Vui lòng nhập địa chỉ hiện tại!" }]}
                                        >
                                            <Input placeholder={userData?.dia_chi} style={{ borderRadius: "6px", height: "40px", textIndent: "10px" }} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8} style={{ marginLeft: 60 }}>
                                        <Form.Item
                                            name="mat_khau"
                                            label={<b>Mật khẩu <span style={{ color: "red" }}></span></b>}
                                            rules={[{ required: true, message: "Vui lòng nhập địa chỉ hiện tại!" }]}
                                        >
                                            <Input.Password
                                                placeholder="input password"
                                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                                            />
                                        </Form.Item>
                                    </Col>

                                </Row>



                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            width: "100%",
                                            height: "45px",
                                            borderRadius: "6px",
                                            fontSize: "16px",
                                            backgroundColor: "#007bff",
                                        }}
                                    >
                                        Cập nhật
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Capnhatthongtinnguoidung;
