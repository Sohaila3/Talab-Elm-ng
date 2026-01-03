import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { CourseService } from '../../services/course.service';
import { TranslationService } from '../../services/translation.service';
import { ModuleDataService } from '../../services/module-data.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-flashcard-management',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
    templateUrl: './flashcard-management.component.html',
    styleUrl: './flashcard-management.component.css'
})
export class FlashcardManagementComponent implements OnInit, OnDestroy {
    courseId: number = 0;
    materialId: number = 0;
    chapterId: string = '';
    moduleId: string = '';
    flashcardId: string = '';

    isAddMode = false;

    // Front (Question)
    frontAr = '';
    frontEn = '';

    // Back (Answer)
    backAr = '';
    backEn = '';

    // Status
    status: 'draft' | 'published' = 'published';
    isActive = true;

    // Preview
    previewFlipped = false;

    showSaveSuccess = false;

    private langSub?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private headerService: HeaderService,
        private courseService: CourseService,
        private router: Router,
        public translationService: TranslationService,
        private moduleDataService: ModuleDataService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.courseId = Number(params.get('courseId'));
            this.materialId = Number(params.get('materialId'));
            this.chapterId = params.get('chapterId') || '1';
            this.moduleId = params.get('moduleId') || 'm1';
            this.flashcardId = params.get('flashcardId') || 'new';

            this.isAddMode = this.flashcardId === 'new';

            if (!this.isAddMode) {
                this.loadExistingFlashcard();
            }

            this.setupBreadcrumbs();
        });

        this.langSub = this.translationService.lang$.subscribe(() => {
            this.setupBreadcrumbs();
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
    }

    loadExistingFlashcard() {
        const flashcard = this.moduleDataService.getFlashcardById(this.flashcardId);
        if (flashcard) {
            this.frontAr = flashcard.front;
            this.frontEn = flashcard.frontEn;
            this.backAr = flashcard.back;
            this.backEn = flashcard.backEn;
            this.status = flashcard.status as 'draft' | 'published';
        }
    }

    setupBreadcrumbs() {
        const isAr = this.translationService.current === 'ar';
        const course = this.courseService.getCourseById(this.courseId);
        const pageTitle = this.isAddMode
            ? (isAr ? 'إضافة بطاقة تعليمية' : 'Add Flashcard')
            : (isAr ? 'تعديل بطاقة تعليمية' : 'Edit Flashcard');

        this.headerService.setBreadcrumbs([
            { label: this.translationService.translate('CERTIFICATES'), url: '/' },
            { label: course?.code || 'SOCPA', url: `/course/${this.courseId}` },
            { label: isAr ? 'المحاسبة المالية' : 'Financial Accounting', url: `/course/${this.courseId}/material/${this.materialId}` },
            { label: 'Module 1', url: `/course/${this.courseId}/material/${this.materialId}/chapter/${this.chapterId}/module/${this.moduleId}` },
            { label: pageTitle }
        ]);
    }

    getPageTitle(): string {
        const isAr = this.translationService.current === 'ar';
        if (this.isAddMode) {
            return isAr ? 'إضافة بطاقة تعليمية جديدة' : 'Add New Flashcard';
        }
        return isAr ? 'تعديل البطاقة التعليمية' : 'Edit Flashcard';
    }

    togglePreview() {
        this.previewFlipped = !this.previewFlipped;
    }

    setStatus(status: 'draft' | 'published') {
        this.status = status;
    }

    toggleActive() {
        this.isActive = !this.isActive;
    }

    saveChanges() {
        if (!this.frontAr && !this.frontEn) {
            alert(this.translationService.current === 'ar' ? 'الرجاء إدخال الوجه الأمامي' : 'Please enter front side');
            return;
        }
        if (!this.backAr && !this.backEn) {
            alert(this.translationService.current === 'ar' ? 'الرجاء إدخال الوجه الخلفي' : 'Please enter back side');
            return;
        }

        const flashcardData = {
            front: this.frontAr,
            frontEn: this.frontEn,
            back: this.backAr,
            backEn: this.backEn,
            status: this.status
        };

        if (this.isAddMode) {
            this.moduleDataService.addFlashcard(flashcardData);
        } else {
            this.moduleDataService.updateFlashcard(this.flashcardId, flashcardData);
        }

        this.showSaveSuccess = true;
        setTimeout(() => {
            this.showSaveSuccess = false;
            this.goBack();
        }, 1500);
    }

    cancelChanges() {
        this.goBack();
    }

    goBack() {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId]);
    }
}
