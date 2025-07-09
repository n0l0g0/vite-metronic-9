import { Filter, Search, X, Calendar, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface OilConsumptionFiltersProps {
  searchQuery: string;
  selectedEngines: string[];
  dateRange: { start: string; end: string };
  engineCounts: Record<string, number>;
  onSearchChange: (value: string) => void;
  onEngineChange: (checked: boolean, value: string) => void;
  onDateRangeChange: (start: string, end: string) => void;
  onClearSearch: () => void;
  onClearAllFilters: () => void;
}

/**
 * คอมโพเนนต์สำหรับแสดงตัวกรองและช่องค้นหาของตาราง Oil Consumption
 * รวมถึงการกรองตาม Engine และช่วงวันที่
 */
export const OilConsumptionFilters = ({
  searchQuery,
  selectedEngines,
  dateRange,
  engineCounts,
  onSearchChange,
  onEngineChange,
  onDateRangeChange,
  onClearSearch,
  onClearAllFilters,
}: OilConsumptionFiltersProps) => {
  return (
    <div className="flex items-center gap-2.5">
      {/* ช่องค้นหา */}
      <div className="relative">
        <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search Oil Consumption..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ps-9 w-48"
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

      {/* ตัวกรอง Engine */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter />
            Engine
            {selectedEngines.length > 0 && (
              <Badge size="sm" appearance="stroke">
                {selectedEngines.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="start">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Engine Filters
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {Object.keys(engineCounts).map((engine) => (
                <div key={engine} className="flex items-center gap-2.5">
                  <Checkbox
                    id={engine}
                    checked={selectedEngines.includes(engine)}
                    onCheckedChange={(checked) =>
                      onEngineChange(checked === true, engine)
                    }
                  />
                  <Label
                    htmlFor={engine}
                    className="grow flex items-center justify-between font-normal gap-1.5 text-xs"
                  >
                    <span className="truncate">{engine}</span>
                    <span className="text-muted-foreground">
                      {engineCounts[engine]}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* ตัวกรองช่วงวันที่ */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Calendar />
            Date Range
            {(dateRange.start || dateRange.end) && (
              <Badge size="sm" appearance="stroke">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Date Range Filters
            </div>
            <div className="space-y-3">
              {/* Start Date */}
              <div>
                <Label className="text-xs mb-2 block">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.start ? (
                        format(new Date(dateRange.start), "PPP", { locale: th })
                      ) : (
                        <span>เลือกวันที่เริ่มต้น</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.start ? new Date(dateRange.start) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, 'yyyy-MM-dd');
                          onDateRangeChange(formattedDate, dateRange.end);
                        }
                      }}
                                             disabled={(date) =>
                         date > new Date() || 
                         (dateRange.end ? date > new Date(dateRange.end) : false)
                       }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div>
                <Label className="text-xs mb-2 block">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.end && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.end ? (
                        format(new Date(dateRange.end), "PPP", { locale: th })
                      ) : (
                        <span>เลือกวันที่สิ้นสุด</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.end ? new Date(dateRange.end) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, 'yyyy-MM-dd');
                          onDateRangeChange(dateRange.start, formattedDate);
                        }
                      }}
                                             disabled={(date) =>
                         date > new Date() || 
                         (dateRange.start ? date < new Date(dateRange.start) : false)
                       }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDateRangeChange('', '')}
              className="w-full"
            >
              Clear Date Range
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* ปุ่มเคลียร์ทุกตัวกรอง */}
      {(searchQuery || selectedEngines.length > 0 || dateRange.start || dateRange.end) && (
        <Button variant="ghost" size="sm" onClick={onClearAllFilters}>
          <X className="size-4" />
          Clear All
        </Button>
      )}
    </div>
  );
}; 