import { useEffect, useState } from "react";
import axios from "axios";
import "./VJAbout.css";

const VJAbout = () => {
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_STRAPI_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, eduRes] = await Promise.all([
          axios.get(`${apiUrl}/api/experiences`),
          axios.get(`${apiUrl}/api/educations`),
        ]);

        const sortByRange = (data) =>
          [...data].sort((a, b) => {
            const getEndYear = (range) => parseInt(range?.split("-")[1]) || 0;
            return getEndYear(b.Range) - getEndYear(a.Range);
          });

        setExperiences(sortByRange(expRes.data.data || []));
        setEducations(sortByRange(eduRes.data.data || []));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          {!loading &&
            experiences.length > 0 &&
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
            {!loading &&
              educations.length > 0 &&
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
