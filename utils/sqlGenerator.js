// src/utils/sqlGenerator.js

export const generateSupabaseSQL = (tables) => {
    let sql = `-- ==========================================\n`;
    sql += `-- AppForge Auto-Generated Schema Migration\n`;
    sql += `-- ==========================================\n\n`;

    tables.forEach(table => {
        const safeTableName = table.name.toLowerCase().replace(/[^a-z0-9_]/g, '');
        if (!safeTableName) return;

        sql += `CREATE TABLE IF NOT EXISTS public.${safeTableName} (\n`;
        
        // Every table needs a primary key and timestamp
        sql += `  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n`;
        sql += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;

        // Map custom columns
        if (table.columns && table.columns.length > 0) {
            sql += `,\n`;
            const colStrings = table.columns.map(col => {
                const safeCol = col.name.toLowerCase().replace(/[^a-z0-9_]/g, '');
                let dbType = 'TEXT';
                if (col.type === 'numeric') dbType = 'NUMERIC';
                if (col.type === 'boolean') dbType = 'BOOLEAN';
                if (col.type === 'timestamp') dbType = 'TIMESTAMP WITH TIME ZONE';
                if (col.type === 'uuid') dbType = 'UUID';
                
                return `  ${safeCol} ${dbType}`;
            });
            sql += colStrings.join(',\n');
        }
        sql += `\n);\n\n`;

        // Apply Row Level Security (RLS) if enabled
        if (table.rlsEnabled) {
            sql += `ALTER TABLE public.${safeTableName} ENABLE ROW LEVEL SECURITY;\n\n`;
            
            // Standard AppForge Default Policies
            sql += `-- Default RLS Policies for ${safeTableName}\n`;
            sql += `CREATE POLICY "Allow public read access" ON public.${safeTableName} FOR SELECT USING (true);\n`;
            
            if (table.rlsAuthOnly) {
                sql += `CREATE POLICY "Allow authenticated insert" ON public.${safeTableName} FOR INSERT TO authenticated WITH CHECK (true);\n`;
            } else {
                sql += `CREATE POLICY "Allow public insert" ON public.${safeTableName} FOR INSERT WITH CHECK (true);\n`;
            }
        } else {
            sql += `ALTER TABLE public.${safeTableName} DISABLE ROW LEVEL SECURITY;\n`;
        }
        
        sql += `\n--------------------------------------------\n\n`;
    });

    return sql;
};