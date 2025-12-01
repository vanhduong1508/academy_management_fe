import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { getMe, updateMe } from '../../api/user.api';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const ProfilePage: React.FC = () => {
    const authUser = useAppSelector(state => state.auth.user);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState(''); // readonly
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMe = async () => {
            if (!authUser) return;
            try {
                const res = await getMe(authUser.id);
                const data = res.data;
                setUsername(data.username);
                setFullName(data.fullName || '');
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không tải được thông tin hồ sơ.');
            }
        };
        fetchMe();
    }, [authUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) return;
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await updateMe(authUser.id, { fullName });
            setMessage('Cập nhật hồ sơ thành công.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Cập nhật hồ sơ thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!authUser) {
        return <p style={{ textAlign: 'center', marginTop: 40 }}>Bạn chưa đăng nhập.</p>;
    }

    return (
        <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, border: '1px solid #ccc' }}>
            <h2>Hồ sơ cá nhân</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Tên đăng nhập"
                    id="username"
                    value={username}
                    disabled
                />
                <Input
                    label="Họ và tên"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ marginTop: 16 }}
                />

                {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
                {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    style={{ width: '100%', marginTop: 20 }}
                >
                    Lưu thay đổi
                </Button>
            </form>
        </div>
    );
};

export default ProfilePage;
