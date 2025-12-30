import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'ar' | 'en';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private currentLang = new BehaviorSubject<Lang>('ar');
    lang$ = this.currentLang.asObservable();

    private dictionary: Record<string, Record<string, string>> = {
        'ar': {
            'CERTIFICATES': 'الشهادات',
            'SUBTITLE': 'إدارة البرامج الدراسية والشهادات المهنية ومتابعة أدائها بشكل فعال',
            'ADD_NEW': 'إضافة شهادة جديدة',
            'ALL': 'الكل',
            'TECHNICAL': 'الشهادات الفنية (1)',
            'DIPLOMA': 'الدبلومات (1)',
            'FELLOWSHIP': 'الزمالات (2)',
            'ACTIVE': 'مفعلة',
            'INACTIVE': 'غير مفعلة',
            'LESSONS': 'مواد',
            'SEARCH_PLACEHOLDER': 'بحث في الشهادات والمواد...',
            'CREATE_NEW': 'إنشاء برنامج دراسي جديد',
            'CONFIRM_DELETE': 'هل أنت متأكد من حذف هذه الشهادة؟',
            'ADD_MATERIALS': 'إضافة مواد',
            'NOT_ADDED_YET': 'لم يضاف بعد'
        },
        'en': {
            'CERTIFICATES': 'Certificates',
            'SUBTITLE': 'Manage study programs and professional certificates effectively',
            'ADD_NEW': 'Add New Course',
            'ALL': 'All',
            'TECHNICAL': 'Technical Certs (1)',
            'DIPLOMA': 'Diplomas (1)',
            'FELLOWSHIP': 'Fellowships (2)',
            'ACTIVE': 'Active',
            'INACTIVE': 'Inactive',
            'LESSONS': 'Lessons',
            'SEARCH_PLACEHOLDER': 'Search certificates and lessons...',
            'CREATE_NEW': 'Create new study program',
            'CONFIRM_DELETE': 'Are you sure you want to delete this certificate?',
            'ADD_MATERIALS': 'Add Materials',
            'NOT_ADDED_YET': 'Not added yet'
        }
    };

    constructor() {
        this.updateDirection('ar');
    }

    setLanguage(lang: Lang) {
        this.currentLang.next(lang);
        this.updateDirection(lang);
    }

    get current() {
        return this.currentLang.value;
    }

    translate(key: string): string {
        return this.dictionary[this.current][key] || key;
    }

    private updateDirection(lang: Lang) {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', lang);
    }
}
