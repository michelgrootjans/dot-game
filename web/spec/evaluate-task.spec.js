const Task = require("../src/Task");

it('adds a success field', () => {
    const task = Task({
        question: 'just copy 1',
        answer: 1,
        actualAnswer: 1
    })
    expect(task).toMatchObject({
        question: 'just copy 1',
        answer: 1,
        actualAnswer: 1,
        success: true
    });
});

it('fails with different values', () => {
    const task = Task({answer: 1, actualAnswer: 2})
    expect(task).toMatchObject({success: false});
})

it('succeeds with equivalent strings', () => {
    const task = Task({answer: '1', actualAnswer: '1'})
    expect(task).toMatchObject({success: true});
})

it('accepts extra spaces', () => {
    const task = Task({answer: '1', actualAnswer: ' 1  '})
    expect(task).toMatchObject({success: true});
})
