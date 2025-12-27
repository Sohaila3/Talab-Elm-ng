import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userName = 'Admin User';
  userRole = 'المالك';

  constructor(private searchService: SearchService) {}

  onSearch(value: string) {
    this.searchService.setTerm(value?.trim() ?? '');
  }
}
