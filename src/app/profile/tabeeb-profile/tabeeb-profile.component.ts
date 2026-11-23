import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-tabeeb-profile',

  templateUrl: './tabeeb-profile.component.html',
  styleUrl: './tabeeb-profile.component.css'
})
export class TabeebProfileComponent {

 // بيانات الإحصائيات مع القيمة الرقمية النهائية واللاحقة (مثل + أو K)
  stats = [
    { label: 'عيادة نشطة', target: 250, current: 0, suffix: '+' },
    { label: 'طبيب واستشاري', target: 600, current: 0, suffix: '+' },
    { label: 'مريض مستفيد', target: 45, current: 0, suffix: 'K+' },
    { label: 'موعد مؤكد', target: 120, current: 0, suffix: 'K+' }
  ];

  @ViewChildren('statItem') statElements!: QueryList<ElementRef>;
  private hasAnimated = false;

  ngAfterViewInit() {
    this.initScrollCounter();
  }

  // مراقبة الـ Scroll وتشغيل العداد عند ظهور الإحصائيات
  initScrollCounter() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.startCounters();
        }
      });
    }, { threshold: 0.3 });

    // مراقبة سكشن الإحصائيات
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  startCounters() {
    this.stats.forEach(stat => {
      let start = 0;
      const duration = 2000; // مدة العداد بالميلي ثانية (2 ثانية)
      const stepTime = Math.abs(Math.floor(duration / stat.target));
      
      const timer = setInterval(() => {
        start += Math.ceil(stat.target / 50); // سرعة الزيادة
        if (start >= stat.target) {
          stat.current = stat.target;
          clearInterval(timer);
        } else {
          stat.current = start;
        }
      }, 30);
    });
  }

  featuredClinics = [
    {
      id: 1,
      name: 'عيادة النور التخصصية',
      specialty: 'أسنان وتجميل',
      city: 'الرياض',
      rating: 4.9,
         doctorsCount:10,
      description:"kdkdkdkdkdkdkdk",
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'مجمّع الشفاء الطبي',
      specialty: 'باطنة أطفال وجلدية',
      city: 'جدة',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'عيادات الحياة للعيون',
      specialty: 'جراحة وجص العيون',
      city: 'الدمام',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 1,
      name: 'عيادة النور التخصصية',
      specialty: 'أسنان وتجميل',
      city: 'الرياض',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'مجمّع الشفاء الطبي',
      specialty: 'باطنة أطفال وجلدية',
      city: 'جدة',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'عيادات الحياة للعيون',
      specialty: 'جراحة وجص العيون',
      city: 'الدمام',
      rating: 5.0,
         doctorsCount:10,
      description:"kdkdkdkdkdkdkdk",
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 1,
      name: 'عيادة النور التخصصية',
      specialty: 'أسنان وتجميل',
      city: 'الرياض',
      rating: 4.9,
         doctorsCount:10,
      description:"kdkdkdkdkdkdkdk",
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'مجمّع الشفاء الطبي',
      specialty: 'باطنة أطفال وجلدية',
      city: 'جدة',
      rating: 4.8,
         doctorsCount:10,
      description:"kdkdkdkdkdkdkdk",
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'عيادات الحياة للعيون',
      specialty: 'جراحة وجص العيون',
      city: 'الدمام',
      rating: 5.0,
      doctorsCount:10,
      description:"kdkdkdkdkdkdkdk",
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
    }
  ];

  appScreenshots = [
    {
      title: 'لوحة التحكم الرئيسية',
      desc: 'إحصائيات فورية ومتابعة دقيقة لحجوزات اليوم.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'إدارة المواعيد والتقويم',
      desc: 'جدولة سهلة ومنظمة لكل طبيب مع تنبيهات تلقائية.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'فواتير إلكترونية متوافقة مع زاتكا',
      desc: 'إصدار فواتير احترافية مع QR Code بنقرة واحدة.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
    }
  ];

  testimonials = [
    {
      quote: "منصة طبيب غيرت طريقة إدارة مجمعنا بالكامل. نظام الحجوزات والفواتير المتوافقة مع زاتكا وفر علينا ساعات من العمل اليدوي.",
      name: "د. خالد السبيعي",
      clinic: "مدير مجمع الأمل الطبي",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    },
    {
      quote: "سهولة الاستخدام والدعم الفني السريع جعلتنا نعتمد عليهم كلياً. أنصح كل طبيب يرغب بتطوير عيادته بالانضمام فوراً.",
      name: "د. منى الغامدي",
      clinic: "استشاري طب الأسنان",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80"
    }
  ];

  pricingPlans = [
    {
      name: 'الباقة الأساسية',
      price: '299',
      period: 'شهرياً',
      desc: 'مثالية للعيادات الفردية الصغيرة لبدء التحول الرقمي.',
      features: ['إدارة المواعيد الأساسية', 'ملفات المرضى الإلكترونية', 'دعم فني عبر البريد', 'تحديثات مجانية'],
      popular: false
    },
    {
      name: 'الباقة الاحترافية',
      price: '599',
      period: 'شهرياً',
      desc: 'الخيار الأفضل للمجمعات الطبية والعيادات المتعددة.',
      features: ['كل مميزات الأساسية', 'نظام الفواتير والـ QR المتوافق مع زاتكا', 'تقارير أداء مالية متقدمة', 'أطباء غير محدودين', 'دعم فني أولوية عالية'],
      popular: true
    },
    {
      name: 'باقة المؤسسات',
      price: '1199',
      period: 'شهرياً',
      desc: 'للمستشفيات والمجموعات الكبرى التي تحتاج تخصيص كامل.',
      features: ['ربط خاص بـ API', 'إدارة فروع متعددة', 'مدير حساب مخصص', 'تدريب كامل للكادر الطبي'],
      popular: false
    }
  ];
  mobileMenuOpen = false;
