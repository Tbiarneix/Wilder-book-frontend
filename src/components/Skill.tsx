export interface ISkill {
  id: number;
  title: string;
  votes: number;
}

const Skill = ({ title, votes }: ISkill) => {
  return (
    <>
      <li>
        {title}
        <span className="votes">{votes}</span>
      </li>
    </>
  );
};

export default Skill;
