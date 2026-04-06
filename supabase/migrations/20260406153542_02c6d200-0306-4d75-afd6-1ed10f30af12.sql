UPDATE module_pages
SET content = jsonb_set(
  content,
  '{url}',
  to_jsonb(
    '/templates/' || 
    regexp_replace(
      regexp_replace(content->>'url', '^/assets/', ''),
      '-[A-Za-z0-9_-]{8}\.',
      '.'
    )
  )
)
WHERE type = 'image' 
  AND content->>'url' LIKE '/assets/%';