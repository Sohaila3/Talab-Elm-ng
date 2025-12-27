import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  model = {
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

  isEdit = false;
  editingId?: number;

  constructor(private cs: CourseService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id) && id) {
      const course = this.cs.getCourseById(id);
      if (course) {
        this.isEdit = true;
        this.editingId = course.id;
        this.model = {
          code: course.code,
          title: course.title,
          titleEn: course.titleEn,
          description: course.description,
          lessonsCount: course.lessonsCount,
          isActive: course.isActive,
          hasVideo: course.hasVideo,
          hasBook: course.hasBook,
          type: course.type
        };
      }
    }
  }

  submit() {
    const payload = {
      code: this.model.code || 'NEW',
      title: this.model.title || 'عنوان جديد',
      titleEn: this.model.titleEn || '',
      description: this.model.description || '',
      lessonsCount: Number(this.model.lessonsCount) || 1,
      isActive: !!this.model.isActive,
      hasVideo: !!this.model.hasVideo,
      hasBook: !!this.model.hasBook,
      type: this.model.type
    };
    if (this.isEdit && this.editingId) {
      this.cs.updateCourse(this.editingId, payload);
    } else {
      this.cs.addCourse(payload);
    }
    this.router.navigate(['']);
  }

  cancel() {
    this.router.navigate(['']);
  }
}
