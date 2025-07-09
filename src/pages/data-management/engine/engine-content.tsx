import { EngineTable } from './components';

export function EngineContent() {
  return (
    <div className="grid gap-5 lg:gap-7.5" data-testid="engine-content">
      <EngineTable />
      {/* Other content */}
    </div>
  );
} 