import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
}

interface ScheduleSlot {
  time: string;
  subject: string;
  class: string;
  room: string;
}

interface DaySchedule {
  [key: string]: ScheduleSlot[];
}

// Dados mock de horário - cada professor terá horários baseados nas suas disciplinas e turmas
const generateSchedule = (teacher: Teacher): DaySchedule => {
  const times = ["08:00", "09:00", "10:30", "11:30", "14:00", "15:00", "16:00"];
  const rooms = ["Sala 101", "Sala 102", "Sala 201", "Sala 202", "Lab. 1", "Lab. 2"];
  
  const schedule: DaySchedule = {
    Segunda: [],
    Terça: [],
    Quarta: [],
    Quinta: [],
    Sexta: [],
  };

  const days = Object.keys(schedule);
  
  // Gerar horário baseado nas disciplinas e turmas do professor
  teacher.subjects.forEach((subject, subjectIndex) => {
    teacher.classes.forEach((cls, classIndex) => {
      // Distribuir aulas pelos dias da semana
      const dayIndex = (subjectIndex + classIndex) % days.length;
      const day = days[dayIndex];
      const timeIndex = (subjectIndex * 2 + classIndex) % times.length;
      
      if (schedule[day].length < 4) {
        schedule[day].push({
          time: times[timeIndex],
          subject: subject,
          class: cls,
          room: rooms[(subjectIndex + classIndex) % rooms.length],
        });
      }
    });
  });

  // Ordenar por hora
  Object.keys(schedule).forEach((day) => {
    schedule[day].sort((a, b) => a.time.localeCompare(b.time));
  });

  return schedule;
};

interface VerHorarioProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

const VerHorarioProfessorModal = ({
  isOpen,
  onClose,
  teacher,
}: VerHorarioProfessorModalProps) => {
  if (!teacher) return null;

  const schedule = generateSchedule(teacher);
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  // Cores para cada disciplina
  const subjectColors: { [key: string]: string } = {
    "Matemática": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    "Física": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    "Português": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    "Literatura": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    "História": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    "Geografia": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    "Inglês": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    "Biologia": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
    "Química": "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
    "Educação Física": "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
  };

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
  };

  // Calcular total de aulas
  const totalClasses = Object.values(schedule).reduce(
    (acc, daySchedule) => acc + daySchedule.length,
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário Semanal
          </DialogTitle>
        </DialogHeader>

        {/* Info do Professor */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
          <div className="h-12 w-12 rounded-full gradient-hero flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">
              {teacher.name
                .replace("Prof. ", "")
                .replace("Prof.ª ", "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{teacher.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {teacher.subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{totalClasses}</p>
            <p className="text-xs text-muted-foreground">aulas/semana</p>
          </div>
        </div>

        {/* Horário Semanal */}
        <div className="grid grid-cols-5 gap-2">
          {days.map((day) => (
            <div key={day} className="space-y-2">
              {/* Cabeçalho do dia */}
              <div className="text-center py-2 bg-primary/10 rounded-lg">
                <p className="font-semibold text-sm text-primary">{day}</p>
                <p className="text-xs text-muted-foreground">
                  {schedule[day].length} aula{schedule[day].length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Aulas do dia */}
              <div className="space-y-2 min-h-[200px]">
                {schedule[day].length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    Sem aulas
                  </div>
                ) : (
                  schedule[day].map((slot, index) => (
                    <Card
                      key={index}
                      className={`p-2 border ${getSubjectColor(slot.subject)}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <Clock className="h-3 w-3" />
                          {slot.time}
                        </div>
                        <p className="font-semibold text-xs leading-tight">
                          {slot.subject}
                        </p>
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {slot.class}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] opacity-75">
                          <MapPin className="h-2.5 w-2.5" />
                          {slot.room}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legenda */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Legenda de Disciplinas:</p>
          <div className="flex flex-wrap gap-2">
            {teacher.subjects.map((subject) => (
              <Badge
                key={subject}
                className={`text-xs ${getSubjectColor(subject)}`}
              >
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerHorarioProfessorModal;
