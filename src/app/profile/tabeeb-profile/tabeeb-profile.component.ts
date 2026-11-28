import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TabeebProfileService } from './services/tabeeb-profile.service';
import {
  ClinicDoctorDto,
  ClinicDoctorWorktimeDto,
  ClinicDtoWithEvaluation,
  SubscriptionPackageDto,
  TabeebProfileDto
} from '../clinic-profile/models/TabeebProfileDto.model';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CurrentUserService } from 'src/app/common/services/current-user.service';
import { LoginService } from 'src/app/auth/login/Services/login.service';
import { Store } from '@ngrx/store';
import { AppService } from 'src/app/app.service';

export interface ScreenshotItem {
  id: number;
  title: string;
  desc: string;
  tag: string;
  image: string;
}

@Component({
  selector: 'app-tabeeb-profile',

  templateUrl: './tabeeb-profile.component.html',
  styleUrl: './tabeeb-profile.component.css'
})
export class TabeebProfileComponent implements OnInit {

  private profileService = inject(TabeebProfileService);
  protected TranslateServ=inject(TranslateService)
  private route=inject(Router)
  private storeData=inject(Store<any>)
  private currentUser=inject(CurrentUserService)
  private loginServ=inject(LoginService)
  private eRef=inject(ElementRef)
  private appSetting=inject(AppService)
  profile: TabeebProfileDto | null = null;
  mobileMenuOpen = false;
  isLoading = true;
  errorMessage = '';

  // Modal مواعيد الدكتور
  selectedDoctor: ClinicDoctorDto | null = null;
  showWorktimeModal = false;

  // فهارس السلايدرز الموحدة
  screenshotSlideIndex = 0;
  clinicSlideIndex = 0;
  doctorSlideIndex = 0;
  packageSlideIndex = 0;
  testimonialSlideIndex = 0;

