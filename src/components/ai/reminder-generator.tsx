"use client";

import { useFormStatus } from "react-dom";
import { generateReminderAction } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useActionState } from "react";
import { Bot, Clipboard, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const initialState = {
  message: "",
  errorMessage: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Générer le rappel
        </>
      )}
    </Button>
  );
}

export default function ReminderGenerator() {
  const [state, formAction] = useActionState(generateReminderAction, initialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      setIsDialogOpen(true);
    }
    if (state.errorMessage) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: state.errorMessage,
      });
    }
  }, [state, toast]);

  const handleCopyToClipboard = () => {
    if (state.message) {
      navigator.clipboard.writeText(state.message);
      toast({
        title: "Copié !",
        description: "Le message de rappel a été copié dans le presse-papiers.",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Rappel de RDV par IA</CardTitle>
          <CardDescription>
            Générez un message de rappel personnalisé pour vos patients.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Nom du patient</Label>
              <Input
                id="patientName"
                name="patientName"
                placeholder="Ex: Fatima Zahra"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentDateTime">Date et heure du RDV</Label>
              <Input
                id="appointmentDateTime"
                name="appointmentDateTime"
                placeholder="Ex: 15 Juillet 2024 à 10:30"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Message de rappel généré</DialogTitle>
            <DialogDescription>
              Voici le message personnalisé à envoyer à votre patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea value={state.message} readOnly rows={5} className="bg-muted" />
          </div>
          <DialogFooter className="sm:justify-start gap-2">
            <Button onClick={handleCopyToClipboard}>
              <Clipboard className="mr-2 h-4 w-4" />
              Copier
            </Button>
             <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              <Send className="mr-2 h-4 w-4" />
              Envoyer (simulation)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
