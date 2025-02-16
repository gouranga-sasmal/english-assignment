import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";
import context from "../../context/createContext";
import LoadingPage from "../LoadingPage";
import { MdDeleteOutline } from "react-icons/md";
import BackButton from "../../component/BackButton";
import { capitalizeName } from "../../component/ToolFunction";
import ErrorPage from "../EroorPage";

const StudentList = () => {
  const [addPopShow, setAddpopShow] = useState(false);
  const [conformPopShow, setConformPopShow] = useState(false);
  const { studentSearch, addTheStudent, listAllStudents, removeStudent } =
    useContext(context);
  const [searchNum, setSearchNum] = useState("");
  const [student, setSetStudent] = useState("");
  const [listStudents, setListStudents] = useState("");
  const [filterStudens, setFilterdStudent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDet, setDeleteDet] = useState({});

  const listingStudents = async () => {
    setIsLoading(true);
    let res = await listAllStudents();
    setIsLoading(false);
    if (res) {
      if (res.total > 0) {
        setListStudents(res.documents);
      }
    } else {
      setListStudents("");
      setFilterdStudent("");
    }
  };

  useEffect(() => {
    listingStudents();
  }, []);

  const groupByClass = (array) => {
    return array.reduce((result, item) => {
      const classKey = item.class;
      if (!result[classKey]) {
        result[classKey] = [];
      }
      result[classKey].push(item);
      return result;
    }, {});
  };
  useEffect(() => {
    if (listStudents) {
      setFilterdStudent(groupByClass(listStudents));
    }
  }, [listStudents]);

  const handleShow = () => setAddpopShow(true);

  const handleClose = () => {
    setSetStudent("");
    setSearchNum("");
    setAddpopShow(false);
  };
  const closePop = () => {
    setConformPopShow(false);
  };
  const conformDeleteStudent = (studentName, studentId) => {
    setDeleteDet({ studentName, studentId });
    setConformPopShow(true);
  };

  const handelChange = (e) => {
    setSearchNum(e.target.value);
  };

  const handelSearch = async () => {
    setSetStudent("");
    let res = await studentSearch(searchNum);
    if (res.total == 0) {
      setSetStudent("not found");
    } else {
      setSetStudent(res.documents[0]);
    }
  };

  const addStudent = async (studentid) => {
    handleClose();
    let res = await addTheStudent(studentid);
    if (res.$id) {
      localStorage.removeItem("students");
      localStorage.removeItem("classes");
      listingStudents();
      
    } else {
      console.log("error while adding");
    }
  };

  const deleteStudent = async (id) => {
    setConformPopShow(false);
    let res = await removeStudent(id);
    if (res) {
      localStorage.removeItem("students");
      localStorage.removeItem("classes");
      listingStudents();
    }
  };
  return (
    <>
      <div className="student-list ">
        <div className="header">
          <div className="container d-flex  align-items-center">
            <BackButton className={"me-2"} />{" "}
            <h2 className="m-0">All students</h2>
          </div>
        </div>
        <div className="list p-2 ">
          {}
          {
            isLoading ? (
              <LoadingPage />
            ) : filterStudens ? (
              <>
                {Object.keys(filterStudens).map((classKey) => (
                  <div key={classKey}>
                    <ul className=" list-stu p-0">
                      <h2 className="rounded">
                        Class: <span>{classKey}</span>
                      </h2>
                      {filterStudens[classKey].map((student) => (
                        <li
                          key={student.$id}
                          className="my-2 p-2 d-flex  align-items-center justify-content-between rounded"
                        >
                          {" "}
                          <div className="logo">
                            <p>{student.name[0]}</p>
                          </div>
                          <div className=" w-50  text-start ms-3 ">
                            <h5 className="m-0">
                              {capitalizeName(student.name)}
                            </h5>
                            <p className="m-0"> Phone: {student.phone}</p>
                          </div>{" "}
                          <button
                            className="rounded"
                            onClick={() =>
                              conformDeleteStudent(student.name, student.$id)
                            }
                          >
                            <MdDeleteOutline className="me-1" />{" "}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* {listStudents.map((student)=> 
            <li key={student.$id} className='my-2 p-2 d-flex  align-items-center rounded'> <div className="logo"><p>{student.name[0]}</p></div>
           <div className=' w-50  text-start ms-3 '><h5 className='m-0'>{student.name}</h5><p className='m-0'> class :{student.class}</p></div>  <button className='rounded' onClick={()=>conformDeleteStudent(student.name,student.$id)}><MdDeleteOutline className='me-1'/> remove</button></li>
            )}   */}
              </>
            ) : (
              <ErrorPage
                massage={"No students available"}
                refreshFun={() => listingStudents()}
              />
            )
            // <div className=' empty-massage d-flex w-100 h-100 align-items-center justify-content-center text-center'>
            //   <p  className='m-auto'>No students available<br/> Add students to view </p>
            // </div>
          }
        </div>

        <div className="fotter ">
          <button onClick={handleShow} className="">
            Add student
          </button>
        </div>
      </div>
      <Modal show={addPopShow} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add student</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="input d-flex justify-content-between ">
            <input
              onChange={handelChange}
              placeholder="search by number"
              type="number"
            />
            <button onClick={handelSearch}>
              <IoSearch />
            </button>
          </div>
          <div className="student ">
            <ul className="list-unstyled">
              {student ? (
                student == "not found" ? (
                  <p className="text-start">
                    {" "}
                    <span className="text-danger ">
                      Please enter a valid student's number
                    </span>
                  </p>
                ) : (
                  <li className=" d-flex justify-content-between align-items-center rounded my-4 p -2">
                    {" "}
                    <div className="logo">
                      <p>{student.name[0]}</p>
                    </div>
                    <div className="ms-2 me-5 text-start ">
                      <h5 className="m-0">{capitalizeName(student.name)}</h5>
                      <p className="m-0"> class :{student.class}</p>
                    </div>{" "}
                    <button
                      className="rounded"
                      onClick={() => addStudent(student.$id)}
                    >
                      Add
                    </button>
                  </li>
                )
              ) : (
                ""
              )}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal show={conformPopShow} onHide={closePop} centered>
        <Modal.Header>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0 del-sec border-0">
          <h5>Confirm Removal </h5>
          <p>
            Remove <b className="">{capitalizeName(deleteDet.studentName)}</b>{" "}
            from your list?
          </p>
          <div className="d-flex justify-content-center p-2  ">
            <button onClick={closePop} className="cancel-btn me-4 ">
              Keep
            </button>
            <button
              className="del-btn"
              onClick={() => deleteStudent(deleteDet.studentId)}
            >
              {" "}
              Remove
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentList;
