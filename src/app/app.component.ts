import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { CoursesComponent } from './components/courses/courses.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CoursesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Talab Elm';
}
