"use client";

import { useState } from "react";
import type { TreatmentPlan } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


interface TreatmentPlansProps {
  treatmentPlans: TreatmentPlan[];
  onAddPlan: (newPlan: Omit<TreatmentPlan, 'id' | 'status' | 'date'> & { treatmentsInput: string }) => void;
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

function NewPlanDialog({ onAddPlan }: { onAddPlan: TreatmentPlansProps['onAddPlan'] }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const totalCost = formData.get("totalCost") as string;
        const treatmentsInput = formData.get("treatments") as string;

        if (!title || !totalCost || !treatmentsInput) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez remplir tous les champs.' });
            return;
        }

        onAddPlan({
            title,
            totalCost: parseFloat(totalCost),
            treatmentsInput,
        });

        toast({ title: "Succès", description: "Plan de traitement ajouté." });
        setIsOpen(false);
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouveau Plan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                 <DialogHeader>
                    <DialogTitle>Nouveau Plan de Traitement</DialogTitle>
                    <DialogDescription>
                        Créez un devis pour un ensemble de soins.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Titre</Label>
                            <Input id="title" name="title" placeholder="Ex: Plan de restauration" className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalCost" className="text-right">Coût Total (MAD)</Label>
                            <Input id="totalCost" name="totalCost" type="number" placeholder="Ex: 8500" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="treatments" className="text-right pt-2">Soins inclus</Label>
                            <Textarea id="treatments" name="treatments" placeholder="Listez les soins ici. Ex: &#10;- Dent n°15: Couronne&#10;- Dent n°26: Inlay-core" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                         <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function TreatmentPlans({ treatmentPlans }: { treatmentPlans: TreatmentPlan[] }) {
  const [plans, setPlans] = useState<TreatmentPlan[]>(treatmentPlans);

  const handleAddPlan = (newPlanData: Omit<TreatmentPlan, 'id' | 'status' | 'date'> & { treatmentsInput: string }) => {
      const newPlan: TreatmentPlan = {
          ...newPlanData,
          id: `PLAN-${(plans.length + 1).toString().padStart(3, '0')}`,
          status: 'Proposed',
          date: format(new Date(), 'yyyy-MM-dd'),
          // A simple way to represent treatments from a textarea for now
          treatments: newPlanData.treatmentsInput.split('\n').map(line => ({
              procedure: line.replace(/^- /, ''),
              tooth: 0, // Placeholder
              cost: 0 // Placeholder
          })),
      };
      setPlans(prevPlans => [...prevPlans, newPlan]);
  };
  
  const exportToPDF = (plan: TreatmentPlan) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("DentiCare Maroc", 14, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123 Avenue des Soins, Casablanca", 14, 30);
    doc.text("contact@denticare.ma | +212 5 22 00 11 22", 14, 35);
    
    // Devis title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`Devis: ${plan.title}`, 14, 50);

    // Plan info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${plan.date}`, 14, 60);
    doc.text(`N° du Plan: ${plan.id}`, 14, 65);
    
    // Table
    autoTable(doc, {
        startY: 75,
        head: [['Soin', 'Description', 'Coût (MAD)']],
        body: plan.treatments.map(t => [
            t.tooth ? `Dent n°${t.tooth}` : 'Général',
            t.procedure,
            t.cost > 0 ? t.cost.toFixed(2) : 'N/A'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [105, 162, 151] } // Primary color
    });
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Coût Total:", 140, finalY + 15, { align: 'right' });
    doc.text(`${plan.totalCost.toFixed(2)} MAD`, 200, finalY + 15, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Devis valable 30 jours. Merci de votre confiance.", 14, doc.internal.pageSize.height - 10);

    doc.save(`devis-${plan.id}.pdf`);
  };


  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Plans de traitement</CardTitle>
            <CardDescription>Gérez les devis et les plans de soins du patient.</CardDescription>
        </div>
        <NewPlanDialog onAddPlan={handleAddPlan} />
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {plans.map((plan) => (
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
                                        <span>{treatment.tooth ? `Dent n°${treatment.tooth}: ` : ''}{treatment.procedure}</span>
                                        {treatment.cost > 0 && <span>{treatment.cost.toFixed(2)} MAD</span>}
                                    </li>
                                ))}
                             </ul>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button variant="outline">Modifier le statut</Button>
                            <Button variant="ghost" onClick={() => exportToPDF(plan)}><FileText className="mr-2 h-4 w-4"/> Exporter en PDF</Button>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
          ))}
        </Accordion>
         {plans.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
                <p>Aucun plan de traitement pour ce patient.</p>
                 <Button size="sm" className="mt-4" onClick={() => {
                     // This is a placeholder for triggering the dialog.
                     // In a real app, you'd manage the dialog state here or higher up.
                     const newPlanButton = document.querySelector('[aria-label="Nouveau Plan"]');
                     if (newPlanButton instanceof HTMLElement) {
                         newPlanButton.click();
                     }
                 }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Créer un plan
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
