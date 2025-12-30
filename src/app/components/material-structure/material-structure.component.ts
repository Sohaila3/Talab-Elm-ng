import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { CourseService } from '../../services/course.service';

type TimelineItemType = 'chapter' | 'exam' | 'comprehensive';
type StatusType = 'published' | 'draft';

interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  label?: string;
  meta: string;
  status?: StatusType;
  examTypeLabel?: string;
}

@Component({
  selector: 'app-material-structure',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './material-structure.component.html',
  styleUrl: './material-structure.component.css'
})
export class MaterialStructureComponent implements OnInit {
  courseId: number = 0;
  materialId: number = 0;
  materialName: string = '';
  courseCode: string = '';

  timelineData: TimelineItem[] = [];

  // Financial Accounting Data (Hardcoded based on 5.tsx)
  private financialAccountingData: TimelineItem[] = [
    {
      id: '1',
      type: 'chapter',
      label: 'F1',
      title: 'الفصل الأول: الإطار النظري للمحاسبة المالية',
      meta: '4 دروس',
      status: 'published'
    },
    {
      id: '2',
      type: 'chapter',
      label: 'F2',
      title: 'الفصل الثاني: القوائم المالية وعناصرها',
      meta: '6 دروس',
      status: 'published'
    },
    {
      id: '3',
      type: 'exam',
      title: 'Simulated Exam (F1 + F2)',
      meta: '60 دقيقة • 40 سؤال',
      status: 'published',
      examTypeLabel: 'اختبار مرحلي'
    },
    {
      id: '4',
      type: 'chapter',
      label: 'F3',
      title: 'الفصل الثالث: الأصول المتداولة والقياس',
      meta: '5 دروس',
      status: 'published'
    },
    {
      id: '5',
      type: 'chapter',
      label: 'F4',
      title: 'الفصل الرابع: الأصول غير المتداولة والاستهلاك',
      meta: '7 دروس',
      status: 'draft'
    },
    {
      id: '6',
      type: 'exam',
      title: 'Simulated Exam (F3 + F4)',
      meta: '60 دقيقة • 40 سؤال',
      status: 'draft',
      examTypeLabel: 'اختبار مرحلي'
    },
    {
      id: '7',
      type: 'chapter',
      label: 'F5',
      title: 'الفصل الخامس: الالتزامات قصيرة وطويلة الأجل',
      meta: '4 دروس',
      status: 'draft'
    },
    {
      id: '8',
      type: 'chapter',
      label: 'F6',
      title: 'الفصل السادس: حقوق الملكية والتغيرات',
      meta: '3 دروس',
      status: 'draft'
    },
    {
      id: '9',
      type: 'chapter',
      label: 'F7',
      title: 'الفصل السابع: قائمة التدفقات النقدية',
      meta: '5 دروس',
      status: 'draft'
    },
    {
      id: '10',
      type: 'exam',
      title: 'Simulated Exam (F5 + F6 + F7)',
      meta: '90 دقيقة • 60 سؤال',
      status: 'draft',
      examTypeLabel: 'اختبار مرحلي'
    },
    {
      id: '11',
      type: 'comprehensive',
      title: 'Simulated Exam شامل – نموذج 1',
      meta: '120 دقيقة • 100 سؤال',
      status: 'published',
      examTypeLabel: 'اختبار شامل'
    },
    {
      id: '12',
      type: 'comprehensive',
      title: 'Simulated Exam شامل – نموذج 2',
      meta: '120 دقيقة • 100 سؤال',
      status: 'published',
      examTypeLabel: 'اختبار شامل'
    }
  ];

  // Logic to determine if it IS Financial Accounting
  // In a real app this would come from DB, but for now we check ID or Name passed/inferred
  // Based on CourseDetailComponent: id=1 is Financial Accounting (Name: 'المحاسبة المالية')

  // Add Form State
  showAddForm: boolean = false;
  newItemType: TimelineItemType = 'chapter';
  newItemTitle: string = '';
  newItemLabel: string = ''; // e.g. F8
  newItemMeta: string = ''; // e.g. 5 lessons

  // Modal State
  showDeleteModal = false;
  itemToDeleteId: string | null = null;

  showEditModal = false;
  editingItem: TimelineItem | null = null;

  // Edit Form Model
  editItemTitle: string = '';
  editItemType: TimelineItemType = 'chapter';
  editItemLabel: string = '';
  editItemMeta: string = '';

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private courseService: CourseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = Number(params.get('courseId'));
      this.materialId = Number(params.get('materialId'));

      this.loadMaterialData();
      this.setupBreadcrumbs();
    });
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
      this.materialName = 'المحاسبة المالية';
      this.timelineData = [...this.financialAccountingData];
    } else {
      // Fallback or generic
      this.materialName = 'مادة تجريبية'; // Or fetch from service if exists
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
      { label: 'الشهادات', url: '/' },
      { label: this.courseCode, url: `/course/${this.courseId}` },
      { label: 'المواد', url: `/course/${this.courseId}` }, // Navigate back to course detail text
      { label: this.materialName }
    ]);
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.resetForm();
  }

  resetForm() {
    this.newItemTitle = '';
    this.newItemLabel = '';
    this.newItemMeta = '';
    this.newItemType = 'chapter';
  }

  saveItem() {
    if (!this.newItemTitle) return;

    const newItem: TimelineItem = {
      id: Date.now().toString(),
      type: this.newItemType,
      title: this.newItemTitle,
      label: this.newItemType === 'chapter' ? (this.newItemLabel || `Ch${this.timelineData.length + 1}`) : undefined,
      meta: this.newItemMeta || (this.newItemType === 'chapter' ? '0 دروس' : '0 دقيقة'),
      status: 'draft',
      examTypeLabel: this.newItemType !== 'chapter' ? 'اختبار' : undefined
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

  // Edit Modal Logic
  openEditModal(item: TimelineItem) {
    this.editingItem = item;
    this.editItemTitle = item.title;
    this.editItemType = item.type;
    this.editItemLabel = item.label || '';
    this.editItemMeta = item.meta;
    this.showEditModal = true;
  }

  updateItem() {
    if (this.editingItem && this.editItemTitle) {
      const index = this.timelineData.findIndex(i => i.id === this.editingItem!.id);
      if (index !== -1) {
        this.timelineData[index] = {
          ...this.timelineData[index],
          title: this.editItemTitle,
          type: this.editItemType,
          label: this.editItemType === 'chapter' ? (this.editItemLabel || this.timelineData[index].label) : undefined,
          meta: this.editItemMeta,
        };
      }
      this.showEditModal = false;
      this.editingItem = null;
    }
  }

  cancelEdit() {
    this.showEditModal = false;
    this.editingItem = null;
  }

  // Icons helper (since we can't use React Icons directly, we use SVG or classes)
  // In template we will use SVGs similar to reference
}
