import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  icon: string;
  label: string;
  active: boolean;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { icon: 'home', label: 'الرئيسية', active: false },
    { icon: 'book', label: 'الدورات', active: true },
    { icon: 'video', label: 'الحصص المباشرة', active: false },
    { icon: 'users', label: 'إدارة الحسابات', active: false },
    { icon: 'tag', label: 'الأسعار', active: false },
    { icon: 'credit-card', label: 'الاشتراكات', active: false },
    { icon: 'file-text', label: 'المدفوعات', active: false },
    { icon: 'headphones', label: 'خدمة العملاء', active: false }
  ];
}
