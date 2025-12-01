import React, { useEffect, useState } from 'react';
import useAuthGuard from '../../hooks/useAuthGuard';
import { getAllUsers, createAdmin } from '../../api/user.api';
import { UserResponse } from '../../types';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const AdminUsersPage: React.FC = () => {
    const allowed = useAuthGuard('admin');
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [newAdminUsername, setNewAdminUsername] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!allowed) return;
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await getAllUsers();
                setUsers(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không tải được danh sách người dùng.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [allowed]);

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await createAdmin({
                username: newAdminUsername,
                password: newAdminPassword,
            });
            setSuccess('Tạo tài khoản Admin thành công.');
            setNewAdminUsername('');
            setNewAdminPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Tạo Admin thất bại.');
        }
    };

    if (!allowed) return null; // useAuthGuard đã điều hướng rồi

    return (
        <div style={{ maxWidth: '900px', margin: '30px auto' }}>
            <h2>Quản lý người dùng</h2>

            {/* Form tạo Admin mới */}
            <div style={{ border: '1px solid #ccc', padding: 16, marginBottom: 24 }}>
                <h3>Tạo tài khoản Admin mới</h3>
                <form onSubmit={handleCreateAdmin}>
                    <Input
                        label="Tên đăng nhập Admin"
                        id="adminUsername"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                    />
                    <Input
                        label="Mật khẩu"
                        id="adminPassword"
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        style={{ marginTop: 12 }}
                    />

                    {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
                    {success && <p style={{ color: 'green', marginTop: 10 }}>{success}</p>}

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!newAdminUsername || !newAdminPassword}
                        style={{ marginTop: 16 }}
                    >
                        Tạo Admin
                    </Button>
                </form>
            </div>

            {/* Bảng danh sách user */}
            <h3>Danh sách tất cả người dùng</h3>
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Username</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Họ tên</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Trạng thái</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td style={{ border: '1px solid #ddd', padding: 8 }}>{u.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: 8 }}>{u.username}</td>
                                <td style={{ border: '1px solid #ddd', padding: 8 }}>{u.fullName || '-'}</td>
                                <td style={{ border: '1px solid #ddd', padding: 8 }}>{u.isActive ? 'ACTIVE' : 'INACTIVE'}</td>
                                <td style={{ border: '1px solid #ddd', padding: 8 }}>{u.createdAt || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsersPage;
