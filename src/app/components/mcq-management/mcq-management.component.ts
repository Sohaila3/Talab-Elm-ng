import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { CourseService } from '../../services/course.service';
import { TranslationService } from '../../services/translation.service';
import { ModuleDataService, McqItem } from '../../services/module-data.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface McqOption {
    id: string;
    text: string;
    textEn: string;
    isCorrect: boolean;
}

@Component({
    selector: 'app-mcq-management',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
    templateUrl: './mcq-management.component.html',
    styleUrl: './mcq-management.component.css'
})
export class McqManagementComponent implements OnInit, OnDestroy {
    courseId: number = 0;
    materialId: number = 0;
    chapterId: string = '';
    moduleId: string = '';
    mcqId: string = '';

    isAddMode = false;

    // Question text
    questionAr = '';
    questionEn = '';

    // Options
    options: McqOption[] = [
        { id: 'A', text: '', textEn: '', isCorrect: false },
        { id: 'B', text: '', textEn: '', isCorrect: false },
        { id: 'C', text: '', textEn: '', isCorrect: false },
        { id: 'D', text: '', textEn: '', isCorrect: false }
    ];

    // Explanation
    explanationAr = '';
    explanationEn = '';

    // Status
    status: 'draft' | 'published' = 'draft';
    level = 'متوسط';
    points = 2;

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
            this.mcqId = params.get('mcqId') || 'new';

            this.isAddMode = this.mcqId === 'new';

            if (!this.isAddMode) {
                this.loadExistingMcq();
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

    loadExistingMcq() {
        const mcq = this.moduleDataService.getMcqById(this.mcqId);
        if (mcq) {
            this.questionAr = mcq.question;
            this.questionEn = mcq.questionEn;
            this.level = mcq.level;
            this.points = mcq.points;
            this.status = mcq.status as 'draft' | 'published';
        }
    }

    setupBreadcrumbs() {
        const isAr = this.translationService.current === 'ar';
        const course = this.courseService.getCourseById(this.courseId);
        const pageTitle = this.isAddMode
            ? (isAr ? 'إضافة سؤال MCQ' : 'Add MCQ Question')
            : (isAr ? 'تعديل سؤال MCQ' : 'Edit MCQ Question');

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
            return isAr ? 'إضافة سؤال اختيار من متعدد' : 'Add Multiple Choice Question';
        }
        return isAr ? 'تعديل سؤال اختيار من متعدد' : 'Edit Multiple Choice Question';
    }

    setCorrectOption(optionId: string) {
        this.options = this.options.map(opt => ({
            ...opt,
            isCorrect: opt.id === optionId
        }));
    }

    setStatus(status: 'draft' | 'published') {
        this.status = status;
    }

    saveChanges() {
        if (!this.questionAr && !this.questionEn) {
            alert(this.translationService.current === 'ar' ? 'الرجاء إدخال نص السؤال' : 'Please enter question text');
            return;
        }

        const mcqData = {
            question: this.questionAr,
            questionEn: this.questionEn,
            level: this.level,
            points: this.points,
            status: this.status
        };

        if (this.isAddMode) {
            this.moduleDataService.addMcq(mcqData);
        } else {
            this.moduleDataService.updateMcq(this.mcqId, mcqData);
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
