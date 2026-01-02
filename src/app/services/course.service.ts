import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Course {
  id: number;
  code: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  lessonsCount: number;
  isActive: boolean;
  hasVideo: boolean;
  hasBook: boolean;
  type: 'fellowship' | 'diploma' | 'technical' | 'cme';
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private _courses$ = new BehaviorSubject<Course[]>([
    {
      id: 1,
      code: 'SOCPA',
      title: 'زمالة الهيئة السعودية',
      titleEn: 'SOCPA Fellowship',
      description: 'البرنامج المؤهل للحصول على زمالة الهيئة السعودية للمراجعين والمحاسبين.',
      descriptionEn: 'The program that qualifies for the Saudi Organization for Certified Public Accountants fellowship.',
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
      titleEn: 'VAT Specialist',
      description: 'دورة مكثفة تغطي كافة جوانب نظام ضريبة القيمة المضافة ولائحته التنفيذية.',
      descriptionEn: 'Intensive course covering all aspects of the VAT system and its executive regulations.',
      lessonsCount: 3,
      isActive: true,
      hasVideo: false,
      hasBook: false,
      type: 'diploma'
    },
    {
      id: 3,
      code: 'CAT',
      title: 'فني المحاسبة',
      titleEn: 'Certified Accounting Technician',
      description: 'شهادة فني المحاسبة المعتمدة لتأهيل الكوادر الفنية في القطاع المالي.',
      descriptionEn: 'Certified accounting technician certificate for qualifying technical staff in the financial sector.',
      lessonsCount: 4,
      isActive: false,
      hasVideo: false,
      hasBook: false,
      type: 'technical'
    },
    {
      id: 4,
      code: 'SPEC',
      title: 'الشهادات التخصصية',
      titleEn: 'Specialized Certificates',
      description: 'مجموعة من الشهادات التخصصية الدقيقة في مجالات المراجعة الداخلية.',
      descriptionEn: 'A collection of specialized certificates in internal audit fields.',
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
      titleEn: 'CME Competency Test',
      description: 'الاختبار المعياري للقطاع المالي.',
      descriptionEn: 'Standard competency test for the financial sector.',
      lessonsCount: 2,
      isActive: false,
      hasVideo: false,
      hasBook: false,
      type: 'cme'
    }
  ]);

  get courses$(): Observable<Course[]> {
    return this._courses$.asObservable();
  }

  addCourse(course: Omit<Course, 'id'>) {
    const list = this._courses$.getValue();
    const nextId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
    const newCourse: Course = { id: nextId, ...course } as Course;
    this._courses$.next([...list, newCourse]);
  }

  getCourseById(id: number): Course | undefined {
    return this._courses$.getValue().find(c => c.id === id);
  }

  deleteCourse(id: number): void {
    const list = this._courses$.getValue();
    const next = list.filter(c => c.id !== id);
    this._courses$.next(next);
  }

  updateCourse(id: number, changes: Partial<Omit<Course, 'id'>>) {
    const list = this._courses$.getValue();
    const next = list.map(c => c.id === id ? { ...c, ...changes } : c);
    this._courses$.next(next);
  }
}
