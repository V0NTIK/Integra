-- Integra Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER TOKENS TABLE
-- Stores Canvas API tokens securely
-- ============================================
CREATE TABLE user_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    canvas_token TEXT NOT NULL,
    canvas_user_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own tokens
CREATE POLICY "Users can only access their own tokens"
ON user_tokens
FOR ALL
USING (auth.uid() = user_id);

-- ============================================
-- USER COURSES TABLE
-- Caches Canvas course data
-- ============================================
CREATE TABLE user_courses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL,
    course_name TEXT,
    course_code TEXT,
    teacher_id INTEGER,
    teacher_name TEXT,
    enrollment_term_id INTEGER,
    last_synced TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own courses"
ON user_courses
FOR ALL
USING (auth.uid() = user_id);

-- ============================================
-- ASSIGNMENT GROUPS TABLE
-- Categories like Communication, Application, etc.
-- ============================================
CREATE TABLE assignment_groups (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    name VARCHAR(100),
    group_weight DECIMAL(5,2),
    position INTEGER,
    UNIQUE(user_id, course_id, group_id)
);

ALTER TABLE assignment_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own assignment groups"
ON assignment_groups
FOR ALL
USING (auth.uid() = user_id);

-- ============================================
-- ASSIGNMENTS TABLE
-- Individual assignments from Canvas
-- ============================================
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL,
    assignment_id INTEGER NOT NULL,
    name TEXT,
    description TEXT,
    due_at TIMESTAMP,
    points_possible DECIMAL(10,2),
    assignment_group_id INTEGER,
    submission_types TEXT[],
    has_submitted_submissions BOOLEAN DEFAULT FALSE,
    grading_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id, assignment_id)
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own assignments"
ON assignments
FOR ALL
USING (auth.uid() = user_id);

-- ============================================
-- ASSIGNMENT SUBMISSIONS TABLE
-- Stores grades and submission status
-- ============================================
CREATE TABLE assignment_submissions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id INTEGER NOT NULL,
    score DECIMAL(10,2),
    grade VARCHAR(10),
    submitted_at TIMESTAMP,
    graded_at TIMESTAMP,
    late BOOLEAN DEFAULT FALSE,
    missing BOOLEAN DEFAULT FALSE,
    excused BOOLEAN DEFAULT FALSE,
    workflow_state VARCHAR(50),
    UNIQUE(user_id, assignment_id)
);

ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own submissions"
ON assignment_submissions
FOR ALL
USING (auth.uid() = user_id);

-- ============================================
-- GRADING PERIODS TABLE
-- Q1, Q2, Q3, Q4, S1 EOS, S2 EOS
-- ============================================
CREATE TABLE grading_periods (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    period_id INTEGER NOT NULL,
    course_id INTEGER,
    title VARCHAR(100),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    close_date TIMESTAMP,
    weight DECIMAL(5,2),
    UNIQUE(user_id, period_id, course_id)
);

ALTER TABLE grading_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own grading periods"
ON grading_periods
FOR ALL
USING (auth.uid() = user_id);

-- ============================================
-- GRADING PERIOD SNAPSHOTS TABLE
-- For cross-student prediction algorithm
-- ============================================
CREATE TABLE grading_period_snapshots (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id INTEGER,
    grading_period_id INTEGER,
    category_name VARCHAR(100),
    period_type VARCHAR(20), -- 'quarter', 'eos', 'semester'
    final_category_points DECIMAL(10,2),
    final_category_earned DECIMAL(10,2),
    final_category_percentage DECIMAL(5,2),
    snapshot_date TIMESTAMP DEFAULT NOW(),
    is_final BOOLEAN DEFAULT FALSE -- TRUE when grading period ends
);

ALTER TABLE grading_period_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can insert their own snapshots
CREATE POLICY "Users can insert their own snapshots"
ON grading_period_snapshots
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- All users can read finalized snapshots (for global predictions)
CREATE POLICY "All users can read finalized snapshots for predictions"
ON grading_period_snapshots
FOR SELECT
USING (is_final = TRUE);

-- Index for fast prediction queries
CREATE INDEX idx_category_predictions 
ON grading_period_snapshots(category_name, period_type, is_final)
WHERE is_final = TRUE;

-- ============================================
-- USER PREFERENCES TABLE
-- Stores user-specific settings
-- ============================================
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    average_grade_decimal DECIMAL(3,2) DEFAULT 0.87,
    default_study_hours DECIMAL(4,2) DEFAULT 2.0,
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own preferences"
ON user_preferences
FOR ALL
USING (auth.uid() = user_id);
