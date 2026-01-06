"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/lib/types"
import { useState } from "react";
import { CreditCard, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";

const statusVariant: { [key in Invoice['status']]: 'default' | 'secondary' | 'destructive' } = {
  Paid: 'default',
  Partial: 'secondary',
  Unpaid: 'destructive',
}
const statusText: { [key in Invoice['status']]: string } = {
    Paid: 'Payé',
    Partial: 'Partiel',
    Unpaid: 'Impayé',
};

interface AddPaymentDialogProps {
  invoice: Invoice;
  onAddPayment: (invoiceId: string, paymentAmount: number) => void;
  children: React.ReactNode;
}

function AddPaymentDialog({ invoice, onAddPayment, children }: AddPaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number | string>("");
  const { toast } = useToast();
  const remainingAmount = invoice.amount - invoice.paidAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount as string);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez entrer un montant valide.' });
      return;
    }
    if (paymentAmount > remainingAmount) {
      toast({ variant: 'destructive', title: 'Erreur', description: `Le paiement ne peut pas dépasser le montant restant de ${remainingAmount.toFixed(2)} MAD.` });
      return;
    }
    
    onAddPayment(invoice.id, paymentAmount);
    toast({ title: "Succès", description: "Paiement enregistré." });
    setIsOpen(false);
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Facture {invoice.id} - Montant total: {invoice.amount.toFixed(2)} MAD
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <p className="text-sm">Montant déjà payé: <span className="font-medium">{invoice.paidAmount.toFixed(2)} MAD</span></p>
                <p className="text-sm">Montant restant: <span className="font-medium">{remainingAmount.toFixed(2)} MAD</span></p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Montant</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder={`Max ${remainingAmount.toFixed(2)}`}
                className="col-span-3"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


interface BillingTableProps {
  invoices: Invoice[];
  onAddPayment: (invoiceId: string, paymentAmount: number) => void;
}

export default function BillingTable({ invoices, onAddPayment }: BillingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Facture</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Payé</TableHead>
          <TableHead className="text-right">Restant</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[invoice.status]}>
                {statusText[invoice.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{invoice.amount.toFixed(2)} MAD</TableCell>
            <TableCell className="text-right text-green-600">{invoice.paidAmount.toFixed(2)} MAD</TableCell>
            <TableCell className="text-right font-medium text-red-600">{(invoice.amount - invoice.paidAmount).toFixed(2)} MAD</TableCell>
            <TableCell className="text-right">
              {invoice.status !== 'Paid' && (
                <AddPaymentDialog invoice={invoice} onAddPayment={onAddPayment}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <CreditCard className="h-4 w-4" />
                        <span className="sr-only">Enregistrer un paiement</span>
                    </Button>
                </AddPaymentDialog>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
