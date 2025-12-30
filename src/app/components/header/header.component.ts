import { Component, OnInit } from '@angular/core';
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
  userName = 'Admin User';
  userRole = 'المالك';
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private searchService: SearchService,
    private sidebarState: SidebarStateService,
    private headerService: HeaderService,
    public translationService: TranslationService // public for template access
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
  }
}
