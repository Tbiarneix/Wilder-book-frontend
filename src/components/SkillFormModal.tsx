import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import PureModal from "react-pure-modal";
import "react-pure-modal/dist/react-pure-modal.min.css";

interface ISkillsProps {
  id: number;
  name: string;
}

interface ISkillModalProps {
  setDate: Dispatch<SetStateAction<number>>;
}

const SkillFormModal = ({ setDate }: ISkillModalProps) => {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<ISkillsProps[]>([]);
  const [skillToRemove, setSkillToRemove] = useState(false);

  const submitForm = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/skills", {
      name: name,
    });
    setName("");
    setSkillToRemove(!skillToRemove);
    setDate(Date.now());
  };

  const removeSkill = async (id: number) => {
    // e.preventDefault();
    await axios.delete("http://localhost:5000/api/skills", {
      data: {
        idToDelete: id,
      },
    });
    setSkillToRemove(!skillToRemove);
    setDate(Date.now());
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/skills")
      .then((res) => res.data)
      .then((data) => setSkills(data));
  }, [skillToRemove]);

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
          return true;
        }}
      >
        <div>
          <form>
            <div className="form-section">
              <h2 style={{ textAlign: "center", color: "#F76C6C" }}>
                Add or remove a skill
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
              <button
                type="submit"
                className="form-buttons"
                style={{ marginLeft: "1em" }}
                onClick={(e) => {
                  submitForm(e);
                }}
              >
                Add
              </button>
            </div>
          </form>
          <div className="form-section">
            <h3 style={{ textAlign: "center", color: "#F76C6C" }}>
              {" "}
              Skill list
            </h3>
            {skills.map((skill) => (
              <div className="skill-list" key={skill.id}>
                <p>{skill.name}</p>
                <button
                  className="form-buttons"
                  value={skill.id}
                  onClick={() => removeSkill(skill.id)}
                >
                  Remove skill
                </button>
              </div>
            ))}
          </div>
        </div>
      </PureModal>
      <button className="add-wilder-button" onClick={() => setModal(true)}>
        Add or remove a skill
      </button>
    </div>
  );
};

export default SkillFormModal;
