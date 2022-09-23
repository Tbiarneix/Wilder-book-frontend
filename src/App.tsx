import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Wilder, { IWilderProps } from "./components/Wilder";
import WilderFormModal from "./components/WilderFormModal";
import SkillFormModal from "./components/SkillFormModal";

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

const App = () => {
  const [wildersData, setWildersData] = useState<IWilder[]>([]);
  const [date, setDate] = useState(Date.now());

  const formattedData = (datas: IWilderFromDb[]): IWilder[] => {
    return datas.map((data) => ({
      id: data.id,
      name: data.name,
      description: data.description,
      skills: data.grade.map((skill) => ({
        id: skill.id,
        title: skill.skill.name,
        votes: skill.grade,
      })),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const wilders = await axios.get("http://localhost:5000/api/wilders");
      setWildersData(formattedData(wilders.data));
    };

    fetchData();
  }, [date]);

  return (
    <div>
      <header>
        <div className="container">
          <h1>Wilders Book</h1>
        </div>
      </header>
      <main className="container">
        <div className="button-form-container">
          <WilderFormModal id={undefined} date={date} setDate={setDate} />
          <SkillFormModal setDate={setDate} />
        </div>
        <div className="wilder-modal">
          <div className="modal-form">
            <div className="modal-style"></div>
          </div>
        </div>
        <div className="wilder-modal">
          <div className="modal-form">
            <div className="modal-style">
              <p>Modal Add skills</p>
            </div>
          </div>
        </div>
        <h2>Wilders</h2>
        <section className="card-row">
          {wildersData.map((wilder) => (
            <Wilder
              key={wilder.id}
              id={wilder.id}
              name={wilder.name}
              description={wilder.description}
              skills={wilder.skills}
              date={date}
              setDate={setDate}
            />
          ))}
        </section>
      </main>
      <footer>
        <div className="container">
          <p>&copy; 2022 Wild Code School</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
