import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../services/course.service';
import { HeaderService } from '../../services/header.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface Material {
  id: number;
  name: string;
  nameEn: string;
  type: string;
  code: string;
  color: string;
  assignedTo: string;
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course | undefined; // Add/Edit Form
  showAddForm = false;
  showEditForm = false;
  editingMaterial: Material | null = null;

  // Delete Modal
  showDeleteModal = false;
  deletingMaterialId: number | null = null;
  searchTerm = '';
  newMaterialColor: string = '#1877F2';
  newMaterialName: string = '';
  newMaterialNameEn: string = '';
  newMaterialCode: string = '';
  newMaterialType: string = 'Public';
  newMaterialAssignedTo: string = 'instructor@taleb.com';

  // Edit Form Fields
  editMaterialName: string = '';
  editMaterialNameEn: string = '';
  editMaterialCode: string = '';
  editMaterialType: string = 'Public';
  editMaterialColor: string = '#1877F2';
  editMaterialAssignedTo: string = 'instructor@taleb.com';

  // SOCPA materials (id = 1 is SOCPA course)
  socpaMaterials: Material[] = [
    {
      id: 1,
      name: 'المحاسبة المالية',
      nameEn: 'Financial Accounting',
      type: 'Public',
      code: 'FAR',
      color: '#1D4ED8',
      assignedTo: 'instructor@taleb.com',
    },
    {
      id: 2,
      name: 'المراجعة',
      nameEn: 'Auditing',
      type: 'Public',
      code: 'AUD',
      color: '#EA580C',
      assignedTo: 'auditlead@taleb.com',
    },
    {
      id: 3,
      name: 'الأنظمة',
      nameEn: 'Regulations',
      type: 'Public',
      code: 'REG',
      color: '#7C3AED',
      assignedTo: 'lawdept@taleb.com',
    },
    {
      id: 4,
      name: 'الزكاة والضريبة',
      nameEn: 'Zakat and Tax',
      type: 'Public',
      code: 'ZTX',
      color: '#EAB308',
      assignedTo: 'taxexpert@taleb.com',
    },
    {
      id: 5,
      name: 'المحاسبة الإدارية والحكومية',
      nameEn: 'Management & Government Accounting',
      type: 'Public',
      code: 'MGA',
      color: '#0D9488',
      assignedTo: 'Business@taleb.com',
    },
    {
      id: 6,
      name: 'بيئة الأعمال',
      nameEn: 'Business Environment',
      type: 'Public',
      code: 'BEV',
      color: '#6D28D9',
      assignedTo: 'hrdept@taleb.com',
    },
  ];

  materials: Material[] = [];
  filteredMaterials: Material[] = [];

  get isSocpa(): boolean {
    return this.course?.id === 1;
  }

  constructor(
    private route: ActivatedRoute,
    private cs: CourseService,
    private router: Router,
    private headerService: HeaderService,
    public translationService: TranslationService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.course = this.cs.getCourseById(id);

      // Set Breadcrumbs
      if (this.course) {
        this.headerService.setBreadcrumbs([
          { label: this.translationService.translate('CERTIFICATES'), url: '/' },
          { label: this.course.code, url: `/course/${id}` },
          { label: this.translationService.translate('MATERIALS') }
        ]);

        // Only SOCPA has materials
        if (this.course.id === 1) {
          this.materials = [...this.socpaMaterials];
        } else {
          this.materials = [];
        }
      }
    }
    this.filterMaterials();
  }

  ngOnDestroy() {
    this.headerService.setBreadcrumbs([]);
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.showEditForm = false;
    this.editingMaterial = null;
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.filterMaterials();
  }

  filterMaterials() {
    if (!this.searchTerm) {
      this.filteredMaterials = [...this.materials];
      return;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    this.filteredMaterials = this.materials.filter(m =>
      (m.name && m.name.toLowerCase().includes(lowerTerm)) ||
      (m.nameEn && m.nameEn.toLowerCase().includes(lowerTerm)) ||
      m.code.toLowerCase().includes(lowerTerm) ||
      m.assignedTo.toLowerCase().includes(lowerTerm)
    );
  }

  openDeleteModal(id: number) {
    this.deletingMaterialId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingMaterialId = null;
  }

  confirmDelete() {
    if (this.deletingMaterialId !== null) {
      this.materials = this.materials.filter(m => m.id !== this.deletingMaterialId);
      this.filterMaterials();
    }
    this.closeDeleteModal();
  }

  deleteMaterial(id: number) {
    this.openDeleteModal(id);
  }

  openMaterialStructure(material: Material) {
    if (this.course) {
      this.router.navigate(['/course', this.course.id, 'material', material.id]);
    }
  }

  // Placeholder actions
  saveMaterial() {
    if (!this.newMaterialName || !this.newMaterialCode) {
      alert('Please fill in required fields');
      return;
    }

    const newMat: Material = {
      id: Date.now(),
      name: this.newMaterialName,
      nameEn: this.newMaterialNameEn || this.newMaterialName,
      type: this.newMaterialType,
      code: this.newMaterialCode,
      color: this.newMaterialColor,
      assignedTo: this.newMaterialAssignedTo
    };

    this.materials.push(newMat);
    this.filterMaterials();
    this.resetForm();
    this.showAddForm = false;
  }

  resetForm() {
    this.newMaterialName = '';
    this.newMaterialNameEn = '';
    this.newMaterialCode = '';
    this.newMaterialType = 'Public';
    this.newMaterialColor = '#1877F2';
    this.newMaterialAssignedTo = 'instructor@taleb.com';
  }

  cancelAdd() {
    this.showAddForm = false;
  }

  // Edit Material Methods
  openEditMaterial(material: Material) {
    this.editingMaterial = material;
    this.editMaterialName = material.name;
    this.editMaterialNameEn = material.nameEn;
    this.editMaterialCode = material.code;
    this.editMaterialType = material.type;
    this.editMaterialColor = material.color;
    this.editMaterialAssignedTo = material.assignedTo;
    this.showEditForm = true;
    this.showAddForm = false;
  }

  updateMaterial() {
    if (!this.editingMaterial) return;
    if (!this.editMaterialName || !this.editMaterialCode) {
      alert(this.translationService.translate('ALERT_FILL_REQUIRED'));
      return;
    }

    const idx = this.materials.findIndex(m => m.id === this.editingMaterial!.id);
    if (idx !== -1) {
      this.materials[idx] = {
        ...this.materials[idx],
        name: this.editMaterialName,
        nameEn: this.editMaterialNameEn || this.editMaterialName,
        code: this.editMaterialCode,
        type: this.editMaterialType,
        color: this.editMaterialColor,
        assignedTo: this.editMaterialAssignedTo
      };
    }
    this.filterMaterials();
    this.cancelEdit();
  }

  cancelEdit() {
    this.showEditForm = false;
    this.editingMaterial = null;
  }

}
