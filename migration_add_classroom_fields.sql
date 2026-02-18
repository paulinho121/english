-- Migration: Add Fields to Classrooms
-- Adiciona campos de Sala, Turno e Escola para o cadastro de turmas.

ALTER TABLE classrooms 
ADD COLUMN IF NOT EXISTS room TEXT,
ADD COLUMN IF NOT EXISTS shift TEXT CHECK (shift IN ('morning', 'afternoon', 'night', 'full_time')),
ADD COLUMN IF NOT EXISTS school_name TEXT; -- Opcional, caso a organização não seja suficiente

-- Comentario para documentacao
COMMENT ON COLUMN classrooms.room IS 'Numero ou nome da sala de aula';
COMMENT ON COLUMN classrooms.shift IS 'Turno da turma (morning, afternoon, night, full_time)';
