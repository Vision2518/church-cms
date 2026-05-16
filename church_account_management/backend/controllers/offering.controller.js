import db from "../config/db.connect.js";

// @desc    Add a new church offering record
// @route   POST /api/offerings
// @access  Public (or Protected later)
export const addOffering = async (req, res) => {
  try {
    const {
      amount,
      offering_type,
      ad_date,
      bs_year,
      bs_month,
      bs_day,
      nepali_date,
      remark,
    } = req.body;

    // Required fields validation (allow 0 checks for numeric-like strings)
    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !offering_type ||
      !ad_date ||
      bs_year === undefined ||
      bs_year === null ||
      bs_year === "" ||
      bs_month === undefined ||
      bs_month === null ||
      bs_month === "" ||
      bs_day === undefined ||
      bs_day === null ||
      bs_day === "" ||
      !nepali_date
    ) {
      return res.status(400).json({
        status: "Fail",
        message:
          "Missing required fields: amount, offering_type, ad_date, bs_year, bs_month, bs_day, nepali_date.",
      });
    }

    // Validate enum (server-side safety)
    if (!ALLOWED_TYPES.has(String(offering_type))) {
      return res.status(400).json({
        status: "Fail",
        message:
          "Invalid offering_type. Allowed values: weekly, children, special.",
      });
    }

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid amount. Must be a number greater than 0.",
      });
    }

    const adDateStr = String(ad_date);
    // Light validation: YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(adDateStr)) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid ad_date format. Expected YYYY-MM-DD.",
      });
    }

    const bsYearNum = toInt(bs_year);
    const bsMonthNum = toInt(bs_month);
    const bsDayNum = toInt(bs_day);

    if (bsYearNum === null || bsMonthNum === null || bsDayNum === null) {
      return res.status(400).json({
        status: "Fail",
        message:
          "Invalid Nepali date parts (bs_year, bs_month, bs_day). Must be numeric.",
      });
    }

    // Reasonable bounds for Nepali calendar parts
    if (bsMonthNum < 1 || bsMonthNum > 12 || bsDayNum < 1 || bsDayNum > 31) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid bs_month/bs_day bounds.",
      });
    }

    const nepaliDateStr = String(nepali_date).trim();
    if (!nepaliDateStr) {
      return res.status(400).json({
        status: "Fail",
        message: "nepali_date is required.",
      });
    }

    const query = `
      INSERT INTO church_offering
      (amount, offering_type, ad_date, bs_year, bs_month, bs_day, nepali_date, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      amountNum,
      String(offering_type),
      adDateStr,
      bsYearNum,
      bsMonthNum,
      bsDayNum,
      nepaliDateStr,
      remark ? String(remark) : null,
    ];

    // Execute the query using our pool
    const [result] = await db.execute(query, values);

    const [rows] = await db.execute(
      `
      SELECT
        id, amount, offering_type, ad_date, bs_year, bs_month, bs_day, nepali_date, remark
      FROM church_offering
      WHERE id = ?
      `,
      [result.insertId],
    );

    const created = Array.isArray(rows) ? rows[0] : null;

    res.status(201).json({
      status: "Success",
      message: "Church offering recorded successfully!",
      data: created || {
        id: result.insertId,
        amount: amountNum,
        offering_type: String(offering_type),
        ad_date: adDateStr,
        nepali_date: nepaliDateStr,
        remark: remark ? String(remark) : null,
      },
    });
  } catch (error) {
    console.error("❌ SQL Insert Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error while inserting record.",
      error: error.message,
    });
  }
};

const ALLOWED_TYPES = new Set(["weekly", "children", "special"]);

const ALLOWED_SORT_BY = new Set([
  "id",
  "amount",
  "offering_type",
  "ad_date",
  "bs_year",
  "bs_month",
]);
const DEFAULT_SORT_BY = "ad_date";
const DEFAULT_SORT_ORDER = "DESC";

function toInt(value) {
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

export const getOfferings = async (req, res) => {
  try {
    const { page, limit, search, type, bs_year, bs_month, sortBy, sortOrder } =
      req.query;

    const currentPage = Math.max(1, toInt(page) || 1);
    const pageSize = Math.max(1, Math.min(100, toInt(limit) || 10));
    const offset = (currentPage - 1) * pageSize;

    const normalizedType = type ? String(type) : null;
    if (normalizedType && !ALLOWED_TYPES.has(normalizedType)) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid type. Allowed values: weekly, children, special.",
      });
    }

    const yearInt =
      bs_year !== undefined && bs_year !== null && bs_year !== ""
        ? toInt(bs_year)
        : null;
    const monthInt =
      bs_month !== undefined && bs_month !== null && bs_month !== ""
        ? toInt(bs_month)
        : null;

    const normalizedSortBy = sortBy ? String(sortBy) : DEFAULT_SORT_BY;
    const sortColumn = ALLOWED_SORT_BY.has(normalizedSortBy)
      ? normalizedSortBy
      : DEFAULT_SORT_BY;

    const normalizedSortOrder = sortOrder
      ? String(sortOrder).toUpperCase()
      : DEFAULT_SORT_ORDER;
    const sortDir = normalizedSortOrder === "ASC" ? "ASC" : "DESC";

    const whereParts = [];
    const params = [];

    if (normalizedType) {
      whereParts.push("offering_type = ?");
      params.push(normalizedType);
    }

    if (yearInt !== null) {
      whereParts.push("bs_year = ?");
      params.push(yearInt);
    }

    if (monthInt !== null) {
      whereParts.push("bs_month = ?");
      params.push(monthInt);
    }

    if (search && String(search).trim() !== "") {
      // Filters by remark or custom string: we match remark + nepali_date + ad_date (string)
      // while keeping primary intent as remark.
      const q = `%${String(search).trim()}%`;
      whereParts.push(
        "(remark LIKE ? OR nepali_date LIKE ? OR ad_date LIKE ?)",
      );
      params.push(q, q, q);
    }

    const whereSQL = whereParts.length
      ? `WHERE ${whereParts.join(" AND ")}`
      : "";

    // Records query
    const recordsSQL = `
      SELECT
        id,
        amount,
        offering_type,
        ad_date,
        bs_year,
        bs_month,
        bs_day,
        nepali_date,
        remark
      FROM church_offering
      ${whereSQL}
      ORDER BY ${sortColumn} ${sortDir}
      LIMIT ? OFFSET ?
    `;
    const recordsParams = [...params, pageSize, offset];

    // Count query
    const countSQL = `
      SELECT COUNT(*) AS totalRows
      FROM church_offering
      ${whereSQL}
    `;

    const [records] = await db.execute(recordsSQL, recordsParams);
    const [countRows] = await db.execute(countSQL, params);

    const totalRows = Number(countRows?.[0]?.totalRows || 0);
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

    res.status(200).json({
      meta: {
        totalRows,
        totalPages,
        currentPage,
        limit: pageSize,
        sortBy: sortColumn,
        sortOrder: sortDir,
        appliedFilters: {
          search: search ? String(search) : null,
          type: normalizedType,
          bs_year: yearInt,
          bs_month: monthInt,
        },
      },
      records,
    });
  } catch (error) {
    console.error("❌ SQL Select Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error while fetching offerings.",
      error: error.message,
    });
  }
};
