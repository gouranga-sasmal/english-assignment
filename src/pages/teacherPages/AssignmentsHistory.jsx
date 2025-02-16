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
    const lStudentObjs = localStorage.getItem("students");
    const lStudents = lStudentObjs ? JSON.parse(lStudentObjs) : [];
    const lClassObjs = localStorage.getItem("classes");
    const lClass = lClassObjs ? JSON.parse(lClassObjs) : [];

    const formattedResponse = formatResponse(
      assignments,
      lStudents,
      lClass,
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
        const assignmentObj = {
          set_id: assignment.qsId,
          set_name: questionSet.title,
          class_name: "Class " + assignment.classId, // classesData.find((classs) => classs.classId === assignment.classId).name,
          chapter_name: "",
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

  const strecturedObj = {
    "20-Jun-24": [
      {
        set_name: "set1",
        class_name: "IX",
        chapter_name: "Algebra Basics",
        students: [
          {
            name: "sumitra jana",
            score: 85,
          },
          {
            name: "sudipta shaoo",
            score: 18,
          },
          {
            name: "gour manna",
            score: 42,
          },
        ],
      },
      {
        set_name: "set1",
        class_name: "IX",
        chapter_name: "Algebra Basics",
        students: [
          {
            name: "sumitra jana",
            score: 16,
          },
          {
            name: "sudipta shaoo",
            score: 66,
          },
          {
            name: "gour manna",
            score: 24,
          },
        ],
      },
    ],
    "21-Jun-24": [
      {
        set_name: "set2",
        class_name: "X",
        chapter_name: "Geometry Fundamentals",
        students: [
          {
            name: "sudipta jana",
            score: 11,
          },
          {
            name: "gour manna",
            score: 53,
          },
          {
            name: "sudipta shaoo",
            score: 82,
          },
        ],
      },
    ],
    "22-Jun-24": [
      {
        set_name: "set3",
        set_id: "123",
        class_name: "XI",
        chapter_name: "Calculus Introduction",
        students: [
          {
            name: "Grace",
            score: 66,
          },
          {
            name: "sumitra jana",
            score: 56,
          },
          {
            name: "Ivy",
            score: 24,
          },
        ],
      },
    ],
    "23-Jun-24": [
      {
        set_name: "set4",
        class_name: "XII",
        chapter_name: "Statistics",
        students: [
          {
            name: "sudipta jana",
            score: 67,
          },
          {
            name: "sumitra jana",
            score: 87,
          },
          {
            name: "gour manna",
            score: 10,
          },
        ],
      },
    ],
    "24-Jun-24": [
      {
        set_name: "set5",
        class_name: "IX",
        chapter_name: "Trigonometry",
        students: [
          {
            name: "sumitra jana",
            score: 90,
          },
          {
            name: "sudipta shaoo",
            score: 12,
          },
          {
            name: "gour manna",
            score: 94,
          },
        ],
      },
    ],
    "25-Jun-24": [
      {
        set_name: "set5",
        class_name: "IX",
        chapter_name: "Trigonometry",
        students: [
          {
            name: "sumitra jana",
            score: 90,
          },
          {
            name: "sudipta shaoo",
            score: 12,
          },
          {
            name: "gour manna",
            score: 94,
          },
        ],
      },
    ],
    "26-Jun-24": [
      {
        set_name: "set5",
        class_name: "IX",
        chapter_name: "Trigonometry",
        students: [
          {
            name: "sumitra jana",
            score: 90,
          },
          {
            name: "sudipta shaoo",
            score: 12,
          },
          {
            name: "gour manna",
            score: 94,
          },
        ],
      },
    ],
    "27-Jun-24": [
      {
        set_name: "set5",
        class_name: "IX",
        chapter_name: "Trigonometry",
        students: [
          {
            name: "sumitra jana",
            score: 90,
          },
          {
            name: "sudipta shaoo",
            score: 12,
          },
          {
            name: "gour manna",
            score: 94,
          },
        ],
      },
    ],
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
                          {ele.set_name} of {ele.class_name}
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