import React, { useState, useEffect } from 'react';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';

interface SimpleEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTitle: string;
    itemId: number;
    itemType: 'Chapter' | 'Lesson';
    onSubmit: (newTitle: string, newType?: string) => Promise<void>;
    isLoading: boolean;
    error: string;
    currentType?: 'VIDEO' | 'QUIZ' | 'DOCUMENT' | string; 
}

const LESSON_TYPES = ['VIDEO', 'QUIZ', 'DOCUMENT'];

const SimpleEditModal: React.FC<SimpleEditModalProps> = ({ 
    isOpen, 
    onClose, 
    currentTitle, 
    itemId, 
    itemType, 
    onSubmit, 
    isLoading, 
    error,
    currentType = 'VIDEO'
}) => {
    const [title, setTitle] = useState(currentTitle);
    const [type, setType] = useState(currentType);

    useEffect(() => {
        setTitle(currentTitle);
        setType(currentType);
    }, [currentTitle, currentType, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(title, itemType === 'Lesson' ? type : undefined);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1002, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '450px' }}>
                <h3>Chỉnh sửa {itemType}: ID {itemId}</h3>
                <form onSubmit={handleSubmit}>
                    <Input 
                        label={`Tên ${itemType}`} 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                    
                    {itemType === 'Lesson' && (
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="type" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Loại Bài học</label>
                            <select 
                                id="type" 
                                value={type} 
                                onChange={(e) => setType(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                            >
                                {LESSON_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button onClick={onClose} variant="secondary" disabled={isLoading}>Hủy</Button>
                        <Button type="submit" variant="primary" isLoading={isLoading}>Lưu thay đổi</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SimpleEditModal;