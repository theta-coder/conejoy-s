"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (newPage: number) => void;
  };
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search records...",
  onRowClick,
  pagination,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortColumn === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Header */}
      {searchable && (
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">
            {sortedData.length} records found
          </span>
        </div>
      )}

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase tracking-wider font-extrabold">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3.5 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 transition-colors"
                  onClick={() => col.sortable && col.accessorKey && handleSort(col.accessorKey)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="h-3 w-3 text-gray-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400 font-semibold">
                  No records found.
                </td>
              </tr>
            ) : (
              sortedData.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-amber-50/40 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3.5 whitespace-nowrap font-medium text-gray-800">
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? "") : "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600">
          <span>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
