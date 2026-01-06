"use client";

import Link from "next/link";
import { ArrowLeft, Edit, FileText, Phone, Mail, Home, History, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { patients, treatments as initialTreatments, invoices as initialInvoices, treatmentPlans } from "@/lib/data";
import DentalChart from "@/components/patients/dental-chart";
import TreatmentsList from "@/components/patients/treatments-list";
import BillingTable from "@/components/patients/billing-table";
import TreatmentPlans from "@/components/patients/treatment-plans";
import { useState } from "react";
import type { Invoice, Treatment, TreatmentPlan } from "@/lib/types";
import NewInvoiceDialog from "@/components/patients/new-invoice-dialog";


export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = patients.find((p) => p.id === params.id);
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [plans, setPlans] = useState<TreatmentPlan[]>(treatmentPlans);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full">
        Patient non trouvé
      </div>
    );
  }

  const handleAddInvoice = (newInvoice: Omit<Invoice, 'id' | 'status'>) => {
    const newInvoiceWithId: Invoice = {
      ...newInvoice,
      id: `INV-${(invoices.length + 1).toString().padStart(3, '0')}`,
      status: 'Unpaid',
    };
    setInvoices(prevInvoices => [...prevInvoices, newInvoiceWithId]);
  };

  return (
    <div className="flex flex-col h-full">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
            <Link href="/patients">
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Retour</span>
                </Button>
            </Link>
            <h1 className="font-semibold text-lg md:text-xl">Dossier Patient</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border">
                                <AvatarImage src={patient.avatar} />
                                <AvatarFallback>{patient.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                                <CardDescription>ID Patient: DENTI-{patient.id.padStart(4, '0')}</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Modifier</Button>
                            <NewInvoiceDialog onAddInvoice={handleAddInvoice} />
                            <Button><CalendarIcon className="mr-2 h-4 w-4" /> Nouveau RDV</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.address}</span>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="chart">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="info">Infos & Notes</TabsTrigger>
                        <TabsTrigger value="chart">Schéma Dentaire</TabsTrigger>
                        <TabsTrigger value="history">Historique Soins</TabsTrigger>
                        <TabsTrigger value="plans">Plans de traitement</TabsTrigger>
                        <TabsTrigger value="billing">Facturation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                        <Card>
                            <CardHeader><CardTitle>Informations et notes</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Date de naissance</h3>
                                    <p className="text-muted-foreground">{new Date(patient.dateOfBirth).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Allergies</h3>
                                    {patient.allergies.length > 0 ? (
                                        <div className="flex gap-2 mt-1">
                                            {patient.allergies.map(allergy => <Badge key={allergy} variant="destructive">{allergy}</Badge>)}
                                        </div>
                                    ) : <p className="text-muted-foreground">Aucune allergie connue.</p>}
                                </div>
                                <div>
                                    <h3 className="font-semibold">Antécédents médicaux</h3>
                                    {patient.medicalHistory.length > 0 ? (
                                        <div className="flex gap-2 mt-1">
                                            {patient.medicalHistory.map(history => <Badge key={history} variant="secondary">{history}</Badge>)}
                                        </div>
                                    ) : <p className="text-muted-foreground">Aucun antécédent notable.</p>}
                                </div>
                                <div>
                                    <h3 className="font-semibold">Notes du médecin</h3>
                                    <p className="text-muted-foreground italic p-3 bg-muted rounded-md mt-1">{patient.notes || "Aucune note."}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="chart">
                        <Card>
                            <CardHeader><CardTitle>Schéma dentaire interactif</CardTitle></CardHeader>
                            <CardContent>
                                <DentalChart />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="history">
                        <Card>
                             <CardHeader><CardTitle>Historique des soins</CardTitle></CardHeader>
                             <CardContent>
                                <TreatmentsList treatments={treatments} />
                             </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="plans">
                        <TreatmentPlans treatmentPlans={plans} />
                    </TabsContent>
                    <TabsContent value="billing">
                        <Card>
                            <CardHeader><CardTitle>Historique de facturation</CardTitle></CardHeader>
                            <CardContent>
                                <BillingTable invoices={invoices} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    </div>
  );
}
