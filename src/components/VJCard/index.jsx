import "./VJCard.css";

export const VJCard = ({ title, description }) => {
  return (
    <>
      <div className="vj-card">
        <h3 className="small fw-bold white text-uppercase mb-3">{title}</h3>
        <p className="h3 small dim-gray fw-light">{description}</p>
      </div>
    </>
  );
};
