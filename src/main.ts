import { SequenceAutomator } from './classes/sequence-automator';

const sequence_automator = new SequenceAutomator({
    steps: [
        {
            action: 'type',
            selector: '#input-email',
            text: 'nbkmaxine@gmail.com',
        },
        {
            action: 'click',
            selector: '#signin',
        },
    ],
});

sequence_automator.run('https://app.bizaway.com/');
