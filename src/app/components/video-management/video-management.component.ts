import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { CourseService } from '../../services/course.service';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

type UploadTab = 'upload' | 'stream';
type VideoStatus = 'published' | 'draft';

interface Comment {
    id: string;
    author: string;
    authorEn: string;
    avatar: string;
    content: string;
    contentEn: string;
    date: string;
    dateEn: string;
    isAdmin?: boolean;
    replies?: Comment[];
}

interface Attachment {
    id: string;
    name: string;
    nameEn: string;
    type: 'pdf' | 'ppt';
    fileName?: string;
    size?: string;
    isRequired: boolean;
    isUploaded: boolean;
}

@Component({
    selector: 'app-video-management',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
    templateUrl: './video-management.component.html',
    styleUrl: './video-management.component.css'
})
export class VideoManagementComponent implements OnInit, OnDestroy {
    courseId: number = 0;
    materialId: number = 0;
    chapterId: string = '';
    moduleId: string = '';
    videoId: string = '';

    // Mode: 'add' or 'edit'
    isAddMode = false;

    // Video Info (Arabic)
    videoTitle = '';
    videoDescription = '';

    // Video Info (English)
    videoTitleEn = '';
    videoDescriptionEn = '';

    // Common video properties
    videoThumbnail = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop';
    lastModified = '';
    lastModifiedEn = '';
    moduleLabel = 'MODULE 1 - VIDEO';

    // Upload states
    activeTab: UploadTab = 'upload';
    videoStatus: VideoStatus = 'draft';
    isUploading = false;
    uploadProgress = 0;
    uploadedVideoName = '';
    streamUrl = '';

    // Workflow
    uploadedBy = 'أحمد محمد';
    uploadedByEn = 'Ahmed Mohammed';
    uploadDate = '';
    uploadDateEn = '';
    reviewers = ['(أنا) Admin User', 'سارة أحمد'];
    selectedReviewer = '(أنا) Admin User';

    // Attachments
    attachments: Attachment[] = [
        {
            id: 'a1',
            name: 'كتاب الشرح (PDF)',
            nameEn: 'Explanation Book (PDF)',
            type: 'pdf',
            isRequired: true,
            isUploaded: false
        },
        {
            id: 'a2',
            name: 'عرض PowerPoint',
            nameEn: 'PowerPoint Presentation',
            type: 'ppt',
            isRequired: false,
            isUploaded: false
        }
    ];

    // Comments
    comments: Comment[] = [];

    newComment = '';
    replyingToId: string | null = null;
    replyText = '';
    showSaveSuccess = false;

    private langSub?: Subscription;

    // Sample existing videos for edit mode
    private existingVideos: { [key: string]: any } = {
        'v1': {
            title: 'المفاهيم الأساسية للأصول والخصوم',
            titleEn: 'Basic Concepts of Assets and Liabilities',
            description: 'في هذا الفيديو سنتعرف على المبادئ الأساسية للمحاسبة وكيفية التمييز بين الأصول الثابتة والمتداولة.',
            descriptionEn: 'In this video, we will learn about the basic principles of accounting and how to distinguish between fixed and current assets.',
            thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
            status: 'published',
            uploadDate: '20 أكتوبر 2023, 10:30 AM',
            uploadDateEn: 'Oct 20, 2023, 10:30 AM',
            lastModified: 'منذ 30 دقيقة',
            lastModifiedEn: '30 minutes ago',
            comments: [
                {
                    id: 'c1',
                    author: 'عمر خالد',
                    authorEn: 'Omar Khaled',
                    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
                    content: 'هل يمكن توضيح الفرق بين الخصوم المتداولة والغير متداولة بمثال عملي أكثر؟',
                    contentEn: 'Can you clarify the difference between current and non-current liabilities with a more practical example?',
                    date: 'منذ ساعتين',
                    dateEn: '2 hours ago',
                    replies: [
                        {
                            id: 'c1r1',
                            author: 'Admin User',
                            authorEn: 'Admin User',
                            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                            content: 'أهلاً عمر، سيتم إضافة فيديو قصير ملحق بالأمثلة العملية غداً. شكراً لملاحظتك.',
                            contentEn: 'Hi Omar, a short supplementary video with practical examples will be added tomorrow. Thanks for your feedback.',
                            date: 'منذ ساعة',
                            dateEn: '1 hour ago',
                            isAdmin: true
                        }
                    ]
                }
            ],
            attachments: [
                { id: 'a1', name: 'كتاب الشرح (PDF)', nameEn: 'Explanation Book (PDF)', type: 'pdf', fileName: 'assets_liabilities_intro_v1.pdf', size: '2.5 MB', isRequired: true, isUploaded: true },
                { id: 'a2', name: 'عرض PowerPoint', nameEn: 'PowerPoint Presentation', type: 'ppt', isRequired: false, isUploaded: false }
            ]
        },
        'v2': {
            title: 'شرح معادلة الميزانية العمومية',
            titleEn: 'Balance Sheet Equation Explained',
            description: 'شرح تفصيلي لمعادلة الميزانية العمومية وكيفية تطبيقها.',
            descriptionEn: 'Detailed explanation of the balance sheet equation and how to apply it.',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
            status: 'published',
            uploadDate: '18 أكتوبر 2023, 2:00 PM',
            uploadDateEn: 'Oct 18, 2023, 2:00 PM',
            lastModified: 'منذ يومين',
            lastModifiedEn: '2 days ago',
            comments: [],
            attachments: [
                { id: 'a1', name: 'كتاب الشرح (PDF)', nameEn: 'Explanation Book (PDF)', type: 'pdf', isRequired: true, isUploaded: false },
                { id: 'a2', name: 'عرض PowerPoint', nameEn: 'PowerPoint Presentation', type: 'ppt', isRequired: false, isUploaded: false }
            ]
        }
    };

