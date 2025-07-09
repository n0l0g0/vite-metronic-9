import { Filter, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface EngineFiltersProps {
  searchQuery: string;
  selectedStatuses: string[];
  selectedModels: string[];
  statusCounts: Record<string, number>;
  modelCounts: Record<string, number>;
  onSearchChange: (value: string) => void;
  onStatusChange: (checked: boolean, value: string) => void;
  onModelChange: (checked: boolean, value: string) => void;
  onClearSearch: () => void;
}

/**
 * คอมโพเนนต์สำหรับแสดงตัวกรองและช่องค้นหาของตาราง Engine
 * รวมถึงการกรองตามสถานะและ Model
 */
export const EngineFilters = ({
  searchQuery,
  selectedStatuses,
  selectedModels,
  statusCounts,
  modelCounts,
  onSearchChange,
  onStatusChange,
  onModelChange,
  onClearSearch,
}: EngineFiltersProps) => {
  return (
    <div className="flex items-center gap-2.5">
      {/* ช่องค้นหา */}
      <div className="relative">
        <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search Engines..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ps-9 w-40"
        />
        {searchQuery.length > 0 && (
          <Button
            mode="icon"
            variant="ghost"
            className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={onClearSearch}
          >
            <X />
          </Button>
        )}
      </div>

      {/* ตัวกรองสถานะ */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter />
            Status
            {selectedStatuses.length > 0 && (
              <Badge size="sm" appearance="stroke">
                {selectedStatuses.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-3" align="start">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Status Filters
            </div>
            <div className="space-y-3">
              {Object.keys(statusCounts).map((status) => (
                <div key={status} className="flex items-center gap-2.5">
                  <Checkbox
                    id={status}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={(checked) =>
                      onStatusChange(checked === true, status)
                    }
                  />
                  <Label
                    htmlFor={status}
                    className="grow flex items-center justify-between font-normal gap-1.5"
                  >
                    {status}
                    <span className="text-muted-foreground">
                      {statusCounts[status]}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* ตัวกรอง Model */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter />
            Model
            {selectedModels.length > 0 && (
              <Badge size="sm" appearance="stroke">
                {selectedModels.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="start">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Model Filters
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {Object.keys(modelCounts).map((model) => (
                <div key={model} className="flex items-center gap-2.5">
                  <Checkbox
                    id={model}
                    checked={selectedModels.includes(model)}
                    onCheckedChange={(checked) =>
                      onModelChange(checked === true, model)
                    }
                  />
                  <Label
                    htmlFor={model}
                    className="grow flex items-center justify-between font-normal gap-1.5 text-xs"
                  >
                    <span className="truncate">{model}</span>
                    <span className="text-muted-foreground">
                      {modelCounts[model]}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}; 