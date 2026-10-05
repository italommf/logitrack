-- Script adicional (não faz parte da carga inicial fornecida).
--
-- Motivo: os dados da carga inicial são de 2024. As métricas
-- "Cronograma de Manutenção" (próximas manutenções) e "Projeção Financeira"
-- (mês atual) dependem da data de hoje, então ficariam sempre vazias.
-- Aqui as datas são calculadas a partir de CURRENT_DATE, para o dashboard
-- sempre ter dados para mostrar, seja qual for o dia em que o projeto rodar.

-- Índices nas colunas usadas em JOIN, WHERE e ORDER BY das consultas do dashboard.
CREATE INDEX idx_viagens_veiculo_id ON viagens (veiculo_id);
CREATE INDEX idx_manutencoes_data_inicio ON manutencoes (data_inicio);

-- Viagens para os veículos 3 e 4, que não tinham nenhuma.
INSERT INTO viagens (veiculo_id, data_saida, data_chegada, origem, destino, km_percorrida) VALUES
(3, '2024-05-10 07:00:00', '2024-05-10 15:00:00', 'Natal', 'Recife', 290.00),
(4, '2024-05-12 06:00:00', '2024-05-13 10:00:00', 'Salvador', 'Fortaleza', 1200.00),
(4, '2024-05-20 04:00:00', '2024-05-21 08:00:00', 'Fortaleza', 'Natal', 520.00);

-- Manutenções com datas relativas ao dia de hoje.
INSERT INTO manutencoes (veiculo_id, data_inicio, data_finalizacao, tipo_servico, custo_estimado, status) VALUES
(1, CURRENT_DATE + 2,  CURRENT_DATE + 3,  'Troca de Óleo',     400.00,  'PENDENTE'),
(2, CURRENT_DATE + 5,  CURRENT_DATE + 7,  'Motor',             8500.00, 'PENDENTE'),
(3, CURRENT_DATE + 10, CURRENT_DATE + 10, 'Troca de Pneus',    2400.00, 'PENDENTE'),
(4, CURRENT_DATE + 15, CURRENT_DATE + 16, 'Revisão de Freios', 1800.00, 'PENDENTE'),
(1, CURRENT_DATE + 20, CURRENT_DATE + 21, 'Alinhamento',       250.00,  'PENDENTE'),
(2, CURRENT_DATE + 40, CURRENT_DATE + 42, 'Troca de Óleo',     600.00,  'PENDENTE'),
(3, CURRENT_DATE,      CURRENT_DATE + 1,  'Motor',             3200.00, 'EM_REALIZACAO');
