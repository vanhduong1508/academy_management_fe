// /src/components/ui/Table/Table.tsx

import React from 'react';
// import styles from './Table.module.css'; // Sẽ cần tạo file CSS tương ứng

// Định nghĩa cấu trúc cột
interface Column<T> {
    header: string;
    // accessor là key để truy cập dữ liệu (ví dụ: 'username', 'amount')
    accessor: keyof T | 'actions'; 
    // renderer tùy chỉnh cho cột (ví dụ: để hiển thị nút)
    Cell?: (row: T) => React.ReactNode; 
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
}

const Table = <T extends object>({ columns, data }: TableProps<T>) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {/* Header của Bảng */}
            <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index} style={{ borderBottom: '2px solid #333', padding: '10px', textAlign: 'left' }}>
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            
            {/* Body của Bảng */}
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                            Không tìm thấy dữ liệu.
                        </td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ borderBottom: '1px solid #eee' }}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={{ padding: '10px' }}>
                                    {/* Sử dụng Cell renderer nếu tồn tại, nếu không thì hiển thị dữ liệu theo accessor */}
                                    {col.Cell ? col.Cell(row) : (row as any)[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default Table;