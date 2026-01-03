import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { CourseService } from '../../services/course.service';
import { TranslationService } from '../../services/translation.service';
import { ModuleDataService, McqItem as ServiceMcqItem, EssayItem as ServiceEssayItem, FlashcardItem as ServiceFlashcardItem } from '../../services/module-data.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CdkDragDrop, DragDropModule, moveItemInArray, Point } from '@angular/cdk/drag-drop';

type VideoStatus = 'active' | 'processing';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface VideoItem {
    id: string;
    title: string;
    titleEn?: string;
    duration: string;
    status: VideoStatus;
    thumbnail: string;
}

interface McqItem {
    id: string;
    question: string;
    questionEn?: string;
    level: DifficultyLevel;
    points: number;
    options: number;
}

interface EssayItem {
    id: string;
    question: string;
    questionEn?: string;
    wordLimit: number;
    isManualGrading: boolean;
}

interface FlashcardItem {
    id: string;
    front: string;
    frontEn?: string;
    back: string;
    backEn?: string;
}

interface ModuleInfo {
    id: string;
    number: number;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    totalDuration: string;
    totalDurationEn: string;
    totalPoints: number;
    isPublished: boolean;
}

@Component({
    selector: 'app-module-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslatePipe, DragDropModule],
    templateUrl: './module-detail.component.html',
    styleUrl: './module-detail.component.css'
})
export class ModuleDetailComponent implements OnInit, OnDestroy {
    courseId: number = 0;
    materialId: number = 0;
    chapterId: string = '';
    moduleId: string = '';
    courseCode: string = '';
    materialName: string = '';
    chapterLabel: string = '';

    moduleInfo: ModuleInfo = {
        id: '1',
        number: 1,
        title: 'مقدمة في المحاسبة والتقارير',
        titleEn: 'Introduction to Accounting and Reporting',
        description: 'تغطي هذه الوحدة المفاهيم الأساسية للمحاسبة المالية، بما في ذلك تعريف الأصول، الالتزامات، وحقوق الملكية، وكيفية إعداد التقارير المالية الأولية.',
        descriptionEn: 'This module covers the basic concepts of financial accounting, including defining assets, liabilities, and equity, and how to prepare preliminary financial reports.',
        totalDuration: '45 دقيقة',
        totalDurationEn: '45 minutes',
        totalPoints: 20,
        isPublished: true
    };

    videosData: VideoItem[] = [];
    mcqsData: McqItem[] = [];
    essaysData: EssayItem[] = [];
    flashcardsData: FlashcardItem[] = [];

    private langSub?: Subscription;

    // Module 1 sample data
    private module1Videos: VideoItem[] = [
        { id: 'v1', title: 'المفاهيم الأساسية للأصول والخصوم', titleEn: 'Basic Concepts of Assets and Liabilities', duration: '12:30', status: 'active', thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=120&fit=crop' },
        { id: 'v2', title: 'شرح معادلة الميزانية العمومية', titleEn: 'Balance Sheet Equation Explained', duration: '08:45', status: 'active', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop' },
        { id: 'v3', title: 'تحليل العمليات المالية', titleEn: 'Financial Operations Analysis', duration: '15:20', status: 'processing', thumbnail: 'https://images.unsplash.com/photo-1554224154-260327c00c19?w=200&h=120&fit=crop' }
    ];

    private module1Mcqs: McqItem[] = [
        { id: 'q1', question: 'أي مما يلي يعتبر من الأصول المتداولة في قائمة المركز المالي؟', questionEn: 'Which of the following is considered a current asset in the statement of financial position?', level: 'easy', points: 1, options: 4 },
        { id: 'q2', question: 'عند شراء معدات مكتبية نقداً، فإن الطرف الدائن في القيد المحاسبي هو...', questionEn: 'When purchasing office equipment with cash, the credit side of the accounting entry is...', level: 'medium', points: 2, options: 4 }
    ];

    private module1Essays: EssayItem[] = [
        { id: 'e1', question: 'اشرح الفرق بين المحاسبة المالية والمحاسبة الإدارية من حيث المستخدمين والهدف.', questionEn: 'Explain the difference between financial accounting and managerial accounting in terms of users and objectives.', wordLimit: 500, isManualGrading: true }
    ];

    private module1Flashcards: FlashcardItem[] = [
        { id: 'f1', front: 'ما هو تعريف الأصول المتداولة؟', frontEn: 'What is the definition of current assets?', back: 'هي النقدية أو الأصول الأخرى التي يتوقع تحويلها إلى نقدية أو بيعها أو استهلاكها خلال سنة واحدة.', backEn: 'Cash or other assets expected to be converted to cash, sold, or consumed within one year.' },
        { id: 'f2', front: 'المعادلة المحاسبية الأساسية', frontEn: 'The Basic Accounting Equation', back: 'الأصول = الخصوم + حقوق الملكية', backEn: 'Assets = Liabilities + Equity' }
    ];

    // Form states
    showVideoForm = false;
    showMcqForm = false;
    showEssayForm = false;
    showFlashcardForm = false;

    // Add form models
    newVideoTitle = '';
    newVideoTitleEn = '';
    newVideoDuration = '';

    newMcqQuestion = '';
    newMcqQuestionEn = '';
    newMcqLevel: DifficultyLevel = 'easy';
    newMcqPoints = 1;
    newMcqOptions = 4;

    newEssayQuestion = '';
    newEssayQuestionEn = '';
    newEssayWordLimit = 500;

    newFlashcardFront = '';
    newFlashcardFrontEn = '';
    newFlashcardBack = '';
    newFlashcardBackEn = '';

    // Delete modal
    showDeleteModal = false;
    deleteType: 'video' | 'mcq' | 'essay' | 'flashcard' = 'video';
    itemToDeleteId: string | null = null;

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

            this.loadModuleData();
            this.setupBreadcrumbs();
        });

