import React from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { AircraftData } from '@/types/aircraft.types';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// Props สำหรับ ViewAircraftDialog Component
interface ViewAircraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraftData: AircraftData | null; // ข้อมูลเครื่องบินที่ต้องการแสดง
  trigger?: React.ReactNode; // Trigger button (optional)
}

// คอมโพเนนต์หลักสำหรับ View Aircraft Dialog
export function ViewAircraftDialog({
  open,
  onOpenChange,
  aircraftData,
  trigger,
}: ViewAircraftDialogProps) {
  // ถ้าไม่มีข้อมูลให้แสดง
  if (!aircraftData) return null;

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', {
        locale: th,
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Trigger Button (ถ้ามี) */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      {/* Dialog Content */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Aircraft Details</span>
            <Badge
              size="lg"
              variant={aircraftData.active ? 'success' : 'destructive'}
              appearance="outline"
              shape="circle"
            >
              <BadgeDot
                className={aircraftData.active ? 'success' : 'destructive'}
              />
              {aircraftData.active ? 'Active' : 'Inactive'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed information for aircraft {aircraftData.registration}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            {/* ข้อมูลหลัก */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Aircraft Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Registration
                    </label>
                    <p className="text-lg font-semibold text-foreground">
                      {aircraftData.registration}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Aircraft ID
                    </label>
                    <p className="text-sm text-foreground font-mono">
                      {aircraftData.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Aircraft Type
                    </label>
                    <p className="text-sm text-foreground">
                      {aircraftData.aircraft_type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Engine Type
                    </label>
                    <p className="text-sm text-foreground">
                      {aircraftData.engine_type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Engine Quantity
                    </label>
                    <p className="text-sm text-foreground">
                      {aircraftData.engine_qty} engines
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          aircraftData.active ? 'success' : 'destructive'
                        }
                        appearance="outline"
                        shape="circle"
                      >
                        <BadgeDot
                          className={
                            aircraftData.active ? 'success' : 'destructive'
                          }
                        />
                        {aircraftData.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* ข้อมูลเพิ่มเติม */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Record Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p className="text-sm text-foreground">
                      {formatDate(aircraftData.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="text-sm text-foreground">
                      {formatDate(aircraftData.updated_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ปุ่มปิด */}
            <div className="flex justify-end pt-4">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
