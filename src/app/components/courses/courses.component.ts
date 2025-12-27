import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Course {
  id: number;
  code: string;
  title: string;
  titleEn: string;
  description: string;
  lessonsCount: number;
  isActive: boolean;
  hasVideo: boolean;
  hasBook: boolean;
  type: 'fellowship' | 'diploma' | 'technical' | 'cme';
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  activeFilter = 'all';
  
  filters = [
    { id: 'technical', label: 'الشهادات الفنية (1)' },
    { id: 'diploma', label: 'الدبلومات (1)' },
    { id: 'fellowship', label: 'الزمالات (2)' },
    { id: 'all', label: 'الكل' }
  ];

  courses: Course[] = [
    {
      id: 1,
      code: 'SOCPA',
      title: 'زمالة الهيئة السعودية',
      titleEn: '(SOCPA)',
      description: 'البرنامج المؤهل للحصول على زمالة الهيئة السعودية للمراجعين...',
      lessonsCount: 5,
      isActive: true,
      hasVideo: true,
      hasBook: false,
      type: 'fellowship'
    },
    {
      id: 2,
      code: 'VAT',
      title: 'أخصائي ضريبة القيمة المضافة',
      titleEn: '(VAT)',
      description: 'دورة مكثفة تغطي كافة جوانب نظام ضريبة القيمة المضافة وتأثيراته...',
      lessonsCount: 3,
      isActive: true,
      hasVideo: true,
      hasBook: false,
      type: 'diploma'
    },
    {
      id: 3,
      code: 'CAT',
      title: 'فني المحاسبة',
      titleEn: '(CAT)',
      description: 'شهادة فني المحاسبة المعتمدة لتأهيل الكوادر الفنية في القطاع...',
      lessonsCount: 4,
      isActive: false,
      hasVideo: false,
      hasBook: true,
      type: 'technical'
    },
    {
      id: 4,
      code: 'SPEC',
      title: 'الشهادات التخصصية',
      titleEn: '(SPECILICTIT)',
      description: 'مجموعة من الشهادات التخصصية الدقيقة في محاولين المراجعة...',
      lessonsCount: 8,
      isActive: true,
      hasVideo: false,
      hasBook: false,
      type: 'technical'
    },
    {
      id: 5,
      code: 'CME',
      title: 'اختبار كفايات',
      titleEn: '(CME)',
      description: 'الاختبار المعياري للقطاع المالي',
      lessonsCount: 2,
      isActive: false,
      hasVideo: false,
      hasBook: true,
      type: 'cme'
    }
  ];

  get filteredCourses(): Course[] {
    if (this.activeFilter === 'all') {
      return this.courses;
    }
    return this.courses.filter(course => course.type === this.activeFilter);
  }

  setFilter(filterId: string): void {
    this.activeFilter = filterId;
  }
}
