-- Inisialisasi tabel admin
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Trigger untuk updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON admins;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON admins
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Tabel Articles
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  excerpt TEXT,
  image TEXT,
  author TEXT,
  content TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_timestamp_articles ON articles;
CREATE TRIGGER set_timestamp_articles
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Tabel Fish
CREATE TABLE IF NOT EXISTS fish (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  variety TEXT,
  description TEXT,
  type_text TEXT,
  size_cm TEXT,
  color TEXT,
  gender TEXT,
  condition TEXT,
  age TEXT,
  origin TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  advantages JSONB NOT NULL DEFAULT '[]'::jsonb,
  care_guide JSONB NOT NULL DEFAULT '[]'::jsonb,
  main_image TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_timestamp_fish ON fish;
CREATE TRIGGER set_timestamp_fish
BEFORE UPDATE ON fish
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Tabel Needs
CREATE TABLE IF NOT EXISTS needs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 0,
  main_image TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_timestamp_needs ON needs;
CREATE TRIGGER set_timestamp_needs
BEFORE UPDATE ON needs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Seeder awal untuk articles
INSERT INTO articles (title, date, excerpt, image, author, content, tags) VALUES
('Panduan Dasar Merawat Cupang','2025-01-01','Air, pakan, dan setting tank untuk pemula.','/img/betta-img/cupang (6).jpg','Admin','<p>Ringkasan perawatan dasar untuk pemula.</p>','["perawatan"]'),
('Mengenal Varietas Betta','2025-01-05','Halfmoon, Plakat, Giant, dan lain-lain.','/img/betta-img/cupang (7).jpg','Admin','<p>Pengantar berbagai varietas betta populer.</p>','["varietas"]');

-- Seeder awal untuk fish
INSERT INTO fish (name, price, discount_percent, variety, description, type_text, size_cm, color, gender, condition, age, origin, stock, advantages, care_guide, main_image, images) VALUES
('Halfmoon Red',200000,25,'Halfmoon','Ikan cupang halfmoon premium dengan sirip lebar dan simetris.','Halfmoon','5-6 cm','Merah Metalik','Jantan','Sehat & Aktif','3-4 bulan','Breeding Lokal',5,'["Sirip lebar dan simetris","Warna metalik yang mencolok"]','["Ganti air 25% setiap minggu","Berikan pakan 2x sehari"]','/img/betta-img/cupang (1).jpeg','["/img/betta-img/cupang (1).jpeg","/img/betta-img/cupang (2).jpeg"]'),
('Plakat Marble',150000,0,'Plakat','Cupang plakat dengan corak marble unik.','Plakat','4-5 cm','Marble','Jantan','Sehat','3 bulan','Breeding Lokal',3,'["Kondisi fisik prima"]','["Suhu air 24-28°C"]','/img/betta-img/cupang (3).jpg','["/img/betta-img/cupang (3).jpg","/img/betta-img/cupang (4).jpg"]');

-- Seeder awal untuk needs
INSERT INTO needs (name, description, price, discount_percent, specs, includes, features, stock, main_image, images) VALUES
('Daun Ketapang Premium','Daun ketapang pilihan untuk menjaga kualitas air dan kesehatan ikan cupang.',8000,0,'["Berat 50g","Dikeringkan alami","Daun utuh pilihan"]','["10 lembar daun ketapang"]','["Meningkatkan kualitas air","Membantu pemulihan ikan"]',25,'/img/kebutuhan-img/2.png','["/img/kebutuhan-img/2.png"]'),
('Garam Ikan 100gr','Garam khusus ikan untuk perawatan harian dan karantina.',10000,0,'["Berat 100g","Kemasan ziplock"]','["1 pouch garam 100g"]','["Meningkatkan daya tahan","Membantu proses penyembuhan"]',40,'/img/kebutuhan-img/1.png','["/img/kebutuhan-img/1.png"]');