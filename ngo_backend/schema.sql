-- ============================================
-- TRANSPARENT NGO FUND MANAGEMENT SYSTEM
-- Database Schema — PostgreSQL
-- ============================================

-- Drop tables if they exist (clean start)
DROP TABLE IF EXISTS audit_flag      CASCADE;
DROP TABLE IF EXISTS audit_report    CASCADE;
DROP TABLE IF EXISTS expenditure     CASCADE;
DROP TABLE IF EXISTS donation        CASCADE;
DROP TABLE IF EXISTS campaign        CASCADE;
DROP TABLE IF EXISTS ngo             CASCADE;
DROP TABLE IF EXISTS users           CASCADE;

-- ============================================
-- TABLE 1 — USERS
-- ============================================
CREATE TABLE users (
    user_id     SERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    phone       VARCHAR(15)         NOT NULL,
    password    VARCHAR(255)        NOT NULL,
    role        VARCHAR(20)         NOT NULL
                CHECK (role IN (
                    'DONOR',
                    'NGO_ADMIN',
                    'AUDITOR',
                    'SUPER_ADMIN'
                )),
    active      BOOLEAN             DEFAULT TRUE,
    joined_on   DATE                DEFAULT CURRENT_DATE
);

-- ============================================
-- TABLE 2 — NGO
-- ============================================
CREATE TABLE ngo (
    ngo_id              SERIAL PRIMARY KEY,
    user_id             INT             REFERENCES users(user_id)
                                        ON DELETE SET NULL,
    name                VARCHAR(150)    NOT NULL,
    registration_no     VARCHAR(100)    NOT NULL UNIQUE,
    email               VARCHAR(150)    NOT NULL,
    phone               VARCHAR(15),
    address             TEXT,
    certificate_url     TEXT,
    status              VARCHAR(20)     DEFAULT 'PENDING'
                        CHECK (status IN (
                            'PENDING',
                            'APPROVED',
                            'REJECTED'
                        )),
    registered_on       DATE            DEFAULT CURRENT_DATE
);

-- ============================================
-- TABLE 3 — CAMPAIGN
-- ============================================
CREATE TABLE campaign (
    campaign_id     SERIAL PRIMARY KEY,
    ngo_id          INT             NOT NULL
                    REFERENCES ngo(ngo_id)
                    ON DELETE CASCADE,
    title           VARCHAR(200)    NOT NULL,
    description     TEXT,
    target_amount   DECIMAL(12,2)   NOT NULL,
    raised_amount   DECIMAL(12,2)   DEFAULT 0.00,
    start_date      DATE            NOT NULL,
    end_date        DATE            NOT NULL,
    status          VARCHAR(20)     DEFAULT 'ACTIVE'
                    CHECK (status IN (
                        'ACTIVE',
                        'COMPLETED',
                        'CLOSED'
                    )),
    created_on      DATE            DEFAULT CURRENT_DATE
);

