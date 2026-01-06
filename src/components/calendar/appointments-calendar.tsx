
"use client";

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { appointments, patients } from '@/lib/data';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '../ui/badge';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Appointment } from '@/lib/types';

export default function AppointmentsCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [allAppointments, setAllAppointments] = React.useState<Appointment[]>(appointments);

  const selectedDayAppointments = allAppointments.filter(
    (appointment) =>
      date &&
      new Date(appointment.dateTime).toDateString() === date.toDateString()
  );

  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const patientId = formData.get('patient') as string;
    const treatment = formData.get('treatment') as string;
    const appointmentDate = formData.get('date') as string;
    const appointmentTime = formData.get('time') as string;

    const patient = patients.find(p => p.id === patientId);
    if (!patient || !treatment || !appointmentDate || !appointmentTime) {
      // Basic validation
      return;
    }

    const [hours, minutes] = appointmentTime.split(':');
    const newDateTime = new Date(appointmentDate);
    newDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const newAppointment: Appointment = {
      id: (allAppointments.length + 1).toString(),
      patientName: patient.name,
      patientAvatar: patient.avatar,
      dateTime: newDateTime,
      treatment: treatment,
      status: 'Confirmed',
    };

    setAllAppointments([...allAppointments, newAppointment]);
    
    // Here you would typically close the dialog
    // For simplicity, we'll rely on the user to close it
    // Or manage open state with useState
  };


  return (
    <>
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-0">
             <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                locale={fr}
                components={{
                    DayContent: ({ date }) => {
                        const dailyAppointments = allAppointments.filter(
                            (appointment) => new Date(appointment.dateTime).toDateString() === date.toDateString()
                        );
                        return (
                            <div className='relative w-full h-full flex items-center justify-center'>
                                {date.getDate()}
                                {dailyAppointments.length > 0 && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
                                )}
                            </div>
                        );
                    }
                }}
             />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card>
            <CardHeader className='flex-row items-center justify-between'>
                <div>
                    <CardTitle>
                        {date ? format(date, 'd MMMM yyyy', { locale: fr }) : "Sélectionnez une date"}
                    </CardTitle>
                    <CardDescription>
                        {selectedDayAppointments.length} rendez-vous
                    </CardDescription>
                </div>
                 <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        RDV
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Nouveau rendez-vous</DialogTitle>
                      <DialogDescription>
                        Planifiez un nouveau rendez-vous pour un patient.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddAppointment}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="patient" className="text-right">
                            Patient
                          </Label>
                           <Select name="patient">
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Sélectionner un patient" />
                            </SelectTrigger>
                            <SelectContent>
                              {patients.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="treatment" className="text-right">
                            Soin
                          </Label>
                          <Input id="treatment" name="treatment" placeholder="Ex: Contrôle" className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date
                          </Label>
                          <Input id="date" name="date" type="date" defaultValue={date ? format(date, 'yyyy-MM-dd') : ''} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="time" className="text-right">
                            Heure
                          </Label>
                          <Input id="time" name="time" type="time" defaultValue="09:00" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Enregistrer</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments
                  .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="grid gap-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.treatment}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-auto font-medium text-sm">
                        {format(appointment.dateTime, 'HH:mm', { locale: fr })}
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun rendez-vous pour cette date.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
