import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarStateService } from '../../services/sidebar-state.service';
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
    { label: 'الرئيسية', icon: 'home', active: false },
    { label: 'الشهادات', icon: 'award', active: true },
    { label: 'الحصص المباشرة', icon: 'video', active: false },
    { label: 'إدارة الحسابات', icon: 'users', active: false },
    { label: 'الأسعار', icon: 'tag', active: false },
    { label: 'الاشتراكات', icon: 'shield', active: false },
    { label: 'المدفوعات', icon: 'credit-card', active: false },
    { label: 'خدمة العملاء', icon: 'headphones', active: false }
  ];
  collapsed = false;
  isOpen = false;
  private _sub: Subscription | null = null;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
  @Output() collapsedChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this._sub = this.sidebarState.open$.subscribe(v => this.isOpen = v);
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
    this._sub = null;
  }

  constructor(private sidebarState: SidebarStateService) { }
}
