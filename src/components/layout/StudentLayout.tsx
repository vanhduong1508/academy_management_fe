import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import styles from "../../styles/StudentLayout.module.css";

const StudentLayout = () => {
  const menuItems = [
    { name: "Dashboard", path: "/student" },
    { name: "Danh sách Khóa học", path: "/student/courses" },
    { name: "Khóa học của tôi", path: "/student/my-courses" },
    { name: "Đơn hàng", path: "/student/orders" },
    { name: "Chứng chỉ của tôi", path: "/student/certificates" },
    { name: "Hồ sơ cá nhân", path: "/student/profile" },
  ];

  return (
    <div className={styles.studentContainer}>
      {/* SIDEBAR */}
      <aside className={styles.studentSidebar}>
        <h3 className={styles.sidebarTitle}>Student Portal</h3>

        <nav className={styles.sidebarMenu}>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/student"}     
              className={({ isActive }) =>
                isActive
                  ? `${styles.sidebarLink} ${styles.active}`
                  : styles.sidebarLink
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.studentContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
