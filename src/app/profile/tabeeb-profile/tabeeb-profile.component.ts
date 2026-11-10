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
}