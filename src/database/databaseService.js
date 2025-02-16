import { Databases, ID, Query } from "appwrite";
import config from "../conf/config";
import client from "./databaseClient";

const databases = new Databases(client);


export const register = async (userDetails) => {
    let { userName, phone, readClass, userType, password, degree } = userDetails;
    if (userType == "student") {
        return await databases.createDocument(
            config.databaseId,
            config.studentUserList,
            ID.unique(),
            {
                name: userName,
                phone: phone,
                class: readClass,
                password: password
            }
        );
    }
    else if (userType == 'teacher') {
        return await databases.createDocument(
            config.databaseId,
            config.teacherUserList,
            ID.unique(),
            {
                name: userName,
                phone: phone,
                degree: degree,
                password: password
            }
        );
    }

}



export const login = async (user) => {
    const { Phone, userType, password } = user;
    if (userType == "student") {
        return await databases.listDocuments(
            config.databaseId,
            config.studentUserList,
            [
                Query.equal("phone", [Phone]),
                Query.equal("password", [password])

            ]
        );
    }
    else if (userType == "teacher") {
        return await databases.listDocuments(
            config.databaseId,
            config.teacherUserList,
            [
                Query.equal("phone", [Phone]),
                Query.equal("password", [password])

            ]
        );
    }


}


export const searchStudent = async (query) => {
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.studentUserList,
            query
        );
    }
    catch (err) {
        console.log(err);
    }

}
export const searchTeacher = async (querys) => {
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.teacherUserList,
            querys
            
        );
    }
    catch (err) {
        console.log(err);
    }

}


export const addStudents = async (addData) => {
    try {
        return await databases.createDocument(
            config.databaseId,
            config.tutorList,
            ID.unique(), addData)
    }
    catch (err) {
        return err;
    }
}


export const listStudents = async (teacherId) => {
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.tutorList,
            [
                Query.equal("teacherId", [teacherId]),
            ]
        );
    }
    catch (err) {
        return err
    }

}

export const getStudents = async (stuDentsIds , exQuery = []) => {
    const finealQuery = [Query.equal("$id", stuDentsIds),
        ...exQuery ]
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.studentUserList,
            finealQuery
        );

    }
    catch (err) {
        return err
    }


}

export const removeStudentfromTeacherList = async (deletedata) => {
    try {
        let res = await databases.listDocuments(
            config.databaseId,
            config.tutorList,
            [Query.equal("teacherId", [deletedata.teacherId]),
            Query.equal("studentId", [deletedata.studentId])
            ]

        )
        if (res) {
            if (res.total >= 0) {
                try {
                    return await databases.deleteDocument(
                        config.databaseId,
                        config.tutorList,
                        res.documents[0].$id
                    )
                } catch (error) {
                    console.log(error);
                }
            }
        }

    }
    catch (err) {
        return err
    }

}

export const addProfileImg = (userId, img) => {
    console.log(userId, img);
}

export const getAllClasses = async ()=>{
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.allClasses,
        );

    }
    catch (err) {
        return err
    }


}

export const getChapters = async (querys)=>{
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.allChapters,
            querys

        );
    }
    catch (err) {
        return err
    }
}
 export const takeQuestionSet = async(classid,chapterid) =>{
    let classId = JSON.parse(classid)
    let chapterId = JSON.parse(chapterid)

    try {
        return await databases.listDocuments(
            config.databaseId,
            config.allQuestionSet,
            [Query.equal("classId", [classId]),
            Query.equal("chapterId", [chapterId])
            ]

        );
    } catch (error) {
        console.log(error);
    }
}

export const fetchGrammerQuestionSet = async(classid,chapterid) =>{
    return fetchQuestionSet(classid, chapterid, true, null)
}

export const fetchQuestionSetByQsIds = async(qsIds) =>{
    return fetchQuestionSet(null, null, false, qsIds)
}

export const fetchQuestionSet = async(classid,chapterid, isGrammer, qsIds) => {
    
    let querys = []
    if (qsIds) {
        console.log(qsIds);
        querys = [ Query.equal("$id", qsIds)]
    } else {
        const classId = JSON.parse(classid)
        const chapterId = JSON.parse(chapterid)
        querys = [
            Query.equal("classId", [classId]),
            Query.equal("chapterId", [chapterId])
        ]
    }
    
    const collectionId = isGrammer == true ? config.allGrammerQuestionSet : config.allQuestionSet

    try {
        return await databases.listDocuments(
            config.databaseId,
            collectionId,
            querys
        );
    } catch (error) {
        console.log(error);
    }
}

 export const getQuestionRelation =  async(questionSetId) =>{
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.questionRelationId,
            [Query.equal("qsId", [questionSetId]),
            ]

        );
    } catch (error) {
     console.log(error);   
    }
} 
export const getQuestions = async(questionIds) =>{
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.allQuestionId,
            [Query.equal("$id", questionIds),
            ]

        );
    } catch (error) {
     console.log(error);   
    }
}
export const getQuestionsOption = async(questionIds) =>{
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.allQuestionOption,
            [Query.equal("questionId", questionIds),
            ]

        );
    } catch (error) {
     console.log(error);   
    }
}
export const addAssingments = async(documents) =>{
try{
    return await databases.createDocument(
        config.databaseId,
        config.allAssingments,
        ID.unique(),documents)
}
catch(err){
    console.log(err);
}
}

export const getAssignments = async(querys)=>{
    try {
        return await databases.listDocuments(
            config.databaseId,
            config.allAssingments,
            querys
        );
    } catch (error) {
     console.log(error);   
    }
}


export const updateDoc = async(documentId , data)=>{
    try {
        return await databases.updateDocument(
            config.databaseId,
            config.allAssingments,
            documentId,
            data
        );
    } catch (error) {
     console.log(error);   
    }
}