        this.langSub = this.translationService.lang$.subscribe(() => {
            this.updateLocalizedStrings();
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
    }

    loadModuleData() {
        const course = this.courseService.getCourseById(this.courseId);
        this.courseCode = course?.code || 'SOCPA';
        this.materialName = this.translationService.current === 'ar' ? 'المحاسبة المالية' : 'Financial Accounting';
        this.chapterLabel = 'F1';

        // Only module m1 has content
        if (this.moduleId === 'm1') {
            // Subscribe to shared data service for live updates
            this.moduleDataService.mcqs$.subscribe(mcqs => {
                this.mcqsData = mcqs.map(m => ({
                    id: m.id,
                    question: m.question,
                    questionEn: m.questionEn,
                    level: m.level as DifficultyLevel,
                    points: m.points,
                    options: 4
                }));
            });
            this.moduleDataService.essays$.subscribe(essays => {
                this.essaysData = essays.map(e => ({
                    id: e.id,
                    question: e.question,
                    questionEn: e.questionEn,
                    wordLimit: e.wordLimit,
                    isManualGrading: true
                }));
            });
            this.moduleDataService.flashcards$.subscribe(flashcards => {
                this.flashcardsData = flashcards.map(f => ({
                    id: f.id,
                    front: f.front,
                    frontEn: f.frontEn,
                    back: f.back,
                    backEn: f.backEn
                }));
            });
            // Keep videos from static data for now
            this.videosData = [...this.module1Videos];
        } else {
            this.videosData = [];
            this.mcqsData = [];
            this.essaysData = [];
            this.flashcardsData = [];
            // Update module info for empty modules
            this.moduleInfo = {
                ...this.moduleInfo,
                title: 'وحدة جديدة',
                titleEn: 'New Module',
                description: 'لم يتم إضافة محتوى بعد',
                descriptionEn: 'No content added yet',
                totalDuration: '0 دقيقة',
                totalDurationEn: '0 minutes',
                totalPoints: 0,
                isPublished: false
            };
        }
    }

    updateLocalizedStrings() {
        this.materialName = this.translationService.current === 'ar' ? 'المحاسبة المالية' : 'Financial Accounting';
    }

    setupBreadcrumbs() {
        this.headerService.setBreadcrumbs([
            { label: this.translationService.translate('CERTIFICATES'), url: '/' },
            { label: this.courseCode, url: `/course/${this.courseId}` },
            { label: this.translationService.translate('COURSE_MATERIALS'), url: `/course/${this.courseId}` },
            { label: this.materialName, url: `/course/${this.courseId}/material/${this.materialId}` },
            { label: `${this.translationService.translate('CHAPTER')} ${this.chapterLabel}`, url: `/course/${this.courseId}/material/${this.materialId}/chapter/${this.chapterId}` },
            { label: `Module ${this.moduleInfo.number}` }
        ]);
    }

    get moduleTitle(): string {
        return this.translationService.current === 'ar' ? this.moduleInfo.title : this.moduleInfo.titleEn;
    }

    get moduleDescription(): string {
        return this.translationService.current === 'ar' ? this.moduleInfo.description : this.moduleInfo.descriptionEn;
    }

    get moduleDuration(): string {
        return this.translationService.current === 'ar' ? this.moduleInfo.totalDuration : this.moduleInfo.totalDurationEn;
    }

    // Helper methods
    getVideoTitle(video: VideoItem): string {
        return this.translationService.current === 'ar' ? video.title : (video.titleEn || video.title);
    }

    getMcqQuestion(mcq: McqItem): string {
        return this.translationService.current === 'ar' ? mcq.question : (mcq.questionEn || mcq.question);
    }

    getEssayQuestion(essay: EssayItem): string {
        return this.translationService.current === 'ar' ? essay.question : (essay.questionEn || essay.question);
    }

    getFlashcardFront(card: FlashcardItem): string {
        return this.translationService.current === 'ar' ? card.front : (card.frontEn || card.front);
    }

    getFlashcardBack(card: FlashcardItem): string {
        return this.translationService.current === 'ar' ? card.back : (card.backEn || card.back);
    }

    // Add operations
    toggleVideoForm() {
        this.showVideoForm = !this.showVideoForm;
        if (!this.showVideoForm) this.resetVideoForm();
    }

    toggleMcqForm() {
        this.showMcqForm = !this.showMcqForm;
        if (!this.showMcqForm) this.resetMcqForm();
    }

    toggleEssayForm() {
        this.showEssayForm = !this.showEssayForm;
        if (!this.showEssayForm) this.resetEssayForm();
    }

    toggleFlashcardForm() {
        this.showFlashcardForm = !this.showFlashcardForm;
        if (!this.showFlashcardForm) this.resetFlashcardForm();
    }

    resetVideoForm() {
        this.newVideoTitle = '';
        this.newVideoTitleEn = '';
        this.newVideoDuration = '';
    }

    resetMcqForm() {
        this.newMcqQuestion = '';
        this.newMcqQuestionEn = '';
        this.newMcqLevel = 'easy';
        this.newMcqPoints = 1;
        this.newMcqOptions = 4;
    }

    resetEssayForm() {
        this.newEssayQuestion = '';
        this.newEssayQuestionEn = '';
        this.newEssayWordLimit = 500;
    }

    resetFlashcardForm() {
        this.newFlashcardFront = '';
        this.newFlashcardFrontEn = '';
        this.newFlashcardBack = '';
        this.newFlashcardBackEn = '';
    }

    saveVideo() {
        if (!this.newVideoTitle) return;
        this.videosData.push({
            id: Date.now().toString(),
            title: this.newVideoTitle,
            titleEn: this.newVideoTitleEn || this.newVideoTitle,
            duration: this.newVideoDuration || '00:00',
            status: 'processing',
            thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=120&fit=crop'
        });
        this.toggleVideoForm();
    }

    saveMcq() {
        if (!this.newMcqQuestion) return;
        this.mcqsData.push({
            id: Date.now().toString(),
            question: this.newMcqQuestion,
            questionEn: this.newMcqQuestionEn || this.newMcqQuestion,
            level: this.newMcqLevel,
            points: this.newMcqPoints,
            options: this.newMcqOptions
        });
        this.toggleMcqForm();
    }

    saveEssay() {
        if (!this.newEssayQuestion) return;
        this.essaysData.push({
            id: Date.now().toString(),
            question: this.newEssayQuestion,
            questionEn: this.newEssayQuestionEn || this.newEssayQuestion,
            wordLimit: this.newEssayWordLimit,
            isManualGrading: true
        });
        this.toggleEssayForm();
    }

    saveFlashcard() {
        if (!this.newFlashcardFront || !this.newFlashcardBack) return;
        this.flashcardsData.push({
            id: Date.now().toString(),
            front: this.newFlashcardFront,
            frontEn: this.newFlashcardFrontEn || this.newFlashcardFront,
            back: this.newFlashcardBack,
            backEn: this.newFlashcardBackEn || this.newFlashcardBack
        });
        this.toggleFlashcardForm();
    }

    // Delete operations
    openDeleteModal(type: 'video' | 'mcq' | 'essay' | 'flashcard', id: string) {
        this.deleteType = type;
        this.itemToDeleteId = id;
        this.showDeleteModal = true;
    }

    confirmDelete() {
        if (!this.itemToDeleteId) return;

        switch (this.deleteType) {
            case 'video':
                this.videosData = this.videosData.filter(v => v.id !== this.itemToDeleteId);
                break;
            case 'mcq':
                this.mcqsData = this.mcqsData.filter(m => m.id !== this.itemToDeleteId);
                break;
            case 'essay':
                this.essaysData = this.essaysData.filter(e => e.id !== this.itemToDeleteId);
                break;
            case 'flashcard':
                this.flashcardsData = this.flashcardsData.filter(f => f.id !== this.itemToDeleteId);
                break;
        }

        this.cancelDelete();
    }

    cancelDelete() {
        this.showDeleteModal = false;
        this.itemToDeleteId = null;
    }

    // Drag and drop
    onVideoDrop(event: CdkDragDrop<VideoItem[]>) {
        moveItemInArray(this.videosData, event.previousIndex, event.currentIndex);
    }

    onMcqDrop(event: CdkDragDrop<McqItem[]>) {
        moveItemInArray(this.mcqsData, event.previousIndex, event.currentIndex);
    }

    onEssayDrop(event: CdkDragDrop<EssayItem[]>) {
        moveItemInArray(this.essaysData, event.previousIndex, event.currentIndex);
    }

    onFlashcardDrop(event: CdkDragDrop<FlashcardItem[]>) {
        moveItemInArray(this.flashcardsData, event.previousIndex, event.currentIndex);
    }

    goBack() {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId]);
    }

    navigateToVideo(video: VideoItem) {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId, 'video', video.id]);
    }

    navigateToAddVideo() {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId, 'video', 'new']);
    }

    navigateToMcq(mcq: McqItem) {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId, 'mcq', mcq.id]);
    }

    navigateToAddMcq() {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId, 'mcq', 'new']);
    }

    navigateToEssay(essay: EssayItem) {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId, 'essay', essay.id]);
    }

    navigateToAddEssay() {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId, 'essay', 'new']);
    }

    navigateToFlashcard(flashcard: FlashcardItem) {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId, 'flashcard', flashcard.id]);
    }

    navigateToAddFlashcard() {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId, 'flashcard', 'new']);
    }
}

