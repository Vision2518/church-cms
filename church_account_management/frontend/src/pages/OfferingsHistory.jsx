import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  DollarSign,
  ListFilter,
  Search,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000/api/offerings";

function formatNumber(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString();
}

function clampIntStringToDigits(value) {
  return String(value ?? "").replace(/[^\d]/g, "");
}

export default function OfferingsHistory() {
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({
    totalRows: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [offeringType, setOfferingType] = useState("");
  const [bsYear, setBsYear] = useState("");
  const [bsMonth, setBsMonth] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [sortBy, setSortBy] = useState("ad_date");
  const [sortOrder, setSortOrder] = useState("DESC");

  // Add Offering Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitBusy, setSubmitBusy] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    offering_type: "weekly",
    ad_date: "",
    bs_year: "",
    bs_month: "",
    bs_day: "",
    nepali_date: "",
    remark: "",
  });

  const offeringTypeOptions = ["weekly", "children", "special"];

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search.trim()) params.set("search", search.trim());
    if (offeringType) params.set("type", offeringType);
    if (bsYear.trim()) params.set("bs_year", bsYear.trim());
    if (bsMonth.trim()) params.set("bs_month", bsMonth.trim());

    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    return params.toString();
  }, [page, limit, search, offeringType, bsYear, bsMonth, sortBy, sortOrder]);

  const fetchOfferings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}?${queryString}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed (${res.status}). ${text}`);
      }

      const json = await res.json();
      setRecords(Array.isArray(json.records) ? json.records : []);
      setMeta(
        json.meta || {
          totalRows: 0,
          totalPages: 1,
          currentPage: page,
          limit,
        },
      );
    } catch (e) {
      setError(e?.message || "Failed to fetch offerings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // reset to page 1 when filters/search change
    setPage(1);
  }, [search, offeringType, bsYear, bsMonth]);

  useEffect(() => {
    fetchOfferings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const kpis = useMemo(() => {
    const totalAmountFiltered = records.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );
    const totalWeeklyCollections = records
      .filter((r) => r.offering_type === "weekly")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const totalSpecialCollections = records
      .filter((r) => r.offering_type === "special")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    return {
      totalAmountFiltered,
      totalWeeklyCollections,
      totalSpecialCollections,
    };
  }, [records]);

  const showingRange = useMemo(() => {
    const total = Number(meta.totalRows || 0);
    const current = Number(meta.currentPage || 1);
    const size = Number(meta.limit || limit);

    const start = total === 0 ? 0 : (current - 1) * size + 1;
    const end = total === 0 ? 0 : Math.min(total, current * size);

    return { start, end, total };
  }, [meta, limit]);

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
  };

  const openModal = () => {
    setSubmitBusy(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsModalOpen(true);

    setForm((prev) => {
      const next = { ...prev };
      // sensible defaults
      next.offering_type = next.offering_type || "weekly";
      return next;
    });
  };

  const closeModal = () => {
    if (submitBusy) return;
    setIsModalOpen(false);
  };

  // Auto-build nepali_date from bs parts if user hasn’t typed a custom nepali_date
  useEffect(() => {
    if (!form.bs_year.trim() || !form.bs_month.trim() || !form.bs_day.trim()) return;

    const autoNepali = `${form.bs_year.trim()}-${String(form.bs_month).padStart(2, "0")}-${String(form.bs_day).padStart(2, "0")}`;

    // Keep it in sync if nepali_date is blank or matches previous auto composition loosely.
    setForm((prev) => {
      const current = String(prev.nepali_date || "").trim();
      if (!current || current === autoNepali) {
        return { ...prev, nepali_date: autoNepali };
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.bs_year, form.bs_month, form.bs_day]);

  const submitOffering = async () => {
    setSubmitBusy(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const payload = {
        amount: form.amount,
        offering_type: form.offering_type,
        ad_date: form.ad_date,
        bs_year: form.bs_year,
        bs_month: form.bs_month,
        bs_day: form.bs_day,
        nepali_date: form.nepali_date,
        remark: form.remark ? form.remark : null,
      };

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let msg = `Request failed (${res.status}).`;
        try {
          const json = JSON.parse(text);
          msg = json?.message || json?.error || msg;
        } catch {
          msg = `${msg} ${text || ""}`.trim();
        }
        throw new Error(msg);
      }

      setSubmitSuccess(true);

      // refresh list (keep current paging; user can see the new row once it falls into filter)
      await fetchOfferings();

      // close after a short success moment
      setTimeout(() => {
        closeModal();
      }, 450);
    } catch (e) {
      setSubmitError(e?.message || "Failed to add offering.");
    } finally {
      setSubmitBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
              <ListFilter size={16} aria-hidden="true" />
              Offerings History & Analytics
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              Offerings
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Search by remark/custom text, filter by offering type, and sort by
              Amount or AD Date.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <Plus size={18} aria-hidden="true" />
              Add Offering
            </button>

            <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              <DollarSign size={18} aria-hidden="true" />
              Live analytics
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Amount (Filtered)
              </p>
              <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Calendar size={18} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {formatNumber(kpis.totalAmountFiltered)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Weekly Collections
              </p>
              <span className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                <ArrowDown
                  size={18}
                  aria-hidden="true"
                  className="rotate-[-45deg]"
                />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {formatNumber(kpis.totalWeeklyCollections)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Special Collections
              </p>
              <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <ArrowUp
                  size={18}
                  aria-hidden="true"
                  className="rotate-[45deg]"
                />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {formatNumber(kpis.totalSpecialCollections)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex w-full flex-col gap-2 md:max-w-xl">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. thanksgiving, offering, remark..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 md:max-w-xl md:grid-cols-4">
            <div className="sm:col-span-1 md:col-span-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Offering Type
              </label>
              <select
                value={offeringType}
                onChange={(e) => setOfferingType(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="">All</option>
                <option value="weekly">weekly</option>
                <option value="children">children</option>
                <option value="special">special</option>
              </select>
            </div>

            <div className="sm:col-span-1 md:col-span-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                BS Year
              </label>
              <input
                value={bsYear}
                onChange={(e) => setBsYear(clampIntStringToDigits(e.target.value))}
                placeholder="e.g. 2081"
                inputMode="numeric"
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="sm:col-span-1 md:col-span-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                BS Month
              </label>
              <input
                value={bsMonth}
                onChange={(e) => setBsMonth(clampIntStringToDigits(e.target.value))}
                placeholder="e.g. 2"
                inputMode="numeric"
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <button
                type="button"
                onClick={() => fetchOfferings()}
                className="mt-5 h-10 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Loading offerings...
          </div>
        ) : null}

        {!loading && !error && records.length === 0 ? (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            No offerings found.
          </div>
        ) : null}
      </section>

      {/* Modal */}
      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  Add Church Offering
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Enter details and submit to record a new offering.
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Close modal"
                disabled={submitBusy}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Amount
                  </label>
                  <input
                    value={form.amount}
                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                    inputMode="decimal"
                    placeholder="e.g. 500.00"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Offering Type
                  </label>
                  <select
                    value={form.offering_type}
                    onChange={(e) => setForm((p) => ({ ...p, offering_type: e.target.value }))}
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    {offeringTypeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    AD Date (Gregorian)
                  </label>
                  <input
                    type="date"
                    value={form.ad_date}
                    onChange={(e) => setForm((p) => ({ ...p, ad_date: e.target.value }))}
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Nepali Date (YYYY-MM-DD)
                  </label>
                  <input
                    value={form.nepali_date}
                    onChange={(e) => setForm((p) => ({ ...p, nepali_date: e.target.value }))}
                    placeholder="e.g. 2081-02-15"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    BS Year
                  </label>
                  <input
                    value={form.bs_year}
                    onChange={(e) => setForm((p) => ({ ...p, bs_year: clampIntStringToDigits(e.target.value) }))}
                    inputMode="numeric"
                    placeholder="2081"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    BS Month
                  </label>
                  <input
                    value={form.bs_month}
                    onChange={(e) => setForm((p) => ({ ...p, bs_month: clampIntStringToDigits(e.target.value) }))}
                    inputMode="numeric"
                    placeholder="2"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    BS Day
                  </label>
                  <input
                    value={form.bs_day}
                    onChange={(e) => setForm((p) => ({ ...p, bs_day: clampIntStringToDigits(e.target.value) }))}
                    inputMode="numeric"
                    placeholder="15"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Remarks
                  </label>
                  <input
                    value={form.remark}
                    onChange={(e) => setForm((p) => ({ ...p, remark: e.target.value }))}
                    placeholder="e.g. special thanksgiving offering"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {submitError ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} aria-hidden="true" className="mt-0.5" />
                    <div>{submitError}</div>
                  </div>
                </div>
              ) : null}

              {submitSuccess ? (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={18} aria-hidden="true" className="mt-0.5" />
                    <div>Offering saved successfully.</div>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitBusy}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitOffering}
                  disabled={submitBusy}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  {submitBusy ? "Saving..." : "Save Offering"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Offerings data
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <th className="px-4 py-3">ID</th>

                <th className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("amount")}
                    className="inline-flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Amount
                    {sortBy === "amount" ? (
                      sortOrder === "ASC" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )
                    ) : null}
                  </button>
                </th>

                <th className="px-4 py-3">Type</th>

                <th className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("ad_date")}
                    className="inline-flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200"
                  >
                    AD Date
                    {sortBy === "ad_date" ? (
                      sortOrder === "ASC" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )
                    ) : null}
                  </button>
                </th>

                <th className="px-4 py-3">Nepali Date</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {records.map((r) => (
                <tr
                  key={r.id}
                  className="text-sm text-slate-800 dark:text-slate-100"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{r.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold">
                    {formatNumber(r.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {r.offering_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.ad_date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.nepali_date}
                  </td>
                  <td className="px-4 py-3">{r.remark || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Showing <span className="font-semibold">{showingRange.start}</span>{" "}
            to <span className="font-semibold">{showingRange.end}</span> of{" "}
            <span className="font-semibold">{showingRange.total}</span> entries
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={meta.currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
