import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import SkillList from "./SkillList";

interface ISkills {
  id: number;
  name: string;
}

interface ISkillsInformations {
  id?: number;
  skillName: string;
  grade: number;
}

interface IGradeValue {
  value: number;
}

interface IAddSkillToWilderProps {
  id?: number;
  date: number;
  setDate: Dispatch<SetStateAction<number>>;
  skills: ISkills[];
  skillsInformations: ISkillsInformations[];
  setSkillsInformations: Dispatch<SetStateAction<ISkillsInformations[]>>;
  gradesValues: IGradeValue[];
}

const AddSkillToWilder = ({
  id,
  date,
  setDate,
  skills,
  skillsInformations,
  setSkillsInformations,
  gradesValues,
}: IAddSkillToWilderProps) => {
  const [grade, setGrade] = useState<ISkillsInformations["grade"]>(0);
  const [skillName, setSkillName] = useState<ISkillsInformations["skillName"]>(
    "-- Select a skill --"
  );

  const addNewSkill = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (skillName === "-- Select a skill --") {
      alert("Please select a skill");
    } else if (
      skillsInformations.find((skill) => skill.skillName === skillName)
    ) {
      alert("You have allready rate this skill");
    } else {
      setSkillsInformations([
        { skillName: skillName, grade: grade },
        ...skillsInformations,
      ]);
      setSkillName("-- Select a skill --");
      setGrade(0);
      setDate(Date.now());
    }
  };

  const addNewSkillToExistingWilder = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/grade", {
      grade: grade,
      wilderId: id,
      skillName: skillName,
    });
    setSkillName("-- Select a skill --");
    setGrade(0);
    setDate(Date.now());
  };

  return (
    <div className="form-section">
      <label htmlFor="skill-select">Choose a skill and a grade :</label>
      <div className="add-skill-form">
        <select
          className="select"
          id="skill-select"
          value={skillName}
          onChange={(e) => {
            setSkillName(e.target.value);
          }}
        >
          <option value={skillName}>{skillName}</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.name}>
              {skill.name}
            </option>
          ))}
        </select>
        <select
          className="select"
          id="grade-select"
          value={grade}
          onChange={(e) => {
            setGrade(parseInt(e.target.value, 10));
          }}
        >
          <option value={grade}>{grade}</option>
          {gradesValues.map((grade) => (
            <option key={grade.value} value={grade.value}>
              {grade.value}
            </option>
          ))}
        </select>
        <button
          className="form-buttons"
          onClick={
            id ? (e) => addNewSkillToExistingWilder(e) : (e) => addNewSkill(e)
          }
        >
          Add skill
        </button>
      </div>
      <div>
        <SkillList
          id={id}
          grade={grade}
          date={date}
          setGrade={setGrade}
          gradesValues={gradesValues}
          skillsInformations={skillsInformations}
          setSkillsInformations={setSkillsInformations}
          setDate={setDate}
        />
      </div>
    </div>
  );
};

export default AddSkillToWilder;
