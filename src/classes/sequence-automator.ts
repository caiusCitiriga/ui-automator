import assert from 'node:assert';
import puppeteer, { Browser, Page } from 'puppeteer';

export interface SequenceStep {
    action: 'click' | 'type';

    /**
     * Required if action is:
     * - click
     * - type
     */
    selector?: string;

    /**
     * Required if action is:
     * - type
     */
    text?: string;
}

export interface Sequence {
    steps: SequenceStep[];
}

export class SequenceAutomator {
    private page!: Page;
    private browser!: Browser;

    private readonly sequence: Sequence;

    constructor(sequence: Sequence) {
        this.sequence = sequence;
    }

    async run(url: string): Promise<void> {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();

        await this.page.goto(url);
        await this.page.setViewport({ width: 1080, height: 1024 });
        await this.page.waitForNavigation({ waitUntil: 'networkidle2' });

        let step_idx = 0;
        for (const step of this.sequence.steps) {
            step_idx++;
            console.log(`Executing step: ${step_idx}`);
            await this.handle_sequence_step(step);
        }
    }

    private async handle_sequence_step(step: SequenceStep) {
        if (step.action === 'click') return this.handle_click_action(step);
        if (step.action === 'type') return this.handle_type_action(step);
    }

    private async handle_click_action(step: SequenceStep) {
        assert(
            !!step.selector,
            new Error('Cannot execute click action without selector')
        );

        const el = await this.page.$(step.selector);

        assert(!!el, new Error(`Selector [${step.selector}] found no element`));

        await el.click();
    }

    private async handle_type_action(step: SequenceStep) {
        assert(
            !!step.selector,
            new Error('Cannot execute type action without selector')
        );
        assert(
            !!step.text,
            new Error('Cannot execute type action without text')
        );

        await this.page.type(step.selector, step.text);
    }
}
