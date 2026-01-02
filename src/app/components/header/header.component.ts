import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SidebarStateService } from '../../services/sidebar-state.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { HeaderService, Breadcrumb } from '../../services/header.service';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  searchTerm = '';
  breadcrumbs: Breadcrumb[] = [];
  isUserMenuOpen = false;
  isMaterialsMenuOpen = false;
  userName = 'Admin User';
  userInitials = 'AU';

  materials = [
    { id: 1, name: 'نسخة تجريبية', nameEn: 'Trial Version', code: 'FAR', color: '#1D4ED8' },
    { id: 2, name: 'نسخة تجريبية', nameEn: 'Trial Version', code: 'AUD', color: '#EA580C' },
    { id: 3, name: 'نسخة تجريبية', nameEn: 'Trial Version', code: 'REG', color: '#7C3AED' },
    { id: 4, name: 'نسخة تجريبية', nameEn: 'Trial Version', code: 'BAR', color: '#0891B2' },
    { id: 5, name: 'نسخة تجريبية', nameEn: 'Trial Version', code: 'ISC', color: '#EAB308' },
    { id: 6, name: 'نسخة تجريبية', nameEn: 'Trial Version', code: 'TCP', color: '#A855F7' },
  ];

  constructor(
    private searchService: SearchService,
    private sidebarState: SidebarStateService,
    private headerService: HeaderService,
    public translationService: TranslationService
  ) { }

  ngOnInit() {
    this.headerService.breadcrumbs$.subscribe(items => {
      this.breadcrumbs = items;
    });
  }

  onSearch(value: string) {
    this.searchService.setTerm(value?.trim() ?? '');
  }

  toggleMobileMenu() {
    this.sidebarState.toggle();
  }

  toggleLang() {
    const next = this.translationService.current === 'ar' ? 'en' : 'ar';
    this.translationService.setLanguage(next);
    this.isUserMenuOpen = false;
    // Reload to apply language changes
    window.location.reload();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isMaterialsMenuOpen = false;
  }

  toggleMaterialsMenu() {
    this.isMaterialsMenuOpen = !this.isMaterialsMenuOpen;
    this.isUserMenuOpen = false;
  }
}
