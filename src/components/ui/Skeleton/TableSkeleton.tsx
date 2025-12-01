// /src/components/ui/Skeleton/TableSkeleton.tsx
import React from 'react';
import Skeleton from './Skeleton';

interface TableSkeletonProps {
    columns: number;
    rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5 }) => {
    const skeletonRows = Array.from({ length: rows }, (_, rowIndex) => (
        <tr key={rowIndex}>
            {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex} style={{ padding: '10px' }}>
                    <Skeleton width={`${50 + (colIndex * 10)}%`} height="18px" />
                </td>
            ))}
        </tr>
    ));

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    {Array.from({ length: columns }, (_, i) => (
                        <th key={i}><Skeleton width="80%" height="20px" /></th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {skeletonRows}
            </tbody>
        </table>
    );
};

export default TableSkeleton;