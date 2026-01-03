import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { CourseService } from '../../services/course.service';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CdkDragDrop, DragDropModule, moveItemInArray, Point, CdkDrag } from '@angular/cdk/drag-drop';

type TimelineItemType = 'chapter' | 'exam' | 'comprehensive';
type StatusType = 'published' | 'draft';

interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  titleEn?: string;
  label?: string;
  meta: string;
  metaEn?: string;
  status?: StatusType;
  examTypeLabel?: string;
  examTypeLabelEn?: string;
}

@Component({
  selector: 'app-material-structure',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe, DragDropModule],
  templateUrl: './material-structure.component.html',
  styleUrl: './material-structure.component.css'
})
export class MaterialStructureComponent implements OnInit {
  courseId: number = 0;
  materialId: number = 0;
  materialName: string = '';
  courseCode: string = '';

  timelineData: TimelineItem[] = [];
  private langSub?: Subscription;

  // Financial Accounting Data (Hardcoded based on 5.tsx)
  private financialAccountingData: TimelineItem[] = [
    {
      id: '1',
      type: 'chapter',
      label: 'F1',
      title: 'الفصل الأول: الإطار النظري للمحاسبة المالية',
      titleEn: 'Chapter 1: Theoretical Framework of Financial Accounting',
      meta: '4 دروس',
      metaEn: '4 lessons',
      status: 'published'
    },
    {
      id: '2',
      type: 'chapter',
      label: 'F2',
      title: 'الفصل الثاني: القوائم المالية وعناصرها',
      titleEn: 'Chapter 2: Financial Statements and Their Elements',
      meta: '6 دروس',
      metaEn: '6 lessons',
      status: 'published'
    },
    {
      id: '3',
      type: 'exam',
      title: 'Simulated Exam (F1 + F2)',
      titleEn: 'Simulated Exam (F1 + F2)',
      meta: '60 دقيقة • 40 سؤال',
      metaEn: '60 min • 40 questions',
      status: 'published',
      examTypeLabel: 'اختبار مرحلي',
      examTypeLabelEn: 'Progress Exam'
    },
    {
      id: '4',
      type: 'chapter',
      label: 'F3',
      title: 'الفصل الثالث: الأصول المتداولة والقياس',
      titleEn: 'Chapter 3: Current Assets and Measurement',
      meta: '5 دروس',
      metaEn: '5 lessons',
      status: 'published'
    },
    {
      id: '5',
      type: 'chapter',
      label: 'F4',
      title: 'الفصل الرابع: الأصول غير المتداولة والاستهلاك',
      titleEn: 'Chapter 4: Non-Current Assets and Depreciation',
      meta: '7 دروس',
      metaEn: '7 lessons',
      status: 'draft'
    },
    {
      id: '6',
      type: 'exam',
      title: 'Simulated Exam (F3 + F4)',
      titleEn: 'Simulated Exam (F3 + F4)',
      meta: '60 دقيقة • 40 سؤال',
      metaEn: '60 min • 40 questions',
      status: 'draft',
      examTypeLabel: 'اختبار مرحلي',
      examTypeLabelEn: 'Progress Exam'
    },
    {
      id: '7',
      type: 'chapter',
      label: 'F5',
      title: 'الفصل الخامس: الالتزامات قصيرة وطويلة الأجل',
      titleEn: 'Chapter 5: Short and Long-Term Liabilities',
      meta: '4 دروس',
      metaEn: '4 lessons',
      status: 'draft'
    },
    {
      id: '8',
      type: 'chapter',
      label: 'F6',
      title: 'الفصل السادس: حقوق الملكية والتغيرات',
      titleEn: 'Chapter 6: Equity and Changes',
      meta: '3 دروس',
      metaEn: '3 lessons',
      status: 'draft'
    },
    {
      id: '9',
      type: 'chapter',
      label: 'F7',
      title: 'الفصل السابع: قائمة التدفقات النقدية',
      titleEn: 'Chapter 7: Cash Flow Statement',
      meta: '5 دروس',
      metaEn: '5 lessons',
      status: 'draft'
    },
    {
      id: '10',
      type: 'exam',
      title: 'Simulated Exam (F5 + F6 + F7)',
      titleEn: 'Simulated Exam (F5 + F6 + F7)',
      meta: '90 دقيقة • 60 سؤال',
      metaEn: '90 min • 60 questions',
      status: 'draft',
      examTypeLabel: 'اختبار مرحلي',
      examTypeLabelEn: 'Progress Exam'
    },
    {
      id: '11',
      type: 'comprehensive',
      title: 'Simulated Exam شامل – نموذج 1',
      titleEn: 'Comprehensive Exam – Model 1',
      meta: '120 دقيقة • 100 سؤال',
      metaEn: '120 min • 100 questions',
      status: 'published',
      examTypeLabel: 'اختبار شامل',
      examTypeLabelEn: 'Comprehensive Exam'
    },
    {
      id: '12',
      type: 'comprehensive',
      title: 'Simulated Exam شامل – نموذج 2',
      titleEn: 'Comprehensive Exam – Model 2',
      meta: '120 دقيقة • 100 سؤال',
      metaEn: '120 min • 100 questions',
      status: 'published',
      examTypeLabel: 'اختبار شامل',
      examTypeLabelEn: 'Comprehensive Exam'
    }
  ];

