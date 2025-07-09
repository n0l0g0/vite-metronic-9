import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { EngineData } from '@/types/engine.types';
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
import { useEngineData, useEngineFilters } from '../hooks';
import {
  AddEngineDialog,
  EditEngineDialog,
} from './engine-dialog-manage';
import { ViewEngineDialog } from './engine-dialog-view';
import { EngineFilters } from './engine-filters';
import { createEngineColumns } from './engine-table-columns';
import { EngineTableToolbar } from './engine-table-toolbar';

// ส่วนของ Interface สำหรับข้อมูล Engine (ใช้จาก types)
type IEngineData = EngineData;

const EngineTable = () => {
  const navigate = useNavigate();
  
  // ใช้ custom hooks สำหรับจัดการข้อมูลและ filters
  const { enginesData, loading, refreshData } = useEngineData();
  const filters = useEngineFilters(enginesData);

  // State สำหรับการแสดงผลและ pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'serial_number', desc: false },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // State สำหรับ Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEngine, setEditingEngine] = useState<IEngineData | null>(
    null,
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingEngine, setViewingEngine] = useState<IEngineData | null>(
    null,
  );

  // ฟังก์ชันเปิด Modal เพิ่มเครื่องยนต์ใหม่
  const handleAddEngine = () => {
    setAddModalOpen(true);
  };

  // ฟังก์ชันแก้ไขเครื่องยนต์
  const handleEditEngine = (engine: IEngineData) => {
    setEditingEngine(engine);
    setEditModalOpen(true);
  };

  // ฟังก์ชันดูข้อมูลเครื่องยนต์
  const handleViewEngine = (engine: IEngineData) => {
    setViewingEngine(engine);
    setViewModalOpen(true);
  };

  // ฟังก์ชันไปหน้า Oil Consumption ตาม Engine ID
  const handleViewOilConsumption = (engine: IEngineData) => {
    navigate(`/oil-consumption?engineId=${engine.id}`);
  };

  // กำหนดคอลัมน์สำหรับตาราง โดยใช้ function ที่แยกออกมา
  const columns = useMemo(
    () =>
      createEngineColumns({
        onRefresh: refreshData,
        onEdit: handleEditEngine,
        onView: handleViewEngine,
        onViewOilConsumption: handleViewOilConsumption,
      }),
    [refreshData],
  );

  // สร้างตาราง
  const table = useReactTable({
    columns,
    data: filters.filteredData,
    pageCount: Math.ceil((filters.filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IEngineData) => String(row.id),
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
              <div className="text-lg font-medium">Engine Management</div>
            </div>
          </CardHeading>
        </CardHeader>
        <CardTable>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Loading engine data...
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
            <EngineFilters
              searchQuery={filters.searchQuery}
              selectedStatuses={filters.selectedStatuses}
              selectedModels={filters.selectedModels}
              statusCounts={filters.statusCounts}
              modelCounts={filters.modelCounts}
              onSearchChange={filters.setSearchQuery}
              onStatusChange={filters.handleStatusChange}
              onModelChange={filters.handleModelChange}
              onClearSearch={filters.clearSearch}
            />
          </CardHeading>
          <EngineTableToolbar onAddEngine={handleAddEngine} />
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

      {/* Add Engine Modal */}
      <AddEngineDialog
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={refreshData}
      />

      {/* Edit Engine Modal */}
      {editingEngine && (
        <EditEngineDialog
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={refreshData}
          editData={editingEngine}
        />
      )}

      {/* View Engine Modal */}
      {viewingEngine && (
        <ViewEngineDialog
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          engineData={viewingEngine}
        />
      )}
    </DataGrid>
  );
};

export { EngineTable }; 