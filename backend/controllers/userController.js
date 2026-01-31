// List all users (admin only)
exports.list = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};
// backend/src/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  console.log(
    "[auth.register]",
    req.method,
    req.path,
    "content-type:",
    req.headers["content-type"]
  );
  console.log("[auth.register] req.body:", req.body);
  if (!req.body) {
    return res.status(400).json({
      message:
        "Missing request body. Make sure you send JSON with Content-Type: application/json",
    });
  }
  const { name, email, password } = req.body || {};
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email in use" });
    user = await User.create({ name, email, password });
    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { interests } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { interests },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Extract skills from CV
exports.extractSkillsFromCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('[CV Upload] File received:', req.file.originalname, 'Type:', req.file.mimetype);

    let text = '';

    // Handle PDF files
    if (req.file.mimetype === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(req.file.buffer);
        text = pdfData.text || '';
        console.log('[CV Upload] PDF parsed, extracted', text.length, 'characters');
      } catch (pdfErr) {
        console.error('[CV Upload] PDF parsing error:', pdfErr.message);
        // Fallback: try to extract raw text from PDF buffer
        text = req.file.buffer.toString('latin1').replace(/\x00/g, '');
        console.log('[CV Upload] Fallback extraction, got', text.length, 'characters');
      }
    } 
    // Handle text files
    else if (req.file.mimetype === 'text/plain') {
      text = req.file.buffer.toString('utf-8');
      console.log('[CV Upload] Text file parsed, extracted', text.length, 'characters');
    }
    // Handle Word documents
    else if (req.file.mimetype.includes('word') || req.file.mimetype.includes('document')) {
      // Extract text from Word document binary
      text = req.file.buffer.toString('utf-8', 0, Math.min(100000, req.file.buffer.length));
      // Remove null bytes and control characters
      text = text.replace(/\x00/g, '').replace(/[^\x20-\x7E\n\r\t]/g, '');
      console.log('[CV Upload] Word doc parsed, extracted', text.length, 'characters');
    }
    else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload PDF, TXT, or Word document.' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from file. Please ensure your CV contains readable text.' });
    }

    // Comprehensive skill keywords (technical + soft + tools + methodologies)
    const skillKeywords = [
      // Programming Languages
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c ', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'r language', 'r programming', 'perl', 'scala', 'objective-c', 'groovy', 'haskell',
      // Frontend Frameworks & Libraries
      'react', 'vue', 'angular', 'svelte', 'ember', 'backbone', 'next.js', 'nextjs', 'nuxt', 'gatsby',
      'astro', 'solid', 'preact', 'stimulus',
      // Backend Frameworks
      'express', 'fastapi', 'django', 'spring', 'node.js', 'nodejs', 'flask', 'laravel', 'symfony', 'asp.net', 'rails',
      'gin', 'actix', 'rocket', 'axum', 'aiohttp', 'tornado', 'pyramid', 'falcon', 'bottle',
      'grails', 'micronaut', 'quarkus', 'revel',
      // Databases
      'mongodb', 'postgresql', 'postgres', 'mysql', 'oracle', 'redis', 'elasticsearch', 'firebase', 'dynamodb',
      'cassandra', 'couchdb', 'neo4j', 'mariadb', 'sqlite', 'sql server', 'sqlalchemy', 'typeorm', 'sequelize',
      'prisma', 'mongoose', 'realm', 'supabase', 'bigtable', 'cloudstore',
      // Cloud Platforms & Hosting
      'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'vercel', 'netlify', 'render',
      'railway', 'fly.io', 'linode', 'vultr', 'ibm cloud', 'oracle cloud', 'alibaba cloud',
      // DevOps & Containerization
      'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab', 'github', 'bitbucket', 'circleci', 'travis ci',
      'gitlab-ci', 'github actions', 'terraform', 'ansible', 'vagrant', 'helm', 'istio',
      // Soft Skills
      'leadership', 'communication', 'teamwork', 'project management', 'problem solving', 'critical thinking',
      'time management', 'collaboration', 'adaptability', 'creativity', 'analytical thinking', 'attention to detail',
      // Methodologies & Practices
      'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'microservices', 'serverless', 'rest api', 'graphql',
      'test-driven development', 'tdd', 'behavior-driven development', 'bdd', 'design patterns',
      'functional programming', 'object-oriented', 'oop', 'domain-driven design', 'ddd',
      // Frontend Technologies
      'html', 'css', 'sass', 'scss', 'less', 'tailwind', 'bootstrap', 'material design', 'ant design',
      'chakra ui', 'material ui', 'shadcn', 'styled-components', 'emotion', 'postcsss',
      // APIs & Protocols
      'rest', 'websocket', 'soap', 'grpc', 'mqtt', 'amqp', 'oauth', 'jwt', 'ssl/tls',
      // Testing Frameworks
      'jest', 'mocha', 'pytest', 'unittest', 'junit', 'selenium', 'cypress', 'playwright',
      'enzyme', 'react testing library', 'rspec', 'cucumber', 'testng', 'vitest',
      // Version Control & SCM
      'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial',
      // ML & AI
      'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn',
      'data analysis', 'pandas', 'numpy', 'matplotlib', 'plotly', 'seaborn', 'nlp', 'computer vision',
      'opencv', 'hugging face', 'transformers', 'statsmodels',
      // Design & UX/UI
      'ux', 'ui', 'user experience', 'figma', 'adobe xd', 'adobe creative', 'sketch', 'responsive design',
      'wireframing', 'prototyping', 'user research', 'design system', 'accessibility', 'wcag',
      // Operating Systems & Environments
      'linux', 'unix', 'windows', 'macos', 'bash', 'shell', 'powershell', 'zsh',
      // Other Tools & Technologies
      'security', 'encryption', 'authentication', 'authorization', 'vpn', 'firewall',
      'data science', 'big data', 'hadoop', 'spark', 'flink', 'kafka', 'rabbitmq', 'redis',
      'elasticsearch', 'kibana', 'grafana', 'prometheus', 'splunk', 'datadog',
      'api documentation', 'swagger', 'openapi', 'postman', 'insomnia',
      'npm', 'yarn', 'pip', 'maven', 'gradle', 'cargo', 'composer',
      'babel', 'webpack', 'vite', 'esbuild', 'rollup', 'parcel', 'gulp', 'grunt',
      'linting', 'eslint', 'prettier', 'flake8', 'pylint', 'rubocop',
      'virtualization', 'hypervisors', 'containers', 'vm', 'virtual machine',
      'monitoring', 'logging', 'alerting', 'performance optimization',
      'database migration', 'backup', 'disaster recovery',
      'agile ceremonies', 'stand-up', 'retrospective', 'sprint planning',
      'code review', 'pair programming', 'refactoring', 'debugging'
    ];

    // Extract matched skills from CV text (case-insensitive, word boundaries)
    const cvTextLower = text.toLowerCase();
    const matchedSkills = new Set();
    
    skillKeywords.forEach(skill => {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      if (regex.test(cvTextLower)) {
        // Normalize the skill name (capitalize properly)
        const normalized = skill
          .split(/\s+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchedSkills.add(normalized);
      }
    });

    // Convert to array and get all matched skills (no limit on count)
    const uniqueSkills = Array.from(matchedSkills).sort();

    console.log('[CV Upload] Extracted skills:', uniqueSkills);

    if (uniqueSkills.length === 0) {
      return res.status(400).json({ 
        message: 'No recognized skills found in your CV. Try mentioning common technologies like React, Python, Node.js, etc.' 
      });
    }

    // Update user profile with extracted skills
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        interests: uniqueSkills,
        cvProcessed: true
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      extractedSkills: uniqueSkills,
      count: uniqueSkills.length,
      user: user
    });
  } catch (err) {
    console.error('Error extracting skills from CV:', err.message, err.stack);
    res.status(500).json({ message: 'Error processing CV: ' + err.message });
  }
};
