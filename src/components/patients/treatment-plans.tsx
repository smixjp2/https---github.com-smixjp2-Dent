"use client";

import type { TreatmentPlan } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";

interface TreatmentPlansProps {
  treatmentPlans: TreatmentPlan[];
}

const statusVariant: { [key in TreatmentPlan['status']]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Proposed: 'secondary',
  Accepted: 'default',
  'In Progress': 'outline',
  Completed: 'default',
};

const statusText: { [key in TreatmentPlan['status']]: string } = {
    Proposed: 'Proposé',
    Accepted: 'Accepté',
    'In Progress': 'En cours',
    Completed: 'Terminé',
};

export default function TreatmentPlans({ treatmentPlans }: TreatmentPlansProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Plans de traitement</CardTitle>
            <CardDescription>Gérez les devis et les plans de soins du patient.</CardDescription>
        </div>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Plan
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {treatmentPlans.map((plan) => (
            <AccordionItem value={`plan-${plan.id}`} key={plan.id} className="border-b-0">
                <Card className="bg-muted/50">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex flex-col md:flex-row justify-between w-full pr-4 items-start md:items-center">
                            <div className="text-left">
                                <h3 className="font-semibold text-lg">{plan.title}</h3>
                                <p className="text-sm text-muted-foreground">Proposé le {plan.date}</p>
                            </div>
                             <div className="flex items-center gap-4 mt-2 md:mt-0">
                                <Badge variant={statusVariant[plan.status]}>
                                    {statusText[plan.status]}
                                </Badge>
                                <span className="font-bold text-lg">{plan.totalCost.toFixed(2)} MAD</span>
                             </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <div className="space-y-2">
                             <h4 className="font-semibold">Soins inclus:</h4>
                             <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                {plan.treatments.map((treatment, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>Dent n°{treatment.tooth}: {treatment.procedure}</span>
                                        <span>{treatment.cost.toFixed(2)} MAD</span>
                                    </li>
                                ))}
                             </ul>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button variant="outline">Modifier le statut</Button>
                            <Button variant="ghost"><FileText className="mr-2 h-4 w-4"/> Exporter en PDF</Button>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
          ))}
        </Accordion>
         {treatmentPlans.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
                <p>Aucun plan de traitement pour ce patient.</p>
                <Button size="sm" className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Créer un plan
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
