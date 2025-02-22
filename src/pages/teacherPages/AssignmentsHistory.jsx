import React, { useContext, useEffect, useState } from 'react'
import context from '../../context/createContext'
import { Query } from 'appwrite'
import { Link } from 'react-router-dom'
import LoadingPage from '../LoadingPage'
import { FaChevronRight } from 'react-icons/fa6'
import { convertISOToDate } from '../../component/ToolFunction'
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { capitalizeName } from "../../component/ToolFunction";
// import moment from 'moment';



const Assignments = () => {
  const {
    getingAssignments,
    isLogin,
    getAllClass,
    fetchQuestionSetByQuestionSetIds,
    getBookChapters
  } = useContext(context);
  const { listAllStudents } = useContext(context);
  const [formattedAssignments, setFormattedAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedDateId, setClickedDateId] = useState("");
  const [clickedSetId, setClickedSetId] = useState("");

  const getAssignment = async () => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Set to end of today

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6); // Go back 6 days to include today
    startDate.setHours(0, 0, 0, 0); // Set to start of the day
    //   console.log("Start date:", startDate.toISOString());
    //   console.log("End date:", endDate.toISOString());

    const response = await getingAssignments([
      Query.equal("teacherId", isLogin.id),
      Query.greaterThanEqual("sharedDate", startDate.toISOString()),
      Query.lessThanEqual("sharedDate", endDate.toISOString()),
      Query.orderDesc("sharedDate"),
      Query.limit(100), // Add this line to limit the results to 100
    ]);
    return response;
  };
  useEffect(() => {
    // getAssignment()
    getAssignmentAndFormatData();
  }, []);

  const fetchStudentAndClass = async (studentIds) => {
    const lStudentObjs = localStorage.getItem("students");
    const lStudent = lStudentObjs ? JSON.parse(lStudentObjs) : [];
    const lStudentIds = lStudent.map((student) => student.id);
    const isContained = studentIds.every((id) => lStudentIds.includes(id));
    if (lStudentIds.length == 0 || !isContained) {
      const students = await listAllStudents();
      localStorage.setItem("students", JSON.stringify(students.documents));
    }

    const lClassObjs = localStorage.getItem("classes");
    const lClass = lClassObjs ? JSON.parse(lClassObjs) : [];
    const lClassIds = lClass.map((cls) => cls.id);
    if (lClassIds.length == 0) {
      const classes = await getAllClass();
      localStorage.setItem("classes", JSON.stringify(classes.documents));
    }
  };

  const fetchChapters = async (classIds) => {
    const uniqueClassIds = [...new Set(classIds)];
    const lChapterObjs = localStorage.getItem("chapters");
    const lChapters = lChapterObjs ? JSON.parse(lChapterObjs) : [];
    const lChapterIds = lChapters.map((chapter) => chapter.classId);
    const isContained = uniqueClassIds.every((id) => lChapterIds.includes(id));
    console.log(uniqueClassIds);
    if (lChapterIds.length == 0 || !isContained) {
      const querys = Query.equal("classId", [JSON.parse(uniqueClassIds)])
      const allChapters = await getBookChapters([querys])
      localStorage.setItem("chapters", JSON.stringify(allChapters.documents));
    }
  };

  const getAssignmentAndFormatData = async () => {
    setLoading(true);
    const response = await getAssignment();
    const assignments = response.documents;
    const ids = getIds(assignments);
    if (ids.students.length == 0) {
      setLoading(false);
      setFormattedAssignments({});
      return;
    }
    const questionSetDetails = await fetchQuestionSetByQuestionSetIds(
      ids.questionSetIds
    );
    await fetchStudentAndClass(ids.students.map((student) => student.id));
    await fetchChapters(ids.classIds);
    const lStudentObjs = localStorage.getItem("students");
    const lStudents = lStudentObjs ? JSON.parse(lStudentObjs) : [];
    const lClassObjs = localStorage.getItem("classes");
    const lClass = lClassObjs ? JSON.parse(lClassObjs) : [];
    const lChapterObjs = localStorage.getItem("chapters");
    const lChapters = lChapterObjs ? JSON.parse(lChapterObjs) : [];

    const formattedResponse = formatResponse(
      assignments,
      lStudents,
      lClass,
      lChapters,
      questionSetDetails.documents
    );
    setLoading(false);
    setFormattedAssignments(formattedResponse);
  };

  const getIds = (response) => {
    let students = [];
    let questionSetIds = [];
    let classIds = [];
    response.forEach((assignment) => {
      students.push(assignment.studentId);
      questionSetIds.push(assignment.qsId);
      classIds.push(assignment.classId);
    });
    return { students, questionSetIds, classIds };
  };

  const formatResponse = (
    response,
    studentsData,
    classesData,
    chaptersData,
    questionSetData
  ) => {
    const formattedResponse = {};
    response.forEach((assignment) => {
      const sharedDate = convertISOToDate(assignment.sharedDate);
      if (!formattedResponse[sharedDate]) {
        formattedResponse[sharedDate] = [];
      }
      const assignmentObjs = formattedResponse[sharedDate];
      const assignmentObj = assignmentObjs.find(
        (as) => as.set_id === assignment.qsId
      );
      if (assignmentObj) {
        const student = studentsData.find(
          (student) => student.$id === assignment.studentId
        );
        const studentName = capitalizeName(student.name);
        const studentObj = {
          name: studentName,
          score: assignment.score,
          isCompleted: assignment.completedDate != null,
        };
        assignmentObj.students.push(studentObj);
      } else {
        const questionSet = questionSetData.find(
          (qs) => qs.$id === assignment.qsId
        );
        const chapter = chaptersData.find((chapter) => chapter.classId === assignment.classId && chapter.chapterId === assignment.chapterId);
        let chapterName = chapter.chapterName;
        if (chapterName.toLowerCase() === 'overall') {
          chapterName = chapterName + '(' + chapter.moduleName + ')'
        }
        const assignmentObj = {
          set_id: assignment.qsId,
          set_name: questionSet.title,
          cahpter_name: '',
          class_name: "Class: " + classesData.find((classs) => classs.classId === assignment.classId).name,
          chapter_name: chapterName,
          students: [],
        };
        const student = studentsData.find(
          (student) => student.$id === assignment.studentId
        );
        const studentName = capitalizeName(student.name);
        const studentObj = {
          name: studentName,
          score: assignment.score,
          isCompleted: assignment.completedDate != null,
        };
        assignmentObj.students.push(studentObj);
        assignmentObjs.push(assignmentObj);
      }
    });

    return formattedResponse;
  };

  const handelDateClick = (id) => {
    if (id == clickedDateId) {
      setClickedDateId("");
    } else {
      setClickedDateId(id);
    }
  };
  const handelSetClicked = (id) => {
    if (id == clickedSetId) {
      setClickedSetId("");
    } else {
      setClickedSetId(id);
    }
  };

  return (
    <div className="assignments-history border1111">
      <div className="history p-2">
        <ul className="border11  border11-success p-0">
          {Object.entries(formattedAssignments).map(([key, value]) => {
            return (
              <li className=" border11 border11-warning" key={key}>
                <label
                  onClick={() => handelDateClick(key)}
                  className="border11 px-3 d-flex align-items-center justify-content-between"
                  htmlFor=""
                >
                  {key}
                  {clickedDateId == key ? (
                    <MdOutlineKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </label>
                <ul
                  className="setlist px-2"
                  style={{ display: clickedDateId == key ? "block" : "none" }}
                >
                  {value.map((ele, ind) => {
                    return (
                      <li
                        className="border11 setbutton border11-info"
                        key={ind}
                      >
                        <label
                          onClick={() => handelSetClicked(key + ind)}
                          className="border11 px-3 d-flex align-items-center justify-content-between"
                          htmlFor=""
                        >
                          {ele.set_name} of {ele.chapter_name} <br/> {ele.class_name}
                          {clickedSetId == key + ind ? (
                            <MdOutlineKeyboardArrowUp />
                          ) : (
                            <MdKeyboardArrowDown />
                          )}
                        </label>
                        <ul
                          className="scorelist"
                          style={{
                            display:
                              clickedSetId == key + ind ? "block" : "none",
                          }}
                        >
                          {ele.students.map((student, i) => {
                            return (
                              <li key={i}>
                                <section className="d-flex align-items-center justify-content-between">
                                  <p>{student.name}</p>
                                  {student.isCompleted
                                    ? `${student.score}%`
                                    : "Inomplete"}
                                </section>
                                <div
                                  className="scorebody "
                                  hidden={!student.isCompleted}
                                >
                                  <div
                                    className="score "
                                    style={{
                                      width: `${student.score}%`,
                                      backgroundColor:
                                        student.score < 30
                                          ? "red"
                                          : student.score < 60
                                          ? "yellow"
                                          : "green",
                                    }}
                                  ></div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Assignments