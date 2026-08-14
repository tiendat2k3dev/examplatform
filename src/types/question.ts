export interface Question {
  id: string;
  examId: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // Index của đáp án đúng trong mảng options (0, 1, 2, 3)
  explanation: string;
}