UPDATE blog 
SET content = REPLACE(content, ' ##' || E'\n', E'\n'),
    updated_at = now()
WHERE id = '014f3493-7278-4430-97dd-d2e5d6a83a50';