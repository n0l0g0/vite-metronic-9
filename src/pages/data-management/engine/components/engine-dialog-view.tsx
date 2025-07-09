import React from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { EngineData } from '@/types/engine.types';
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

// Props สำหรับ ViewEngineDialog Component
interface ViewEngineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  engineData: EngineData | null; // ข้อมูลเครื่องยนต์ที่ต้องการแสดง
  trigger?: React.ReactNode; // Trigger button (optional)
}

// คอมโพเนนต์หลักสำหรับ View Engine Dialog
export function ViewEngineDialog({
  open,
  onOpenChange,
  engineData,
  trigger,
}: ViewEngineDialogProps) {
  // ถ้าไม่มีข้อมูลให้แสดง
  if (!engineData) return null;

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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <span>Engine Details</span>
            <Badge
              size="lg"
              variant={engineData.active ? 'success' : 'destructive'}
              appearance="outline"
              shape="circle"
            >
              <BadgeDot
                className={engineData.active ? 'success' : 'destructive'}
              />
              {engineData.active ? 'Active' : 'Inactive'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed information for engine {engineData.serial_number}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="flex-1 kt-scrollable-y-auto">
          <div className="space-y-6">
            {/* ข้อมูลหลัก */}
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
                    <p className="text-lg font-semibold text-foreground">
                      {engineData.serial_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Engine ID
                    </label>
                    <p className="text-sm text-foreground font-mono break-all">
                      {engineData.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Model
                    </label>
                    <p className="text-sm text-foreground">
                      {engineData.model}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Position
                    </label>
                    <p className="text-sm text-foreground">
                      {engineData.position}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Low Oil Threshold
                    </label>
                    <p className="text-sm text-foreground">
                      {engineData.low_oil_threshold_hours
                        ? `${engineData.low_oil_threshold_hours} hours`
                        : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={engineData.active ? 'success' : 'destructive'}
                        appearance="outline"
                        shape="circle"
                      >
                        <BadgeDot
                          className={
                            engineData.active ? 'success' : 'destructive'
                          }
                        />
                        {engineData.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* ข้อมูลเครื่องบิน */}
            {engineData.aircraft && (
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
                          {engineData.aircraft.registration}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Aircraft ID
                        </label>
                        <p className="text-sm text-foreground font-mono break-all">
                          {engineData.aircraft.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Aircraft Type
                        </label>
                        <p className="text-sm text-foreground">
                          {engineData.aircraft.aircraft_type}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Engine Type
                        </label>
                        <p className="text-sm text-foreground">
                          {engineData.aircraft.engine_type}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Total Engines
                        </label>
                        <p className="text-sm text-foreground">
                          {engineData.aircraft.engine_qty} engines
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
                      {formatDate(engineData.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="text-sm text-foreground">
                      {formatDate(engineData.updated_at)}
                    </p>
                  </div>
                  {engineData.install_date && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Install Date
                      </label>
                      <p className="text-sm text-foreground">
                        {formatDate(engineData.install_date)}
                      </p>
                    </div>
                  )}
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
