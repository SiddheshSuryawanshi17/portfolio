// ─────────────────────────────────────────────────────────────
//  ALL SITE CONTENT LIVES HERE.
//  Change text, links or projects in this file. You never need
//  to touch the components to update what the site says.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: 'Siddhesh',
  lastName: 'Suryawanshi',
  initials: 'SS',
  role: 'AI / ML Engineer',
  location: 'Nashik, India',
  timezone: 'Asia/Kolkata',
  email: 'siddheshksuryawanshi@gmail.com',
  phone: '+91 7972390165',
  resume: '/resume.pdf',
  available: true,
  availableText: 'Open to internships & full-time roles · 2027',
  // Put your photo in public/images/me/portrait.jpg. Until then a placeholder is shown.
  portrait: '/images/me/portrait.jpg',
  heroLine: 'I build AI that runs on your machine and explains its decisions.',
}

export const socials = [
  { label: 'GitHub', href: 'https://github.com/SiddheshSuryawanshi17' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siddhesh-suryawanshi-866b67361/' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/SiddheshS/' },
  { label: 'X / Twitter', href: 'https://x.com/SiddheshSurya12' },
  { label: 'Instagram', href: 'https://www.instagram.com/siddhesh_suryawanshi/' },
  { label: 'Dev.to', href: 'https://dev.to/siddheshsuryawanshi' },
]

export const marquee = [
  'Generative AI',
  'Multi-Agent Systems',
  'Local LLMs',
  'Deep Learning',
  'AWS Cloud',
  'CI/CD',
  'Python',
  'System Design',
]

export const about = {
  statement:
    'I’m a final-year Computer Engineering student at SPPU who builds the whole thing: the model, the API, the interface, and the pipeline that ships it. Lately that means running LLMs on everyday hardware and designing agent systems whose every decision can be audited.',
  paragraphs: [
    'I study at JESITMR, Nashik, and graduate in 2027. Most of my time goes into applied AI: models that run privately on your own machine, and multi-agent pipelines where each agent does one job you can check.',
    'I’m just as comfortable in the cloud. I’ve trained on AWS, set up CI/CD with Docker and Git, and I like owning a feature from the first commit to production.',
  ],
  stats: [
    { value: '1st', label: 'Prize · Build with Gemma hackathon' },
    { value: '3', label: 'Internships & roles' },
    { value: '94%', label: 'CNN accuracy, flower classifier' },
    { value: '2027', label: 'B.E. Computer Engineering' },
  ],
}

// Project images go in public/images/projects/. Leave `image` empty to get
// an auto-generated cover in the project's colour.
export const projects = [
  {
    title: 'Privacy-First AI Interviewer',
    tag: 'Hackathon winner',
    year: '2026',
    blurb:
      'A spoken mock interviewer that runs 100% on your own machine. Gemma 4 asks questions based on your resume and the job description, listens to your answers, adapts the difficulty and writes a scored PDF report. Your voice and data never leave the device.',
    stack: ['Gemma 4', 'Ollama', 'Whisper', 'Piper TTS', 'Gradio', 'Python'],
    award: '1st Prize · Build with Gemma, ML Nashik × Kaggle',
    image: '/images/projects/ai-interviewer-thumbnail.png',
    color: '#c6ff3d',
    link: 'https://github.com/SiddheshSuryawanshi17/Privacy-First-AI-Interviewer',
  },
  {
    title: 'MedIntel',
    tag: 'Final-year research',
    year: '2026–27',
    blurb:
      'A multi-agent framework for clinical decision support. ML analysis, rule-based checks and LLM agents each handle one step, so every diagnosis suggestion comes with an explanation you can audit, rather than one generative model writing the whole report.',
    stack: ['Python', 'Multi-Agent', 'LLM Agents', 'Scikit-learn', 'Rule engine'],
    image: '',
    color: '#7cc4ff',
    link: 'https://github.com/SiddheshSuryawanshi17/MedIntel-A-Multi-Agent-AI-Framework-for-Clinical-Decision-Support',
  },
  {
    title: 'VenueFlow',
    tag: 'PromptWars hackathon',
    year: '2026',
    blurb:
      'Real-time coordination for large stadiums: a live crowd heatmap, predicted queue times for food and restrooms, a fan alerts feed and an AI concierge. Built accessibility-first, with keyboard navigation and screen-reader support.',
    stack: ['JavaScript', 'SVG maps', 'Realtime UI', 'Accessibility'],
    image: '',
    color: '#ff8a3d',
    link: 'https://github.com/SiddheshSuryawanshi17/Promptwars_hackathon',
  },
  {
    title: 'FarmConnect',
    tag: 'Full-stack',
    year: '2026',
    blurb:
      'A farmer-to-consumer marketplace with JWT authentication, product listings, order tracking and market prices, available in English, Hindi, Kannada and Telugu.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'i18next'],
    image: '',
    color: '#ffd23d',
    link: 'https://github.com/SiddheshSuryawanshi17/farmconnect',
  },
  {
    title: 'Flower Classification',
    tag: 'Deep learning',
    year: '2025',
    blurb:
      'A CNN that tells flower species apart with 94% accuracy, using transfer learning on VGG16 and ResNet, with data augmentation to make it robust and avoid overfitting.',
    stack: ['TensorFlow', 'Keras', 'VGG16', 'ResNet', 'Python'],
    image: '',
    color: '#ff6fb5',
    link: 'https://github.com/SiddheshSuryawanshi17',
  },
]

export const experience = [
  {
    role: 'Data Science Intern',
    company: 'Skymind IT Training & Solutions',
    period: 'Jan 2026 — Present',
    place: 'Nashik',
    points: [
      'Python for data preprocessing, visualisation and machine learning tasks',
      'Applying data science methods to real business problems and datasets',
    ],
  },
  {
    role: 'Cloud Computing Intern',
    company: 'Sumago Infotech',
    period: 'Aug 2025 — Nov 2025',
    place: 'Nashik',
    points: [
      'Hands-on with core AWS services: EC2, S3, IAM and VPC',
      'DevOps workflows on Linux with Git and Docker, plus basic CI/CD pipelines',
    ],
  },
  {
    role: 'Software Developer',
    company: 'EduSkills Foundation',
    period: 'Aug 2024 — Present',
    place: 'Nashik',
    points: [
      'Building and maintaining software in Python and modern frameworks',
      'Working with cross-functional teams to design, build and deploy applications',
      'Cloud solutions on AWS for better performance and reliability',
    ],
  },
]

export const skills = [
  {
    group: 'AI & Machine Learning',
    items: ['Generative AI & LLMs', 'Multi-Agent Systems', 'Deep Learning', 'Neural Networks', 'TensorFlow / Keras', 'PyTorch', 'Scikit-learn', 'OpenCV'],
  },
  {
    group: 'Languages',
    items: ['Python', 'SQL', 'C++', 'Java', 'JavaScript'],
  },
  {
    group: 'Cloud & DevOps',
    items: ['AWS (EC2, S3, IAM, VPC)', 'Docker', 'CI/CD', 'Infrastructure as Code', 'Linux', 'Git'],
  },
  {
    group: 'Data & Systems',
    items: ['SQL & NoSQL', 'Data Modeling', 'Pandas / NumPy', 'Networking & TCP/IP', 'System Design'],
  },
]
