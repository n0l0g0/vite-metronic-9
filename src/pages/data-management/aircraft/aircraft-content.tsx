import { AircraftTable } from './components';

export function AircraftContent() {
  return (
    <div className="grid gap-5 lg:gap-7.5" data-testid="aircraft-content">
      <AircraftTable />
      {/* Other content */}
    </div>
  );
}
