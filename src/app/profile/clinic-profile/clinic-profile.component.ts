

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  available: boolean;
}

interface GalleryImage {
  url: string;
  alt: string;
}

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  initials: string;
}

interface Offer {
  id: number;
  title: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
  icon: string;
  validity: string;
}

interface BookingDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  monthName: string;
}

@Component({
  selector: 'app-clinic-profile',

  templateUrl: './clinic-profile.component.html',
  styleUrl: './clinic-profile.component.scss'
})
export class ClinicProfileComponent implements OnInit {

  constructor(private fb: FormBuilder) {}

  // Clinic Information
  clinic = {
    name: 'عيادات النور التخصصية',
    description:
      'نقدم لكم رعاية طبية متكاملة بأحدث الأجهزة والتقنيات الطبية، من خلال نخبة من الأطباء المتخصصين.',
    address: 'شارع الجمهورية، دمنهور، البحيرة',
    phone: '01012345678',
    email: 'info@clinic.com',
    rating: 4.9,
    reviewsCount: 1250,
    doctorsCount: 12,
    patientsCount: 8500,
    workingHours: 'يومياً من 10 صباحاً حتى 10 مساءً',
    locationUrl: 'https://maps.google.com/?q=Damanhur,Egypt'
  };

  // Gallery
  galleryImages: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000',
      alt: 'استقبال العيادة'
    },
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      alt: 'غرفة الانتظار'
    },
    {
      url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
      alt: 'غرفة الكشف'
    },
    {
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
      alt: 'الأجهزة الطبية'
    },
    {
      url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800',
      alt: 'الممر الداخلي'
    }
  ];

  selectedGalleryImage: string | null = null;

  // Doctors
  doctors: Doctor[] = [
    {
      id: 1,
      name: 'د. أحمد محمد',
      specialty: 'استشاري طب الأطفال',
      experience: 12,
      rating: 4.9,
      reviews: 240,
      price: 250,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500',
      available: true
    },
    {
      id: 2,
      name: 'د. سارة محمود',
      specialty: 'استشاري أمراض النساء',
      experience: 9,
      rating: 4.8,
      reviews: 185,
      price: 300,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500',
      available: true
    },
    {
      id: 3,
      name: 'د. محمد علي',
      specialty: 'أخصائي الباطنة',
      experience: 8,
      rating: 4.7,
      reviews: 160,
      price: 200,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500',
      available: true
    },
    {
      id: 4,
      name: 'د. منى إبراهيم',
      specialty: 'استشاري طب الأسنان',
      experience: 11,
      rating: 5.0,
      reviews: 310,
      price: 350,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500',
      available: true
    }
  ];

  // Reviews
  reviews: Review[] = [
    {
      id: 1,
      name: 'مريم أحمد',
      date: 'منذ يومين',
      rating: 5,
      comment: 'تجربة ممتازة، المكان نظيف جداً والتعامل راقٍ، والدكتور مهتم بكل التفاصيل.',
      initials: 'م أ'
    },
    {
      id: 2,
      name: 'أحمد خالد',
      date: 'منذ أسبوع',
      rating: 5,
      comment: 'من أفضل العيادات التي تعاملت معها. الحجز سهل والانتظار قليل.',
      initials: 'أ خ'
    },
    {
      id: 3,
      name: 'نور محمد',
      date: 'منذ أسبوعين',
      rating: 4,
      comment: 'فريق طبي محترم وخدمة ممتازة، بالتأكيد سأكرر الزيارة.',
      initials: 'ن م'
    }
  ];

  // Offers
  offers: Offer[] = [
    {
      id: 1,
      title: 'باقة الفحص الشامل',
      description: 'مجموعة من الفحوصات الأساسية للاطمئنان على صحتك.',
      oldPrice: 800,
      newPrice: 550,
      discount: 31,
      icon: '🩺',
      validity: 'لفترة محدودة'
    },
    {
      id: 2,
      title: 'خصم الكشف الأول',
      description: 'احصل على خصم خاص عند أول زيارة للعيادة.',
      oldPrice: 300,
      newPrice: 200,
      discount: 33,
      icon: '💙',
      validity: 'للمرضى الجدد'
    },
    {
      id: 3,
      title: 'باقة متابعة الأسرة',
      description: 'استشارات ومتابعة طبية لجميع أفراد الأسرة.',
      oldPrice: 1000,
      newPrice: 750,
      discount: 25,
      icon: '👨‍👩‍👧‍👦',
      validity: 'لفترة محدودة'
    }
  ];

  // Booking
  currentStep = 1;

  selectedDoctor: Doctor | null = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;

  bookingDays: BookingDay[] = [];
  availableTimes: string[] = [
    '10:00 ص',
    '10:30 ص',
    '11:00 ص',
    '11:30 ص',
    '12:00 م',
    '12:30 م',
    '01:00 م',
    '02:00 م',
    '03:00 م',
    '04:00 م',
    '05:00 م',
    '06:00 م'
  ];

  patientForm!: FormGroup;
  bookingConfirmed = false;
  bookingNumber = '';

  ngOnInit(): void {
    this.initializePatientForm();
    this.generateBookingDays();
  }

  initializePatientForm(): void {
    this.patientForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/)
      ]],
      age: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(120)
      ]],
      gender: ['', Validators.required],
      notes: ['', Validators.maxLength(500)]
    });
  }

  generateBookingDays(): void {
    const today = new Date();

    this.bookingDays = Array.from({ length: 10 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);

      return {
        date,
        dayName: date.toLocaleDateString('ar-EG', {
          weekday: 'long'
        }),
        dayNumber: date.getDate(),
        monthName: date.toLocaleDateString('ar-EG', {
          month: 'short'
        })
      };
    });
  }

  selectDoctor(doctor: Doctor): void {
    if (!doctor.available) return;

    this.selectedDoctor = doctor;

    // الانتقال لخطوة اختيار الموعد
    this.currentStep = 2;
  }

  selectDate(day: BookingDay): void {
    this.selectedDate = day.date;
    this.selectedTime = null;
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.selectedDoctor) return;
      this.currentStep = 2;
      return;
    }

    if (this.currentStep === 2) {
      if (!this.selectedDate || !this.selectedTime) return;
      this.currentStep = 3;
      return;
    }

    if (this.currentStep === 3) {
      this.submitBooking();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1 && this.currentStep < 4) {
      this.currentStep--;
    }
  }

  submitBooking(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    if (!this.selectedDoctor || !this.selectedDate || !this.selectedTime) {
      return;
    }

    // هذه بيانات تجريبية لحين ربط الـ API
    this.bookingNumber = 'TB-' + Date.now().toString().slice(-8);
    this.bookingConfirmed = true;
    this.currentStep = 4;

    const bookingData = {
      doctorId: this.selectedDoctor.id,
      appointmentDate: this.selectedDate,
      appointmentTime: this.selectedTime,
      patient: this.patientForm.value
    };

    console.log('Booking data:', bookingData);

    // هنا يتم استدعاء Booking Service وإرسال البيانات للـ API
  }

  resetBooking(): void {
    this.currentStep = 1;
    this.selectedDoctor = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.bookingConfirmed = false;
    this.bookingNumber = '';
    this.patientForm.reset();
  }

  get fullNameControl() {
    return this.patientForm.get('fullName');
  }

  get phoneControl() {
    return this.patientForm.get('phone');
  }

  get ageControl() {
    return this.patientForm.get('age');
  }

  get genderControl() {
    return this.patientForm.get('gender');
  }

  openGallery(image: string): void {
    this.selectedGalleryImage = image;
  }

  closeGallery(): void {
    this.selectedGalleryImage = null;
  }

  scrollToBooking(): void {
    document.getElementById('booking')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  scrollToDoctors(): void {
    document.getElementById('doctors')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}