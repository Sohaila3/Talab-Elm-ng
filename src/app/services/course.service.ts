import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Course {
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

@Injectable({ providedIn: 'root' })
export class CourseService {
  private _courses$ = new BehaviorSubject<Course[]>([
    {
      id: 1,
      code: 'SOCPA',
      title: 'زمالة الهيئة السعودية',
      titleEn: '(SOCPA)',
      description: 'البرنامج المؤهل للحصول على زمالة الهيئة السعودية للمراجعين والمحاسبين',
      lessonsCount: 6,
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
      description: 'لم يضاف بعد',
      lessonsCount: 0,
      isActive: true,
      hasVideo: false,
      hasBook: false,
      type: 'diploma'
    },
    {
      id: 3,
      code: 'CAT',
      title: 'فني المحاسبة',
      titleEn: '(CAT)',
      description: 'لم يضاف بعد',
      lessonsCount: 0,
      isActive: false,
      hasVideo: false,
      hasBook: false,
      type: 'technical'
    },
    {
      id: 4,
      code: 'SPEC',
      title: 'الشهادات التخصصية',
      titleEn: '(SPECILICTIT)',
      description: 'لم يضاف بعد',
      lessonsCount: 0,
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
      description: 'لم يضاف بعد',
      lessonsCount: 0,
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
