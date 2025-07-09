import React from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { OilConsumptionData } from '@/types/oil-consumption.types';
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

// Props สำหรับ ViewOilConsumptionDialog Component
interface ViewOilConsumptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oilConsumptionData: OilConsumptionData | null; // ข้อมูล Oil Consumption ที่ต้องการแสดง
  trigger?: React.ReactNode; // Trigger button (optional)
}

// คอมโพเนนต์หลักสำหรับ View Oil Consumption Dialog
export function ViewOilConsumptionDialog({
  open,
  onOpenChange,
  oilConsumptionData,
  trigger,
}: ViewOilConsumptionDialogProps) {
  // ถ้าไม่มีข้อมูลให้แสดง
  if (!oilConsumptionData) return null;

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

  // คำนวณ Oil Rate
  const oilRate = oilConsumptionData.flight_hours > 0 
    ? oilConsumptionData.oil_added / oilConsumptionData.flight_hours 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Trigger Button (ถ้ามี) */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      {/* Dialog Content */}
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <span>Oil Consumption Details</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information for oil consumption record
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="flex-1 kt-scrollable-y-auto">
          <div className="space-y-6">
            {/* ข้อมูลหลัก */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Oil Consumption Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Record ID
                    </label>
                    <p className="text-sm text-foreground font-mono break-all">
                      {oilConsumptionData.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Date
                    </label>
                    <p className="text-lg font-semibold text-foreground">
                      {new Date(oilConsumptionData.date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Flight Hours
                    </label>
                    <p className="text-sm text-foreground">
                      {oilConsumptionData.flight_hours.toFixed(1)} hours
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Oil Added
                    </label>
                    <p className="text-sm text-foreground">
                      {oilConsumptionData.oil_added.toFixed(1)} liters
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Oil Consumption Rate
                    </label>
                    <p className="text-sm text-foreground font-semibold">
                      {oilRate.toFixed(2)} L/hr
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Remarks
                    </label>
                    <p className="text-sm text-foreground">
                      {oilConsumptionData.remarks || 'No remarks'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* ข้อมูลเครื่องยนต์ */}
            {oilConsumptionData.engine && (
              <>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Engine Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Serial Number
                        </label>
                        <p className="text-sm text-foreground font-semibold">
                          {oilConsumptionData.engine.serial_number}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Engine ID
                        </label>
                        <p className="text-sm text-foreground font-mono break-all">
                          {oilConsumptionData.engine.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Model
                        </label>
                        <p className="text-sm text-foreground">
                          {oilConsumptionData.engine.model}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Position
                        </label>
                        <p className="text-sm text-foreground">
                          {oilConsumptionData.engine.position}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Low Oil Threshold
                        </label>
                        <p className="text-sm text-foreground">
                          {oilConsumptionData.engine.low_oil_threshold_hours
                            ? `${oilConsumptionData.engine.low_oil_threshold_hours} hours`
                            : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Separator />
              </>
            )}

            {/* ข้อมูลเครื่องบิน */}
            {oilConsumptionData.engine?.aircraft && (
              <>
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
                        <p className="text-sm text-foreground font-semibold">
                          {oilConsumptionData.engine.aircraft.registration}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Aircraft ID
                        </label>
                        <p className="text-sm text-foreground font-mono break-all">
                          {oilConsumptionData.engine.aircraft.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Aircraft Type
                        </label>
                        <p className="text-sm text-foreground">
                          {oilConsumptionData.engine.aircraft.aircraft_type}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Engine Type
                        </label>
                        <p className="text-sm text-foreground">
                          {oilConsumptionData.engine.aircraft.engine_type}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Separator />
              </>
            )}

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
                      {formatDate(oilConsumptionData.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="text-sm text-foreground">
                      {formatDate(oilConsumptionData.updated_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogBody>

        {/* ปุ่มปิด - ย้ายออกมาจาก scrollable area */}
        <div className="flex justify-end pt-4 border-t bg-background flex-shrink-0">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
} 