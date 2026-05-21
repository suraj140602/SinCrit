// src/utils/sqlGenerator.js

export const generateSupabaseSQL = (tables) => {
    let sql = `-- ==========================================\n`;
    sql += `-- AppForge Auto-Generated Schema Migration\n`;
    sql += `-- ==========================================\n\n`;

    const sanitizeIdent = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    const reservedColumns = new Set(['id', 'created_at']);

    tables.forEach(table => {
        const safeTableName = sanitizeIdent(table.name);
        if (!safeTableName) return;

        sql += `CREATE TABLE IF NOT EXISTS public.${safeTableName} (\n`;
        
        // Every table needs a primary key and timestamp
        sql += `  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n`;
        sql += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;

        const extraDefinitions = [];

        // Map custom columns
        if (table.columns && table.columns.length > 0) {
            table.columns
                .filter(col => !reservedColumns.has(sanitizeIdent(col.name)))
                .forEach(col => {
                    const safeCol = sanitizeIdent(col.name);
                    if (!safeCol) return;
                    let dbType = 'TEXT';
                    if (col.type === 'numeric') dbType = 'NUMERIC';
                    if (col.type === 'boolean') dbType = 'BOOLEAN';
                    if (col.type === 'timestamp') dbType = 'TIMESTAMP WITH TIME ZONE';
                    if (col.type === 'uuid') dbType = 'UUID';

                    extraDefinitions.push(`  ${safeCol} ${dbType}`);
                });
        }

        (table.relationships || []).forEach(rel => {
            const column = sanitizeIdent(rel.column);
            const refTable = sanitizeIdent(rel.referencesTable);
            const refColumn = sanitizeIdent(rel.referencesColumn || 'id');
            if (!column || !refTable || !refColumn) return;
            const onDelete = String(rel.onDelete || 'cascade').toUpperCase() === 'SET NULL' ? 'SET NULL' : 'CASCADE';
            extraDefinitions.push(`  CONSTRAINT ${safeTableName}_${column}_fkey FOREIGN KEY (${column}) REFERENCES public.${refTable}(${refColumn}) ON DELETE ${onDelete}`);
        });

        if (extraDefinitions.length > 0) sql += `,\n${extraDefinitions.join(',\n')}`;
        sql += `\n);\n\n`;

        // Apply Row Level Security (RLS) if enabled
        if (table.rlsEnabled) {
            sql += `ALTER TABLE public.${safeTableName} ENABLE ROW LEVEL SECURITY;\n\n`;
            
            // Standard AppForge Default Policies
            sql += `-- Default RLS Policies for ${safeTableName}\n`;
            sql += `DROP POLICY IF EXISTS "Allow public read access" ON public.${safeTableName};\n`;
            sql += `DROP POLICY IF EXISTS "Allow authenticated insert" ON public.${safeTableName};\n`;
            sql += `DROP POLICY IF EXISTS "Allow public insert" ON public.${safeTableName};\n`;
            sql += `CREATE POLICY "Allow public read access" ON public.${safeTableName} FOR SELECT USING (true);\n`;
            
            if (table.rlsAuthOnly) {
                sql += `CREATE POLICY "Allow authenticated insert" ON public.${safeTableName} FOR INSERT TO authenticated WITH CHECK (true);\n`;
            } else {
                sql += `CREATE POLICY "Allow public insert" ON public.${safeTableName} FOR INSERT WITH CHECK (true);\n`;
            }
        } else {
            sql += `ALTER TABLE public.${safeTableName} DISABLE ROW LEVEL SECURITY;\n`;
        }

        (table.indexes || []).forEach((index, idx) => {
            const columns = (index.columns || []).map(sanitizeIdent).filter(Boolean);
            if (columns.length === 0) return;
            const indexName = sanitizeIdent(index.name) || `${safeTableName}_${columns.join('_')}_idx_${idx + 1}`;
            sql += `CREATE ${index.unique ? 'UNIQUE ' : ''}INDEX IF NOT EXISTS ${indexName} ON public.${safeTableName} (${columns.join(', ')});\n`;
        });

        const relationshipIndexes = (table.relationships || [])
            .map(rel => sanitizeIdent(rel.column))
            .filter(Boolean);
        relationshipIndexes.forEach(column => {
            sql += `CREATE INDEX IF NOT EXISTS ${safeTableName}_${column}_fk_idx ON public.${safeTableName} (${column});\n`;
        });
        
        sql += `\n--------------------------------------------\n\n`;
    });

    return sql.trim() === `-- ==========================================\n-- AppForge Auto-Generated Schema Migration\n-- ==========================================` ? '-- No tables defined' : sql;
};
