import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const HelpDesk = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/em-helpdesk-query`,
          { search: query },
          {
            withCredentials: true,
          }
        );
        setResults(res.data.data || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="helpDesk-card">
                <div className="helpDesk-logo">
                  <img
                    src="/dist/img/webguruz-logo-blue.png"
                    alt="Webguruz Logo"
                  />
                </div>
                <div className={`form-outline helpDesk-search ${query ? "show" : ""}`}>
                  <input
                    type="search"
                    className="form-control search"
                    placeholder="Type query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {results.length > 0 && (
                    <ul className="helpDesk-dropdown" type="none">
                      {results.map((item) => (
                        <li key={item.id}>
                          <Link to={`/helpdesk/${item.id}`}>{item.question}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebar Menu */}
      <div className="sidebar-navmenu" id="js-sidebar-navmenu">
        <div className="close-sidebar-navmenu" id="js-close-sidebar-navmenu">
          <i className="fas fa-times"></i>
        </div>
        {/* <EmLeftMenu /> */}
      </div>
    </>
  );
};

export default HelpDesk;
