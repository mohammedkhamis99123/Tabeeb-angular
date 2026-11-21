
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexMarkers, NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexGrid,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive
} from 'ng-apexcharts';

type DashboardChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  labels?: string[];
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  fill?: ApexFill;
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  colors?: string[];
  responsive?: ApexResponsive[];
};

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-index.component.html',
  styleUrl: './super-admin-index.component.css'
})
export class SuperAdminDashboardComponent {
  activePage = 'Dashboard';
  selectedPeriod = '7 Days';
  isSidebarOpen = false;

  // =========================
  // Navigation
  // =========================

  menuItems = [
    { title: 'Dashboard', icon: 'fa-chart-pie' },
    { title: 'Clinics', icon: 'fa-hospital' },
    { title: 'Doctors', icon: 'fa-user-doctor' },
    { title: 'Patients', icon: 'fa-users' },
    { title: 'Appointments', icon: 'fa-calendar-check' },
    { title: 'Subscriptions', icon: 'fa-credit-card' },
    { title: 'Payments', icon: 'fa-money-bill-wave' },
    { title: 'Reports', icon: 'fa-chart-line' }
  ];

  // =========================
  // Statistics
  // =========================

  stats = [
    {
      title: 'Total Clinics',
      value: '248',
      change: '+12.8%',
      description: 'Compared to last month',
      icon: 'fa-hospital',
      color: 'purple'
    },
    {
      title: 'Total Doctors',
      value: '1,842',
      change: '+8.4%',
      description: 'Compared to last month',
      icon: 'fa-user-doctor',
      color: 'blue'
    },
    {
      title: 'Total Patients',
      value: '24,580',
      change: '+18.2%',
      description: 'Compared to last month',
      icon: 'fa-users',
      color: 'green'
    },
    {
      title: 'Appointments',
      value: '8,429',
      change: '+10.5%',
      description: 'Compared to last month',
      icon: 'fa-calendar-check',
      color: 'orange'
    }
  ];

  // =========================
  // Revenue
  // =========================

  revenueChart: DashboardChartOptions = {
    series: [
      {
        name: 'Revenue',
        data: [3200, 4800, 3700, 5900, 4400, 6800, 8200]
      }
    ],
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, speed: 800 }
    },
    colors: ['#7068ed'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
        formatter: (value: number) =>
          `SAR ${value.toLocaleString()}`
      }
    }
  };

  // =========================
  // Clinic Growth
  // =========================

  clinicGrowthChart: DashboardChartOptions = {
    series: [
      {
        name: 'New Clinics',
        data: [12, 18, 15, 25, 21, 32, 38, 35, 48, 52, 61, 68]
      }
    ],
    chart: {
      type: 'line',
      height: 260,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#18B981'],
    stroke: {
      curve: 'smooth',
      width: 3
    },

    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
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
        formatter: (value: number) => `${value} clinics`
      }
    }
  };

  // =========================
  // Subscription Distribution
  // =========================

  subscriptionChart: DashboardChartOptions = {
    series: [125, 85, 38],
    chart: {
      type: 'donut',
      height: 280,
      fontFamily: 'Inter, sans-serif'
    },
    labels: ['Active', 'Trial', 'Expired'],
    colors: ['#7068ed', '#18B981', '#F59E0B'],
    legend: {
      position: 'bottom',
      fontSize: '13px',
      labels: { colors: '#667085' }
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => '248'
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} clinics`
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 250 },
          legend: { position: 'bottom' }
        }
      }
    ]
  };

  // =========================
  // Monthly Appointments
  // =========================

  appointmentsChart: DashboardChartOptions = {
    series: [
      {
        name: 'Appointments',
        data: [420, 580, 490, 720, 650, 890, 760, 980, 850, 1100, 960, 1250]
      }
    ],
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#4F7DF3'],
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '45%'
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
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
        formatter: (value: number) =>
          `${value.toLocaleString()} appointments`
      }
    }
  };

  // =========================
  // Recent Clinics
  // =========================

  clinics = [
    {
      name: 'Al Noor Medical Center',
      location: 'Riyadh, Saudi Arabia',
      doctors: 18,
      patients: 1240,
      status: 'Active',
      plan: 'Premium',
      initials: 'AN'
    },
    {
      name: 'Al Hayat Clinic',
      location: 'Jeddah, Saudi Arabia',
      doctors: 12,
      patients: 980,
      status: 'Active',
      plan: 'Standard',
      initials: 'AH'
    },
    {
      name: 'Elite Care Center',
      location: 'Dammam, Saudi Arabia',
      doctors: 24,
      patients: 2100,
      status: 'Pending',
      plan: 'Premium',
      initials: 'EC'
    },
    {
      name: 'Royal Medical Clinic',
      location: 'Riyadh, Saudi Arabia',
      doctors: 8,
      patients: 650,
      status: 'Inactive',
      plan: 'Basic',
      initials: 'RM'
    }
  ];

  // =========================
  // Activities
  // =========================

  activities = [
    {
      title: 'New clinic registered',
      description: 'Al Noor Medical Center joined Tabeeb',
      time: '5 minutes ago',
      icon: 'fa-hospital',
      color: 'purple'
    },
    {
      title: 'New subscription payment',
      description: 'Premium plan payment received',
      time: '25 minutes ago',
      icon: 'fa-credit-card',
      color: 'green'
    },
    {
      title: 'New doctor registered',
      description: 'Dr. Ahmed joined Al Hayat Clinic',
      time: '1 hour ago',
      icon: 'fa-user-doctor',
      color: 'blue'
    },
    {
      title: 'Subscription expired',
      description: 'Royal Medical Clinic subscription expired',
      time: '3 hours ago',
      icon: 'fa-clock',
      color: 'orange'
    }
  ];

  // =========================
  // Top Clinics
  // =========================

  topClinics = [
    { name: 'Al Noor Medical Center', appointments: 1240, percentage: 92 },
    { name: 'Elite Care Center', appointments: 1080, percentage: 82 },
    { name: 'Al Hayat Clinic', appointments: 890, percentage: 68 },
    { name: 'Royal Medical Clinic', appointments: 650, percentage: 48 }
  ];

  // =========================
  // Actions
  // =========================

  setActivePage(page: string): void {
    this.activePage = page;
    this.isSidebarOpen = false;
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  exportReport(): void {
    const headers = [
      'Clinic',
      'Location',
      'Doctors',
      'Patients',
      'Status',
      'Plan'
    ];

    const rows = this.clinics.map(clinic => [
      clinic.name,
      clinic.location,
      clinic.doctors,
      clinic.patients,
      clinic.status,
      clinic.plan
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'tabeeb-dashboard-report.csv';
    link.click();

    URL.revokeObjectURL(url);
  }
}
