-- MySQL migration (production guidance)
-- Adds embedding + compatibility fields and helpful indexes for auto-parts search.

-- 1) Add compatibility JSON and embedding JSON (vector storage)
ALTER TABLE products
  ADD COLUMN compatibility JSON NULL,
  ADD COLUMN embedding_json JSON NULL,
  ADD COLUMN ai_search_text TEXT NULL;

-- 2) Add indexes to speed up filtering
CREATE INDEX idx_products_brand ON products (brand);
CREATE INDEX idx_products_year ON products (year);
CREATE INDEX idx_products_section_main ON products (section_main);
CREATE INDEX idx_products_section_sub ON products (section_sub);
CREATE INDEX idx_products_part_number ON products (part_number);

-- 3) Optional: full-text index for keyword fallback (requires appropriate collation)
-- CREATE FULLTEXT INDEX ft_products_ar ON products (name_ar, description, part_number);

