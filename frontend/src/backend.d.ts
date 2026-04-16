import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SkillAssessment {
    assessedAt: bigint;
    userId: Principal;
    level: string;
    tradeId: string;
}
export interface QuizResult {
    completedAt: bigint;
    userId: Principal;
    score: bigint;
    totalQuestions: bigint;
    quizId: string;
}
export interface ProgressRecord {
    moduleId: string;
    completedAt: bigint;
    userId: Principal;
    score: bigint;
    tradeId: string;
}
export interface SavedAnswer {
    userId: Principal;
    answer: string;
    questionId: string;
    savedAt: bigint;
}
export interface PathwayEnrollment {
    completedModules: Array<string>;
    pathwayId: string;
    userId: Principal;
    tradeId: string;
    enrolledAt: bigint;
}
export interface UserProfile {
    displayName: string;
    userId: Principal;
    createdAt: bigint;
    email: string;
    currentTradeId: string;
    onboardingCompleted: boolean;
}
export interface backendInterface {
    clearSavedAnswers(): Promise<void>;
    completeModule(pathwayId: string, moduleId: string, tradeId: string, score: bigint): Promise<ProgressRecord>;
    completeOnboarding(tradeId: string): Promise<boolean>;
    createOrUpdateProfile(displayName: string, email: string): Promise<UserProfile>;
    enrollInPathway(pathwayId: string, tradeId: string): Promise<PathwayEnrollment>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getMyEnrollments(): Promise<Array<PathwayEnrollment>>;
    getMyProfile(): Promise<UserProfile | null>;
    getMyProgress(): Promise<Array<ProgressRecord>>;
    getMyQuizResults(): Promise<Array<QuizResult>>;
    getMySavedAnswers(): Promise<Array<SavedAnswer>>;
    getMySkillAssessments(): Promise<Array<SkillAssessment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    recordQuizResult(quizId: string, score: bigint, totalQuestions: bigint): Promise<QuizResult>;
    saveAnswer(questionId: string, answer: string): Promise<SavedAnswer>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveSkillAssessment(tradeId: string, level: string): Promise<SkillAssessment>;
}
