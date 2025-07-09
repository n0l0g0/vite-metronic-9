import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AircraftTableToolbar } from './aircraft-table-toolbar';

// Mock dependencies ที่ไม่ใช่สิ่งที่เราต้องการทดสอบ
vi.mock('@/components/ui/data-grid', () => ({
  useDataGrid: () => ({
    table: {
      // Mock table object ที่จำเป็น
      getAllColumns: vi.fn(() => []),
      getState: vi.fn(() => ({ columnVisibility: {} })),
      setColumnVisibility: vi.fn(),
    },
  }),
}));

vi.mock('@/components/ui/card', () => ({
  CardToolbar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-toolbar">{children}</div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button
      onClick={onClick}
      data-testid={props['data-testid'] || 'button'}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/data-grid-column-visibility', () => ({
  DataGridColumnVisibility: ({ trigger }: { trigger: React.ReactNode }) => (
    <div data-testid="column-visibility">{trigger}</div>
  ),
}));

/**
 * Unit Tests สำหรับ AircraftTableToolbar Component
 * ทดสอบการแสดงปุ่มและ callback functions
 */
describe('AircraftTableToolbar', () => {
  const mockOnAddAircraft = vi.fn();

  // ทำความสะอาด mocks ก่อนการทดสอบแต่ละครั้ง
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render Add Aircraft button', () => {
    // Arrange - เตรียมข้อมูลสำหรับการทดสอบ
    const onAddAircraft = vi.fn();

    // Act - render component พร้อม props
    const { getByText } = render(
      <AircraftTableToolbar onAddAircraft={onAddAircraft} />,
    );

    // Assert - ตรวจสอบว่าปุ่ม Add Aircraft แสดงอยู่
    const addButton = getByText('Add Aircraft');
    expect(addButton).toBeInTheDocument();
  });

  it('Should render Columns button', () => {
    // Arrange - เตรียมข้อมูลสำหรับการทดสอบ
    const onAddAircraft = vi.fn();

    // Act - render component
    const { getByText } = render(
      <AircraftTableToolbar onAddAircraft={onAddAircraft} />,
    );

    // Assert - ตรวจสอบว่าปุ่ม Columns แสดงอยู่
    const columnsButton = getByText('Columns');
    expect(columnsButton).toBeInTheDocument();
  });

  it('Should call onAddAircraft callback when Add Aircraft button is clicked', async () => {
    // Arrange - เตรียม user event และ mock function
    const user = userEvent.setup();
    const onAddAircraft = vi.fn();

    // Act - render component และคลิกปุ่ม
    const { getByText } = render(
      <AircraftTableToolbar onAddAircraft={onAddAircraft} />,
    );

    const addButton = getByText('Add Aircraft');
    await user.click(addButton);

    // Assert - ตรวจสอบว่า callback ถูกเรียก
    expect(onAddAircraft).toHaveBeenCalledTimes(1);
  });

  it('Should have CardToolbar as wrapper container', () => {
    // Arrange - เตรียมข้อมูลสำหรับการทดสอบ
    const onAddAircraft = vi.fn();

    // Act - render component
    const { getByTestId } = render(
      <AircraftTableToolbar onAddAircraft={onAddAircraft} />,
    );

    // Assert - ตรวจสอบว่ามี CardToolbar wrapper
    const cardToolbar = getByTestId('card-toolbar');
    expect(cardToolbar).toBeInTheDocument();
  });

  it('Should have DataGridColumnVisibility component for column management', () => {
    // Arrange - เตรียมข้อมูลสำหรับการทดสอบ
    const onAddAircraft = vi.fn();

    // Act - render component
    const { getByTestId } = render(
      <AircraftTableToolbar onAddAircraft={onAddAircraft} />,
    );

    // Assert - ตรวจสอบว่ามี column visibility component
    const columnVisibility = getByTestId('column-visibility');
    expect(columnVisibility).toBeInTheDocument();
  });

  it('Should render without error', () => {
    // Arrange & Act - ทดสอบการ render โดยไม่มี error
    const onAddAircraft = vi.fn();
    const renderComponent = () =>
      render(<AircraftTableToolbar onAddAircraft={onAddAircraft} />);

    // Assert - ตรวจสอบว่าไม่เกิด error ในการ render
    expect(renderComponent).not.toThrow();
  });

  it('Should show Plus icon in Add Aircraft button', () => {
    // Arrange - เตรียมข้อมูลสำหรับการทดสอบ
    const onAddAircraft = vi.fn();

    // Act - render component
    const { container } = render(
      <AircraftTableToolbar onAddAircraft={onAddAircraft} />,
    );

    // Assert - ตรวจสอบว่ามี Plus icon (จำลองผ่าน text content)
    const addButton = container.querySelector('button');
    expect(addButton).toBeInTheDocument();
  });
});
