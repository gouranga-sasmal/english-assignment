
const config = {
    databaseEndPoint:import.meta.env.VITE_DATABASE_ENDPOINT,
    projectId : import.meta.env.VITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_DATABASE_ID,
    teacherUserList:import.meta.env.VITE_TEACHER_USER_COLLECTION,
    studentUserList:import.meta.env.VITE_STUDENT_USER_COLLECTION,
    tutorList : import.meta.env.VITE_TUTOR_COLLECTION,
    allClasses:import.meta.env.VITE_ALL_CLASSES_ID,
    allChapters:import.meta.env.VITE_ALL_CHAPTERS_ID,
    allQuestionSet:import.meta.env.VITE_QUESTIONSET_ID,
    questionRelationId:import.meta.env.VITE_QUESTION_RELATION_ID,
    allQuestionId:import.meta.env.VITE_All_QUESTION_ID,
    allQuestionOption:import.meta.env.VITE_QUESTION_OPTION_ID,
    allAssingments:import.meta.env.VITE_ASSINGMENTS_ID,
    allGrammerQuestionSet:import.meta.env.VITE_GRAMMER_QUESTIONSET_ID,
    grammerQuestionRelationId:import.meta.env.VITE_GRAMMER_QUESTION_RELATION,
}
export default config 
 