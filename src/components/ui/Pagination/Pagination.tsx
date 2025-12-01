// /src/components/ui/Pagination/Pagination.tsx
import React from 'react';
import { PaginationMeta } from '../../../types';
import Button from '../../common/Button/Button'; 

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
    const { totalPages, currentPage, totalItems, limit } = meta;

    if (totalPages <= 1) return null;

    const pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {'<'}
            </Button>

            {pagesToShow.map(page => (
                <button 
                    key={page} 
                    onClick={() => onPageChange(page)}
                    style={{ fontWeight: page === currentPage ? 'bold' : 'normal' }}
                >
                    {page}
                </button>
            ))}

            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {'>'}
            </Button>
            <span>
                {totalItems} items ({limit} per page)
            </span>
        </div>
    );
};

export default Pagination;