import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './components/courses/courses.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MaterialStructureComponent } from './components/material-structure/material-structure.component';
import { ChapterDetailComponent } from './components/chapter-detail/chapter-detail.component';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { VideoManagementComponent } from './components/video-management/video-management.component';
import { McqManagementComponent } from './components/mcq-management/mcq-management.component';
import { EssayManagementComponent } from './components/essay-management/essay-management.component';
import { FlashcardManagementComponent } from './components/flashcard-management/flashcard-management.component';

export const routes: Routes = [
  { path: '', component: CoursesComponent },
  { path: 'add-course', component: AddCourseComponent },
  { path: 'edit-course/:id', component: AddCourseComponent },
  { path: 'course/:id', component: CourseDetailComponent },
  { path: 'course/:courseId/material/:materialId', component: MaterialStructureComponent },
  { path: 'course/:courseId/material/:materialId/chapter/:chapterId', component: ChapterDetailComponent },
  { path: 'course/:courseId/material/:materialId/chapter/:chapterId/module/:moduleId', component: ModuleDetailComponent },
  { path: 'course/:courseId/material/:materialId/chapter/:chapterId/module/:moduleId/video/:videoId', component: VideoManagementComponent },
  { path: 'course/:courseId/material/:materialId/chapter/:chapterId/module/:moduleId/mcq/:mcqId', component: McqManagementComponent },
  { path: 'course/:courseId/material/:materialId/chapter/:chapterId/module/:moduleId/essay/:essayId', component: EssayManagementComponent },
  { path: 'course/:courseId/material/:materialId/chapter/:chapterId/module/:moduleId/flashcard/:flashcardId', component: FlashcardManagementComponent },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }


