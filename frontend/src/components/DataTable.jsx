import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Loader from './Loader';

/**
 * Reusable Data Table Component
 * @param {Array} columns - Array of { header: string, accessor: string | function }
 * @param {Array} data - Array of data objects
 * @param {boolean} loading - Loading state
 * @param {Object} pagination - { page, pages, onPageChange }
 * @param {Object} search - { value, onChange, placeholder }
 */
const DataTable = ({ columns, data, loading, pagination, search }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Toolbar (Search) */}
            {search && (
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search.value}
                            onChange={search.onChange}
                            placeholder={search.placeholder || 'Search...'}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    </div>
                </div>
            )}

            {/* Table Area */}
            <div className="overflow-x-auto min-h-[300px] relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 backdrop-blur-[1px]">
                        <Loader />
                    </div>
                ) : null}

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100/50 border-b border-slate-200">
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {!loading && data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-slate-500 text-sm">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={row._id || rowIndex} className="hover:bg-slate-50/80 transition-colors">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="p-4 text-sm text-slate-700 whitespace-nowrap">
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(row)
                                                : row[col.accessor] || '—'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.pages > 1 && (
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                        Page <span className="font-bold text-slate-700">{pagination.page}</span> of {pagination.pages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.pages}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
