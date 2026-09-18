import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Production Flask backend on Render
const API = "https://gitlytics-1-nov2.onrender.com";

export default function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze(e) {
    e.preventDefault();

    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(
        `${API}/api/repositories?username=${encodeURIComponent(
          username.trim()
        )}`
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Request failed");
      }

      setData(json);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const chartData = useMemo(() => {
    if (!data) return [];

    return data.repositories.slice(0, 10).map((repo) => ({
      name:
        repo.name.length > 14
          ? repo.name.slice(0, 14) + "…"
          : repo.name,
      stars: repo.stars,
      forks: repo.forks,
    }));
  }, [data]);

  return (
    <div className="page">
      <header>
        <div>
          <h1>Gitlytics</h1>
          <p>GitHub repository analytics dashboard</p>
        </div>
      </header>

      <main>
        <form className="search" onSubmit={analyze}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username (e.g. torvalds)"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {!data && !loading && !error && (
          <section className="welcome">
            <h2>Analyze a GitHub profile</h2>
            <p>
              Enter a public GitHub username to view repository activity and
              statistics.
            </p>
          </section>
        )}

        {data && (
          <>
            <h2>{data.username}'s GitHub Overview</h2>

            <section className="cards">
              <Card
                label="Repositories"
                value={data.summary.repositories}
              />

              <Card
                label="Total Stars"
                value={data.summary.stars}
              />

              <Card
                label="Total Forks"
                value={data.summary.forks}
              />

              <Card
                label="Languages"
                value={Object.keys(data.summary.languages).length}
              />
            </section>

            <section className="panel">
              <h3>Repository Stars & Forks</h3>

              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Bar
                      dataKey="stars"
                      name="Stars"
                    />

                    <Bar
                      dataKey="forks"
                      name="Forks"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel">
              <h3>Repositories</h3>

              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>Repository</th>
                      <th>Language</th>
                      <th>Stars</th>
                      <th>Forks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.repositories.map((repo) => (
                      <tr key={repo.full_name}>
                        <td>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {repo.name}
                          </a>
                        </td>

                        <td>{repo.language || "—"}</td>

                        <td>{repo.stars}</td>

                        <td>{repo.forks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}