activeFeatureIndex = 0;
annualBilling = false;
submittedSuccess = false;
quickDemoSent = false;

quickDemo = {
  name: '',
  phone: ''
};

contactForm = {
  fullName: '',
  contactInfo: '',
  message: ''
};

featureTabs = [
  {
    id: 'appointments',
    badge: 'الاستقبال والمواعيد',
    title: 'إدارة الحجوزات وجداول الأطباء',
    subtitle: 'تنظيم الحجز وحالات الانتظار وتقليل وقت الانتظار',
    description: 'تابع مواعيد اليوم والفترات القادمة لكل طبيب أو عيادة، مع وضوح حالة المريض من لحظة الحجز حتى انتهاء الكشف.',
    points: [
      'جدولة المواعيد حسب الطبيب والتخصص',
      'متابعة حالات الانتظار والحضور والإنهاء',
      'تقليل تعارض المواعيد وسهولة إعادة الجدولة',
      'عرض سريع لجدول كل طبيب خلال اليوم'
    ]
  },
  {
    id: 'records',
    badge: 'الملفات الطبية',
    title: 'السجلات الطبية وتاريخ الزيارات',
    subtitle: 'ملف متكامل لكل مريض يسهل الرجوع إليه',
    description: 'احتفظ ببيانات المرضى وسجل زياراتهم وتشخيصاتهم وملاحظاتهم الطبية في ملف واحد منظم وسريع البحث.',
    points: [
      'بحث فوري بملف المريض أو رقم الجوال',
      'سجل زيارات وتشخيصات متسلسل',
      'ملاحظات وملفات مرفقة لكل زيارة',
      'خصوصية وحوكمة وصول واضحة'
    ]
  },
  {
    id: 'billing',
    badge: 'الحسابات والفواتير',
    title: 'الفواتير والتحصيل المالي',
    subtitle: 'متابعة دقيقة للرسوم والمدفوعات والتقارير',
    description: 'أصدر الفواتير بوضوح وتابع المدفوعات والمستحقات اليومية أو الشهرية لكل عيادة أو فرع.',
    points: [
      'إصدار فواتير الخدمات والكشوفات بسهولة',
      'تتبع المدفوعات وحالات السداد',
      'ملخصات مالية يومية وشهرية',
      'وضوح الحسابات بين الأقسام والأطباء'
    ]
  },
  {
    id: 'team',
    badge: 'الفريق والصلاحيات',
    title: 'إدارة الكادر الطبي والصلاحيات',
    subtitle: 'توزيع أدوار واضح بين الإدارة والطبيب والاستقبال',
    description: 'حدد صلاحيات كل مستخدم حسب دوره الوظيفي لضمان انسيابية العمل وحماية البيانات الحساسة.',
    points: [
      'صلاحيات مخصصة للاستقبال والأطباء والإدارة',
      'إدارة التخصصات والعيادات والمواعيد',
      'تنظيم فرق العمل بسهولة',
      'تجربة استخدام مريحة لكل مستخدم'
    ]
  }
];

getAnnualPrice(monthlyPrice: number | string): number | string {
  const num = Number(monthlyPrice);
  if (Number.isNaN(num)) return monthlyPrice;
  return Math.round(num * 0.8);
}

onQuickDemoSubmit(): void {
  if (!this.quickDemo.name.trim() || !this.quickDemo.phone.trim()) return;
  this.quickDemoSent = true;
  this.quickDemo = { name: '', phone: '' };
}

onContactSubmit(): void {
  if (!this.contactForm.fullName.trim() || !this.contactForm.contactInfo.trim() || !this.contactForm.message.trim()) return;
  this.submittedSuccess = true;
  this.contactForm = { fullName: '', contactInfo: '', message: '' };
}

slideIndex = 0;

get visibleScreenshots() {
  if (!this.appScreenshots?.length) return [];
  const list = this.appScreenshots;
  if (list.length <= 3) return list;
  return [
    list[this.slideIndex % list.length],
    list[(this.slideIndex + 1) % list.length],
    list[(this.slideIndex + 2) % list.length]
  ];
}

prevSlide(): void {
  if (!this.appScreenshots?.length) return;
  this.slideIndex = (this.slideIndex - 1 + this.appScreenshots.length) % this.appScreenshots.length;
}

nextSlide(): void {
  if (!this.appScreenshots?.length) return;
  this.slideIndex = (this.slideIndex + 1) % this.appScreenshots.length;
}

selectPlan(planName: string): void {
  const el = document.getElementById('contact');
  el?.scrollIntoView({ behavior: 'smooth' });
}

clinicSlideIndex = 0;

get visibleClinics() {
  const list = this.featuredClinics ?? [];
  if (list.length <= 3) {
    return list;
  }

  return [
    list[this.clinicSlideIndex % list.length],
    list[(this.clinicSlideIndex + 1) % list.length],
    list[(this.clinicSlideIndex + 2) % list.length]
  ];
}

nextClinicSlide(): void {
  const len = this.featuredClinics?.length ?? 0;
  if (!len) return;
  this.clinicSlideIndex = (this.clinicSlideIndex + 1) % len;
}

prevClinicSlide(): void {
  const len = this.featuredClinics?.length ?? 0;
  if (!len) return;
  this.clinicSlideIndex = (this.clinicSlideIndex - 1 + len) % len;
}

goToClinicSlide(index: number): void {
  const len = this.featuredClinics?.length ?? 0;
  if (!len) return;
  this.clinicSlideIndex = index % len;
}
}