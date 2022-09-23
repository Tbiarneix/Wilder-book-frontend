import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import blank_profile from "../assets/blank_profile.png";
import Skill, { ISkill } from "./Skill";
import WilderFormModal from "./WilderFormModal";

export interface IWilderProps {
  id: number;
  name: string;
  description: string;
  skills: ISkill[];
  date: number;
  setDate: Dispatch<SetStateAction<number>>;
}

const Wilder = ({
  id,
  name,
  description,
  skills,
  date,
  setDate,
}: IWilderProps) => {
  const deleteOnClick = async () => {
    await axios.delete("http://localhost:5000/api/wilders", {
      data: {
        idToDelete: id,
      },
    });
    setDate(Date.now());
  };

  return (
    <div className="card">
      <img src={blank_profile} alt="Jane Doe Profile" />
      <h3>{name}</h3>
      <p>{description}</p>
      <h4>Wild Skills</h4>
      <ul className="skills">
        {skills.map((skill) => (
          <Skill
            key={skill.id}
            id={skill.id}
            title={skill.title}
            votes={skill.votes}
          />
        ))}
      </ul>
      <div className="wilder-buttons-container">
        <WilderFormModal id={id} date={date} setDate={setDate} />
        <button
          className="form-buttons"
          onClick={() => {
            deleteOnClick();
          }}
        >
          Delete the wilder
        </button>
      </div>
    </div>
  );
};

export default Wilder;
