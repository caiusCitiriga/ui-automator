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
        this.browser.setCookie(
            ...[
                {
                    name: '_gid',
                    value: 'GA1.2.1195948686.1740511979',
                    domain: '.bizaway.com',
                    path: '/',
                    expires: 1740615032,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: 'lastLoginMethod',
                    value: 'email-password',
                    domain: '.bizaway.com',
                    path: '/',
                    expires: 1772064630,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: 'ap3c',
                    value: 'AGezT25MwdQpd74CAGe-Gwhae-5G4rLwnBYAUvxSSOIo37LP5Q',
                    domain: 'superfriends.bizaway.com',
                    path: '/',
                    expires: 1772064712,
                    httpOnly: false,
                    secure: true,
                },
                {
                    name: 'ap3sessionkey',
                    value: '0067be1b08768dd9e6a1bdbc',
                    domain: 'superfriends.bizaway.com',
                    path: '/',
                    expires: 1772048008,
                    httpOnly: false,
                    secure: true,
                },
                {
                    name: 'bz_keep_adblocker',
                    value: 'true',
                    domain: 'superfriends.bizaway.com',
                    path: '/',
                    expires: 1743104016,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: 'bz_country',
                    value: 'IT',
                    domain: 'superfriends.bizaway.com',
                    path: '/',
                    expires: 1772048029,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: 'access_tokens_superfriends',
                    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdiMzRmNmU4NzdiZDFkNTM4NjRhZGZhIiwicmVhbF91c2VyX2lkIjpudWxsLCJhY2NvdW50X2lkIjoiNTYzOGRkNmNiYzE0YTNiNjc3OWFhNmQzIiwic2Vzc2lvbl9pZCI6IjY3YmU1YmY2MTJlNjYxMzE5ODQ0YjU0NyIsImlhdCI6MTc0MDUyODYzMCwiZXhwIjoxNzU2MDgwNjMwfQ.bYMaQ8DD0CV__CCz3KalInlJweDdNUHykyHug_evnPY',
                    domain: '.bizaway.com',
                    path: '/',
                    expires: 1772064630,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: 'ap3pages',
                    value: '4',
                    domain: 'superfriends.bizaway.com',
                    path: '/',
                    expires: -1,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: '_ga_J45K1LTFFS',
                    value: 'GS1.1.1740528632.3.0.1740528632.0.0.0',
                    domain: '.bizaway.com',
                    path: '/',
                    expires: 1775088632.647382,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: '_ga',
                    value: 'GA1.1.75119343.1740511979',
                    domain: '.bizaway.com',
                    path: '/',
                    expires: 1775088632.647641,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: 'mp_1cbd9fd3e665c467371249b9b975904a_mixpanel',
                    value: '%7B%22distinct_id%22%3A%20%2267b34f6e877bd1d53864adfa%22%2C%22%24device_id%22%3A%20%221953e998b6f135-0e34069adcbad8-1d525636-201b88-1953e998b6f135%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fsuperfriends.bizaway.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22superfriends.bizaway.com%22%2C%22%24user_id%22%3A%20%2267b34f6e877bd1d53864adfa%22%7D',
                    domain: '.bizaway.com',
                    path: '/',
                    expires: 1772064633,
                    httpOnly: false,
                    secure: false,
                },
                {
                    name: 'amp_f4fab8',
                    value: 'PnTnCC-GbhSV-O3N1amfvd.NjdiMzRmNmU4NzdiZDFkNTM4NjRhZGZh..1ikvpejcc.1ikvpejcc.0.0.0',
                    domain: '.bizaway.com',
                    path: '/',
                    expires: 1772064635,
                    httpOnly: false,
                    secure: false,
                },
            ]
        );

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
