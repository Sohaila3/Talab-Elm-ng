import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'ar' | 'en';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private currentLang!: BehaviorSubject<Lang>;
    lang$!: ReturnType<BehaviorSubject<Lang>['asObservable']>;

    private dictionary: Record<string, Record<string, string>> = {
        'ar': {
            // Navigation
            'HOME': 'الرئيسية',
            'CERTIFICATES': 'الشهادات',
            'LIVE_SESSIONS': 'البث المباشر',
            'ACCOUNT_MANAGEMENT': 'إدارة الحسابات',
            'PRICES': 'الأسعار',
            'SUBSCRIPTIONS': 'الاشتراكات',
            'PAYMENTS': 'المدفوعات',
            'CUSTOMER_SERVICE': 'خدمة العملاء',
            'HELP_CENTER': 'مركز المساعدة',
            'LOGOUT': 'تسجيل الخروج',
            'LANGUAGE': 'اللغة',

            // Page Headers
            'SUBTITLE': 'إدارة البرامج الدراسية والشهادات المهنية بفعالية',

            // Actions
            'ADD_NEW': 'إضافة دورة جديدة',
            'CREATE_NEW': 'إنشاء برنامج دراسي جديد',
            'CONFIRM_DELETE': 'هل أنت متأكد من حذف هذه الشهادة؟',
            'ADD_MATERIALS': 'إضافة مواد',
            'NOT_ADDED_YET': 'لم تضف بعد',
            'SEARCH_PLACEHOLDER': 'البحث في الشهادات والدروس...',
            'DELETE': 'حذف',

            // Filters
            'ALL': 'الكل',
            'TECHNICAL': 'شهادات تقنية',
            'DIPLOMA': 'دبلومات',
            'FELLOWSHIP': 'زمالات',
            'ACTIVE': 'مفعلة',
            'INACTIVE': 'غير مفعلة',
            'LESSONS': 'دروس',
            'MATERIALS': 'مواد',
            'CME': 'التعليم الطبي المستمر',

            // Certificate Form
            'EDIT_CERTIFICATE': 'تعديل الشهادة',
            'ADD_NEW_CERTIFICATE': 'إضافة شهادة جديدة',
            'EDIT_MSG': 'عدل بيانات الشهادة ثم احفظ التغييرات.',
            'ADD_MSG': 'املأ بيانات الشهادة الجديدة وسيتم عرضها مباشرة في قائمة الشهادات.',
            'CODE': 'الرمز',
            'TITLE': 'العنوان',
            'EN_TITLE': 'العنوان بالإنجليزية',
            'TYPE': 'النوع',
            'DESCRIPTION': 'الوصف',
            'DESC_PLACEHOLDER': 'وصف مختصر عن الشهادة',
            'OPTIONS': 'خيارات',
            'VIDEO_EXIST': 'يوجد فيديو',
            'BOOK_EXIST': 'يوجد كتاب',
            'SAVE_EDIT': 'حفظ التعديل',
            'SAVE_ADD': 'حفظ وإضافة',
            'CANCEL': 'إلغاء',
            'SAVE': 'حفظ',
            'MATERIAL_NAME': 'اسم الشهادة',
            'ALERT_FILL_DATA': 'الرجاء إكمال البيانات المطلوبة (الرمز والعنوان)',

            // Course Detail
            'COURSE_MATERIALS': 'مواد',
            'SOCPA_DESC': 'إدارة المواد الدراسية، الأكواد، والمدربين الخاصين بشهادة الزمالة',
            'GENERIC_DESC': 'إدارة المواد الدراسية الخاصة بهذه الشهادة',
            'SEARCH_MATERIALS': 'بحث في المواد...',
            'CANCEL_ADD': 'إلغاء الإضافة',
            'ADD_NEW_MATERIAL': 'إضافة مادة جديدة',
            'NEW_MATERIAL_DATA': 'بيانات المادة الجديدة',
            'MATERIAL_NAME_LABEL': 'اسم المادة',
            'ENTER_MATERIAL_NAME': 'أدخل اسم المادة',
            'COLOR': 'اللون',
            'ASSIGNED_TO': 'المسؤول',
            'ACTIONS': 'الإجراءات',
            'NO_MATERIALS_ADDED': 'لم تضف مادة بعد',
            'SHOWING': 'عرض',
            'FROM': 'من أصل',
            'ALERT_FILL_REQUIRED': 'يرجى تعبئة الحقول المطلوبة',
            'PUBLIC': 'عام',
            'PRIVATE': 'خاص',
            'OPTIONAL': 'اختياري',
            'SELECT_MATERIAL_COLOR': 'اختر لون المادة',
            'STATUS': 'الحالة',

            // Material Structure
            'MATERIAL_STRUCTURE': 'هيكل المادة',
            'MANAGE_STRUCTURE_DESC': 'قم بإدارة هيكل الدورة التدريبية من خلال تنظيم الفصول والاختبارات',
            'ADD_ITEM': 'إضافة عنصر جديد',
            'ITEM_DETAILS_MSG': 'أدخل تفاصيل العنصر ليتم إضافته إلى الهيكل',
            'ITEM_TITLE': 'العنوان',
            'ITEM_TYPE': 'النوع',
            'CHAPTER': 'فصل',
            'PROGRESS_EXAM': 'اختبار مرحلي',
            'COMPREHENSIVE_EXAM': 'اختبار شامل',
            'LABEL': 'الرمز',
            'METADATA': 'الوصف الإضافي',
            'NO_CONTENT_ADDED': 'لا يوجد محتوى مضاف حالياً',
            'START_ADDING_MSG': 'ابدأ بإضافة فصول أو اختبارات لهيكل المادة',
            'PUBLISHED': 'منشور',
            'DRAFT': 'مسودة',
            'DELETE_CONFIRM_TITLE': 'تأكيد الحذف',
            'DELETE_CONFIRM_MSG': 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
            'EDIT_ITEM': 'تعديل العنصر',
            'UPDATE_ITEM_MSG': 'قم بتحديث بيانات الفصل أو الاختبار',
            'SAVE_CHANGES': 'حفظ التغييرات',
            'DELETE_CONFIRM': 'تأكيد الحذف',
            'DELETE_CONFIRM_MESSAGE': 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
            'AVAILABLE_COURSES': 'الدورات',
            'MANAGE_DEPARTMENTS': 'إدارة الأقسام',
            
            // Bilingual Fields
            'TITLE_AR': 'العنوان بالعربية',
            'TITLE_EN': 'العنوان بالإنجليزية',
            'DESCRIPTION_AR': 'الوصف بالعربية',
            'DESCRIPTION_EN': 'الوصف بالإنجليزية',
            'NAME_AR': 'الاسم بالعربية',
            'NAME_EN': 'الاسم بالإنجليزية',
            'MATERIAL_NAME_AR': 'اسم المادة بالعربية',
            'MATERIAL_NAME_EN': 'اسم المادة بالإنجليزية',
            'ITEM_TITLE_AR': 'العنوان بالعربية',
            'ITEM_TITLE_EN': 'العنوان بالإنجليزية',
            'ITEM_DESC_AR': 'الوصف بالعربية',
            'ITEM_DESC_EN': 'الوصف بالإنجليزية'
        },
        'en': {
            // Navigation
            'HOME': 'Home',
            'CERTIFICATES': 'Certificates',
            'LIVE_SESSIONS': 'Live Sessions',
            'ACCOUNT_MANAGEMENT': 'Account Management',
            'PRICES': 'Pricing',
            'SUBSCRIPTIONS': 'Subscriptions',
            'PAYMENTS': 'Payments',
            'CUSTOMER_SERVICE': 'Customer Service',
            'HELP_CENTER': 'Help Center',
            'LOGOUT': 'Log Out',
            'LANGUAGE': 'Language',

            // Page Headers
            'SUBTITLE': 'Manage study programs and professional certificates effectively',

            // Actions
            'ADD_NEW': 'Add New Course',
            'CREATE_NEW': 'Create new study program',
            'CONFIRM_DELETE': 'Are you sure you want to delete this certificate?',
            'ADD_MATERIALS': 'Add Materials',
            'NOT_ADDED_YET': 'Not added yet',
            'SEARCH_PLACEHOLDER': 'Search certificates and lessons...',
            'DELETE': 'Delete',

            // Filters
            'ALL': 'All',
            'TECHNICAL': 'Technical Certs',
            'DIPLOMA': 'Diplomas',
            'FELLOWSHIP': 'Fellowships',
            'ACTIVE': 'Active',
            'INACTIVE': 'Inactive',
            'LESSONS': 'Lessons',
            'MATERIALS': 'Materials',
            'CME': 'Continuing Medical Education',

            // Certificate Form
            'EDIT_CERTIFICATE': 'Edit Certificate',
            'ADD_NEW_CERTIFICATE': 'Add New Certificate',
            'EDIT_MSG': 'Edit certificate details and save changes.',
            'ADD_MSG': 'Fill in the new certificate details to display it in the list.',
            'CODE': 'Code',
            'TITLE': 'Title',
            'EN_TITLE': 'English Title',
            'TYPE': 'Type',
            'DESCRIPTION': 'Description',
            'DESC_PLACEHOLDER': 'Brief description of the certificate',
            'OPTIONS': 'Options',
            'VIDEO_EXIST': 'Video Available',
            'BOOK_EXIST': 'Book Available',
            'SAVE_EDIT': 'Save Changes',
            'SAVE_ADD': 'Save and Add',
            'CANCEL': 'Cancel',
            'SAVE': 'Save',
            'MATERIAL_NAME': 'Certificate Name',
            'ALERT_FILL_DATA': 'Please fill in the required data (Code and Title)',

            // Course Detail
            'COURSE_MATERIALS': 'Materials',
            'SOCPA_DESC': 'Manage study materials, codes, and instructors for the Fellowship certificate',
            'GENERIC_DESC': 'Manage study materials for this certificate',
            'SEARCH_MATERIALS': 'Search materials...',
            'CANCEL_ADD': 'Cancel',
            'ADD_NEW_MATERIAL': 'Add New Material',
            'NEW_MATERIAL_DATA': 'New Material Data',
            'MATERIAL_NAME_LABEL': 'Material Name',
            'ENTER_MATERIAL_NAME': 'Enter material name',
            'COLOR': 'Color',
            'ASSIGNED_TO': 'Assigned To',
            'ACTIONS': 'Actions',
            'NO_MATERIALS_ADDED': 'No materials added yet',
            'SHOWING': 'Showing',
            'FROM': 'of',
            'ALERT_FILL_REQUIRED': 'Please fill in required fields',
            'PUBLIC': 'Public',
            'PRIVATE': 'Private',
            'OPTIONAL': 'Optional',
            'SELECT_MATERIAL_COLOR': 'Select material color',
            'STATUS': 'Status',

            // Material Structure
            'MATERIAL_STRUCTURE': 'Material Structure',
            'MANAGE_STRUCTURE_DESC': 'Manage course structure by organizing chapters and simulated exams',
            'ADD_ITEM': 'Add New Item',
            'ITEM_DETAILS_MSG': 'Enter item details to be added to the structure',
            'ITEM_TITLE': 'Title',
            'ITEM_TYPE': 'Type',
            'CHAPTER': 'Chapter',
            'PROGRESS_EXAM': 'Progress Exam',
            'COMPREHENSIVE_EXAM': 'Comprehensive Exam',
            'LABEL': 'Label',
            'METADATA': 'Additional Description',
            'NO_CONTENT_ADDED': 'No content added yet',
            'START_ADDING_MSG': 'Start adding chapters or exams to the material structure',
            'PUBLISHED': 'Published',
            'DRAFT': 'Draft',
            'DELETE_CONFIRM_TITLE': 'Confirm Delete',
            'DELETE_CONFIRM_MSG': 'Are you sure you want to delete this item? This action cannot be undone.',
            'EDIT_ITEM': 'Edit Item',
            'UPDATE_ITEM_MSG': 'Update chapter or exam details',
            'SAVE_CHANGES': 'Save Changes',
            'DELETE_CONFIRM': 'Confirm Delete',
            'DELETE_CONFIRM_MESSAGE': 'Are you sure you want to delete this item? This action cannot be undone.',
            'AVAILABLE_COURSES': 'Courses',
            'MANAGE_DEPARTMENTS': 'Manage Departments',
            
            // Bilingual Fields
            'TITLE_AR': 'Arabic Title',
            'TITLE_EN': 'English Title',
            'DESCRIPTION_AR': 'Arabic Description',
            'DESCRIPTION_EN': 'English Description',
            'NAME_AR': 'Arabic Name',
            'NAME_EN': 'English Name',
            'MATERIAL_NAME_AR': 'Arabic Material Name',
            'MATERIAL_NAME_EN': 'English Material Name',
            'ITEM_TITLE_AR': 'Arabic Title',
            'ITEM_TITLE_EN': 'English Title',
            'ITEM_DESC_AR': 'Arabic Description',
            'ITEM_DESC_EN': 'English Description'
        }
    };
    private readonly STORAGE_KEY = 'talab_elm_lang';

    constructor() {
        // Load saved language from localStorage, default to 'ar'
        const savedLang = this.getSavedLanguage();
        this.currentLang = new BehaviorSubject<Lang>(savedLang);
        this.lang$ = this.currentLang.asObservable();
        this.updateDirection(savedLang);
    }

    private getSavedLanguage(): Lang {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved === 'ar' || saved === 'en') {
                return saved;
            }
        }
        return 'ar'; // Default to Arabic
    }

    setLanguage(lang: Lang) {
        this.currentLang.next(lang);
        this.updateDirection(lang);
        // Save to localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, lang);
        }
    }

    get current() {
        return this.currentLang.value;
    }

    translate(key: string): string {
        return this.dictionary[this.current][key] || key;
    }

    private updateDirection(lang: Lang) {
        if (typeof document !== 'undefined') {
            const dir = lang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.setAttribute('dir', dir);
            document.documentElement.setAttribute('lang', lang);
        }
    }
}
