import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const DisplayTable = ({ data, columns }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="overflow-x-auto scrollbar-slim">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-ink text-ink-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider">Sr.</th>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-line">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="transition-colors hover:bg-sunken">
                <td className="px-4 py-3 text-fg-faint tabular-nums">{row.index + 1}</td>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="whitespace-nowrap px-4 py-3 text-fg">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DisplayTable
