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

export const getQuestionsByExamIdService = async (
  examId: string,
): Promise<Question[]> => {
  const response = await api.get<Question[]>(
    `/questions?examId=${encodeURIComponent(examId)}`,
  );

  return response.data;
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
