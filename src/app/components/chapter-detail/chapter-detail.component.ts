import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { CourseService } from '../../services/course.service';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CdkDragDrop, DragDropModule, moveItemInArray, Point } from '@angular/cdk/drag-drop';

type ContentType = 'video' | 'mcq' | 'essay' | 'flashcard';
type StatusType = 'published' | 'draft';

interface ModuleStats {
    video?: number;
    mcq?: number;
    essay?: number;
    flashcard?: number;
}

interface ModuleItem {
    id: string;
    title: string;
    titleEn?: string;
    stats: ModuleStats;
    status: StatusType;
}

interface ChapterInfo {
    id: string;
    label: string;
    title: string;
    titleEn: string;
    moduleCount: number;
    duration: string;
    durationEn: string;
    isActive: boolean;
}

@Component({
    selector: 'app-chapter-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslatePipe, DragDropModule],
    templateUrl: './chapter-detail.component.html',
    styleUrl: './chapter-detail.component.css'
})
export class ChapterDetailComponent implements OnInit, OnDestroy {
    courseId: number = 0;
    materialId: number = 0;
    chapterId: string = '';
    chapterLabel: string = '';
    courseCode: string = '';
    materialName: string = '';

    chapterInfo: ChapterInfo = {
        id: '1',
        label: 'F1',
        title: 'الإطار النظري للمحاسبة المالية',
        titleEn: 'Theoretical Framework of Financial Accounting',
        moduleCount: 5,
        duration: '3 ساعات',
        durationEn: '3 hours',
        isActive: true
    };

    modulesData: ModuleItem[] = [];
    private langSub?: Subscription;

    // Chapter 1 (F1) Data
    private chapter1Modules: ModuleItem[] = [
        {
            id: 'm1',
            title: 'Module 1: مقدمة في المحاسبة والتقارير',
            titleEn: 'Module 1: Introduction to Accounting and Reporting',
            stats: { video: 5, mcq: 30, essay: 3, flashcard: 5 },
            status: 'published'
        },
        {
            id: 'm2',
            title: 'Module 2: القوائم المالية الأساسية',
            titleEn: 'Module 2: Basic Financial Statements',
            stats: { video: 3, mcq: 15 },
            status: 'published'
        },
        {
            id: 'm3',
            title: 'Module 3: عناصر القوائم المالية وتصنيفاتها',
            titleEn: 'Module 3: Financial Statement Elements and Classifications',
            stats: { video: 4, mcq: 20, essay: 2 },
            status: 'published'
        },
        {
            id: 'm4',
            title: 'Module 4: القياس والاعتراف المحاسبي',
            titleEn: 'Module 4: Accounting Measurement and Recognition',
            stats: { video: 6, mcq: 25, flashcard: 10 },
            status: 'draft'
        },
        {
            id: 'm5',
            title: 'Module 5: الإفصاح والتقارير المالية',
            titleEn: 'Module 5: Disclosure and Financial Reporting',
            stats: { video: 2, mcq: 10 },
            status: 'draft'
        }
    ];

    // Form States
    showAddForm = false;
    showEditForm = false;
    editingItem: ModuleItem | null = null;

    // Add Form Model
    newModuleTitle = '';
    newModuleTitleEn = '';
    newModuleVideoCount = 0;
    newModuleMcqCount = 0;
    newModuleEssayCount = 0;
    newModuleFlashcardCount = 0;

    // Edit Form Model
    editModuleTitle = '';
    editModuleTitleEn = '';
    editModuleVideoCount = 0;
    editModuleMcqCount = 0;
    editModuleEssayCount = 0;
    editModuleFlashcardCount = 0;

    // Delete Modal
    showDeleteModal = false;
    itemToDeleteId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private headerService: HeaderService,
        private courseService: CourseService,
        private router: Router,
        public translationService: TranslationService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.courseId = Number(params.get('courseId'));
            this.materialId = Number(params.get('materialId'));
            this.chapterId = params.get('chapterId') || '1';

