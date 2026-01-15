-- Add meeting and no-show tracking to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meeting_scheduled BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meeting_date TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meeting_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS no_show BOOLEAN DEFAULT FALSE;

-- Add meetings goal to company_goals
ALTER TABLE company_goals ADD COLUMN IF NOT EXISTS meetings_goal INTEGER DEFAULT 0;

-- Add meetings goal to individual goals
ALTER TABLE goals ADD COLUMN IF NOT EXISTS meetings_goal INTEGER DEFAULT 0;