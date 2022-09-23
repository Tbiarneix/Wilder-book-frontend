import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import PureModal from "react-pure-modal";
import "react-pure-modal/dist/react-pure-modal.min.css";

import AddSkillToWilder from "./AddSkillToWilder";

interface IWilderFromDb {
  id: number;
  name: string;
  description: string;
  grade: IGradeFromDb[];
}

interface IGradeFromDb {
  id: number;
  grade: number;
  skill: {
    id: number;
    name: string;
  };
}

interface ISkillsFromDb {
  id: number;
  name: string;
}

interface IWilder {
  id: number;
  name: string;
  description: string;
  skills: ISkills[];
}

interface ISkills {
  id: number;
  title: string;
  votes: number;
}

interface ISkillsInformations {
  id?: number;
  skillName: string;
  grade: number;
}

interface IWilderFormModal {
  id?: number;
  date: number;
  setDate: Dispatch<SetStateAction<number>>;
}

interface IGradeValue {
  value: number;
}

const WilderFormModal = ({ id, date, setDate }: IWilderFormModal) => {
  const [modal, setModal] = useState<boolean>(false);
  const [name, setName] = useState<IWilder["name"]>("");
  const [description, setDescription] = useState<IWilder["description"]>("");
  const [skills, setSkills] = useState<ISkillsFromDb[]>([]);
  const [skillsInformations, setSkillsInformations] = useState<
    ISkillsInformations[]
  >([]);
  const gradesValues: IGradeValue[] = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: 10 },
  ];

  useEffect(() => {
    if (id !== undefined) {
      axios
        .get("http://localhost:5000/api/wilders")
        .then((res) => res.data)
        .then((data) =>
          data.filter((wilder: IWilderFromDb) => wilder.id === id)
        )
        .then((filteredData) => {
          setName(filteredData[0].name),
            setDescription(filteredData[0].description),
            setSkillsInformations(
              filteredData[0].grade.map((skill: IGradeFromDb) => ({
                id: skill.id,
                skillName: skill.skill.name,
                grade: skill.grade,
              }))
            );
        });
    }
  }, [date]);

  const postAWilder = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newWilder = await axios.post("http://localhost:5000/api/wilders", {
      name: name,
      description: description,
    });

    skillsInformations.forEach(async (skill) => {
      await axios.post("http://localhost:5000/api/grade", {
        grade: skill.grade,
        wilderId: newWilder.data.id,
        skillName: skill.skillName,
      });
    });

    setName("");
    setDescription("");
    setDate(Date.now());
    setModal(false);
  };

  const updateAwilder = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await axios.put("http://localhost:5000/api/wilders", {
      id: id,
      name: name,
      description: description,
    });

    skillsInformations.forEach(async (grade) => {
      await axios.put("http://localhost:5000/api/grade", {
        grade: grade.grade,
        id: grade.id,
      });
    });
    setDate(Date.now());
    setModal(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/skills")
      .then((res) => res.data)
      .then((data) => setSkills(data));
  }, []);

  return (
    <div>
      <PureModal
        isOpen={modal}
        width={"20%"}
        closeButton="X"
        closeButtonPosition="header"
        className="modal-style"
        onClose={() => {
          setModal(false);
          setDate(Date.now());
          return true;
        }}
      >
        <form>
          <div className="form-section">
            <h2 style={{ textAlign: "center", color: "#F76C6C" }}>
              {id ? "Update a wilder" : "Add a wilder"}
            </h2>
            <label htmlFor="name-input">Name :</label>
            <br />
            <input
              className="input"
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="form-section">
            <label htmlFor="description-area">Description :</label>
            <br />
            <textarea
              className="input"
              id="description-area"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            ></textarea>
            <br />
          </div>
          <AddSkillToWilder
            id={id}
            date={date}
            setDate={setDate}
            skills={skills}
            skillsInformations={skillsInformations}
            setSkillsInformations={setSkillsInformations}
            gradesValues={gradesValues}
          />
          <div id="buttons" className="form-buttons-container">
            <button
              className="form-buttons"
              onClick={id ? (e) => updateAwilder(e) : (e) => postAWilder(e)}
            >
              {id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </PureModal>
      <button
        className={id ? "form-buttons" : "add-wilder-button"}
        onClick={() => setModal(true)}
      >
        {id ? "Update a wilder" : "Add a wilder"}
      </button>
    </div>
  );
};

export default WilderFormModal;