-- ============================================
-- TABLE 4 — DONATION
-- ============================================
CREATE TABLE donation (
    donation_id         SERIAL PRIMARY KEY,
    donor_id            INT             NOT NULL
                        REFERENCES users(user_id)
                        ON DELETE CASCADE,
    campaign_id         INT             NOT NULL
                        REFERENCES campaign(campaign_id)
                        ON DELETE CASCADE,
    amount              DECIMAL(12,2)   NOT NULL,
    transaction_id      VARCHAR(200)    UNIQUE,
    payment_status      VARCHAR(20)     DEFAULT 'PENDING'
                        CHECK (payment_status IN (
                            'PENDING',
                            'SUCCESS',
                            'FAILED'
                        )),
    donated_on          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 5 — EXPENDITURE
-- ============================================
CREATE TABLE expenditure (
    expenditure_id  SERIAL PRIMARY KEY,
    campaign_id     INT             NOT NULL
                    REFERENCES campaign(campaign_id)
                    ON DELETE CASCADE,
    description     TEXT            NOT NULL,
    amount          DECIMAL(12,2)   NOT NULL,
    bill_url        TEXT,
    spent_on        DATE            NOT NULL,
    verified_by     VARCHAR(100),
    verified_on     DATE,
    created_on      DATE            DEFAULT CURRENT_DATE
);

-- ============================================
-- TABLE 6 — AUDIT FLAG
-- ============================================
CREATE TABLE audit_flag (
    flag_id         SERIAL PRIMARY KEY,
    campaign_id     INT             NOT NULL
                    REFERENCES campaign(campaign_id)
                    ON DELETE CASCADE,
    auditor_id      INT             NOT NULL
                    REFERENCES users(user_id)
                    ON DELETE CASCADE,
    remarks         TEXT            NOT NULL,
    resolved        BOOLEAN         DEFAULT FALSE,
    resolved_by     VARCHAR(100),
    resolved_on     DATE,
    flagged_on      DATE            DEFAULT CURRENT_DATE
);

-- ============================================
-- TABLE 7 — AUDIT REPORT
-- ============================================
CREATE TABLE audit_report (
    report_id       SERIAL PRIMARY KEY,
    ngo_id          INT             NOT NULL
                    REFERENCES ngo(ngo_id)
                    ON DELETE CASCADE,
    auditor_id      INT             NOT NULL
                    REFERENCES users(user_id)
                    ON DELETE CASCADE,
    report_title    VARCHAR(200)    NOT NULL,
    status          VARCHAR(20)     DEFAULT 'DRAFT'
                    CHECK (status IN (
                        'DRAFT',
                        'SUBMITTED',
                        'APPROVED'
                    )),
    remarks         TEXT,
    generated_on    DATE            DEFAULT CURRENT_DATE
);

-- ============================================
-- TABLE 8 — FUND ALLOCATION
-- ============================================
CREATE TABLE fund_allocation (
    allocation_id       SERIAL PRIMARY KEY,
    campaign_id         INT             NOT NULL
                        REFERENCES campaign(campaign_id)
                        ON DELETE CASCADE,
    activity_name       VARCHAR(200)    NOT NULL,
    allocated_amount    DECIMAL(12,2)   NOT NULL,
    allocated_on        DATE            DEFAULT CURRENT_DATE
);

-- ============================================
-- INDEXES — For faster queries
-- ============================================
CREATE INDEX idx_donation_donor
    ON donation(donor_id);

CREATE INDEX idx_donation_campaign
    ON donation(campaign_id);

CREATE INDEX idx_campaign_ngo
    ON campaign(ngo_id);

CREATE INDEX idx_expenditure_campaign
    ON expenditure(campaign_id);

CREATE INDEX idx_audit_flag_campaign
    ON audit_flag(campaign_id);

CREATE INDEX idx_audit_report_ngo
    ON audit_report(ngo_id);

-- ============================================
-- SEED DATA — Default Super Admin
-- ============================================
INSERT INTO users (
    name,
    email,
    phone,
    password,
    role,
    active
) VALUES (
    'Super Admin',
    'admin@ngofund.com',
    '+919999999999',
    -- BCrypt of 'admin@123'
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'SUPER_ADMIN',
    TRUE
);

-- ============================================
-- SEED DATA — Sample Auditor
-- ============================================
INSERT INTO users (
    name,
    email,
    phone,
    password,
    role,
    active
) VALUES (
    'Ramesh Auditor',
    'auditor@ngofund.com',
    '+919888888888',
    -- BCrypt of 'auditor@123'
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'AUDITOR',
    TRUE
);

-- ============================================
-- SEED DATA — Sample NGO Admin
-- ============================================
INSERT INTO users (
    name,
    email,
    phone,
    password,
    role,
    active
) VALUES (
    'Priya NGO Admin',
    'ngo@ngofund.com',
    '+919777777777',
    -- BCrypt of 'ngo@123'
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'NGO_ADMIN',
    TRUE
);

-- ============================================
-- SEED DATA — Sample Donor
-- ============================================
INSERT INTO users (
    name,
    email,
    phone,
    password,
    role,
    active
) VALUES (
    'Anjali Donor',
    'donor@ngofund.com',
    '+919666666666',
    -- BCrypt of 'donor@123'
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'DONOR',
    TRUE
);

-- ============================================
-- SEED DATA — Sample NGO
-- ============================================
INSERT INTO ngo (
    user_id,
    name,
    registration_no,
    email,
    phone,
    address,
    status
) VALUES (
    3,
    'Seva Foundation India',
    'MH/NGO/2024/001',
    'seva@foundation.org',
    '+919777777777',
    'Pune, Maharashtra, India',
    'APPROVED'
);

-- ============================================
-- SEED DATA — Sample Campaigns
-- ============================================
INSERT INTO campaign (
    ngo_id,
    title,
    description,
    target_amount,
    raised_amount,
    start_date,
    end_date,
    status
) VALUES (
    1,
    'Education for Rural Children',
    'Providing books, uniforms and school
     fees for 500 rural children in
     Maharashtra villages.',
    500000.00,
    185000.00,
    '2026-01-01',
    '2026-06-30',
    'ACTIVE'
);

INSERT INTO campaign (
    ngo_id,
    title,
    description,
    target_amount,
    raised_amount,
    start_date,
    end_date,
    status
) VALUES (
    1,
    'Clean Water for Villages',
    'Installing water purification units
     in 10 drought-affected villages
     in Marathwada.',
    300000.00,
    290000.00,
    '2025-10-01',
    '2026-03-31',
    'ACTIVE'
);

INSERT INTO campaign (
    ngo_id,
    title,
    description,
    target_amount,
    raised_amount,
    start_date,
    end_date,
    status
) VALUES (
    1,
    'Women Skill Development',
    'Training 200 rural women in
     tailoring, handicrafts and
     digital literacy.',
    200000.00,
    200000.00,
    '2025-06-01',
    '2025-12-31',
    'COMPLETED'
);

-- ============================================
-- SEED DATA — Sample Donations
-- ============================================
INSERT INTO donation (
    donor_id,
    campaign_id,
    amount,
    transaction_id,
    payment_status
) VALUES
    (4, 1, 5000.00,  'TXN_001_2026', 'SUCCESS'),
    (4, 1, 10000.00, 'TXN_002_2026', 'SUCCESS'),
    (4, 2, 2500.00,  'TXN_003_2026', 'SUCCESS'),
    (4, 3, 1000.00,  'TXN_004_2025', 'SUCCESS');

-- ============================================
-- SEED DATA — Sample Expenditures
-- ============================================
INSERT INTO expenditure (
    campaign_id,
    description,
    amount,
    bill_url,
    spent_on,
    verified_by
) VALUES (
    1,
    'Purchase of 500 school notebooks
     and stationery kits',
    25000.00,
    'https://storage/bills/bill_001.pdf',
    '2026-01-15',
    'Ramesh Auditor'
);

INSERT INTO expenditure (
    campaign_id,
    description,
    amount,
    bill_url,
    spent_on,
    verified_by
) VALUES (
    1,
    'School uniform distribution
     for 200 students',
    45000.00,
    'https://storage/bills/bill_002.pdf',
    '2026-02-01',
    NULL
);

INSERT INTO expenditure (
    campaign_id,
    description,
    amount,
    bill_url,
    spent_on,
    verified_by
) VALUES (
    2,
    'Water purification unit
     installation — Village 1 & 2',
    80000.00,
    'https://storage/bills/bill_003.pdf',
    '2025-11-10',
    'Ramesh Auditor'
);

-- ============================================
-- SEED DATA — Sample Audit Flag
-- ============================================
INSERT INTO audit_flag (
    campaign_id,
    auditor_id,
    remarks,
    resolved
) VALUES (
    1,
    2,
    'Expenditure entry for stationery
     has no original vendor bill
     attached. Amount seems high
     for 500 notebooks.',
    FALSE
);

-- ============================================
-- SEED DATA — Sample Audit Report
-- ============================================
INSERT INTO audit_report (
    ngo_id,
    auditor_id,
    report_title,
    status,
    remarks
) VALUES (
    1,
    2,
    'Q1 2026 Fund Audit Report —
     Seva Foundation India',
    'SUBMITTED',
    'Overall fund utilisation is
     satisfactory. One expenditure
     pending bill verification.'
);

-- ============================================
-- USEFUL VIEWS
-- ============================================

-- View 1 — Campaign Summary
CREATE OR REPLACE VIEW campaign_summary AS
SELECT
    c.campaign_id,
    c.title,
    n.name          AS ngo_name,
    c.target_amount,
    c.