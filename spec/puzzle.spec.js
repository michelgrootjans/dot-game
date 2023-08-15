const {Puzzle} = require("../application/domain/Puzzle");

describe('Puzzle', () => {
    it('difficulty 1: copy a 1-digit number', () => {
        const puzzle = Puzzle().generate(1);
        expect(puzzle.question).toMatch(/\d = /)
        expect(puzzle.answer).toMatch(/\d/)
    });

    it('difficulty 2: 1-digit multiplication or division', () => {
        const puzzle = Puzzle().generate(2);
        expect(puzzle.question).toMatch(/(\d x \d)|(\d{1,2} \/ \d)/)
        expect(puzzle.answer).toMatch(/\d{1,2}/) // can 1-91
    });

    it('difficulty 3: 2-digit addition or subtraction', () => {
        const puzzle = Puzzle().generate(3);
        expect(puzzle.question).toMatch(/\d{2} [+-] \d{2} = /)
        expect(puzzle.answer).toMatch(/\d{1,3}/) // can 0-198
    });

    it('difficulty 4: 3-digit addition or subtraction', () => {
        const puzzle = Puzzle().generate(4);
        expect(puzzle.question).toMatch(/\d{3} [+-] \d{3} = /)
        expect(puzzle.answer).toMatch(/\d{1,4}/) // can 0-1998
    });
});