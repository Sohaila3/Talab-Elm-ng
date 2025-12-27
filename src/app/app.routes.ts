import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './components/courses/courses.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const routes: Routes = [
  { path: '', component: CoursesComponent },
  { path: 'add-course', component: AddCourseComponent },
  { path: 'edit-course/:id', component: AddCourseComponent },
  { path: 'course/:id', component: CourseDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }


