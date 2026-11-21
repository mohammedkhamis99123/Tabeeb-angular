
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-clinic-dashboard',

  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class ClinicDashboardComponent implements OnInit {

  clinicId: number | null = null;
  clinicName = 'My Clinic';
  selectedPeriod = 'This Week';

  today=new Date();

  ngOnInit(): void {
    this.loadSelectedClinic();
  }

  // Read selected clinic from sessionStorage
  private loadSelectedClinic(): void {
    const storedClinic =
      sessionStorage.getItem('SelectedClinic') ||
      sessionStorage.getItem('Celectedclinic');

    if (!storedClinic) {
      return;
    }

    try {
      const clinic = JSON.parse(storedClinic);

      if (typeof clinic === 'object' && clinic !== null) {
        this.clinicId =
          Number(clinic.clinicId ?? clinic.ClinicId ?? clinic.id ?? clinic.Id) || null;

        this.clinicName =
          clinic.enName ||
          clinic.EnName ||
          clinic.arName ||
          clinic.ArName ||
          clinic.name ||
          clinic.Name ||
          'My Clinic';
      } else {
        this.clinicId = Number(clinic) || null;
      }
    } catch {
      this.clinicId = Number(storedClinic) || null;
    }
  }

  // Statistics
  stats = [
    {
      title: "Today's Appointments",
      value: '42',
      change: '+12.5%',
      icon: 'fa-calendar-check',
      color: 'purple',
      note: 'Compared to yesterday'
    },
    {
      title: 'Total Patients',
      value: '1,240',
      change: '+8.2%',
      icon: 'fa-users',
      color: 'blue',
      note: 'Registered patients'
    },
    {
      title: 'Total Doctors',
      value: '18',
      change: '+2',
      icon: 'fa-user-doctor',
      color: 'green',
      note: 'Active doctors'
    },
    {
      title: "Today's Revenue",
      value: '8,450',
      suffix: 'SAR',
      change: '+15.3%',
      icon: 'fa-wallet',
      color: 'orange',
      note: 'Compared to yesterday'
    }
  ];

  // Revenue Area Chart
  revenueChart: any = {
    series: [{
      name: 'Revenue',
      data: [3200, 4800, 3900, 6200, 5100, 7400, 8450]
    }],
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, Arial, sans-serif'
    },
    colors: ['#6C63E8'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      labels: { style: { colors: '#98A2B3' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value / 1000}k`,
        style: { colors: '#98A2B3' }
      }
    },
    grid: {
      borderColor: '#EDF0F5',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (value: number) => `SAR ${value.toLocaleString()}`
      }
    }
  };

  // Appointment Status Donut Chart
  appointmentStatusChart: any = {
    series: [45, 28, 18, 9],
    chart: {
      type: 'donut',
      height: 290,
      fontFamily: 'Inter, Arial, sans-serif'
    },
    labels: ['Completed', 'Confirmed', 'Pending', 'Cancelled'],
    colors: ['#19B982', '#6C63E8', '#F5A623', '#F16B6B'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: { colors: '#667085' }
    },
    dataLabels: { enabled: false },
    stroke: { width: 3, colors: ['#fff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Appointments',
              formatter: () => '100'
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} appointments`
      }
    }
  };

  // Patients Growth Line Chart
  patientsChart: any = {
    series: [{
      name: 'New Patients',
      data: [35, 48, 42, 65, 58, 82, 95, 88, 110, 125, 118, 145]
    }],
    chart: {
      type: 'line',
      height: 270,
      toolbar: { show: false },
      fontFamily: 'Inter, Arial, sans-serif'
    },
    colors: ['#2196E8'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 4,
      hover: { size: 6 }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      labels: { style: { colors: '#98A2B3' } }
    },
    yaxis: {
      labels: { style: { colors: '#98A2B3' } }
    },
    grid: {
      borderColor: '#EDF0F5',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} patients`
      }
    }
  };

  // Monthly Appointments Bar Chart
  monthlyAppointmentsChart: any = {
    series: [{
      name: 'Appointments',
      data: [320, 450, 390, 520, 480, 610, 570, 720, 680, 850, 790, 920]
    }],
    chart: {
      type: 'bar',
      height: 270,
      toolbar: { show: false },
      fontFamily: 'Inter, Arial, sans-serif'
    },
    colors: ['#6C63E8'],
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '45%'
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      labels: { style: { colors: '#98A2B3' } }
    },
    yaxis: {
      labels: { style: { colors: '#98A2B3' } }
    },
    grid: {
      borderColor: '#EDF0F5',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} appointments`
      }
    }
  };

  // Today's Appointments
  appointments = [
    {
      patient: 'Ahmed Mohamed',
      doctor: 'Dr. Sara Ahmed',
      time: '09:00 AM',
      type: 'Consultation',
      status: 'Confirmed',
      initials: 'AM'
    },
    {
      patient: 'Mona Hassan',
      doctor: 'Dr. Omar Ali',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'Pending',
      initials: 'MH'
    },
    {
      patient: 'Khaled Samir',
      doctor: 'Dr. Ahmed Mostafa',
      time: '11:00 AM',
      type: 'Consultation',
      status: 'Completed',
      initials: 'KS'
    },
    {
      patient: 'Nour Adel',
      doctor: 'Dr. Sara Ahmed',
      time: '12:30 PM',
      type: 'Checkup',
      status: 'Confirmed',
      initials: 'NA'
    },
    {
      patient: 'Salma Tarek',
      doctor: 'Dr. Omar Ali',
      time: '02:00 PM',
      type: 'Follow-up',
      status: 'Cancelled',
      initials: 'ST'
    }
  ];

  // Top Doctors
  topDoctors = [
    {
      name: 'Dr. Sara Ahmed',
      specialty: 'Cardiology',
      appointments: 128,
      rating: 4.9,
      initials: 'SA',
      percentage: 95
    },
    {
      name: 'Dr. Omar Ali',
      specialty: 'Dermatology',
      appointments: 112,
      rating: 4.8,
      initials: 'OA',
      percentage: 85
    },
    {
      name: 'Dr. Ahmed Mostafa',
      specialty: 'Dentistry',
      appointments: 96,
      rating: 4.7,
      initials: 'AM',
      percentage: 73
    }
  ];

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
  }
}
