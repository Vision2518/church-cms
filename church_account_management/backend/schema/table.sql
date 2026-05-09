CREATE TABLE church_offering (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    offering_type ENUM('weekly', 'children', 'special') NOT NULL,
    
    -- Date Columns
    ad_date DATE NOT NULL,          -- Gregorian date for logic
    bs_year SMALLINT NOT NULL,      -- e.g., 2081
    bs_month TINYINT NOT NULL,      -- e.g., 2
    bs_day TINYINT NOT NULL,        -- e.g., 15
    nepali_date VARCHAR(10) NOT NULL, -- e.g., '2081-02-15'
    
    -- Description and Audit
    remark VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- High-Performance Indexes
    INDEX idx_nepali_month (bs_year, bs_month),
    INDEX idx_ad_date (ad_date),
    INDEX idx_type (offering_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;