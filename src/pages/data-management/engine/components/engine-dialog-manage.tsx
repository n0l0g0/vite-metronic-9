import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AircraftData } from '@/types/aircraft.types';
import { EngineData, EnginePayload } from '@/types/engine.types';
import { getAircrafts } from '@/services/aircraft.service';
import { patchEngine, postEngine } from '@/services/engine.service';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schema สำหรับ validation ข้อมูล Engine
const engineSchema = z.object({
  serial_number: z
    .string()
    .min(1, 'Serial Number is required')
    .min(3, 'Serial Number must be at least 3 characters')
    .max(50, 'Serial Number must not exceed 50 characters'),
  model: z
    .string()
    .min(1, 'Model is required')
    .max(100, 'Model must not exceed 100 characters'),
  position: z
    .number()
    .min(1, 'Position must be at least 1')
    .max(10, 'Position must not exceed 10'),
  aircraft_id: z.string().min(1, 'Aircraft is required'),
  low_oil_threshold_hours: z
    .number()
    .min(0, 'Low oil threshold must be at least 0')
    .max(1000, 'Low oil threshold must not exceed 1000')
    .nullable(),
  active: z.boolean(),
});

// Type สำหรับ Form Values
type EngineFormValues = z.infer<typeof engineSchema>;

// Props สำหรับ EngineDialog Component
interface EngineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Callback เมื่อเพิ่ม/แก้ไขข้อมูลสำเร็จ
  trigger?: React.ReactNode; // Trigger button (optional)
  editData?: EngineData | null; // ข้อมูลสำหรับแก้ไข (ถ้ามี = edit mode)
}

// คอมโพเนนต์หลักสำหรับ Engine Dialog (Add/Edit)
export function EngineDialog({
  open,
  onOpenChange,
  onSuccess,
  trigger,
  editData,
}: EngineDialogProps) {
  // State สำหรับข้อมูล Aircraft
  const [aircraftData, setAircraftData] = useState<AircraftData[]>([]);
  const [loadingAircraft, setLoadingAircraft] = useState(false);

  // ตรวจสอบว่าเป็น Edit mode หรือไม่
  const isEditMode = !!editData;

  // สร้าง Form instance ด้วย react-hook-form และ zod validation
  const form = useForm<EngineFormValues>({
    resolver: zodResolver(engineSchema),
    defaultValues: isEditMode
      ? {
          serial_number: editData.serial_number || '',
          model: editData.model || '',
          position: Number(editData.position) || 1,
          aircraft_id: editData.aircraft_id || '',
          low_oil_threshold_hours: editData.low_oil_threshold_hours || 0,
          active: editData.active ?? true,
        }
      : {
          serial_number: '',
          model: '',
          position: 1,
          aircraft_id: '',
          low_oil_threshold_hours: 0,
          active: true,
        },
    mode: 'onChange', // Validate แบบ real-time
  });

  // ฟังก์ชันดึงข้อมูล Aircraft
  const fetchAircrafts = async () => {
    try {
      setLoadingAircraft(true);
      const response = await getAircrafts();
      setAircraftData(response.data);
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
      toast.error('Failed to load aircraft data');
    } finally {
      setLoadingAircraft(false);
    }
  };

  // Reset form เมื่อ dialog เปิด/ปิด หรือข้อมูล edit เปลี่ยน
  useEffect(() => {
    if (open) {
      fetchAircrafts();
      form.reset(
        isEditMode
          ? {
              serial_number: editData?.serial_number || '',
              model: editData?.model || '',
              position: Number(editData?.position) || 1,
              aircraft_id: editData?.aircraft_id || '',
              low_oil_threshold_hours: editData?.low_oil_threshold_hours || 0,
              active: editData?.active ?? true,
            }
          : {
              serial_number: '',
              model: '',
              position: 1,
              aircraft_id: '',
              low_oil_threshold_hours: 0,
              active: true,
            },
      );
    }
  }, [open, form, isEditMode, editData]);

  // ฟังก์ชันสำหรับ Submit ข้อมูล
  const handleSubmit = async (data: EngineFormValues) => {
    try {
      // แปลงข้อมูลให้ตรงกับ EnginePayload
      const enginePayload: EnginePayload = {
        serial_number: data.serial_number.trim().toUpperCase(),
        model: data.model.trim(),
        position: data.position,
        aircraft_id: data.aircraft_id,
        low_oil_threshold_hours: data.low_oil_threshold_hours,
        active: data.active,
      };

      // เรียก API ตาม mode (Add หรือ Edit)
      if (isEditMode && editData) {
        await patchEngine(editData.id, enginePayload);
      } else {
        await postEngine(enginePayload);
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
              Engine {isEditMode ? 'updated' : 'created'} successfully!
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
        `Error ${isEditMode ? 'updating' : 'creating'} engine:`,
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
              Failed to {isEditMode ? 'update' : 'create'} engine. Please try
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
            {isEditMode ? 'Edit Engine' : 'Add New Engine'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the engine details below. All fields are required.'
              : 'Fill in the engine details below. All fields are required.'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Serial Number Field */}
              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., ENG001"
                        className="uppercase"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model Field */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., GE90-115B" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Aircraft Field */}
              <FormField
                control={form.control}
                name="aircraft_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aircraft</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select aircraft" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingAircraft ? (
                          <SelectItem value="loading" disabled>
                            Loading aircrafts...
                          </SelectItem>
                        ) : (
                          aircraftData.map((aircraft) => (
                            <SelectItem key={aircraft.id} value={aircraft.id}>
                              {aircraft.registration} - {aircraft.aircraft_type}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position Field */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="10"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Low Oil Threshold Field */}
              <FormField
                control={form.control}
                name="low_oil_threshold_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Oil Threshold (hours)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="1000"
                        step="0.1"
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Radio Group */}
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ? 'true' : 'false'}
                        onValueChange={(value) =>
                          field.onChange(value === 'true')
                        }
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="active" />
                          <Label htmlFor="active">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="inactive" />
                          <Label htmlFor="inactive">Inactive</Label>
                        </div>
                      </RadioGroup>
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
                      ? 'Update Engine'
                      : 'Create Engine'}
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
export const AddEngineDialog = (props: Omit<EngineDialogProps, 'editData'>) => (
  <EngineDialog {...props} editData={null} />
);

export const EditEngineDialog = (
  props: EngineDialogProps & { editData: EngineData },
) => <EngineDialog {...props} />;
