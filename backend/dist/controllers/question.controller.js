import asyncHandler from '../middleware/async-handler.js';
import Question from '../models/Question.js';
const getAllQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find().sort({ id: 1 }).lean();
    res.json(questions);
});
const getQuestionById = asyncHandler(async (req, res) => {
    const question = await Question.findOne({ id: Number(req.params.id) }).lean();
    if (!question) {
        res.status(404);
        throw new Error('Question not found');
    }
    res.json(question);
});
const createQuestion = asyncHandler(async (req, res) => {
    const existing = await Question.findOne().sort({ id: -1 });
    const nextId = existing ? existing.id + 1 : 1;
    const question = await Question.create({
        id: nextId,
        question: req.body.question,
        answer: req.body.answer,
        isOpen: !!req.body.isOpen,
    });
    res.status(201).json(question);
});
const updateQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findOne({ id: Number(req.params.id) });
    if (!question) {
        res.status(404);
        throw new Error('Question not found');
    }
    question.question = req.body.question ?? question.question;
    question.answer = req.body.answer ?? question.answer;
    question.isOpen = req.body.isOpen ?? question.isOpen;
    const updated = await question.save();
    res.json(updated);
});
const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findOne({ id: Number(req.params.id) });
    if (!question) {
        res.status(404);
        throw new Error('Question not found');
    }
    await question.deleteOne();
    res.json({ message: 'Question removed' });
});
export { getAllQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion };
//# sourceMappingURL=question.controller.js.map