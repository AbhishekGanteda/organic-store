jest.mock('../models/Question', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
}));

import Question from '../models/Question';
import { getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion, } from '../controllers/question.controller';

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const waitForAsyncHandler = () => new Promise(resolve => {
  setImmediate(resolve);
});

describe('question.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all questions', async () => {
    const req = {};
    const res = createRes();
    const next = jest.fn();

    const lean = jest.fn().mockResolvedValue([{ id: 1, question: 'q' }]);
    const sort = jest.fn().mockReturnValue({ lean });
    Question.find.mockReturnValue({ sort });

    getAllQuestions(req, res, next);
    await waitForAsyncHandler();

    expect(res.json).toHaveBeenCalledWith([{ id: 1, question: 'q' }]);
  });

  it('returns 404 when question is missing', async () => {
    const req = { params: { id: '3' } };
    const res = createRes();
    const next = jest.fn();

    Question.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    getQuestionById(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next.mock.calls[0][0].message).toBe('Question not found');
  });

  it('creates question with incremented id', async () => {
    const req = { body: { question: 'Q1', answer: 'A1', isOpen: true } };
    const res = createRes();
    const next = jest.fn();

    Question.findOne.mockReturnValue({ sort: jest.fn().mockResolvedValue({ id: 8 }) });
    Question.create.mockResolvedValue({ id: 9, ...req.body });

    createQuestion(req, res, next);
    await waitForAsyncHandler();

    expect(Question.create).toHaveBeenCalledWith(expect.objectContaining({ id: 9 }));
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('updates and deletes question', async () => {
    const updateReq = { params: { id: '9' }, body: { answer: 'New' } };
    const res = createRes();
    const next = jest.fn();

    const doc = {
      question: 'Q',
      answer: 'Old',
      isOpen: true,
      save: jest.fn().mockResolvedValue({ id: 9, answer: 'New' }),
      deleteOne: jest.fn().mockResolvedValue(undefined),
    };

    Question.findOne.mockResolvedValueOnce(doc).mockResolvedValueOnce(doc);

    updateQuestion(updateReq, res, next);
    await waitForAsyncHandler();

    expect(doc.answer).toBe('New');

    deleteQuestion({ params: { id: '9' } }, res, next);
    await waitForAsyncHandler();

    expect(doc.deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenLastCalledWith({ message: 'Question removed' });
  });
});
