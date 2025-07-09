import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AircraftData, AircraftPayload } from '@/types/aircraft.types';
import { patchAircraft, postAircraft } from '@/services/aircraft.service';
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

// Schema สำหรับ validation ข้อมูล Aircraft
const aircraftSchema = z.object({
  registration: z
    .string()
    .min(1, 'Registration is required')
    .min(3, 'Registration must be at least 3 characters')
    .max(10, 'Registration must not exceed 10 characters'),
  aircraft_type: z
    .string()
    .min(1, 'Aircraft Type is required')
    .max(50, 'Aircraft Type must not exceed 50 characters'),
  engine_type: z
    .string()
    .min(1, 'Engine Type is required')
    .max(50, 'Engine Type must not exceed 50 characters'),
  engine_qty: z
    .number()
    .min(1, 'Engine quantity must be at least 1')
    .max(10, 'Engine quantity must not exceed 10'),
  active: z.boolean(),
});

// Type สำหรับ Form Values
type AircraftFormValues = z.infer<typeof aircraftSchema>;

// Props สำหรับ AircraftDialog Component
interface AircraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Callback เมื่อเพิ่ม/แก้ไขข้อมูลสำเร็จ
  trigger?: React.ReactNode; // Trigger button (optional)
  editData?: AircraftData | null; // ข้อมูลสำหรับแก้ไข (ถ้ามี = edit mode)
}

// คอมโพเนนต์หลักสำหรับ Aircraft Dialog (Add/Edit)
export function AircraftDialog({
  open,
  onOpenChange,
  onSuccess,
  trigger,
  editData,
}: AircraftDialogProps) {
  // ตรวจสอบว่าเป็น Edit mode หรือไม่
  const isEditMode = !!editData;
  // สร้าง Form instance ด้วย react-hook-form และ zod validation
  const form = useForm<AircraftFormValues>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: isEditMode
      ? {
          registration: editData.registration || '',
          aircraft_type: editData.aircraft_type || '',
          engine_type: editData.engine_type || '',
          engine_qty: editData.engine_qty || 2,
          active: editData.active ?? true,
        }
      : {
          registration: '',
          aircraft_type: '',
          engine_type: '',
          engine_qty: 2, // ค่าเริ่มต้นเป็น 2 engines
          active: true, // ค่าเริ่มต้นเป็น Active
        },
    mode: 'onChange', // Validate แบบ real-time
  });

  // Reset form เมื่อ dialog เปิด/ปิด หรือข้อมูล edit เปลี่ยน
  useEffect(() => {
    if (open) {
      form.reset(
        isEditMode
          ? {
              registration: editData?.registration || '',
              aircraft_type: editData?.aircraft_type || '',
              engine_type: editData?.engine_type || '',
              engine_qty: editData?.engine_qty || 2,
              active: editData?.active ?? true,
            }
          : {
              registration: '',
              aircraft_type: '',
              engine_type: '',
              engine_qty: 2,
              active: true,
            },
      );
    }
  }, [open, form, isEditMode, editData]);

  // ฟังก์ชันสำหรับ Submit ข้อมูล
  const handleSubmit = async (data: AircraftFormValues) => {
    try {
      // แปลงข้อมูลให้ตรงกับ AircraftPayload
      const aircraftPayload: AircraftPayload = {
        registration: data.registration.trim().toUpperCase(), // แปลงเป็นตัวพิมพ์ใหญ่
        aircraft_type: data.aircraft_type.trim(),
        engine_type: data.engine_type.trim(),
        engine_qty: data.engine_qty,
        active: data.active,
      };

      // เรียก API ตาม mode (Add หรือ Edit)
      if (isEditMode && editData) {
        await patchAircraft(editData.id, aircraftPayload);
      } else {
        await postAircraft(aircraftPayload);
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
              Aircraft {isEditMode ? 'updated' : 'created'} successfully!
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
        `Error ${isEditMode ? 'updating' : 'creating'} aircraft:`,
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
              Failed to {isEditMode ? 'update' : 'create'} aircraft. Please try
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
            {isEditMode ? 'Edit Aircraft' : 'Add New Aircraft'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the aircraft details below. All fields are required.'
              : 'Fill in the aircraft details below. All fields are required.'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Registration Field */}
              <FormField
                control={form.control}
                name="registration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., HS-TKA"
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

              {/* Aircraft Type Field */}
              <FormField
                control={form.control}
                name="aircraft_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aircraft Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Boeing 777-300ER" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Engine Type Field */}
              <FormField
                control={form.control}
                name="engine_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., GE90-115B" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Engine Quantity Field */}
              <FormField
                control={form.control}
                name="engine_qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Quantity</FormLabel>
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
                      ? 'Update Aircraft'
                      : 'Create Aircraft'}
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
export const AddAircraftDialog = (
  props: Omit<AircraftDialogProps, 'editData'>,
) => <AircraftDialog {...props} editData={null} />;

export const EditAircraftDialog = (
  props: AircraftDialogProps & { editData: AircraftData },
) => <AircraftDialog {...props} />;
