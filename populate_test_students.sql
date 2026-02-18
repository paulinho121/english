-- Matricular o usuário logado para teste
DO $$
DECLARE
    v_classroom_id UUID;
    v_user_id UUID; -- Precisa ser o ID do usuário atual. Como SQL direto não sabe auth.uid() fora de contexto, eu vou pegar o primeiro professor que encontrar para vincular na primeira turma que encontrar.
    -- OU melhor: Vou vincular TODOS os usuários existentes na ÚLTIMA turma criada (3 ano B). Assim o usuário logado com certeza entra.
BEGIN
    -- Pegar ID da ultima turma criada
    SELECT id INTO v_classroom_id FROM classrooms ORDER BY created_at DESC LIMIT 1;
    
    -- Inserir matricula para todos os usuarios (simples para dev) na turma encontrada
    -- Ignora duplicatas
    INSERT INTO classroom_members (classroom_id, student_id)
    SELECT v_classroom_id, id FROM profiles
    ON CONFLICT (classroom_id, student_id) DO NOTHING;
    
END $$;
