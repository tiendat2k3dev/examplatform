import api from "../lib/apiClient";

import {
  Question,
  QuestionDetail,
  Answer,
  CreateQuestionData,
  UpdateQuestionData,
} from "@/types/question";

// ======================================================
// GET ALL QUESTIONS
// ======================================================

export const getQuestionsService = async (): Promise<Question[]> => {
  const response = await api.get<Question[]>("/questions");

  return response.data;
};

// ======================================================
// GET QUESTION DETAIL + ANSWERS
// ======================================================

export const getQuestionDetailService = async (
  questionId: string,
): Promise<QuestionDetail> => {
  const [questionRes, answersRes] = await Promise.all([
    api.get<Question>(`/questions/${encodeURIComponent(questionId)}`),

    api.get<Answer[]>(`/answers?questionId=${encodeURIComponent(questionId)}`),
  ]);

  return {
    ...questionRes.data,

    answers: Array.isArray(answersRes.data) ? answersRes.data : [],
  };
};

// ======================================================
// GET QUESTIONS BY EXAM ID
// ======================================================

// ======================================================
// GET QUESTIONS BY EXAM ID
// Luồng đúng:
// 1. GET /exam_questions?examId=... → lấy danh sách questionId (sắp xếp theo questionOrder)
// 2. Fetch song song từng GET /questions/:id + GET /answers?questionId=:id
// 3. Map sang Question có questionText, options[], correctAnswer (number index)
//    để QuizQuestionBox và chấm điểm hoạt động đúng
// ======================================================

interface RawExamQuestion {
  id: string;
  examId: string;
  questionId: string;
  questionOrder: number;
}

interface RawAnswer {
  id: string;
  content: string;
  label: string;
  isCorrect: boolean;
  questionId: string;
}

export const getQuestionsByExamIdService = async (
  examId: string,
): Promise<Question[]> => {
  // Bước 1: lấy danh sách questionId theo thứ tự
  const eqRes = await api.get<RawExamQuestion[]>(
    `/exam_questions?examId=${encodeURIComponent(examId)}`,
  );
  const examQuestions = Array.isArray(eqRes.data) ? eqRes.data : [];

  if (examQuestions.length === 0) return [];

  // Sắp xếp theo questionOrder
  const sorted = [...examQuestions].sort(
    (a, b) => a.questionOrder - b.questionOrder,
  );

  // Bước 2: fetch song song question + answers cho từng câu
  const results = await Promise.all(
    sorted.map(async ({ questionId }) => {
      const [qRes, aRes] = await Promise.all([
        api.get<Question>(`/questions/${encodeURIComponent(questionId)}`),
        api.get<RawAnswer[]>(
          `/answers?questionId=${encodeURIComponent(questionId)}`,
        ),
      ]);

      const raw = qRes.data;
      const answers = Array.isArray(aRes.data) ? aRes.data : [];

      // Sắp xếp đáp án theo label A→D
      const sortedAnswers = [...answers].sort((a, b) =>
        a.label.localeCompare(b.label),
      );

      // options: mảng string hiển thị cho QuizQuestionBox
      const options = sortedAnswers.map((a) => a.content);

      // correctAnswer: index trong mảng options (số nguyên)
      const correctIdx = sortedAnswers.findIndex((a) => a.isCorrect);

      return {
        ...raw,
        // QuizQuestionBox dùng questionText để render nội dung câu hỏi
        questionText: raw.content,
        options,
        correctAnswer: correctIdx !== -1 ? correctIdx : 0,
        // Giữ lại answers raw để dùng ở nơi khác nếu cần
        answers: sortedAnswers as unknown as Answer[],
      } satisfies Question;
    }),
  );

  return results;
};

// ======================================================
// CREATE QUESTION + ANSWERS
// ======================================================

export const createQuestionService = async (
  data: CreateQuestionData,
): Promise<QuestionDetail> => {
  try {
    const now = new Date().toISOString();

    // ==================================================
    // 1. TẠO QUESTION
    // ==================================================

    const questionId = crypto.randomUUID();

    const questionData = {
      id: questionId,

      content: data.content,

      categoryId: data.categoryId,

      createdAt: now,

      updatedAt: now,
    };

    console.log("QUESTION DATA:", questionData);

    const questionResponse = await api.post<Question>(
      "/questions",
      questionData,
    );

    const createdQuestion = questionResponse.data;

    console.log("QUESTION ĐÃ TẠO:", createdQuestion);

    // ==================================================
    // 2. TẠO ANSWERS
    // ==================================================

    const createdAnswers: Answer[] = [];

    try {
      for (const answer of data.answers) {
        const answerData = {
          id: crypto.randomUUID(),

          content: answer.value,

          label: answer.key,

          isCorrect: answer.key === data.correctAnswer,

          questionId: createdQuestion.id,

          createdAt: now,

          updatedAt: now,
        };

        console.log("ANSWER ĐANG TẠO:", answerData);

        const answerResponse = await api.post<Answer>("/answers", answerData);

        createdAnswers.push(answerResponse.data);
      }
    } catch (answerError) {
      // ==================================================
      // NẾU TẠO ANSWER LỖI
      // XÓA QUESTION VỪA TẠO ĐỂ TRÁNH DATA RÁC
      // ==================================================

      console.error("Lỗi khi tạo answers:", answerError);

      try {
        await api.delete(`/questions/${createdQuestion.id}`);
      } catch (rollbackError) {
        console.error("Không thể rollback question:", rollbackError);
      }

      throw answerError;
    }

    // ==================================================
    // 3. TRẢ VỀ QUESTION + ANSWERS
    // ==================================================

    return {
      ...createdQuestion,

      answers: createdAnswers,
    };
  } catch (error) {
    console.error("Lỗi createQuestionService:", error);

    throw error;
  }
};