            this.loadChapterData();
            this.setupBreadcrumbs();
        });

        this.langSub = this.translationService.lang$.subscribe(lang => {
            this.updateLocalizedStrings();
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
    }

    loadChapterData() {
        const course = this.courseService.getCourseById(this.courseId);
        this.courseCode = course?.code || 'SOCPA';

        // Material name based on materialId
        if (this.materialId === 1) {
            this.materialName = this.translationService.current === 'ar' ? 'المحاسبة المالية' : 'Financial Accounting';
        } else {
            this.materialName = this.translationService.current === 'ar' ? 'مادة تجريبية' : 'Trial Material';
        }

        // Load chapter info based on chapterId
        this.loadChapterInfo();

        // Load modules - only Chapter 1 has content
        if (this.chapterId === '1') {
            this.modulesData = [...this.chapter1Modules];
        } else {
            this.modulesData = [];
        }
    }

    loadChapterInfo() {
        const chapterConfigs: Record<string, ChapterInfo> = {
            '1': {
                id: '1',
                label: 'F1',
                title: 'الإطار النظري للمحاسبة المالية',
                titleEn: 'Theoretical Framework of Financial Accounting',
                moduleCount: 5,
                duration: '3 ساعات',
                durationEn: '3 hours',
                isActive: true
            },
            '2': {
                id: '2',
                label: 'F2',
                title: 'القوائم المالية وعناصرها',
                titleEn: 'Financial Statements and Their Elements',
                moduleCount: 0,
                duration: '0 ساعات',
                durationEn: '0 hours',
                isActive: false
            },
            '4': {
                id: '4',
                label: 'F3',
                title: 'الأصول المتداولة والقياس',
                titleEn: 'Current Assets and Measurement',
                moduleCount: 0,
                duration: '0 ساعات',
                durationEn: '0 hours',
                isActive: false
            },
            '5': {
                id: '5',
                label: 'F4',
                title: 'الأصول غير المتداولة والاستهلاك',
                titleEn: 'Non-Current Assets and Depreciation',
                moduleCount: 0,
                duration: '0 ساعات',
                durationEn: '0 hours',
                isActive: false
            }
        };

        this.chapterInfo = chapterConfigs[this.chapterId] || {
            id: this.chapterId,
            label: `F${this.chapterId}`,
            title: 'فصل جديد',
            titleEn: 'New Chapter',
            moduleCount: 0,
            duration: '0 ساعات',
            durationEn: '0 hours',
            isActive: false
        };

        this.chapterLabel = this.chapterInfo.label;
    }

    updateLocalizedStrings() {
        if (this.materialId === 1) {
            this.materialName = this.translationService.current === 'ar' ? 'المحاسبة المالية' : 'Financial Accounting';
        }
    }

    setupBreadcrumbs() {
        this.headerService.setBreadcrumbs([
            { label: this.translationService.translate('CERTIFICATES'), url: '/' },
            { label: this.courseCode, url: `/course/${this.courseId}` },
            { label: this.translationService.translate('COURSE_MATERIALS'), url: `/course/${this.courseId}` },
            { label: this.materialName, url: `/course/${this.courseId}/material/${this.materialId}` },
            { label: this.translationService.translate('MATERIAL_STRUCTURE'), url: `/course/${this.courseId}/material/${this.materialId}` },
            { label: `${this.translationService.translate('CHAPTER')} ${this.chapterLabel}` }
        ]);
    }

    get chapterTitle(): string {
        return this.translationService.current === 'ar' ? this.chapterInfo.title : this.chapterInfo.titleEn;
    }

    get chapterDuration(): string {
        return this.translationService.current === 'ar' ? this.chapterInfo.duration : this.chapterInfo.durationEn;
    }

    get publishedCount(): number {
        return this.modulesData.filter(m => m.status === 'published').length;
    }

    get draftCount(): number {
        return this.modulesData.filter(m => m.status === 'draft').length;
    }

    // CRUD Operations
    toggleAddForm() {
        this.showAddForm = !this.showAddForm;
        this.showEditForm = false;
        this.resetAddForm();
    }

    resetAddForm() {
        this.newModuleTitle = '';
        this.newModuleTitleEn = '';
        this.newModuleVideoCount = 0;
        this.newModuleMcqCount = 0;
        this.newModuleEssayCount = 0;
        this.newModuleFlashcardCount = 0;
    }

    saveModule() {
        if (!this.newModuleTitle) return;

        const newModule: ModuleItem = {
            id: Date.now().toString(),
            title: this.newModuleTitle,
            titleEn: this.newModuleTitleEn || this.newModuleTitle,
            stats: {
                video: this.newModuleVideoCount || undefined,
                mcq: this.newModuleMcqCount || undefined,
                essay: this.newModuleEssayCount || undefined,
                flashcard: this.newModuleFlashcardCount || undefined
            },
            status: 'draft'
        };

        this.modulesData.push(newModule);
        this.showAddForm = false;
        this.resetAddForm();
    }

    openEditForm(module: ModuleItem) {
        this.editingItem = module;
        this.editModuleTitle = module.title;
        this.editModuleTitleEn = module.titleEn || module.title;
        this.editModuleVideoCount = module.stats.video || 0;
        this.editModuleMcqCount = module.stats.mcq || 0;
        this.editModuleEssayCount = module.stats.essay || 0;
        this.editModuleFlashcardCount = module.stats.flashcard || 0;
        this.showEditForm = true;
        this.showAddForm = false;
    }

    updateModule() {
        if (this.editingItem && this.editModuleTitle) {
            const index = this.modulesData.findIndex(m => m.id === this.editingItem!.id);
            if (index !== -1) {
                this.modulesData[index] = {
                    ...this.modulesData[index],
                    title: this.editModuleTitle,
                    titleEn: this.editModuleTitleEn || this.editModuleTitle,
                    stats: {
                        video: this.editModuleVideoCount || undefined,
                        mcq: this.editModuleMcqCount || undefined,
                        essay: this.editModuleEssayCount || undefined,
                        flashcard: this.editModuleFlashcardCount || undefined
                    }
                };
            }
            this.cancelEdit();
        }
    }

    cancelEdit() {
        this.showEditForm = false;
        this.editingItem = null;
    }

    openDeleteModal(id: string) {
        this.itemToDeleteId = id;
        this.showDeleteModal = true;
    }

    confirmDelete() {
        if (this.itemToDeleteId) {
            this.modulesData = this.modulesData.filter(m => m.id !== this.itemToDeleteId);
            this.itemToDeleteId = null;
            this.showDeleteModal = false;
        }
    }

    cancelDelete() {
        this.itemToDeleteId = null;
        this.showDeleteModal = false;
    }

    // Drag and Drop
    onDrop(event: CdkDragDrop<ModuleItem[]>) {
        moveItemInArray(this.modulesData, event.previousIndex, event.currentIndex);
    }

    dragConstraint = (point: Point, _dragRef: any, _dimensions: DOMRect, pickupPosition: Point): Point => {
        return {
            x: pickupPosition.x,
            y: point.y
        };
    };

    getModuleTitle(module: ModuleItem): string {
        return this.translationService.current === 'ar' ? module.title : (module.titleEn || module.title);
    }

    hasStats(module: ModuleItem): boolean {
        return !!(module.stats.video || module.stats.mcq || module.stats.essay || module.stats.flashcard);
    }

    goBack() {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId]);
    }

    navigateToModule(module: ModuleItem) {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', module.id]);
    }
}
