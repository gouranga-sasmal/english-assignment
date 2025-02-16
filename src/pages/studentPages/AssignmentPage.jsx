import React, { useContext, useEffect, useState } from "react";
import BackButton from "../../component/BackButton";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../../component/QuestionCard";
import context from "../../context/createContext";
import { Modal } from "react-bootstrap";
import HalfCircleProgress from "../../component/HalfCircleProgress";
import LoadingPage from "../LoadingPage";
import { toast } from "react-toastify";
import ErrorPage from '../EroorPage'

const AssignmentPage = () => {
  const param = useParams();
  const { getQuestion, updateAssignments } = useContext(context);
  const { assignmentDocid,chapterName, score, qsid } = param;
  const [allQuestions, setAllQuestions] = useState([]);
  const [addPopShow, setAddpopshow] = useState(false);
  const [newScore, setNewScore] = useState(0);
  const [showcorrectAns, setShowcorrectAns] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAllQuestions = async () => {
    setLoading(true);
    const res = await getQuestion(qsid);
    setLoading(false);
    if (res.length > 0) {
      setAllQuestions(res);
    }
  };


  useEffect(() => {
    if (score==0) {
      getAllQuestions();
    } else {
      console.log(score);
      setLoading(false);
    }
  }, []);


  const sendScore = async (scoreofHundred) => {
    let res = await updateAssignments(assignmentDocid, {
      score: scoreofHundred,
      completedDate: new Date().toISOString(),
    });
    if(res.assignmentId){
      toast.success("Assignment submitted successfully")
    }
  };

  const getScore = (scoreofHundred) => {
    setNewScore(scoreofHundred);
    setAddpopshow(true);
    sendScore(scoreofHundred);
  };

  const checkPreview = () => {
    setShowcorrectAns(true);
    setAddpopshow(false);
  };
  const backtoHome = () => {
    navigate(-1);
  };

  return (
    <div className="assignment-page ">
      <div className="header">
        <div className="container d-flex  align-items-center my-2">
          <BackButton className={"me-2"} />{" "}
          <h2 className="m-0">{chapterName}</h2>
        </div>
      </div>
      <div className="assignment-body ">
        {loading ? (
          <div className=" w-100 h-100 position-relative  d-flex align-items-center  justify-content-center">
            <LoadingPage />
          </div>
        ) :(score>0)?<div className=" shadow  text-center p-3"><h5>you already complete this assignments</h5>
        <HalfCircleProgress percent={score} />
        <h6>your score</h6>
        <BackButton className={"me-2 text-primary"}/>
        </div>:(allQuestions.length>0)? (
          <QuestionCard
            showcorrectAns={showcorrectAns}
            allQuestions={allQuestions}
            getScore={getScore}
          />
        ):<ErrorPage massage={'No question is there '} refreshFun={()=>getAllQuestions()}/>}
      </div>

      <Modal
        show={addPopShow}
        onHide={() => {
          setAddpopshow(false), backtoHome();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Score</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="pop-body ">
            <HalfCircleProgress percent={newScore} />
            <div className="w-100 d-flex justify-content-center py-5 ">
              <button onClick={checkPreview} className="w-25">
                Preview
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignmentPage;
