-- Adiciona o nível de dificuldade padrão para a turma
ALTER TABLE classrooms 
ADD COLUMN IF NOT EXISTS difficulty_level TEXT 
CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) 
DEFAULT 'beginner';

COMMENT ON COLUMN classrooms.difficulty_level IS 'Nível padrão de dificuldade para atividades desta turma';