  // فلترة الأطباء حسب العيادة
  selectedDoctorClinicFilter: string = 'ALL';

private readonly arabicScreenshots: ScreenshotItem[] = [
  {
    id: 1,
    title: 'لوحة التحكم التحليلية',
    desc: 'متابعة لحظية للإحصائيات، الإيرادات، ومواعيد اليوم في واجهة واحدة.',
    tag: 'إحصائيات حية',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'جدولة المواعيد الذكية',
    desc: 'تنظيم حجوزات المرضى وتنبيهات المواعيد بدون تعارض.',
    tag: 'حجز سريع',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'السجل الطبي والمرضى',
    desc: 'ملف طبي متكامل لكل مريض يتضمن الزيارات والتشخيصات والوصفات.',
    tag: 'سجلات آمنة',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'إدارة الفواتير والتقارير',
    desc: 'إصدار الفواتير ومراجعة تقارير الأداء المالي بضغطة زر.',
    tag: 'تقارير مالية',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=80'
  }
];

private readonly englishScreenshots: ScreenshotItem[] = [
  {
    id: 1,
    title: 'Analytics Dashboard',
    desc: 'Real-time tracking of stats, revenue, and daily appointments in one interface.',
    tag: 'Live Stats',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Smart Appointment Scheduling',
    desc: 'Organize patient bookings and appointment reminders with zero conflicts.',
    tag: 'Fast Booking',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Medical Records & Patients',
    desc: 'Complete medical profile for every patient including visits, diagnoses, and prescriptions.',
    tag: 'Secure Records',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Invoices & Reports',
    desc: 'Issue invoices and review financial performance reports in a single click.',
    tag: 'Financial Reports',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=80'
  }
];

private readonly arabicTestimonials = [
  {
    id: 1,
    name: 'د. أحمد علي',
    role: 'مدير عيادة النور',
    comment: 'منصة رائعة وسهلة الاستخدام، ساعدتنا في تنظيم المواعيد والمرضى بشكل كبير.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'د. سارة محمد',
    role: 'مديرة مجمع الحياة الطبي',
    comment: 'دعم فني ممتاز وتجربة احترافية بكل المقاييس مع وضوح كامل في التقارير.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'د. خالد محمود',
    role: 'استشاري باطنة',
    comment: 'أفضل نظام لإدارة العيادات، يختصر وقت الاستقبال ويجعل متابعة الحالات أسهل.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'د. نورة العتيبي',
    role: 'مديرة مركز الابتسامة',
    comment: 'واجهة عربية أنيقة وسريعة، وفريق العمل تعامل مع النظام من أول يوم.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&auto=format&fit=crop&q=80'
  }
];

private readonly englishTestimonials = [
  {
    id: 1,
    name: 'Dr. Ahmed Ali',
    role: 'Director, Al-Noor Clinic',
    comment: 'A great, easy-to-use platform that helped us organize appointments and patients significantly.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Dr. Sara Mohamed',
    role: 'Director, Al-Hayah Medical Complex',
    comment: 'Excellent technical support and a professional experience across the board with crystal-clear reports.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Dr. Khaled Mahmoud',
    role: 'Internal Medicine Consultant',
    comment: 'The best clinic management system—it saves reception time and makes patient follow-up much easier.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Dr. Nora Al-Otaibi',
    role: 'Director, Al-Ibtisamah Center',
    comment: 'A sleek, fast interface, and our team adapted to the system from day one.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&auto=format&fit=crop&q=80'
  }
];

get isAe(): boolean {
  const current = this.TranslateServ.currentLang || this.TranslateServ.getDefaultLang() || 'ae';
  return current.toLowerCase().startsWith('ae');
}

get screenshots(): ScreenshotItem[] {
  return this.isAe ? this.arabicScreenshots : this.englishScreenshots;
}

get testimonials() {
  return this.isAe ? this.arabicTestimonials : this.englishTestimonials;
}
  store: any;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.getTabeebProfileInfo().subscribe({
      next: (response:any) => {
        this.profile = response.data;
        this.screenshotSlideIndex = 0;
        this.clinicSlideIndex = 0;
        this.doctorSlideIndex = 0;
        this.packageSlideIndex = 0;
        this.testimonialSlideIndex = 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Tabeeb profile:', error);
        this.errorMessage = 'حدث خطأ أثناء تحميل بيانات المنصة';
        this.isLoading = false;
      }
    });
  }

  // ===== دالة موحدة لعرض 3 بطاقات لكل سلايدر =====
  private getWindowItems<T>(items: T[], startIndex: number, count = 3): T[] {
    if (!items || items.length === 0) return [];
    if (items.length <= count) return items;

    const result: T[] = [];
    for (let i = 0; i < count; i++) {
      result.push(items[(startIndex + i) % items.length]);
    }
    return result;
  }

  // 1) سلايدر اللقطات
  get visibleScreenshots(): ScreenshotItem[] {
    return this.getWindowItems(this.screenshots, this.screenshotSlideIndex, 3);
  }
  goToScreenshotSlide(index: number): void {
    this.screenshotSlideIndex = index;
  }

 
  get visibleClinics(): ClinicDtoWithEvaluation[] {
    return this.getWindowItems(this.clinicsList, this.clinicSlideIndex, 3);
  }
  goToClinicSlide(index: number): void {
    this.clinicSlideIndex = index;
  }
  getClinicRating(clinic: ClinicDtoWithEvaluation | null | undefined): string {
    if (!clinic) return '5.0';
    const c = clinic as unknown as Record<string, unknown>;
    const score = c['evaluation'] ?? c['rate'];
    return score !== undefined && score !== null && score !== '' ? String(score) : '5.0';
  }



 

  get visibleDoctors(): ClinicDoctorDto[] {
    return this.getWindowItems(this.filteredDoctors, this.doctorSlideIndex, 3);
  }

  selectDoctorClinicFilter(clinicName: string): void {
    this.selectedDoctorClinicFilter = clinicName;
    this.doctorSlideIndex = 0;
  }
  gotoclinic(id:number){

    this.route.navigateByUrl(`/Profile/Clinic/${id}`)
  }

  goToDoctorSlide(index: number): void {
    this.doctorSlideIndex = index;
  }

  // 4) سلايدر الباقات (profile.subscriptionPackages)
  get packagesList(): SubscriptionPackageDto[] {
    return this.profile?.subscriptionPackages ?? [];
  }
  get visiblePackages(): SubscriptionPackageDto[] {
    return this.getWindowItems(this.packagesList, this.packageSlideIndex, 3);
  }
  goToPackageSlide(index: number): void {
    this.packageSlideIndex = index;
  }
  isPopularPackage(index: number): boolean {
    if (this.packagesList.length >= 3) {
      return index === 1;
    }
    return index === 0;
  }

  // 5) سلايدر آراء العملاء
  get visibleTestimonials() {
    return this.getWindowItems(this.testimonials, this.testimonialSlideIndex, 3);
  }
  goToTestimonialSlide(index: number): void {
    this.testimonialSlideIndex = index;
  }

  // ===== Modal مواعيد الدكتور =====
  openWorktimes(doctor: ClinicDoctorDto): void {
    this.selectedDoctor = doctor;
    this.showWorktimeModal = true;
  }

  closeWorktimes(): void {
    this.showWorktimeModal = false;
    this.selectedDoctor = null;
  }

  getDayName(day: number): string {

    if(this.TranslateServ.currentLang=="ae"){
 const days = [
      'الأحد',
      'الإثنين',
      'الثلاثاء',
      'الأربعاء',
      'الخميس',
      'الجمعة',
      'السبت'
    ];


    return days[day] ?? 'غير محدد';
    }else{
      const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'wednesday',
      'Thrusday',
      'Friday',
      'Saturday'
    ];


    return days[day] ?? 'غير محدد';
    }
   
  }

  formatTime(time: string): string {
    if (!time) return '--:--';
    const [hours, minutes] = time.split(':');
    const hour = Number(hours);
    const period = hour >= 12 ? 'مساءً' : 'صباحاً';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  }

  getDoctorWorktimes(doctor: ClinicDoctorDto | null): ClinicDoctorWorktimeDto[] {
    return doctor?.worktimeDtos ?? [];
  }

  getDoctorInitials(doctor: ClinicDoctorDto | null): string {
    if (!doctor) return 'ط';
    const name = doctor.arName || doctor.enName || 'ط';
    return name.trim().charAt(0);
  }

  getClinicImage(path?: string | null): string {
    if (!path) {
      return 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&auto=format&fit=crop&q=80';
    }
    if (path.startsWith('http')) return path;
    return `${environment.ServerUrl.replace('/api', '')}/${path.replace(/^\/+/, '')}`;
  }

  getDoctorImage(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.ImageServer}/${path}`;
  }

  selectPlan(pkg: SubscriptionPackageDto): void {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // نصوص البحث الفوري للعيادات والأطباء
  clinicSearchQuery: string = '';
  doctorSearchQuery: string = '';

  onClinicSearchChange(value: string): void {
    this.clinicSearchQuery = value;
    this.clinicSlideIndex = 0;
  }

  onDoctorSearchChange(value: string): void {
    this.doctorSearchQuery = value;
    this.doctorSlideIndex = 0;
  }

  clearClinicFilters(): void {
    this.clinicSearchQuery = '';
    this.clinicSlideIndex = 0;
  }

  clearDoctorFilters(): void {
    this.doctorSearchQuery = '';
    this.selectedDoctorClinicFilter = 'ALL';
    this.doctorSlideIndex = 0;
  }

  // 2) سلايدر العيادات (profile.clinics + بحث)
  get clinicsList(): ClinicDtoWithEvaluation[] {
    const all = this.profile?.clinics ?? [];
    const q = this.clinicSearchQuery.trim().toLowerCase();
    if (!q) return all;

    return all.filter((c) => {
      const arName = (c.arName ?? '').toLowerCase();
      const enName = (c.enName ?? '').toLowerCase();
      const cityAr = (c.cityArName ?? '').toLowerCase();
      const cityEn = (c.cityEnName ?? '').toLowerCase();
      const countryAr = (c.countryArName ?? '').toLowerCase();
      const countryEn = (c.countryEnName ?? '').toLowerCase();

      return (
        arName.includes(q) ||
        enName.includes(q) ||
        cityAr.includes(q) ||
        cityEn.includes(q) ||
        countryAr.includes(q) ||
        countryEn.includes(q)
      );
    });
  }

  // 3) سلايدر الأطباء (profile.doctors + فلترة العيادة + بحث)
  get doctorsList(): ClinicDoctorDto[] {
    return this.profile?.doctors ?? [];
  }

  get clinicFilterOptions(): string[] {
    const names = this.doctorsList
      .map((d) => d.clinicArName || d.clinicEnName)
      .filter((n): n is string => !!n);
    return Array.from(new Set(names));
  }

  get filteredDoctors(): ClinicDoctorDto[] {
    const q = this.doctorSearchQuery.trim().toLowerCase();

    return this.doctorsList.filter((d) => {
      const clinicLabel = d.clinicArName || d.clinicEnName || '';
      const matchesClinic =
        this.selectedDoctorClinicFilter === 'ALL' ||
        clinicLabel === this.selectedDoctorClinicFilter;

      if (!matchesClinic) return false;
      if (!q) return true;

      const docAr = (d.arName ?? '').toLowerCase();
      const docEn = (d.enName ?? '').toLowerCase();
      const specAr = (d.specializationArName ?? '').toLowerCase();
      const specEn = (d.specializationEnName ?? '').toLowerCase();
      const clinicAr = (d.clinicArName ?? '').toLowerCase();
      const clinicEn = (d.clinicEnName ?? '').toLowerCase();

      return (
        docAr.includes(q) ||
        docEn.includes(q) ||
        specAr.includes(q) ||
        specEn.includes(q) ||
        clinicAr.includes(q) ||
        clinicEn.includes(q)
      );
    });
  }

  goToLogin() {
  const currentUrl = this.route.url; // مثال: '/clinic/profile' أو '/site/profile'
  this.route.navigate(['/Login'], {
    queryParams: { returnUrl: currentUrl }
  });
}

  userMenuOpen = false;

  // بنربطها مباشرة بالـ Observable من السيرفس
  currentUser$ = this.currentUser.isLoggedIn;

 
  goToProfile() {
    this.userMenuOpen = false;
    this.route.navigate(['/profile']); // عدّل المسار لصفحة الملف الشخصي عندك
  }

  logout() {
    this.userMenuOpen = false;
    this.loginServ.Logout();
  }

  // قفل الدروب داون لو المستخدم ضغط في أي مكان بره الهيدر
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.userMenuOpen = false;
    }
  }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });

            console.log(this.store.languageList);
            
    }
    changeLanguage(item: any) {
        this.TranslateServ.use(item);
        this.appSetting.toggleLanguage(item);
        if (this.store.locale?.toLowerCase() === 'ae') {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
        } else {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
        }
        window.location.reload();
    }

    toggleLanguage(lang:string){
      if(lang=="ae"){
        this.TranslateServ.use("en")
      }else{
        this.TranslateServ.use("ae")
      }
    }
}