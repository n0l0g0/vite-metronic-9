import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { OilConsumptionData } from '@/types/oil-consumption.types';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useOilConsumptionData, useOilConsumptionFilters } from '../hooks';
import {
  AddOilConsumptionDialog,
  EditOilConsumptionDialog,
} from './oil-consumption-dialog-manage';
import { ViewOilConsumptionDialog } from './oil-consumption-dialog-view';
import { OilConsumptionFilters } from './oil-consumption-filters';
import { createOilConsumptionColumns } from './oil-consumption-table-columns';
import { OilConsumptionTableToolbar } from './oil-consumption-table-toolbar';

// ส่วนของ Interface สำหรับข้อมูล Oil Consumption (ใช้จาก types)
type IOilConsumptionData = OilConsumptionData;

interface OilConsumptionTableProps {
  engineId?: string; // Optional engineId สำหรับกรองตาม engine
}

const OilConsumptionTable = ({ engineId }: OilConsumptionTableProps) => {
  // ใช้ custom hooks สำหรับจัดการข้อมูลและ filters
  const { oilConsumptionsData, loading, refreshData } = useOilConsumptionData(engineId);
  const filters = useOilConsumptionFilters(oilConsumptionsData, engineId);

  // State สำหรับการแสดงผลและ pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true }, // เรียงตามวันที่ ใหม่ก่อน
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // State สำหรับ Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOilConsumption, setEditingOilConsumption] = useState<IOilConsumptionData | null>(
    null,
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingOilConsumption, setViewingOilConsumption] = useState<IOilConsumptionData | null>(
    null,
  );

  // ฟังก์ชันเปิด Modal เพิ่ม Oil Consumption ใหม่
  const handleAddOilConsumption = () => {
    setAddModalOpen(true);
  };

  // ฟังก์ชันเปิด Modal แก้ไข Oil Consumption
  const handleEditOilConsumption = (oilConsumption: IOilConsumptionData) => {
    setEditingOilConsumption(oilConsumption);
    setEditModalOpen(true);
  };

  // ฟังก์ชันเปิด Modal ดูข้อมูล Oil Consumption
  const handleViewOilConsumption = (oilConsumption: IOilConsumptionData) => {
    setViewingOilConsumption(oilConsumption);
    setViewModalOpen(true);
  };

  // กำหนดคอลัมน์สำหรับตาราง โดยใช้ function ที่แยกออกมา
  const columns = useMemo(
    () =>
      createOilConsumptionColumns({
        onRefresh: refreshData,
        onEdit: handleEditOilConsumption,
        onView: handleViewOilConsumption,
      }),
    [refreshData, handleEditOilConsumption, handleViewOilConsumption],
  );

  // สร้างตาราง
  const table = useReactTable({
    columns,
    data: filters.filteredData,
    pageCount: Math.ceil((filters.filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IOilConsumptionData) => String(row.id),
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // แสดง loading หากกำลังโหลดข้อมูล
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="text-lg font-medium">Oil Consumption Management</div>
            </div>
          </CardHeading>
        </CardHeader>
        <CardTable>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Loading oil consumption data...
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        </CardTable>
      </Card>
    );
  }

  return (
    <DataGrid
      table={table}
      recordCount={filters.filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <Card>
        <CardHeader>
          <CardHeading>
            <OilConsumptionFilters
              searchQuery={filters.searchQuery}
              selectedEngines={filters.selectedEngines}
              dateRange={filters.dateRange}
              engineCounts={filters.engineCounts}
              onSearchChange={filters.setSearchQuery}
              onEngineChange={filters.handleEngineChange}
              onDateRangeChange={filters.handleDateRangeChange}
              onClearSearch={filters.clearSearch}
              onClearAllFilters={filters.clearAllFilters}
            />
          </CardHeading>
          <OilConsumptionTableToolbar onAddOilConsumption={handleAddOilConsumption} />
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>

      {/* Add Oil Consumption Modal */}
      <AddOilConsumptionDialog
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={refreshData}
        selectedEngineId={engineId} // ส่ง engineId ถ้ามี
      />

      {/* Edit Oil Consumption Modal */}
      {editingOilConsumption && (
        <EditOilConsumptionDialog
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={refreshData}
          editData={editingOilConsumption}
        />
      )}

      {/* View Oil Consumption Modal */}
      {viewingOilConsumption && (
        <ViewOilConsumptionDialog
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          oilConsumptionData={viewingOilConsumption}
        />
      )}
    </DataGrid>
  );
};

export { OilConsumptionTable }; 