import { Link } from "react-router-dom";
import "./VJProjectSection.css";

export const VJProjectSection = ({
  backgroudImg,
  number,
  title,
  description,
  path,
}) => {
  return (
    <>
      <section
        className="vj-project-section"
        style={{ backgroundImage: `url(${backgroudImg})` }}
      >
        <div className="container">
          <div className="project-details-wrap">
            <h2 className="project-num font-spectral">{number}</h2>
            <h2 className="big fw-bold white mb-5">{title}</h2>
            <p className="h3 small fw-light gray-secondary mb-5">
              {description}
            </p>
            <Link to={path} className="h4 white fw-normal project-view-link">
              view project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
