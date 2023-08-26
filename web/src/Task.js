const clean = value => `${value}`.replaceAll(' ', '');

const compare = (expected, actual) => clean(actual) === clean(expected);

const Task = (task) => {
    return {
        ...task,
        success: compare(task.answer, task.actualAnswer)
    }
};

module.exports = Task;