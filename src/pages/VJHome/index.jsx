import { useEffect, useState } from "react";
import { VJCard } from "../../components/VJCard";
import { Row, Col } from "react-bootstrap";
import { VJProjectSection } from "../../components/VJProjectSection";
import axios from "axios";
import "./VJHome.css";

const VJHome = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_STRAPI_URL;
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  useEffect(() => {
    const fetchData = async (attempt = 1) => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/vivek-jariwalas?populate=backgroundImg`),
          axios.get(`${apiUrl}/api/skills`),
        ]);

        // Check if data is valid
        if (
          !projectsRes.data.data ||
          !Array.isArray(projectsRes.data.data) ||
          !skillsRes.data.data ||
          !Array.isArray(skillsRes.data.data)
        ) {
          throw new Error("Invalid data received from API");
        }

        const sortedProjects = [...(projectsRes.data.data || [])].sort(
          (a, b) => parseInt(a.Number) - parseInt(b.Number)
        );
        setProjects(sortedProjects);
        setSkills(skillsRes.data.data || []);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err.message);
        if (attempt < maxRetries) {
          // Retry after delay
          setTimeout(() => fetchData(attempt + 1), retryDelay);
        } else {
          setError(
            "Failed to load projects and skills. Please try again later."
          );
          setProjects([]);
          setSkills([]);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

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

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <h1 className="font-spectral fw-medium hero-text">
            Software Engineer,
          </h1>
          <h2 className="font-spectral fw-bold hero-text">Data Analyst</h2>
          <h3 className="small fw-light dim-gray mt-4 ls-1">
            M.S. in Computer Science — Class of 2026
          </h3>
        </div>
      </section>

      <section className="skills-section bg-black">
        <div className="container">
          <h2 className="big gray font-spectral fw-normal ls-1 text-center mb-5">
            SKILLS
          </h2>
          <div className="skills-card-wrap">
            <Row className="g-4">
              {skills.map((item, index) => (
                <Col xs={12} sm={6} key={index}>
                  <VJCard
                    title={item.SkillsTitle || "Skill"}
                    description={item.Description || "Description"}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </section>

      {projects.length > 0 ? (
        projects.map((project) => (
          <VJProjectSection
            key={project.id}
            backgroudImg={
              project.backgroundImg &&
              Array.isArray(project.backgroundImg) &&
              project.backgroundImg[0]?.url
                ? `${apiUrl}${project.backgroundImg[0].url}`
                : ""
            }
            description={project.Tagline || ""}
            number={project.Number || ""}
            path={`/project-details/${project.documentId}`}
            title={project.Title || ""}
          />
        ))
      ) : (
        <div className="container">No projects available</div>
      )}

      <a
        href="mailto:vj84491n@pace.edu"
        className="sticky-email text-decoration-none"
      >
        <div className="email-icon">
          <i className="ri-mail-line"></i>
        </div>
      </a>
    </>
  );
};

export default VJHome;
