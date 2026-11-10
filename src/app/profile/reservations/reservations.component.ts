
import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';

import {
  CalendarOptions,
  EventContentArg,
  EventClickArg,
  EventInput
} from '@fullcalendar/core';

import { FullCalendarComponent } from '@fullcalendar/angular';

import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'cancelled';

interface Appointment {
  id: number;
  startTime: string;
  patientName: string;
  patientPhone: string;
  patientImage?: string;
  serviceName: string;
  status: AppointmentStatus;
  price: number;
  notes?: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  image: string;
  startTime: string;
  endTime: string;
  sessionDuration: number;
  bookedSlots: Appointment[];
}

@Component({
  selector: 'app-appointments',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;

  selectedDoctor!: Doctor;

  doctors: Doctor[] = [
    {
      id: 1,
      name: 'د. أحمد محمد',
      specialization: 'أخصائي باطنة',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      startTime: '09:00',
      endTime: '15:00',
      sessionDuration: 30,

      bookedSlots: [
        {
          id: 1,
          startTime: '09:00',
          patientName: 'محمد أحمد',
          patientPhone: '01012345678',
          patientImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
          serviceName: 'كشف باطنة',
          status: 'confirmed',
          price: 300,
          notes: 'متابعة دورية'
        },
        {
          id: 2,
          startTime: '10:00',
          patientName: 'محمود علي',
          patientPhone: '01112345678',
          serviceName: 'استشارة طبية',
          status: 'pending',
          price: 250
        },
        {
          id: 3,
          startTime: '11:30',
          patientName: 'أحمد خالد',
          patientPhone: '01212345678',
          serviceName: 'كشف باطنة',
          status: 'completed',
          price: 300
        }
      ]
    },

    {
      id: 2,
      name: 'د. سارة محمود',
      specialization: 'أخصائية أطفال',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      startTime: '10:00',
      endTime: '16:00',
      sessionDuration: 45,

      bookedSlots: [
        {
          id: 4,
          startTime: '10:00',
          patientName: 'يوسف محمد',
          patientPhone: '01055555555',
          serviceName: 'كشف أطفال',
          status: 'confirmed',
          price: 350
        },
        {
          id: 5,
          startTime: '12:15',
          patientName: 'عمر أحمد',
          patientPhone: '01066666666',
          serviceName: 'متابعة أطفال',
          status: 'pending',
          price: 250
        }
      ]
    },

    {
      id: 3,
      name: 'د. محمود علي',
      specialization: 'أخصائي عظام',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      startTime: '08:00',
      endTime: '14:00',
      sessionDuration: 60,

      bookedSlots: [
        {
          id: 6,
          startTime: '09:00',
          patientName: 'خالد إبراهيم',
          patientPhone: '01077777777',
          serviceName: 'كشف عظام',
          status: 'confirmed',
          price: 400
        }
      ]
    }
  ];

  appointments: EventInput[] = [];

  selectedAppointment: Appointment | null = null;

  isDetailsModalOpen = false;

  today = new Date();

calendarOptions: CalendarOptions = {
  plugins: [
    timeGridPlugin,
    interactionPlugin
  ],

  initialView: 'timeGridDay',
  initialDate: new Date(),

  locale: 'ar',
  direction: 'rtl',

  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },

  allDaySlot: false,
  nowIndicator: true,

  height: 'auto',
  expandRows: true,

  slotMinTime: '09:00:00',
  slotMaxTime: '15:00:00',

  slotDuration: '00:30:00',
  snapDuration: '00:30:00',
  slotLabelInterval: '00:30:00',

  eventDisplay: 'block',
  displayEventTime: false,

  eventOverlap: false,
  slotEventOverlap: false,

  events: [],

  eventContent: (arg) => this.renderEvent(arg),

  eventClick: (info) => this.openBookingDetails(info)
};

ngOnInit(): void {

  this.selectedDoctor = this.doctors[0];

  this.calendarOptions = {
    ...this.calendarOptions,

    slotMinTime: `${this.selectedDoctor.startTime}:00`,

    slotMaxTime: `${this.selectedDoctor.endTime}:00`,

    slotDuration: this.formatDuration(
      this.selectedDoctor.sessionDuration
    ),

    snapDuration: this.formatDuration(
      this.selectedDoctor.sessionDuration
    ),

    slotLabelInterval: this.formatDuration(
      this.selectedDoctor.sessionDuration
    ),

    events: this.generateAppointments()
  };
}

  // ==============================
  // Doctor Selection
  // ==============================

 selectDoctor(doctor: Doctor): void {

  this.selectedDoctor = doctor;

  const duration = this.formatDuration(
    doctor.sessionDuration
  );

  // Update working hours and session duration
  this.calendarOptions = {
    ...this.calendarOptions,

    slotMinTime: `${doctor.startTime}:00`,
    slotMaxTime: `${doctor.endTime}:00`,

    slotDuration: duration,
    snapDuration: duration,
    slotLabelInterval: duration,

    events: this.generateAppointments()
  };

  // Close old popup
  this.closeBookingDetails();
}

  // ==============================
  // Generate Appointments
  // ==============================

generateAppointments(): EventInput[] {

  if (!this.selectedDoctor) {
    return [];
  }

  const doctor = this.selectedDoctor;

  const slots = this.generateTimeSlots(
    doctor.startTime,
    doctor.endTime,
    doctor.sessionDuration
  );

  const currentDate = this.formatDate(new Date());

  const events: EventInput[] = [];

  slots.forEach((slot, index) => {

    const appointment = doctor.bookedSlots.find(
      x => x.startTime === slot
    );

    const startDate = `${currentDate}T${slot}:00`;

    const endDate = this.addMinutes(
      startDate,
      doctor.sessionDuration
    );

    if (appointment) {

      events.push({
        id: `appointment-${appointment.id}`,

        title: appointment.patientName,

        start: startDate,
        end: endDate,

        classNames: [
          `event-${appointment.status}`
        ],

        extendedProps: {
          type: 'appointment',
          appointment: appointment
        }
      });

    } else {

      events.push({
        id: `available-${doctor.id}-${index}`,

        title: 'متاح',

        start: startDate,
        end: endDate,

        classNames: [
          'event-available'
        ],

        extendedProps: {
          type: 'available',
          startTime: slot
        }
      });

    }

  });

  return events;
}

  // ==============================
  // Generate Time Slots
  // ==============================

  generateTimeSlots(
    startTime: string,
    endTime: string,
    duration: number
  ): string[] {

    const slots: string[] = [];

    const start = this.convertTimeToMinutes(startTime);

    const end = this.convertTimeToMinutes(endTime);

    for (
      let current = start;
      current + duration <= end;
      current += duration
    ) {

      const hours = Math.floor(current / 60);

      const minutes = current % 60;

      const time =
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}`;

      slots.push(time);
    }

    return slots;
  }

  // ==============================
  // Render Calendar Event
  // ==============================

  renderEvent(info: EventContentArg): { domNodes: HTMLElement[] } {

    const props = info.event.extendedProps;

    const card = document.createElement('div');

    card.className = 'appointment-card';

    if (props['type'] === 'available') {

      const title = document.createElement('div');

      title.className = 'appointment-available-title';

      title.textContent = '● موعد متاح';

      const time = document.createElement('div');

      time.className = 'appointment-service';

      time.textContent = info.event.start
        ? this.formatTime(info.event.start)
        : '';

      card.appendChild(title);

      card.appendChild(time);

      return {
        domNodes: [card]
      };
    }

    const appointment = props['appointment'] as Appointment;

    if (!appointment) {
      return {
        domNodes: [card]
      };
    }

    // Patient information
    const patientTop = document.createElement('div');

    patientTop.className = 'patient-card-top';

    // Patient image
    const avatar = document.createElement('img');

    avatar.className = 'patient-avatar';

    avatar.src =
      appointment.patientImage ||
      'assets/images/default-user.png';

    avatar.alt = 'Patient';



    // Patient name
    const name = document.createElement('div');

    name.className = 'patient-name';

    name.textContent = appointment.patientName;

    patientTop.appendChild(avatar);

    patientTop.appendChild(name);

    // Service
    const service = document.createElement('div');

    service.className = 'appointment-service';

    service.textContent = appointment.serviceName;

    // Status
    const status = document.createElement('div');

    status.className = 'appointment-status-badge';

    status.textContent = this.getStatusName(
      appointment.status
    );

    // Time
    const time = document.createElement('div');

    time.className = 'appointment-time';

    time.textContent = appointment.startTime;

    card.appendChild(patientTop);

    card.appendChild(service);

    card.appendChild(status);

    card.appendChild(time);

    return {
      domNodes: [card]
    };
  }

  // ==============================
  // Booking Details Modal
  // ==============================

  openBookingDetails(info: EventClickArg): void {

    const props = info.event.extendedProps;

    if (props['type'] === 'available') {

      // يمكنك لاحقاً فتح Modal إنشاء حجز جديد هنا
      return;
    }

    this.selectedAppointment =
      props['appointment'] as Appointment;

    this.isDetailsModalOpen = true;
  }

  closeBookingDetails(): void {

    this.isDetailsModalOpen = false;

    this.selectedAppointment = null;
  }

  // ==============================
  // Status Helpers
  // ==============================

  getStatusName(status: AppointmentStatus): string {

    const statuses: Record<AppointmentStatus, string> = {
      confirmed: 'مؤكد',
      pending: 'قيد الانتظار',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };

    return statuses[status];
  }

  getStatusClass(status: AppointmentStatus): string {

    return `status-${status}`;
  }

  // ==============================
  // Date / Time Helpers
  // ==============================

  convertTimeToMinutes(time: string): number {

    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
  }

  formatDuration(minutes: number): string {

    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;

    return (
      `${String(hours).padStart(2, '0')}:` +
      `${String(remainingMinutes).padStart(2, '0')}:00`
    );
  }

  addMinutes(dateTime: string, minutes: number): string {

    const date = new Date(dateTime);

    date.setMinutes(date.getMinutes() + minutes);

    return (
      `${this.formatDate(date)}T` +
      `${String(date.getHours()).padStart(2, '0')}:` +
      `${String(date.getMinutes()).padStart(2, '0')}:00`
    );
  }

  formatDate(date: Date): string {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  formatTime(date: Date): string {

    return (
      `${String(date.getHours()).padStart(2, '0')}:` +
      `${String(date.getMinutes()).padStart(2, '0')}`
    );
  }
get totalCount(): number {
  return this.selectedDoctor?.bookedSlots?.length ?? 0;
}

get confirmedCount(): number {
  return this.selectedDoctor?.bookedSlots
    ?.filter(x => x.status === 'confirmed').length ?? 0;
}

get pendingCount(): number {
  return this.selectedDoctor?.bookedSlots
    ?.filter(x => x.status === 'pending').length ?? 0;
}

get completedCount(): number {
  return this.selectedDoctor?.bookedSlots
    ?.filter(x => x.status === 'completed').length ?? 0;
}
}
