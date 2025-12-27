import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { Course, CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  activeFilter = 'all';
  searchTerm = '';
  private sub: Subscription | null = null;
  private coursesSub: Subscription | null = null;
  
  filters = [
    { id: 'technical', label: 'الشهادات الفنية (1)' },
    { id: 'diploma', label: 'الدبلومات (1)' },
    { id: 'fellowship', label: 'الزمالات (2)' },
    { id: 'all', label: 'الكل' }
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

  constructor(private searchService: SearchService, private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
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

  openAddCourse(): void {
    this.router.navigate(['add-course']);
  }

  openCourse(id: number): void {
    this.router.navigate(['course', id]);
  }

  openEdit(id: number): void {
    // navigate to edit route for the course
    this.router.navigate(['edit-course', id]);
  }
}
