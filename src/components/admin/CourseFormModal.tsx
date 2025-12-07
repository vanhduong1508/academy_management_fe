import React, { useEffect, useState } from 'react';
import { CourseFormPayload } from '../../types';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';

interface CourseFormModalProps {
  isOpen: boolean;
  title: string;
  initialValues?: CourseFormPayload;
  onClose: () => void;
  onSubmit: (values: CourseFormPayload) => Promise<void> | void;
}

const defaultForm: CourseFormPayload = {
  title: '',
  startDate: '',
  endDate: '',
  content: '',
};

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
  width: 480,
  maxWidth: '95%',
};

const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  title,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<CourseFormPayload>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(initialValues ?? defaultForm);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
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
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <Input
            label="Tên khóa học"
            id="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <Input
            label="Ngày bắt đầu"
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
            style={{ marginTop: 12 }}
          />
          <Input
            label="Ngày kết thúc"
            id="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            required
            style={{ marginTop: 12 }}
          />
          <label style={{ display: 'block', marginTop: 12 }}>Mô tả</label>
          <textarea
            id="content"
            value={form.content}
            onChange={handleChange}
            style={{ width: '100%', minHeight: 80 }}
          />

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

export default CourseFormModal;
