import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false // Impure to trigger on lang change or we subscribe manually
})
export class TranslatePipe implements PipeTransform, OnDestroy {
    private lastKey = '';
    private lastValue = '';
    private onLangChange: Subscription;

    constructor(private translationService: TranslationService, private cdr: ChangeDetectorRef) {
        this.onLangChange = this.translationService.lang$.subscribe(() => {
            this.lastValue = this.translationService.translate(this.lastKey);
            this.cdr.markForCheck();
        });
    }

    transform(key: string): string {
        this.lastKey = key;
        this.lastValue = this.translationService.translate(key);
        return this.lastValue;
    }

    ngOnDestroy() {
        if (this.onLangChange) {
            this.onLangChange.unsubscribe();
        }
    }
}
