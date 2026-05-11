import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getUser } from "../utils/auth";

const STATUS_ORDER = ["Applied", "Interview", "Offer", "Rejected"];

const STATUS_STYLES = {
  Applied: "bg-sky-100 text-sky-800 ring-sky-200",
  Interview: "bg-amber-100 text-amber-900 ring-amber-200",
  Offer: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Rejected: "bg-rose-100 text-rose-800 ring-rose-200",
};

const formatSalary = (n) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
};

const formatDate = (d) => {
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(d));
  } catch {
    return "";
  }
};

function Home() {
  const user = getUser();
  // jwt-decode returns a new object every call — never use `user` as a useEffect dependency
  // or the effect re-runs every render, sets loading again, and hides the dashboard.
  const userId = user?.userId ?? null;
  const displayName = user?.name?.trim() || "Your";

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setJobs([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get("/api/jobs")
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : [];
        if (!cancelled) setJobs(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load applications.");
          console.error(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const byStatus = STATUS_ORDER.reduce((acc, s) => {
      acc[s] = jobs.filter((j) => j.status === s).length;
      return acc;
    }, {});
    const salaries = jobs.map((j) => Number(j.salary)).filter((n) => !Number.isNaN(n));
    const avgSalary =
      salaries.length > 0
        ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
        : null;
    return { total, byStatus, avgSalary };
  }, [jobs]);

  const recentJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 6);
  }, [jobs]);

  const handleEdit = (job) => {
    localStorage.setItem("editJob", JSON.stringify(job));
    navigate("/create-job");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-indigo-50/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Job Tracker
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Stay on top of every application, in one calm dashboard.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Track roles, companies, salary targets, and pipeline status—from first apply to final
              offer—without spreadsheets or scattered notes.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Pipeline at a glance",
                body: "See how many roles are applied, interviewing, or in offer stage—instantly.",
              },
              {
                title: "Notes that stick",
                body: "Keep role context next to each application so prep stays where you need it.",
              },
              {
                title: "Built for focus",
                body: "A single place to add, edit, and retire applications as your search evolves.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">Welcome back</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {displayName}&rsquo;s dashboard
            </h1>
            <p className="mt-2 max-w-xl text-slate-600">
              {stats.total === 0
                ? "Add your first application to start tracking your job search."
                : `You are tracking ${stats.total} application${stats.total === 1 ? "" : "s"} across your pipeline.`}
            </p>
          </div>
          <Link
            to="/create-job"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            New application
          </Link>
        </header>

        {loading ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-white/60 ring-1 ring-slate-200/80"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-800">
            {error}
          </div>
        ) : (
          <>
            <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
                <p className="mt-1 text-sm text-slate-500">Active records</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  In interview
                </p>
                <p className="mt-2 text-3xl font-bold text-amber-700">{stats.byStatus.Interview}</p>
                <p className="mt-1 text-sm text-slate-500">Conversations in flight</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Offers
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-700">{stats.byStatus.Offer}</p>
                <p className="mt-1 text-sm text-slate-500">Wins to celebrate</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Avg. salary
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.avgSalary != null ? formatSalary(stats.avgSalary) : "—"}
                </p>
                <p className="mt-1 text-sm text-slate-500">Across listed roles</p>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 lg:col-span-1">
                <h2 className="text-sm font-semibold text-slate-900">Pipeline mix</h2>
                <p className="mt-1 text-xs text-slate-500">Share of applications by status</p>
                <ul className="mt-6 space-y-4">
                  {STATUS_ORDER.map((status) => {
                    const count = stats.byStatus[status];
                    const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <li key={status}>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                          <span>{status}</span>
                          <span>{count}</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 lg:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Latest updates across your applications
                    </p>
                  </div>
                  <Link to="/create-job" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    Add new
                  </Link>
                </div>
                {recentJobs.length === 0 ? (
                  <div className="mt-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">No applications yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Create one to see it show up here with status and notes.
                    </p>
                    <Link
                      to="/create-job"
                      className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Add application
                    </Link>
                  </div>
                ) : (
                  <ul className="mt-6 divide-y divide-slate-100">
                    {recentJobs.map((job) => (
                      <li key={job._id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0">
                        <div>
                          <p className="font-medium text-slate-900">{job.role}</p>
                          <p className="text-sm text-slate-500">{job.company}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[job.status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}
                          >
                            {job.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatDate(job.updatedAt || job.createdAt)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">All applications</h2>
                <span className="text-sm text-slate-500">{jobs.length} total</span>
              </div>
              {jobs.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center">
                  <p className="text-sm font-medium text-slate-700">No applications yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Create one to see it listed here with salary, status, and notes.
                  </p>
                  <Link
                    to="/create-job"
                    className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Add application
                  </Link>
                </div>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {jobs.map((job) => (
                    <article
                      key={job._id}
                      className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-indigo-700 group-hover:text-indigo-800">
                            {job.role}
                          </h3>
                          <p className="text-sm text-slate-500">{job.company}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[job.status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <dt className="text-slate-500">Salary</dt>
                          <dd className="font-medium text-slate-900">{formatSalary(job.salary)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Updated</dt>
                          <dd className="font-medium text-slate-900">
                            {formatDate(job.updatedAt || job.createdAt) || "—"}
                          </dd>
                        </div>
                      </dl>
                      {job.notes ? (
                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                          {job.notes}
                        </p>
                      ) : (
                        <p className="mt-4 text-sm italic text-slate-400">No notes yet</p>
                      )}
                      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(job)}
                          className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(job._id)}
                          className="flex-1 rounded-lg bg-rose-600 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