  // Logic to determine if it IS Financial Accounting
  // In a real app this would come from DB, but for now we check ID or Name passed/inferred
  // Based on CourseDetailComponent: id=1 is Financial Accounting (Name: 'المحاسبة المالية')

  // Add Form State
  showAddForm: boolean = false;
  newItemType: TimelineItemType = 'chapter';
  newItemTitle: string = '';
  newItemTitleEn: string = '';
  newItemLabel: string = ''; // e.g. F8
  newItemMeta: string = '';
  newItemMetaEn: string = ''; // e.g. 5 lessons

  // Modal State
  showDeleteModal = false;
  itemToDeleteId: string | null = null;

  showEditModal = false;
  showEditForm = false;
  editingItem: TimelineItem | null = null;

  // Edit Form Model
  editItemTitle: string = '';
  editItemTitleEn: string = '';
  editItemType: TimelineItemType = 'chapter';
  editItemLabel: string = '';
  editItemMeta: string = '';
  editItemMetaEn: string = '';

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

      this.loadMaterialData();
      this.setupBreadcrumbs();
    });

    // react to language changes to update material name if needed
    this.langSub = this.translationService.lang$.subscribe(lang => {
      if (this.materialId === 1) {
        this.materialName = lang === 'ar' ? 'المحاسبة المالية' : 'Financial Accounting';
      }
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  loadMaterialData() {
    // Simulate fetching material name
    // For demo purposes, we'll try to get it from navigation state OR infer from ID
    // If materialId == 1 (Financial Accounting from course-detail mock), use the data.
    // Else empty.

    // We can fetch course to get code
    const course = this.courseService.getCourseById(this.courseId);
    this.courseCode = course?.code || 'Course';

    // Mock Material Lookup
    // In CourseDetailComponent, Material ID 1 is "المحاسبة المالية"
    if (this.materialId === 1) {
      this.materialName = this.translationService.current === 'ar' ? 'المحاسبة المالية' : 'Financial Accounting';
      this.timelineData = [...this.financialAccountingData];
    } else {
      // Fallback or generic
      this.materialName = this.translationService.current === 'ar' ? 'مادة تجريبية' : 'Trial Material';
      // If user navigated from course detail, we might have passed state. 
      // check history state? Angular 7+
      const state = history.state;
      if (state && state.materialName) {
        this.materialName = state.materialName;
      }
      this.timelineData = []; // Empty for others
    }
  }

  setupBreadcrumbs() {
    this.headerService.setBreadcrumbs([
      { label: this.translationService.translate('CERTIFICATES'), url: '/' },
      { label: this.courseCode, url: `/course/${this.courseId}` },
      { label: this.translationService.translate('COURSE_MATERIALS'), url: `/course/${this.courseId}` },
      { label: this.materialName }
    ]);
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.showEditForm = false;
    this.resetForm();
  }

  resetForm() {
    this.newItemTitle = '';
    this.newItemTitleEn = '';
    this.newItemLabel = '';
    this.newItemMeta = '';
    this.newItemMetaEn = '';
    this.newItemType = 'chapter';
  }

  saveItem() {
    if (!this.newItemTitle) return;

    const newItem: TimelineItem = {
      id: Date.now().toString(),
      type: this.newItemType,
      title: this.newItemTitle,
      titleEn: this.newItemTitleEn || this.newItemTitle,
      label: this.newItemType === 'chapter' ? (this.newItemLabel || `Ch${this.timelineData.length + 1}`) : undefined,
      meta: this.newItemMeta || (this.newItemType === 'chapter' ? '0 دروس' : '0 دقيقة'),
      metaEn: this.newItemMetaEn || this.newItemMeta || (this.newItemType === 'chapter' ? '0 lessons' : '0 min'),
      status: 'draft',
      examTypeLabel: this.newItemType !== 'chapter' ? 'اختبار' : undefined,
      examTypeLabelEn: this.newItemType !== 'chapter' ? 'Exam' : undefined
    };

    this.timelineData.push(newItem);
    this.showAddForm = false;
    this.resetForm();
  }

  // Delete Modal Logic
  openDeleteModal(id: string) {
    this.itemToDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.itemToDeleteId) {
      this.timelineData = this.timelineData.filter(item => item.id !== this.itemToDeleteId);
      this.itemToDeleteId = null;
      this.showDeleteModal = false;
    }
  }

  cancelDelete() {
    this.itemToDeleteId = null;
    this.showDeleteModal = false;
  }

  // Edit Form Logic - Inline instead of Modal
  openEditModal(item: TimelineItem) {
    this.editingItem = item;
    this.editItemTitle = item.title;
    this.editItemTitleEn = item.titleEn || item.title;
    this.editItemType = item.type;
    this.editItemLabel = item.label || '';
    this.editItemMeta = item.meta;
    this.editItemMetaEn = item.metaEn || item.meta;
    this.showEditForm = true;
    this.showAddForm = false;
    this.showEditModal = false; // Not using modal anymore
  }

  updateItem() {
    if (this.editingItem && this.editItemTitle) {
      const index = this.timelineData.findIndex(i => i.id === this.editingItem!.id);
      if (index !== -1) {
        this.timelineData[index] = {
          ...this.timelineData[index],
          title: this.editItemTitle,
          titleEn: this.editItemTitleEn || this.editItemTitle,
          type: this.editItemType,
          label: this.editItemType === 'chapter' ? (this.editItemLabel || this.timelineData[index].label) : undefined,
          meta: this.editItemMeta,
          metaEn: this.editItemMetaEn || this.editItemMeta
        };
      }
      this.showEditModal = false;
      this.editingItem = null;
    }
  }

  cancelEdit() {
    this.showEditForm = false;
    this.showEditModal = false;
    this.editingItem = null;
  }

  // Drag and Drop Handler
  onDrop(event: CdkDragDrop<TimelineItem[]>) {
    moveItemInArray(this.timelineData, event.previousIndex, event.currentIndex);
  }

  // Constrain drag to only vertical movement
  dragConstraint = (point: Point, _dragRef: any, _dimensions: DOMRect, pickupPosition: Point): Point => {
    // Keep X fixed to pickup position, only allow Y changes
    return {
      x: pickupPosition.x,
      y: point.y
    };
  };

  // Navigate to chapter detail page
  navigateToChapter(item: TimelineItem) {
    if (item.type === 'chapter') {
      this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', item.id]);
    }
  }

  // Icons helper (since we can't use React Icons directly, we use SVG or classes)
  // In template we will use SVGs similar to reference
}
