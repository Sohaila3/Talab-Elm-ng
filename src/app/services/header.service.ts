import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
    label: string;
    url?: string;
    isActive?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
    breadcrumbs$ = this.breadcrumbsSubject.asObservable();

    setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
        this.breadcrumbsSubject.next(breadcrumbs);
    }
}
