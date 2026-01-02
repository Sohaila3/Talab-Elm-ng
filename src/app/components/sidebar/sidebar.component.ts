import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarStateService } from '../../services/sidebar-state.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface MenuItem {
  icon: string;
  labelKey: string;
  active: boolean;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [
    { labelKey: 'HOME', icon: 'home', active: false },
    { labelKey: 'CERTIFICATES', icon: 'award', active: true },
    { labelKey: 'LIVE_SESSIONS', icon: 'video', active: false },
    { labelKey: 'ACCOUNT_MANAGEMENT', icon: 'users', active: false },
    { labelKey: 'PRICES', icon: 'tag', active: false },
    { labelKey: 'SUBSCRIPTIONS', icon: 'shield', active: false },
    { labelKey: 'PAYMENTS', icon: 'credit-card', active: false },
    { labelKey: 'CUSTOMER_SERVICE', icon: 'headphones', active: false }
  ];
  collapsed = false;
  isOpen = false;
  private _sub: Subscription | null = null;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  closeSidebar() {
    this.sidebarState.close();
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
