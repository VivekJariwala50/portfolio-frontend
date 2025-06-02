import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./VJProjectDetails.css";

const VJProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [otherProjects, setOtherProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_STRAPI_URL;
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  useEffect(() => {
    const fetchData = async (attempt = 1) => {
      try {
        const [projectRes, otherProjectsRes] = await Promise.all([
          axios.get(
            `${apiUrl}/api/vivek-jariwalas/${id}?populate=backgroundImg&populate=CoverImg`
          ),
          axios.get(`${apiUrl}/api/vivek-jariwalas?populate=backgroundImg`),
        ]);

        // Validate data
        if (!projectRes.data.data) {
          throw new Error(`Project with ID ${id} not found`);
        }
        if (
          !otherProjectsRes.data.data ||
          !Array.isArray(otherProjectsRes.data.data)
        ) {
          throw new Error("Invalid data for other projects");
        }

        setProject(projectRes.data.data);
        setOtherProjects(
          otherProjectsRes.data.data.filter((proj) => proj.documentId !== id)
        );
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err.message);
        if (attempt < maxRetries) {
          setTimeout(() => fetchData(attempt + 1), retryDelay);
        } else {
          setError(
            err.response?.status === 404
              ? `Project with ID ${id} not found`
              : "Failed to load project details. Please try again later."
          );
          setProject(null);
          setOtherProjects([]);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  if (!project) {
    return (
      <div className="container error-message">No project data available</div>
    );
  }

  const imageUrl =
    project.backgroundImg &&
    Array.isArray(project.backgroundImg) &&
    project.backgroundImg[0]?.url
      ? `${apiUrl}${project.backgroundImg[0].url}`
      : "";

  return (
    <>
      <section className="project-details-hero-sec">
        <div className="container">
          <Link to="/" className="h3 small dim-gray fw-normal back-link">
            <i className="ri-arrow-left-s-line"></i> Back to Projects
          </Link>
          <h1 className="font-spectral fw-medium hero-text mt-5 mb-1">
            {project.Title || "Untitled Project"}
          </h1>
          <p className="h3 small fw-light dim-gray">
            {project.Tagline || "No description available"}
          </p>
        </div>
      </section>

      <section className="banner-section">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={project.Title || "Project Image"}
            width="100%"
            height="100%"
          />
        )}
      </section>

      <section className="content-section">
        <div className="container">
          <a
            href={project.Link}
            target="_blank"
            className="h3 small dark-gray fw-normal visit-link"
          >
            Visit {project.Title || "Untitled Project"}
          </a>
          <div className="content-wrap">
            {project.CoverImg &&
              Array.isArray(project.CoverImg) &&
              project.CoverImg.length > 0 && (
                <img
                  src={`${apiUrl}${project.CoverImg[0].url}`}
                  alt={project.CoverImg[0].name || `Cover 1`}
                  width="100%"
                  height="100%"
                  className="mb-3"
                />
              )}
            <div className="content-description-wrap">
              <p className="dim-gray">
                <ReactMarkdown>
                  {project.Description || "No description available"}
                </ReactMarkdown>
              </p>
              <p className="dim-gray">
                <b>Technologies:</b> {project.Technologies || "None specified"}
              </p>
            </div>
            {project.CoverImg &&
              Array.isArray(project.CoverImg) &&
              project.CoverImg.length > 1 &&
              project.CoverImg.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={`${apiUrl}${img.url}`}
                  alt={img.name || `Cover ${index + 2}`}
                  width="100%"
                  height="100%"
                  className="mb-3"
                />
              ))}
          </div>
        </div>
      </section>

      <section className="other-project-section">
        <div className="container">
          <h2 className="gray font-spectral fw-normal mb-5">Other projects:</h2>
          <div className="project-list">
            {otherProjects.length > 0 ? (
              otherProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/project-details/${proj.documentId}`}
                  className="h1 small font-spectral visit-link d-block"
                >
                  {proj.Title || "Untitled Project"}
                </Link>
              ))
            ) : (
              <p>No other projects available</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default VJProjectDetails;