    constructor(
        private route: ActivatedRoute,
        private headerService: HeaderService,
        private courseService: CourseService,
        private router: Router,
        public translationService: TranslationService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.courseId = Number(params.get('courseId'));
            this.materialId = Number(params.get('materialId'));
            this.chapterId = params.get('chapterId') || '1';
            this.moduleId = params.get('moduleId') || 'm1';
            this.videoId = params.get('videoId') || 'new';

            // Determine mode
            this.isAddMode = this.videoId === 'new';

            if (this.isAddMode) {
                this.initNewVideo();
            } else {
                this.loadExistingVideo();
            }

            this.setupBreadcrumbs();
        });

        this.langSub = this.translationService.lang$.subscribe(() => {
            this.setupBreadcrumbs();
        });
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
    }

    initNewVideo() {
        // Reset all fields for new video
        this.videoTitle = '';
        this.videoTitleEn = '';
        this.videoDescription = '';
        this.videoDescriptionEn = '';
        this.videoThumbnail = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop';
        this.videoStatus = 'draft';
        this.streamUrl = '';
        this.uploadedVideoName = '';
        this.comments = [];
        this.lastModified = '';
        this.lastModifiedEn = '';
        this.uploadDate = '';
        this.uploadDateEn = '';

        // Reset attachments
        this.attachments = [
            { id: 'a1', name: 'كتاب الشرح (PDF)', nameEn: 'Explanation Book (PDF)', type: 'pdf', isRequired: true, isUploaded: false },
            { id: 'a2', name: 'عرض PowerPoint', nameEn: 'PowerPoint Presentation', type: 'ppt', isRequired: false, isUploaded: false }
        ];
    }

    loadExistingVideo() {
        const video = this.existingVideos[this.videoId];
        if (video) {
            this.videoTitle = video.title;
            this.videoTitleEn = video.titleEn;
            this.videoDescription = video.description;
            this.videoDescriptionEn = video.descriptionEn;
            this.videoThumbnail = video.thumbnail;
            this.videoStatus = video.status;
            this.uploadDate = video.uploadDate;
            this.uploadDateEn = video.uploadDateEn;
            this.lastModified = video.lastModified;
            this.lastModifiedEn = video.lastModifiedEn;
            this.comments = video.comments || [];
            this.attachments = video.attachments || this.attachments;
        }
    }

    setupBreadcrumbs() {
        const isAr = this.translationService.current === 'ar';
        const course = this.courseService.getCourseById(this.courseId);
        const pageTitle = this.isAddMode
            ? (isAr ? 'إضافة فيديو جديد' : 'Add New Video')
            : (isAr ? 'تعديل الفيديو' : 'Edit Video');

        this.headerService.setBreadcrumbs([
            { label: this.translationService.translate('CERTIFICATES'), url: '/' },
            { label: course?.code || 'SOCPA', url: `/course/${this.courseId}` },
            { label: this.translationService.translate('COURSE_MATERIALS'), url: `/course/${this.courseId}` },
            { label: isAr ? 'المحاسبة المالية' : 'Financial Accounting', url: `/course/${this.courseId}/material/${this.materialId}` },
            { label: 'Module 1', url: `/course/${this.courseId}/material/${this.materialId}/chapter/${this.chapterId}/module/${this.moduleId}` },
            { label: pageTitle }
        ]);
    }

    get displayVideoTitle(): string {
        return this.translationService.current === 'ar' ? this.videoTitle : this.videoTitleEn;
    }

    get displayVideoDescription(): string {
        return this.translationService.current === 'ar' ? this.videoDescription : this.videoDescriptionEn;
    }

    get displayLastModified(): string {
        return this.translationService.current === 'ar' ? this.lastModified : this.lastModifiedEn;
    }

    get displayUploadedBy(): string {
        return this.translationService.current === 'ar' ? this.uploadedBy : this.uploadedByEn;
    }

    get displayUploadDate(): string {
        return this.translationService.current === 'ar' ? this.uploadDate : this.uploadDateEn;
    }

    getPageTitle(): string {
        const isAr = this.translationService.current === 'ar';
        if (this.isAddMode) {
            return isAr ? 'إضافة فيديو جديد' : 'Add New Video';
        }
        return isAr ? 'تعديل الفيديو' : 'Edit Video';
    }

    getAttachmentName(attachment: Attachment): string {
        return this.translationService.current === 'ar' ? attachment.name : attachment.nameEn;
    }

    getCommentAuthor(comment: Comment): string {
        return this.translationService.current === 'ar' ? comment.author : comment.authorEn;
    }

    getCommentContent(comment: Comment): string {
        return this.translationService.current === 'ar' ? comment.content : comment.contentEn;
    }

    getCommentDate(comment: Comment): string {
        return this.translationService.current === 'ar' ? comment.date : comment.dateEn;
    }

    setActiveTab(tab: UploadTab) {
        this.activeTab = tab;
    }

    setVideoStatus(status: VideoStatus) {
        this.videoStatus = status;
    }

    // Video Upload
    triggerVideoUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/mp4,video/webm,video/ogg';
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
                this.simulateVideoUpload(file);
            }
        };
        input.click();
    }

    simulateVideoUpload(file: File) {
        this.isUploading = true;
        this.uploadProgress = 0;
        this.uploadedVideoName = file.name;

        const interval = setInterval(() => {
            this.uploadProgress += Math.random() * 15;
            if (this.uploadProgress >= 100) {
                this.uploadProgress = 100;
                this.isUploading = false;
                clearInterval(interval);
            }
        }, 200);
    }

    // Attachment Upload
    uploadAttachment(attachment: Attachment) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = attachment.type === 'pdf' ? '.pdf' : '.ppt,.pptx';
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
                const idx = this.attachments.findIndex(a => a.id === attachment.id);
                if (idx !== -1) {
                    this.attachments[idx] = {
                        ...this.attachments[idx],
                        fileName: file.name,
                        size: this.formatFileSize(file.size),
                        isUploaded: true
                    };
                }
            }
        };
        input.click();
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Thumbnail change
    changeThumbnail() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    this.videoThumbnail = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    // Comments
    startReply(commentId: string) {
        this.replyingToId = commentId;
        this.replyText = '';
    }

    cancelReply() {
        this.replyingToId = null;
        this.replyText = '';
    }

    submitReply(comment: Comment) {
        if (!this.replyText.trim()) return;

        const newReply: Comment = {
            id: Date.now().toString(),
            author: 'Admin User',
            authorEn: 'Admin User',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            content: this.replyText,
            contentEn: this.replyText,
            date: 'الآن',
            dateEn: 'Just now',
            isAdmin: true
        };

        const idx = this.comments.findIndex(c => c.id === comment.id);
        if (idx !== -1) {
            if (!this.comments[idx].replies) {
                this.comments[idx].replies = [];
            }
            this.comments[idx].replies!.push(newReply);
        }

        this.replyingToId = null;
        this.replyText = '';
    }

    sendQuickReply() {
        if (!this.newComment.trim()) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: 'Admin User',
            authorEn: 'Admin User',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            content: this.newComment,
            contentEn: this.newComment,
            date: 'الآن',
            dateEn: 'Just now',
            isAdmin: true,
            replies: []
        };

        this.comments.unshift(newComment);
        this.newComment = '';
    }

    hideComment(comment: Comment) {
        this.comments = this.comments.filter(c => c.id !== comment.id);
    }

    // Save Changes
    saveChanges() {
        // Validate required fields
        if (!this.videoTitle && !this.videoTitleEn) {
            alert(this.translationService.current === 'ar' ? 'الرجاء إدخال عنوان الفيديو' : 'Please enter video title');
            return;
        }

        this.showSaveSuccess = true;
        this.lastModified = 'الآن';
        this.lastModifiedEn = 'Just now';

        setTimeout(() => {
            this.showSaveSuccess = false;
            // Navigate back to module detail after save
            this.goBack();
        }, 1500);
    }

    cancelChanges() {
        this.goBack();
    }

    goBack() {
        this.router.navigate(['/course', this.courseId, 'material', this.materialId, 'chapter', this.chapterId, 'module', this.moduleId]);
    }
}
