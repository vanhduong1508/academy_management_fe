import React from "react";
import { NavLink } from "react-router-dom";
import { UserRole } from "../../types";
import styles from "../../styles/AdminSidebar.module.css";

interface SidebarProps {
  role: UserRole;
}

const adminMenuItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "Quản lý Khóa học", path: "/admin/courses" },
  { name: "Duyệt Đơn hàng", path: "/admin/orders/pending" },
  { name: "Quản lý Người dùng", path: "/admin/users" },
  { name: "Cấp Chứng chỉ", path: "/admin/certificates/eligible" },
];

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  if (role !== "ADMIN") return null;

  return (
    <div className={styles.sidebarContainer}>
      <h3 className={styles.sidebarTitle}>Admin Menu</h3>

      <nav className={styles.sidebarMenu}>
        <ul >
          {adminMenuItems.map((item) => (
            <li key={item.path} >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? styles.active : styles.sidebarLink
                }
                end={item.path === "/admin"}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
