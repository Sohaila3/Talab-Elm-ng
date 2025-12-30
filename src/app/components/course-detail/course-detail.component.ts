import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../services/course.service';
import { HeaderService } from '../../services/header.service';
import { TranslationService } from '../../services/translation.service';

interface Material {
  id: number;
  name: string;
  type: string;
  code: string;
  color: string;
  assignedTo: string;
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course | undefined;
  showAddForm = false;
  searchTerm = '';
  newMaterialColor: string = '#1877F2';
  newMaterialName: string = '';
  newMaterialCode: string = '';
  newMaterialType: string = 'Public';
  newMaterialAssignedTo: string = 'Instructor1@taleb.com';

  // SOCPA materials (id = 1 is SOCPA course)
  socpaMaterials: Material[] = [
    {
      id: 1,
      name: 'المحاسبة المالية',
      type: 'Public',
      code: 'FAR',
      color: '#1D4ED8',
      assignedTo: 'Instructor1@taleb.com',
    },
    {
      id: 2,
      name: 'المراجعة',
      type: 'Public',
      code: 'AUD',
      color: '#EA580C',
      assignedTo: 'Audit_Lead@taleb.com',
    },
    {
      id: 3,
      name: 'الأنظمة',
      type: 'Public',
      code: 'REG',
      color: '#7C3AED',
      assignedTo: 'Law_Dept@taleb.com',
    },
    {
      id: 4,
      name: 'الزكاة والضريبة',
      type: 'Public',
      code: 'ZTX',
      color: '#EAB308',
      assignedTo: 'Tax_Expert@taleb.com',
    },
    {
      id: 5,
      name: 'المحاسبة الإدارية والحكومية',
      type: 'Public',
      code: 'MGA',
      color: '#0D9488',
      assignedTo: 'Business@taleb.com',
    },
    {
      id: 6,
      name: 'بيئة الأعمال',
      type: 'Public',
      code: 'BEV',
      color: '#6D28D9',
      assignedTo: 'HR_Dept@taleb.com',
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
          { label: 'الشهادات', url: '/' },
          { label: this.course.code, url: `/course/${id}` },
          { label: 'المواد' }
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
      m.name.toLowerCase().includes(lowerTerm) ||
      m.code.toLowerCase().includes(lowerTerm) ||
      m.assignedTo.toLowerCase().includes(lowerTerm)
    );
  }

  deleteMaterial(id: number) {
    this.materials = this.materials.filter(m => m.id !== id);
    this.filterMaterials();
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
    this.newMaterialCode = '';
    this.newMaterialType = 'Public';
    this.newMaterialColor = '#1877F2';
    this.newMaterialAssignedTo = 'Instructor1@taleb.com';
  }

  cancelAdd() {
    this.showAddForm = false;
  }

}
