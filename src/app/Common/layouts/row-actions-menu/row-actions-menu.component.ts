import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, ConnectedPosition, Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-row-actions-menu',
    standalone: true,
    imports: [CommonModule, OverlayModule, TranslateModule],
    templateUrl: './row-actions-menu.component.html',
    styleUrl: './row-actions-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActionsMenuComponent {
    @ContentChild(TemplateRef, { static: true }) itemsTemplate!: TemplateRef<any>;
    isOpen = false;
    scrollStrategy: ScrollStrategy;

    constructor(private dir: Directionality, private cdr: ChangeDetectorRef, overlay: Overlay) {
        this.scrollStrategy = overlay.scrollStrategies.reposition();
    }

    get positions(): ConnectedPosition[] {
        const isRtl = this.dir.value === 'rtl';
        const x: 'start' | 'end' = isRtl ? 'start' : 'end';
        return [
            { originX: x, originY: 'bottom', overlayX: x, overlayY: 'top', offsetY: 4 },
            { originX: x, originY: 'top',    overlayX: x, overlayY: 'bottom', offsetY: -4 },
        ];
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.cdr.markForCheck();
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.cdr.markForCheck();
    }

    onOverlayKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            e.stopPropagation();
            this.close();
        }
    }

    onItemClick(e: MouseEvent) {
        const t = e.target as HTMLElement;
        if (t.closest('button, a')) this.close();
    }
}
