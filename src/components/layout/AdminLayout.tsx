import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import styles from "../../styles/AdminLayout.module.css";


const AdminLayout: React.FC = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Khóa học", path: "/admin/courses" },
    { name: "Học viên", path: "/admin/students" },
    { name: "Quá trình học tập", path: "/admin/enrollments" },
    { name: "Lộ trình Khóa học", path: "/admin/course-structure" },
    { name: "Đơn hàng", path: "/admin/orders" },
    { name: "Chứng chỉ", path: "/admin/certificates" },
    { name: "Thống kê", path: "/admin/statistics" },
  ];

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>LMS ADMIN</h3>

        <nav className={styles.menu}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.menuLink
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;