import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface VideoItem {
    id: string;
    title: string;
    titleEn: string;
    duration: string;
    status: string;
    thumbnail: string;
}

export interface McqItem {
    id: string;
    question: string;
    questionEn: string;
    level: string;
    points: number;
    status: string;
}

export interface EssayItem {
    id: string;
    question: string;
    questionEn: string;
    wordLimit: number;
    status: string;
}

export interface FlashcardItem {
    id: string;
    front: string;
    frontEn: string;
    back: string;
    backEn: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class ModuleDataService {
    // Videos
    private videosSubject = new BehaviorSubject<VideoItem[]>([
        {
            id: 'v1',
            title: 'المفاهيم الأساسية للأصول والخصوم',
            titleEn: 'Basic Concepts of Assets and Liabilities',
            duration: '18:23',
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=120&fit=crop'
        },
        {
            id: 'v2',
            title: 'شرح معادلة الميزانية العمومية',
            titleEn: 'Balance Sheet Equation Explained',
            duration: '14:10',
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop'
        }
    ]);
    videos$ = this.videosSubject.asObservable();

    // MCQs
    private mcqsSubject = new BehaviorSubject<McqItem[]>([
        {
            id: 'mcq1',
            question: 'ما هو التأثير المحاسبي عند شراء أصل ثابت نقداً؟',
            questionEn: 'What is the accounting impact when purchasing a fixed asset with cash?',
            level: 'متوسط',
            points: 2,
            status: 'published'
        },
        {
            id: 'mcq2',
            question: 'أي من التالي يعتبر أصلاً متداولاً؟',
            questionEn: 'Which of the following is considered a current asset?',
            level: 'سهل',
            points: 1,
            status: 'draft'
        }
    ]);
    mcqs$ = this.mcqsSubject.asObservable();

    // Essays
    private essaysSubject = new BehaviorSubject<EssayItem[]>([
        {
            id: 'essay1',
            question: 'ناقش بالتفصيل الفرق بين التكاليف الثابتة والمتغيرة',
            questionEn: 'Discuss in detail the difference between fixed and variable costs',
            wordLimit: 500,
            status: 'published'
        }
    ]);
    essays$ = this.essaysSubject.asObservable();

    // Flashcards
    private flashcardsSubject = new BehaviorSubject<FlashcardItem[]>([
        {
            id: 'fc1',
            front: 'ما هي الأصول؟',
            frontEn: 'What are Assets?',
            back: 'الموارد الاقتصادية التي تملكها المنشأة',
            backEn: 'Economic resources owned by an entity',
            status: 'published'
        },
        {
            id: 'fc2',
            front: 'ما هي الخصوم؟',
            frontEn: 'What are Liabilities?',
            back: 'الالتزامات المالية على المنشأة تجاه الغير',
            backEn: 'Financial obligations of an entity to others',
            status: 'published'
        }
    ]);
    flashcards$ = this.flashcardsSubject.asObservable();

    constructor() { }

    // Videos Methods
    getVideos(): VideoItem[] {
        return this.videosSubject.getValue();
    }

    getVideoById(id: string): VideoItem | undefined {
        return this.getVideos().find(v => v.id === id);
    }

    addVideo(video: Omit<VideoItem, 'id'>): void {
        const newVideo: VideoItem = { ...video, id: Date.now().toString() };
        this.videosSubject.next([...this.getVideos(), newVideo]);
    }

    updateVideo(id: string, updates: Partial<VideoItem>): void {
        const videos = this.getVideos().map(v => v.id === id ? { ...v, ...updates } : v);
        this.videosSubject.next(videos);
    }

    // MCQs Methods
    getMcqs(): McqItem[] {
        return this.mcqsSubject.getValue();
    }

    getMcqById(id: string): McqItem | undefined {
        return this.getMcqs().find(m => m.id === id);
    }

    addMcq(mcq: Omit<McqItem, 'id'>): void {
        const newMcq: McqItem = { ...mcq, id: 'mcq' + Date.now().toString() };
        this.mcqsSubject.next([...this.getMcqs(), newMcq]);
    }

    updateMcq(id: string, updates: Partial<McqItem>): void {
        const mcqs = this.getMcqs().map(m => m.id === id ? { ...m, ...updates } : m);
        this.mcqsSubject.next(mcqs);
    }

    // Essays Methods
    getEssays(): EssayItem[] {
        return this.essaysSubject.getValue();
    }

    getEssayById(id: string): EssayItem | undefined {
        return this.getEssays().find(e => e.id === id);
    }

    addEssay(essay: Omit<EssayItem, 'id'>): void {
        const newEssay: EssayItem = { ...essay, id: 'essay' + Date.now().toString() };
        this.essaysSubject.next([...this.getEssays(), newEssay]);
    }

    updateEssay(id: string, updates: Partial<EssayItem>): void {
        const essays = this.getEssays().map(e => e.id === id ? { ...e, ...updates } : e);
        this.essaysSubject.next(essays);
    }

    // Flashcards Methods
    getFlashcards(): FlashcardItem[] {
        return this.flashcardsSubject.getValue();
    }

    getFlashcardById(id: string): FlashcardItem | undefined {
        return this.getFlashcards().find(f => f.id === id);
    }

    addFlashcard(flashcard: Omit<FlashcardItem, 'id'>): void {
        const newFlashcard: FlashcardItem = { ...flashcard, id: 'fc' + Date.now().toString() };
        this.flashcardsSubject.next([...this.getFlashcards(), newFlashcard]);
    }

    updateFlashcard(id: string, updates: Partial<FlashcardItem>): void {
        const flashcards = this.getFlashcards().map(f => f.id === id ? { ...f, ...updates } : f);
        this.flashcardsSubject.next(flashcards);
    }
}
