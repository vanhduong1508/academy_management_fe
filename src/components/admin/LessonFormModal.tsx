// src/components/admin/LessonFormModal.tsx

import React, { useEffect, useState } from 'react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';

interface LessonFormValues {
  title: string;
  type: string;
}

interface LessonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LessonFormValues) => Promise<void> | void;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.35)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 8,
  width: 420,
  maxWidth: '95%',
};

const LessonFormModal: React.FC<LessonFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<LessonFormValues>({
    title: '',
    type: 'VIDEO',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({ title: '', type: 'VIDEO' });
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.id || e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3>Thêm bài học</h3>
        <form onSubmit={handleSubmit}>
          <Input
            label="Tên bài học"
            id="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label style={{ display: 'block', marginTop: 12 }}>Loại bài học</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ marginTop: 4, width: '100%', padding: 6 }}
          >
            <option value="VIDEO">VIDEO</option>
            <option value="QUIZ">QUIZ</option>
            <option value="DOCUMENT">DOCUMENT</option>
          </select>

          {error && (
            <p style={{ color: 'red', marginTop: 10 }}>
              {error}
            </p>
          )}

          <div
            style={{
              marginTop: 16,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonFormModal;
