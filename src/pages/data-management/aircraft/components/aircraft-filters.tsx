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

interface AircraftFiltersProps {
  searchQuery: string;
  selectedStatuses: string[];
  selectedAircraftTypes: string[];
  statusCounts: Record<string, number>;
  aircraftTypeCounts: Record<string, number>;
  onSearchChange: (value: string) => void;
  onStatusChange: (checked: boolean, value: string) => void;
  onAircraftTypeChange: (checked: boolean, value: string) => void;
  onClearSearch: () => void;
}

/**
 * คอมโพเนนต์สำหรับแสดงตัวกรองและช่องค้นหาของตาราง Aircraft
 * รวมถึงการกรองตามสถานะและประเภทเครื่องบิน
 */
export const AircraftFilters = ({
  searchQuery,
  selectedStatuses,
  selectedAircraftTypes,
  statusCounts,
  aircraftTypeCounts,
  onSearchChange,
  onStatusChange,
  onAircraftTypeChange,
  onClearSearch,
}: AircraftFiltersProps) => {
  return (
    <div className="flex items-center gap-2.5">
      {/* ช่องค้นหา */}
      <div className="relative">
        <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search Aircrafts..."
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

      {/* ตัวกรองประเภทเครื่องบิน */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter />
            Aircraft Type
            {selectedAircraftTypes.length > 0 && (
              <Badge size="sm" appearance="stroke">
                {selectedAircraftTypes.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="start">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Aircraft Type Filters
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {Object.keys(aircraftTypeCounts).map((type) => (
                <div key={type} className="flex items-center gap-2.5">
                  <Checkbox
                    id={type}
                    checked={selectedAircraftTypes.includes(type)}
                    onCheckedChange={(checked) =>
                      onAircraftTypeChange(checked === true, type)
                    }
                  />
                  <Label
                    htmlFor={type}
                    className="grow flex items-center justify-between font-normal gap-1.5 text-xs"
                  >
                    <span className="truncate">{type}</span>
                    <span className="text-muted-foreground">
                      {aircraftTypeCounts[type]}
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