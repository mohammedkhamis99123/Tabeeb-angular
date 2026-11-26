

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClinicProfileService } from './services/clinic-profile.service';
import { ClinicProfileDto, OfferDto } from './models/ClinicProfileDto.model';
import { ClinicDoctorDto } from './models/ClinicProfileDto.model';
import { environment } from 'src/environments/environment.prod';



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
 clinic!:ClinicProfileDto
 doctors:ClinicDoctorDto[]=[]
  offers: OfferDto[]=[]
  constructor(private fb: FormBuilder,
    private clinicProfile:ClinicProfileService,
    private actRoute:ActivatedRoute
  ) {

actRoute.paramMap.subscribe((result)=>{
  this.loadClinic( parseInt(result.get("id")!))
})
    
  }
  loadClinic(id: number) {
    this.clinicProfile.getClinicProfile(id).subscribe((result:any)=>{
      this.clinic=result.data;
      this.clinic.logoPath=environment.ImageServer+"/"+this.clinic.logoPath
       this.clinic.bannerPath=environment.ImageServer+"/"+this.clinic.bannerPath

      this.doctors=this.clinic.doctors;
      this.doctors.map((doc:any)=>{
       doc.imagePath=environment.ImageServer+"/"+doc.imagePath
      })
      this.offers=this.clinic.offers
    })
  }

  // Clinic Information

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


  // Booking
  currentStep = 1;

  selectedDoctor: ClinicDoctorDto | null = null;
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

  selectDoctor(doctor: ClinicDoctorDto): void {


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

  isArabic = true;
isMobileMenuOpen = false;

toggleLanguage(): void {
  this.isArabic = !this.isArabic;
  document.documentElement.dir = this.isArabic ? 'rtl' : 'ltr';
  document.documentElement.lang = this.isArabic ? 'ar' : 'en';
}

toggleMobileMenu(): void {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

closeMobileMenu(): void {
  this.isMobileMenuOpen = false;
}

onLoginClick(): void {
  // مثال: this.router.navigate(['/auth/login']); أو فتح Login Modal
  console.log('Navigate to login');
}

cleanHandle(handle: string | null | undefined): string {
  return (handle ?? '').trim().replace(/^@+/, '');
}

cleanWhatsapp(phone: string | null | undefined): string {
  const digits = (phone ?? '').replace(/\D+/g, '');
  if (digits.startsWith('00')) {
    return digits.slice(2);
  }
  if (digits.startsWith('05') && digits.length === 10) {
    return '966' + digits.slice(1);
  }
  return digits;
}
}