// ======================================================
// UPDATE QUESTION + ANSWERS
// ======================================================

export const updateQuestionService = async (
  id: string,
  data: UpdateQuestionData,
): Promise<QuestionDetail> => {
  try {
    const now = new Date().toISOString();

    // ==================================================
    // 1. UPDATE QUESTION
    // ==================================================

    const questionData = {
      content: data.content,

      categoryId: data.categoryId,

      updatedAt: now,
    };

    console.log("UPDATE QUESTION:", questionData);

    const questionResponse = await api.put<Question>(
      `/questions/${encodeURIComponent(id)}`,
      questionData,
    );

    const updatedQuestion = questionResponse.data;

    // ==================================================
    // 2. LẤY ANSWERS HIỆN TẠI
    // ==================================================

    const answersResponse = await api.get<Answer[]>(
      `/answers?questionId=${encodeURIComponent(id)}`,
    );

    const oldAnswers = Array.isArray(answersResponse.data)
      ? answersResponse.data
      : [];

    // ==================================================
    // 3. UPDATE ANSWERS
    // ==================================================

    const updatedAnswers: Answer[] = [];

    for (const answer of data.answers) {
      const oldAnswer = oldAnswers.find((item) => item.label === answer.key);

      const answerData = {
        content: answer.value,

        label: answer.key,

        isCorrect: answer.key === data.correctAnswer,

        questionId: id,

        updatedAt: now,
      };

      // ==================================================
      // ANSWER ĐÃ CÓ → UPDATE
      // ==================================================

      if (oldAnswer) {
        const response = await api.put<Answer>(
          `/answers/${encodeURIComponent(oldAnswer.id)}`,
          {
            ...oldAnswer,
            ...answerData,
          },
        );

        updatedAnswers.push(response.data);
      }

      // ==================================================
      // ANSWER CHƯA CÓ → CREATE
      // ==================================================
      else {
        const newAnswer = {
          id: crypto.randomUUID(),

          ...answerData,

          createdAt: now,
        };

        const response = await api.post<Answer>("/answers", newAnswer);

        updatedAnswers.push(response.data);
      }
    }

    // ==================================================
    // 4. XÓA ANSWER THỪA
    // ==================================================

    const currentLabels = data.answers.map((answer) => answer.key);

    const answersToDelete = oldAnswers.filter(
      (answer) =>
        !currentLabels.includes(answer.label as "A" | "B" | "C" | "D"),
    );

    await Promise.all(
      answersToDelete.map((answer) =>
        api.delete(`/answers/${encodeURIComponent(answer.id)}`),
      ),
    );

    // ==================================================
    // 5. TRẢ VỀ QUESTION + ANSWERS
    // ==================================================

    return {
      ...updatedQuestion,

      answers: updatedAnswers,
    };
  } catch (error) {
    console.error("Lỗi updateQuestionService:", error);

    throw error;
  }
};

// ======================================================
// DELETE QUESTION + ANSWERS
// ======================================================

export const deleteQuestionService = async (id: string): Promise<void> => {
  try {
    // ==================================================
    // 1. LẤY ANSWERS CỦA QUESTION
    // ==================================================

    const answersResponse = await api.get<Answer[]>(
      `/answers?questionId=${encodeURIComponent(id)}`,
    );

    const answers = Array.isArray(answersResponse.data)
      ? answersResponse.data
      : [];

    console.log("ANSWERS CẦN XÓA:", answers);

    // ==================================================
    // 2. XÓA TẤT CẢ ANSWERS
    // ==================================================

    await Promise.all(
      answers.map((answer) =>
        api.delete(`/answers/${encodeURIComponent(answer.id)}`),
      ),
    );

    // ==================================================
    // 3. XÓA QUESTION
    // ==================================================

    await api.delete(`/questions/${encodeURIComponent(id)}`);

    console.log("ĐÃ XÓA QUESTION:", id);
  } catch (error) {
    console.error("Lỗi deleteQuestionService:", error);

    throw error;
  }
};
