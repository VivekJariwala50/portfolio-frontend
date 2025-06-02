import { useEffect, useState } from "react";
import axios from "axios";
import "./VJAbout.css";

const VJAbout = () => {
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_STRAPI_URL;
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  useEffect(() => {
    const fetchData = async (attempt = 1) => {
      try {
        const [expRes, eduRes] = await Promise.all([
          axios.get(`${apiUrl}/api/experiences`),
          axios.get(`${apiUrl}/api/educations`),
        ]);

        // Validate data
        if (
          !expRes.data.data ||
          !Array.isArray(expRes.data.data) ||
          !eduRes.data.data ||
          !Array.isArray(eduRes.data.data)
        ) {
          throw new Error("Invalid data received from API");
        }

        const sortByRange = (data) =>
          [...data].sort((a, b) => {
            const getEndYear = (range) => parseInt(range?.split("-")[1]) || 0;
            return getEndYear(b.Range) - getEndYear(a.Range);
          });

        setExperiences(sortByRange(expRes.data.data || []));
        setEducations(sortByRange(eduRes.data.data || []));
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt < maxRetries) {
          setTimeout(() => fetchData(attempt + 1), retryDelay);
        } else {
          setError(
            "Failed to load experiences and educations. Please try again later."
          );
          setExperiences([]);
          setEducations([]);
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

  const renderSection = (title, items, renderItem) => (
    <div className="mb-5">
      <h2 className="big fw-bold mb-5 dim-black">{title}</h2>
      <div className="experience-container">{items.map(renderItem)}</div>
    </div>
  );

  return (
    <section className="about-section">
      <div className="container">
        <div className="content-container">
          {experiences.length > 0 &&
            renderSection("Experience", experiences, (exp, index) => (
              <div className="experience-wrapper" key={index}>
                <h3 className="small dim-black fw-bold mb-3">
                  {exp.Role || "TITLE"}
                </h3>
                <p className="h3 small dim-gray">
                  {exp.CompanyName || "Company Name"}.
                </p>
                <p className="h3 small dim-gray">{exp.Range || "Year"}.</p>
              </div>
            ))}

          <div className="text-end">
            {educations.length > 0 &&
              renderSection("Education", educations, (edu, index) => (
                <div className="experience-wrapper" key={index}>
                  <h3 className="small dim-black fw-bold mb-3">
                    {edu.DegreeName || "Degree"}
                  </h3>
                  <p className="h3 small dim-gray">
                    {edu.UniversityName || "University Name"}.
                  </p>
                  <p className="h3 small dim-gray">{edu.Range || "Year"}.</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VJAbout;
