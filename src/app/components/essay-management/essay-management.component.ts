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
    selector: 'app-essay-management',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
    templateUrl: './essay-management.component.html',
    styleUrl: './essay-management.component.css'
})
export class EssayManagementComponent implements OnInit, OnDestroy {
    courseId: number = 0;
    materialId: number = 0;
    chapterId: string = '';
    moduleId: string = '';
    essayId: string = '';

    isAddMode = false;

    // Question
    questionAr = '';
    questionEn = '';

    // Answer settings
    wordLimit = 500;
    timeLimit = 15;

    // Explanation
    explanationAr = '';
    explanationEn = '';

    // Status
    status: 'draft' | 'published' = 'draft';

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
            this.essayId = params.get('essayId') || 'new';

            this.isAddMode = this.essayId === 'new';

            if (!this.isAddMode) {
                this.loadExistingEssay();
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

    loadExistingEssay() {
        const essay = this.moduleDataService.getEssayById(this.essayId);
        if (essay) {
            this.questionAr = essay.question;
            this.questionEn = essay.questionEn;
            this.wordLimit = essay.wordLimit;
            this.status = essay.status as 'draft' | 'published';
        }
    }

    setupBreadcrumbs() {
        const isAr = this.translationService.current === 'ar';
        const course = this.courseService.getCourseById(this.courseId);
        const pageTitle = this.isAddMode
            ? (isAr ? 'إضافة سؤال مقالي' : 'Add Essay Question')
            : (isAr ? 'تعديل سؤال مقالي' : 'Edit Essay Question');

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
            return isAr ? 'إضافة سؤال مقالي' : 'Add Essay Question';
        }
        return isAr ? 'تعديل سؤال مقالي' : 'Edit Essay Question';
    }

    setStatus(status: 'draft' | 'published') {
        this.status = status;
    }

    saveChanges() {
        if (!this.questionAr && !this.questionEn) {
            alert(this.translationService.current === 'ar' ? 'الرجاء إدخال نص السؤال' : 'Please enter question text');
            return;
        }

        const essayData = {
            question: this.questionAr,
            questionEn: this.questionEn,
            wordLimit: this.wordLimit,
            status: this.status
        };

        if (this.isAddMode) {
            this.moduleDataService.addEssay(essayData);
        } else {
            this.moduleDataService.updateEssay(this.essayId, essayData);
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
