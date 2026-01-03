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
            'ITEM_DESC_EN': 'الوصف بالإنجليزية',

            // Chapter Detail Page
            'ACTIVE_NOW': 'نشط حالياً',
            'ADD_NEW_MODULE': 'إضافة وحدة جديدة',
            'PREVIEW_CHAPTER': 'معاينة الفصل',
            'MODULES': 'وحدات',
            'DURATION': 'المدة',
            'CHAPTER_DESC_PART1': 'يحتوي هذا الفصل على',
            'CHAPTER_DESC_PART2': 'أساسية. يمكنك ترتيب الوحدات، إضافة محتوى جديد، أو تعديل حالة النشر لكل وحدة.',
            'MODULE_TITLE': 'عنوان الوحدة',
            'MODULE_TITLE_EN': 'عنوان الوحدة بالإنجليزية',
            'MODULE_DETAILS_MSG': 'أدخل تفاصيل الوحدة التعليمية',
            'VIDEO_COUNT': 'عدد الفيديوهات',
            'MCQ_COUNT': 'عدد الأسئلة الاختيارية',
            'ESSAY_COUNT': 'عدد الأسئلة المقالية',
            'FLASHCARD_COUNT': 'عدد البطاقات التعليمية',
            'EDIT_MODULE': 'تعديل الوحدة',
            'UPDATE_MODULE_MSG': 'قم بتحديث بيانات الوحدة التعليمية',
            'NO_MODULES_YET': 'لا توجد وحدات تعليمية بعد',
            'START_ADDING_MODULES_MSG': 'ابدأ بإضافة وحدات تعليمية لهذا الفصل',
            'NO_CONTENT_YET': 'لا يوجد محتوى بعد',
            'VIDEO_CLIPS': 'مقاطع فيديو',
            'MCQ_QUESTIONS': 'سؤال اختياري',
            'ESSAY_QUESTIONS': 'أسئلة مقالية',
            'FLASHCARDS': 'بطاقات تعليمية',
            'ADD_NEW_MODULE_BTN': 'إضافة وحدة تعليمية جديدة',
            'TOTAL_MODULES': 'إجمالي الوحدات',
            'PUBLISHED_COUNT': 'تم النشر',
            'DRAFT_COUNT': 'قيد المسودة',
            'BACK_TO_STRUCTURE': 'العودة لهيكل المادة',
            'DELETE_MODULE_MSG': 'هل أنت متأكد من حذف هذه الوحدة؟ لا يمكن التراجع عن هذا الإجراء.',

            // Module Detail Page
            'TOTAL_DURATION': 'إجمالي المدة',
            'TOTAL_POINTS': 'إجمالي الدرجات',
            'POINTS': 'درجة',
            'PREVIEW_MODULE': 'معاينة الوحدة',
            'EXPLANATION_VIDEOS': 'فيديوهات الشرح',
            'VIDEOS': 'فيديوهات',
            'ADD_VIDEO': 'إضافة فيديو جديد',
            'VIDEO_TITLE': 'عنوان الفيديو',
            'VIDEO_TITLE_EN': 'عنوان الفيديو بالإنجليزية',
            'VIDEO_DURATION': 'مدة الفيديو',
            'ACTIVE_STATUS': 'نشط',
            'PROCESSING_STATUS': 'قيد المعالجة',
            'NO_VIDEOS_YET': 'لا توجد فيديوهات بعد',
            'MCQ_SECTION': 'أسئلة الاختيار من متعدد (MCQ)',
            'QUESTIONS': 'أسئلة',
            'ADD_MCQ': 'إضافة سؤال MCQ',
            'MCQ_QUESTION': 'نص السؤال',
            'MCQ_QUESTION_EN': 'نص السؤال بالإنجليزية',
            'DIFFICULTY_LEVEL': 'مستوى الصعوبة',
            'EASY': 'سهل',
            'MEDIUM': 'متوسط',
            'HARD': 'صعب',
            'POINTS_LABEL': 'الدرجات',
            'OPTIONS_LABEL': 'خيارات',
            'NO_MCQ_YET': 'لا توجد أسئلة MCQ بعد',
            'ESSAY_SECTION': 'الأسئلة المقالية',
            'ADD_ESSAY': 'إضافة سؤال مقالي',
            'ESSAY_QUESTION': 'نص السؤال',
            'ESSAY_QUESTION_EN': 'نص السؤال بالإنجليزية',
            'WORD_LIMIT': 'الحد الأقصى للكلمات',
            'MANUAL_GRADING': 'تصحيح يدوي',
            'MAX_LIMIT': 'الحد الأقصى',
            'WORDS': 'كلمة',
            'NO_ESSAY_YET': 'لا توجد أسئلة مقالية بعد',
            'FLASHCARDS_SECTION': 'البطاقات التعليمية',
            'CARDS': 'بطاقات',
            'ADD_FLASHCARD': 'إضافة بطاقة تعليمية',
            'FLASHCARD_FRONT': 'الوجه الأمامي',
            'FLASHCARD_FRONT_EN': 'الوجه الأمامي بالإنجليزية',
            'FLASHCARD_BACK': 'الوجه الخلفي',
            'FLASHCARD_BACK_EN': 'الوجه الخلفي بالإنجليزية',
            'NO_FLASHCARDS_YET': 'لا توجد بطاقات تعليمية بعد',
            'BACK_TO_CHAPTER': 'العودة للفصل',
            'ESSAY_SHORT': 'مقالي',
            'DELETE_ITEM_MSG': 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',

            // Video Management Page
            'VIDEO_MANAGEMENT_TITLE': 'إدارة فيديو الشرح',
            'LAST_MODIFIED': 'آخر تعديل',
            'VIDEO_SOURCE': 'مصدر الفيديو',
            'DIRECT_UPLOAD': 'رفع ملف مباشر',
            'STREAM_LINK': 'رابط بث',
            'DRAG_VIDEO_HERE': 'اسحب ملف الفيديو هنا',
            'OR_BROWSE_FILES': 'أو اضغط لاستعراض الملفات من جهازك',
            'VIDEO_LINK_LABEL': 'رابط الفيديو',
            'VIDEO_DETAILS': 'تفاصيل الفيديو',
            'THUMBNAIL': 'الصورة المصغرة',
            'CHANGE_IMAGE': 'تغيير الصورة',
            'THUMBNAIL_RECOMMENDATION': 'يوصى باستخدام صورة بدقة 1280x720 بكسل وبحجم لا يتجاوز 2MB.',
            'ATTACHMENTS': 'المرفقات',
            'REQUIRED': 'إلزامي',
            'NOT_UPLOADED_YET': 'لم يتم رفع ملف بعد',
            'UPDATE': 'تحديث',
            'UPLOAD_FILE': 'رفع ملف',
            'WORKFLOW': 'مسار العمل',
            'UPLOADED_BY': 'تم الرفع بواسطة',
            'REVIEWED_BY': 'تمت المراجعة بواسطة',
            'VIDEO_STATUS': 'حالة الفيديو',
            'VIDEO_VISIBILITY_NOTE': '* لن يظهر الفيديو للطلاب إلا عند تفعيل حالة "منشور".',
            'STUDENT_COMMENTS': 'تعليقات الطلاب',
            'NEW': 'جديد',
            'REPLY': 'رد',
            'HIDE': 'إخفاء',
            'WRITE_QUICK_REPLY': 'كتب رد سريع...'
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
            'ITEM_DESC_EN': 'English Description',

            // Chapter Detail Page
            'ACTIVE_NOW': 'Active Now',
            'ADD_NEW_MODULE': 'Add New Module',
            'PREVIEW_CHAPTER': 'Preview Chapter',
            'MODULES': 'Modules',
            'DURATION': 'Duration',
            'CHAPTER_DESC_PART1': 'This chapter contains',
            'CHAPTER_DESC_PART2': 'essential. You can reorder modules, add new content, or modify the publishing status of each module.',
            'MODULE_TITLE': 'Module Title',
            'MODULE_TITLE_EN': 'Module Title (English)',
            'MODULE_DETAILS_MSG': 'Enter module details',
            'VIDEO_COUNT': 'Videos Count',
            'MCQ_COUNT': 'MCQ Count',
            'ESSAY_COUNT': 'Essay Count',
            'FLASHCARD_COUNT': 'Flashcard Count',
            'EDIT_MODULE': 'Edit Module',
            'UPDATE_MODULE_MSG': 'Update module details',
            'NO_MODULES_YET': 'No modules yet',
            'START_ADDING_MODULES_MSG': 'Start adding educational modules to this chapter',
            'NO_CONTENT_YET': 'No content yet',
            'VIDEO_CLIPS': 'video clips',
            'MCQ_QUESTIONS': 'MCQ questions',
            'ESSAY_QUESTIONS': 'essay questions',
            'FLASHCARDS': 'flashcards',
            'ADD_NEW_MODULE_BTN': 'Add New Educational Module',
            'TOTAL_MODULES': 'Total Modules',
            'PUBLISHED_COUNT': 'Published',
            'DRAFT_COUNT': 'Draft',
            'BACK_TO_STRUCTURE': 'Back to Structure',
            'DELETE_MODULE_MSG': 'Are you sure you want to delete this module? This action cannot be undone.',

            // Module Detail Page
            'TOTAL_DURATION': 'Total Duration',
            'TOTAL_POINTS': 'Total Points',
            'POINTS': 'points',
            'PREVIEW_MODULE': 'Preview Module',
            'EXPLANATION_VIDEOS': 'Explanation Videos',
            'VIDEOS': 'Videos',
            'ADD_VIDEO': 'Add New Video',
            'VIDEO_TITLE': 'Video Title',
            'VIDEO_TITLE_EN': 'Video Title (English)',
            'VIDEO_DURATION': 'Video Duration',
            'ACTIVE_STATUS': 'Active',
            'PROCESSING_STATUS': 'Processing',
            'NO_VIDEOS_YET': 'No videos yet',
            'MCQ_SECTION': 'Multiple Choice Questions (MCQ)',
            'QUESTIONS': 'Questions',
            'ADD_MCQ': 'Add MCQ Question',
            'MCQ_QUESTION': 'Question Text',
            'MCQ_QUESTION_EN': 'Question Text (English)',
            'DIFFICULTY_LEVEL': 'Difficulty Level',
            'EASY': 'Easy',
            'MEDIUM': 'Medium',
            'HARD': 'Hard',
            'POINTS_LABEL': 'Points',
            'OPTIONS_LABEL': 'Options',
            'NO_MCQ_YET': 'No MCQ questions yet',
            'ESSAY_SECTION': 'Essay Questions',
            'ADD_ESSAY': 'Add Essay Question',
            'ESSAY_QUESTION': 'Question Text',
            'ESSAY_QUESTION_EN': 'Question Text (English)',
            'WORD_LIMIT': 'Word Limit',
            'MANUAL_GRADING': 'Manual Grading',
            'MAX_LIMIT': 'Maximum',
            'WORDS': 'words',
            'NO_ESSAY_YET': 'No essay questions yet',
            'FLASHCARDS_SECTION': 'Flashcards',
            'CARDS': 'Cards',
            'ADD_FLASHCARD': 'Add Flashcard',
            'FLASHCARD_FRONT': 'Front Side',
            'FLASHCARD_FRONT_EN': 'Front Side (English)',
            'FLASHCARD_BACK': 'Back Side',
            'FLASHCARD_BACK_EN': 'Back Side (English)',
            'NO_FLASHCARDS_YET': 'No flashcards yet',
            'BACK_TO_CHAPTER': 'Back to Chapter',
            'ESSAY_SHORT': 'Essay',
            'DELETE_ITEM_MSG': 'Are you sure you want to delete this item? This action cannot be undone.',

            // Video Management Page
            'VIDEO_MANAGEMENT_TITLE': 'Video Management',
            'LAST_MODIFIED': 'Last modified',
            'VIDEO_SOURCE': 'Video Source',
            'DIRECT_UPLOAD': 'Direct Upload',
            'STREAM_LINK': 'Stream Link',
            'DRAG_VIDEO_HERE': 'Drag video file here',
            'OR_BROWSE_FILES': 'Or click to browse files from your device',
            'VIDEO_LINK_LABEL': 'Video Link',
            'VIDEO_DETAILS': 'Video Details',
            'THUMBNAIL': 'Thumbnail',
            'CHANGE_IMAGE': 'Change Image',
            'THUMBNAIL_RECOMMENDATION': 'Recommended: 1280x720 pixels, max 2MB.',
            'ATTACHMENTS': 'Attachments',
            'REQUIRED': 'Required',
            'NOT_UPLOADED_YET': 'Not uploaded yet',
            'UPDATE': 'Update',
            'UPLOAD_FILE': 'Upload File',
            'WORKFLOW': 'Workflow',
            'UPLOADED_BY': 'Uploaded by',
            'REVIEWED_BY': 'Reviewed by',
            'VIDEO_STATUS': 'Video Status',
            'VIDEO_VISIBILITY_NOTE': '* Video will only be visible to students when status is "Published".',
            'STUDENT_COMMENTS': 'Student Comments',
            'NEW': 'New',
            'REPLY': 'Reply',
            'HIDE': 'Hide',
            'WRITE_QUICK_REPLY': 'Write a quick reply...'
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
