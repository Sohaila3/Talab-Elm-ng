import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { Course, CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, TranslatePipe, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  showAddForm = false;
  newCourse = {
    code: '',
    title: '',
    titleEn: '',
    description: '',
    lessonsCount: 1,
    isActive: true,
    hasVideo: false,
    hasBook: false,
    type: 'technical' as 'fellowship' | 'diploma' | 'technical' | 'cme'
  };

  activeFilter = 'all';
  searchTerm = '';
  private sub: Subscription | null = null;
  private coursesSub: Subscription | null = null;

  filters = [
    { id: 'technical', label: 'TECHNICAL' },
    { id: 'diploma', label: 'DIPLOMA' },
    { id: 'fellowship', label: 'FELLOWSHIP' },
    { id: 'all', label: 'ALL' }
  ];

  courses: Course[] = [];

  get filteredCourses(): Course[] {
    const term = this.searchTerm.trim().toLowerCase();
    let list = this.courses;
    if (this.activeFilter !== 'all') {
      list = list.filter(c => c.type === this.activeFilter);
    }
    if (!term) return list;
    return list.filter(course =>
      course.code.toLowerCase().includes(term) ||
      course.title.toLowerCase().includes(term) ||
      course.titleEn.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term)
    );
  }

  constructor(
    private searchService: SearchService,
    private courseService: CourseService,
    private router: Router,
    private headerService: HeaderService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.headerService.setBreadcrumbs([]); // Reset to default
    this.sub = this.searchService.term$.subscribe(t => {
      this.searchTerm = t ?? '';
    });
    this.coursesSub = this.courseService.courses$.subscribe(list => this.courses = list);
  }

  setFilter(filterId: string): void {
    this.activeFilter = filterId;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.sub = null;
    this.coursesSub?.unsubscribe();
    this.coursesSub = null;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.resetNewCourse();
    }
  }

  resetNewCourse(): void {
    this.newCourse = {
      code: '',
      title: '',
      titleEn: '',
      description: '',
      lessonsCount: 1,
      isActive: true,
      hasVideo: false,
      hasBook: false,
      type: 'technical'
    };
  }

  cancelAdd(): void {
    this.showAddForm = false;
  }

  saveCourse(): void {
    if (!this.newCourse.code || !this.newCourse.title) {
      alert('الرجاء إكمال البيانات المطلوبة (الرمز والعنوان)');
      return;
    }

    const payload = {
      ...this.newCourse,
      lessonsCount: Number(this.newCourse.lessonsCount)
    };

    this.courseService.addCourse(payload);
    this.showAddForm = false;
    this.resetNewCourse();
  }

  openCourse(id: number): void {
    this.router.navigate(['course', id]);
  }

  openEdit(id: number): void {
    // navigate to edit route for the course
    this.router.navigate(['edit-course', id]);
  }

  deleteCourse(id: number): void {
    const msg = this.translationService.translate('CONFIRM_DELETE');
    if (confirm(msg)) {
      this.courseService.deleteCourse(id);
    }
  }
}
