
"use client";

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { appointments } from '@/lib/data';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '../ui/badge';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

export default function AppointmentsCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const selectedDayAppointments = appointments.filter(
    (appointment) =>
      date &&
      new Date(appointment.dateTime).toDateString() === date.toDateString()
  );

  return (
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
                        const dailyAppointments = appointments.filter(
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
                 <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    RDV
                </Button>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments
                  .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
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
  );
}
