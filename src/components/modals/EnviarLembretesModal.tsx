import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Send, Loader2, AlertCircle, Clock, Mail, Phone } from "lucide-react";

interface EnviarLembretesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const estudantesPendentes = [
  { id: 1, student: "Ana Ferreira", class: "10ª A", guardian: "Maria Ferreira", phone: "923 456 789", email: "maria.f@email.com", amount: "17.500 Kz", dueDate: "2026-01-10", status: "pending" },
  { id: 2, student: "Carlos Santos", class: "11ª B", guardian: "José Santos", phone: "912 345 678", email: "jose.s@email.com", amount: "17.500 Kz", dueDate: "2026-01-10", status: "overdue" },
  { id: 3, student: "Teresa Mendes", class: "9ª A", guardian: "Ana Mendes", phone: "934 567 890", email: "ana.m@email.com", amount: "35.000 Kz", dueDate: "2025-12-10", status: "overdue" },
  { id: 4, student: "Ricardo Alves", class: "8ª C", guardian: "Paulo Alves", phone: "945 678 901", email: "", amount: "17.500 Kz", dueDate: "2026-01-10", status: "pending" },
  { id: 5, student: "Luísa Costa", class: "12ª A", guardian: "Rosa Costa", phone: "956 789 012", email: "rosa.c@email.com", amount: "52.500 Kz", dueDate: "2025-11-10", status: "overdue" },
];

const messageTemplates = {
  pending: `Prezado(a) Encarregado(a),

Vimos por este meio lembrar que a propina do mês de Janeiro 2026 encontra-se por regularizar.

Valor: {amount}
Data limite: {dueDate}

Agradecemos a regularização atempada.

Atenciosamente,
Escola de Gestão Educacional`,
  overdue: `Prezado(a) Encarregado(a),

Informamos que a propina do(a) estudante {student} encontra-se em atraso.

Valor em dívida: {amount}
Vencimento: {dueDate}

Solicitamos a regularização urgente para evitar constrangimentos.

Atenciosamente,
Escola de Gestão Educacional`,
};

const EnviarLembretesModal = ({ open, onOpenChange }: EnviarLembretesModalProps) => {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sendMethod, setSendMethod] = useState<string>("email");
  const [customMessage, setCustomMessage] = useState(messageTemplates.pending);

  const filteredStudents = estudantesPendentes.filter(
    (s) => filterStatus === "all" || s.status === filterStatus
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const validStudents = filteredStudents.filter(s => 
        sendMethod === "email" ? s.email : s.phone
      );
      setSelectedStudents(validStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter((sId) => sId !== id));
    }
  };

  const handleStatusChange = (status: string) => {
    setFilterStatus(status);
    if (status === "overdue") {
      setCustomMessage(messageTemplates.overdue);
    } else {
      setCustomMessage(messageTemplates.pending);
    }
  };

  const sendReminders = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Seleccione pelo menos um encarregado");
      return;
    }

    setIsSending(true);

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(`${selectedStudents.length} lembrete(s) enviado(s) com sucesso!`, {
      description: `Enviados por ${sendMethod === "email" ? "email" : "SMS"}`,
    });

    setIsSending(false);
    setSelectedStudents([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-primary" />
            Enviar Lembretes de Pagamento
          </DialogTitle>
          <DialogDescription>
            Envie lembretes aos encarregados de estudantes com propinas pendentes ou em atraso
          </DialogDescription>
        </DialogHeader>

        {/* Filters and Options */}
        <div className="flex flex-wrap items-center gap-4 py-2">
          <Select value={filterStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="overdue">Em Atraso</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sendMethod} onValueChange={setSendMethod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
              </SelectItem>
              <SelectItem value="sms">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  SMS
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
            <Send className="h-4 w-4" />
            {selectedStudents.length} seleccionado(s)
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Student List */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.filter(s => sendMethod === "email" ? s.email : s.phone).length && filteredStudents.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const hasContact = sendMethod === "email" ? student.email : student.phone;
                  return (
                    <TableRow key={student.id} className={!hasContact ? "opacity-50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) =>
                            handleSelectStudent(student.id, checked as boolean)
                          }
                          disabled={!hasContact}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.student}</p>
                          <p className="text-xs text-muted-foreground">{student.guardian}</p>
                          {!hasContact && (
                            <p className="text-xs text-destructive">Sem {sendMethod === "email" ? "email" : "telefone"}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{student.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            student.status === "pending"
                              ? "border-accent text-accent"
                              : "border-destructive text-destructive"
                          }
                        >
                          {student.status === "pending" ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pendente
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Atraso
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Message Preview */}
          <div className="space-y-3">
            <Label>Mensagem a Enviar</Label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[280px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use {"{student}"}, {"{amount}"}, {"{dueDate}"} para personalizar automaticamente
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={sendReminders} disabled={isSending || selectedStudents.length === 0}>
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A enviar...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ""} Lembrete(s)
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnviarLembretesModal;
