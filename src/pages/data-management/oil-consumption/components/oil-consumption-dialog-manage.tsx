import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { EngineData } from '@/types/engine.types';
import { OilConsumptionData, OilConsumptionPayload } from '@/types/oil-consumption.types';
import { getEngines } from '@/services/engine.service';
import { patchOilConsumption, postOilConsumption } from '@/services/oil-consumption.service';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Schema สำหรับ validation ข้อมูล Oil Consumption
const oilConsumptionSchema = z.object({
  engine_id: z.string().min(1, 'Engine is required'),
  date: z.string().min(1, 'Date is required'),
  flight_hours: z
    .number()
    .min(0, 'Flight hours must be non-negative')
    .max(1000, 'Flight hours must not exceed 1000'),
  oil_added: z
    .number()
    .min(0, 'Oil added must be non-negative')
    .max(1000, 'Oil added must not exceed 1000'),
  remarks: z.string().max(500, 'Remarks must not exceed 500 characters'),
});

// Type สำหรับ Form Values
type OilConsumptionFormValues = z.infer<typeof oilConsumptionSchema>;

// Props สำหรับ OilConsumptionDialog Component
interface OilConsumptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Callback เมื่อเพิ่ม/แก้ไขข้อมูลสำเร็จ
  trigger?: React.ReactNode; // Trigger button (optional)
  editData?: OilConsumptionData | null; // ข้อมูลสำหรับแก้ไข (ถ้ามี = edit mode)
  selectedEngineId?: string; // Engine ID ที่เลือกไว้ล่วงหน้า
}

// คอมโพเนนต์หลักสำหรับ Oil Consumption Dialog (Add/Edit)
export function OilConsumptionDialog({
  open,
  onOpenChange,
  onSuccess,
  trigger,
  editData,
  selectedEngineId,
}: OilConsumptionDialogProps) {
  // State สำหรับข้อมูล Engine
  const [engineData, setEngineData] = useState<EngineData[]>([]);
  const [loadingEngine, setLoadingEngine] = useState(false);

  // ตรวจสอบว่าเป็น Edit mode หรือไม่
  const isEditMode = !!editData;

  // สร้าง Form instance ด้วย react-hook-form และ zod validation
  const form = useForm<OilConsumptionFormValues>({
    resolver: zodResolver(oilConsumptionSchema),
    defaultValues: isEditMode
      ? {
          engine_id: editData.engine_id || '',
          date: editData.date ? editData.date.split('T')[0] : '',
          flight_hours: editData.flight_hours || 0,
          oil_added: editData.oil_added || 0,
          remarks: editData.remarks || '',
        }
      : {
          engine_id: selectedEngineId || '',
          date: new Date().toISOString().split('T')[0], // วันนี้
          flight_hours: 0,
          oil_added: 0,
          remarks: '',
        },
    mode: 'onChange', // Validate แบบ real-time
  });

  // ฟังก์ชันดึงข้อมูล Engine
  const fetchEngines = async () => {
    try {
      setLoadingEngine(true);
      const response = await getEngines();
      setEngineData(response.data);
    } catch (error) {
      console.error('Error fetching engines:', error);
      toast.error('Failed to load engine data');
    } finally {
      setLoadingEngine(false);
    }
  };

  // Reset form เมื่อ dialog เปิด/ปิด หรือข้อมูล edit เปลี่ยน
  useEffect(() => {
    if (open) {
      fetchEngines();
      form.reset(
        isEditMode
          ? {
              engine_id: editData?.engine_id || '',
              date: editData?.date ? editData.date.split('T')[0] : '',
              flight_hours: editData?.flight_hours || 0,
              oil_added: editData?.oil_added || 0,
              remarks: editData?.remarks || '',
            }
          : {
              engine_id: selectedEngineId || '',
              date: new Date().toISOString().split('T')[0],
              flight_hours: 0,
              oil_added: 0,
              remarks: '',
            },
      );
    }
  }, [open, form, isEditMode, editData, selectedEngineId]);

  // ฟังก์ชันสำหรับ Submit ข้อมูล
  const handleSubmit = async (data: OilConsumptionFormValues) => {
    try {
      // แปลงข้อมูลให้ตรงกับ OilConsumptionPayload
      const oilConsumptionPayload: OilConsumptionPayload = {
        engine_id: data.engine_id,
        date: data.date,
        flight_hours: data.flight_hours,
        oil_added: data.oil_added,
        remarks: data.remarks.trim(),
      };

      // เรียก API ตาม mode (Add หรือ Edit)
      if (isEditMode && editData) {
        await patchOilConsumption(editData.id, oilConsumptionPayload);
      } else {
        await postOilConsumption(oilConsumptionPayload);
      }

      // แสดงข้อความแจ้งความสำเร็จ
      toast.custom(
        (t) => (
          <Alert
            variant="mono"
            icon="success"
            close={false}
            onClose={() => toast.dismiss(t)}
          >
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>
              Oil consumption {isEditMode ? 'updated' : 'created'} successfully!
            </AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );

      // ปิด Dialog และเรียก callback function
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // แสดงข้อความแจ้งข้อผิดพลาด
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} oil consumption:`,
        error,
      );
      toast.custom(
        (t) => (
          <Alert
            variant="destructive"
            icon="warning"
            close={false}
            onClose={() => toast.dismiss(t)}
          >
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>
              Failed to {isEditMode ? 'update' : 'create'} oil consumption. Please try
              again.
            </AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Trigger Button (ถ้ามี) */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      {/* Dialog Content */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Oil Consumption' : 'Add New Oil Consumption'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the oil consumption details below. All fields are required.'
              : 'Fill in the oil consumption details below. All fields are required.'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Engine Field */}
              <FormField
                control={form.control}
                name="engine_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select engine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingEngine ? (
                          <SelectItem value="loading" disabled>
                            Loading engines...
                          </SelectItem>
                        ) : (
                          engineData.map((engine) => (
                            <SelectItem key={engine.id} value={engine.id}>
                              {engine.serial_number} - {engine.aircraft?.registration}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: th })
                            ) : (
                              <span>เลือกวันที่</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              // แปลงวันที่เป็น format YYYY-MM-DD สำหรับ API
                              const formattedDate = format(date, 'yyyy-MM-dd');
                              field.onChange(formattedDate);
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Flight Hours Field */}
              <FormField
                control={form.control}
                name="flight_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Hours</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="1000"
                        step="0.1"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Oil Added Field */}
              <FormField
                control={form.control}
                name="oil_added"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oil Added (liters)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="1000"
                        step="0.1"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remarks Field */}
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Optional remarks..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dialog Footer with Buttons */}
              <DialogFooter>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? isEditMode
                      ? 'Updating...'
                      : 'Creating...'
                    : isEditMode
                      ? 'Update Oil Consumption'
                      : 'Create Oil Consumption'}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

// Export aliases สำหรับความสะดวกในการใช้งาน
export const AddOilConsumptionDialog = (
  props: Omit<OilConsumptionDialogProps, 'editData'>,
) => <OilConsumptionDialog {...props} editData={null} />;

export const EditOilConsumptionDialog = (
  props: OilConsumptionDialogProps & { editData: OilConsumptionData },
) => <OilConsumptionDialog {...props} />; 