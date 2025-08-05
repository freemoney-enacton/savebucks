ALTER TABLE affiliates
  ADD COLUMN promotion_method ENUM('social_media','website','youtube','other') NOT NULL,
  ADD COLUMN website_link VARCHAR(255) NOT NULL,
  ADD COLUMN estimated_monthly_leads ENUM('0-100','100-500','500-1000','1000+') NOT NULL;
