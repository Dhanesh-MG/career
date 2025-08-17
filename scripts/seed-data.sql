-- Insert sample jobs
INSERT INTO public.jobs (
  title, department, location, type, salary, description, requirements, responsibilities, benefits, status
) VALUES 
(
  'Senior Frontend Developer',
  'Engineering',
  'San Francisco, CA',
  'Full-time',
  '$120,000 - $160,000',
  'We''re looking for a senior frontend developer to join our engineering team and help build the next generation of our web applications.',
  ARRAY['5+ years of React experience', 'TypeScript proficiency', 'Modern CSS frameworks'],
  ARRAY['Develop React applications', 'Code reviews', 'Mentor junior developers'],
  ARRAY['Health insurance', 'Stock options', 'Remote work'],
  'active'
),
(
  'Backend Engineer',
  'Engineering',
  'Remote',
  'Full-time',
  '$110,000 - $150,000',
  'Join our backend team to design and implement scalable APIs and microservices that power our platform.',
  ARRAY['Node.js/Python experience', 'Database design', 'Cloud platforms (AWS/GCP)'],
  ARRAY['Build scalable APIs', 'Design database schemas', 'Implement microservices'],
  ARRAY['Remote work', 'Health insurance', 'Stock options'],
  'active'
),
(
  'Product Designer',
  'Design',
  'New York, NY',
  'Full-time',
  '$90,000 - $130,000',
  'We''re seeking a talented product designer to create intuitive and beautiful user experiences for our products.',
  ARRAY['Figma expertise', 'User research experience', 'Design systems knowledge'],
  ARRAY['Design user interfaces', 'Conduct user research', 'Maintain design systems'],
  ARRAY['Health insurance', 'Design tools budget', 'Flexible hours'],
  'active'
),
(
  'DevOps Engineer',
  'Engineering',
  'Austin, TX',
  'Full-time',
  '$100,000 - $140,000',
  'Help us build and maintain our infrastructure, CI/CD pipelines, and deployment processes.',
  ARRAY['Kubernetes experience', 'Docker proficiency', 'Infrastructure as Code'],
  ARRAY['Manage infrastructure', 'Build CI/CD pipelines', 'Monitor systems'],
  ARRAY['Health insurance', 'Stock options', 'Learning budget'],
  'active'
),
(
  'Data Scientist',
  'Data',
  'Remote',
  'Full-time',
  '$130,000 - $170,000',
  'Analyze complex datasets and build machine learning models to drive business insights and product improvements.',
  ARRAY['Python/R proficiency', 'Machine learning experience', 'Statistical analysis'],
  ARRAY['Build ML models', 'Analyze data', 'Present insights'],
  ARRAY['Remote work', 'Health insurance', 'Conference budget'],
  'active'
),
(
  'Marketing Manager',
  'Marketing',
  'Los Angeles, CA',
  'Full-time',
  '$80,000 - $110,000',
  'Lead our marketing initiatives and help grow our brand presence across digital channels.',
  ARRAY['Digital marketing experience', 'Content strategy', 'Analytics tools'],
  ARRAY['Develop marketing strategies', 'Create content', 'Analyze campaigns'],
  ARRAY['Health insurance', 'Marketing tools budget', 'Flexible hours'],
  'active'
);
