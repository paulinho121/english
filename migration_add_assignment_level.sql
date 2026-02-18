-- Migration: Add Difficulty Level to Assignments
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner';

COMMENT ON COLUMN assignments.difficulty_level IS 'Nivel de dificuldade: beginner (80% PT), intermediate (50% PT), advanced (100% EN)';
