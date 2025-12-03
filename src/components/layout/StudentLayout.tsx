import React from "react";
import { Outlet, Link } from "react-router-dom";

// Layout cơ bản cho trang Student (giống AdminLayout)
const StudentLayout: React.FC = () => {
  const sidebarStyle: React.CSSProperties = {
    width: "250px",
    backgroundColor: "#343a40", // Màu tối cho Sidebar
    color: "white",
    padding: "20px",
    height: "100vh",
    position: "fixed",
    overflowY: "auto",
  };

  const contentStyle: React.CSSProperties = {
    marginLeft: "250px", // Đẩy nội dung sang phải bằng chiều rộng Sidebar
    padding: "20px",
    backgroundColor: "#f8f9fa", // Màu nền sáng cho khu vực nội dung
    minHeight: "100vh",
  };

  const linkStyle: React.CSSProperties = {
    color: "white",
    textDecoration: "none",
    display: "block",
    padding: "10px 0",
    marginBottom: "5px",
    borderBottom: "1px solid #495057",
    transition: "background-color 0.2s",
  };

  const menuItems = [
    { name: "Dashboard", path: "/student" },
    { name: "Danh sách Khóa học", path: "/student/courses" },
    { name: "Khóa học của tôi", path: "/student/my-courses" },
    { name: "Chứng chỉ của tôi", path: "/student/certificates" },
    { name: "Hồ sơ cá nhân", path: "/student/profile" },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* 1. SIDEBAR */}
      <div style={sidebarStyle}>
        <h3>🎓 Student Portal</h3>
        <hr
          style={{ borderTop: "1px solid #6c757d", marginBottom: "20px" }}
        />

        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={linkStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#495057")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* 2. MAIN CONTENT */}
      <div style={contentStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
