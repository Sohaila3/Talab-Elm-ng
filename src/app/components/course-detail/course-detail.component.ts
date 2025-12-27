import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService, Course } from '../../services/course.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;

  constructor(private route: ActivatedRoute, private cs: CourseService, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.course = this.cs.getCourseById(id);
    }
  }

  goBack() {
    this.router.navigate(['']);
  }
 
  deleteCourse() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) return;
    if (!confirm('هل أنت متأكد من حذف هذه الشهادة؟')) return;
    this.cs.deleteCourse(id);
    this.router.navigate(['']);
  }

  editCourse() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) return;
    this.router.navigate(['edit-course', id]);
  }
}
