import Fuse from 'fuse.js'

export interface SearchItem {
  title: string
  path: string
  content: string
  category?: string
}

// Build search index from content structure
export const searchItems: SearchItem[] = [
  {
    title: 'Home',
    path: '/',
    content: 'Developer Hub - Centralized knowledge base for all development teams',
    category: 'Main',
  },
  {
    title: '00. Principles',
    path: '/00-principles',
    content: 'Core development principles and values. Ownership & Responsibility, Safety Over Speed, Promotion Not Deployment',
    category: 'Principles',
  },
  {
    title: '10. Developer Contracts',
    path: '/10-developer-contracts',
    content: 'Agreements and responsibilities. Local Testing Contract, CI Responsibility Contract, Staging Promotion Contract',
    category: 'Contracts',
  },
  {
    title: '20. Workflows',
    path: '/20-workflows',
    content: 'Development workflows and processes. Branching Strategy, Release Flow, Hotfix Process',
    category: 'Workflows',
  },
  {
    title: '30. Tooling',
    path: '/30-tooling',
    content: 'Development tools and setup. Local Setup, Test Commands, CI Overview',
    category: 'Tooling',
  },
  {
    title: '40. Reference',
    path: '/40-reference',
    content: 'Architecture and technical reference. Architecture, ADRs, Runbooks',
    category: 'Reference',
  },
  {
    title: 'Domains Overview',
    path: '/domains',
    content: 'Domain-specific documentation. API Integration, Integration Services, Security, Platform Engineering',
    category: 'Domains',
  },
  {
    title: 'API Integration',
    path: '/domains/api-integration',
    content: 'API integration patterns, Java backend + React frontend patterns, and best practices',
    category: 'API Integration',
  },
  {
    title: 'Backend API Integration',
    path: '/domains/api-integration/backend',
    content: 'Backend API integration patterns, best practices, and implementation guides for Java Spring Boot',
    category: 'API Integration',
  },
  {
    title: 'Java Backend API Integration',
    path: '/domains/api-integration/backend/java',
    content: 'Java Spring Boot backend API integration patterns and examples. REST APIs, authentication, error handling',
    category: 'API Integration',
  },
  {
    title: 'Java Overview',
    path: '/domains/api-integration/backend/java/overview',
    content: 'Java releases, version status, best practices, var keyword, JUnit, Mockito, testing tools',
    category: 'API Integration',
  },
  {
    title: 'Testing in Java',
    path: '/domains/api-integration/backend/java/testing',
    content: 'Java testing with JUnit 5, Mockito, AssertJ. Testing patterns, best practices, integration testing',
    category: 'API Integration',
  },
  {
    title: 'REST APIs in Java',
    path: '/domains/api-integration/backend/java/rest',
    content: 'REST API implementation patterns using Java Spring Boot. GET, POST, PUT, DELETE operations',
    category: 'API Integration',
  },
  {
    title: 'Authentication in Java',
    path: '/domains/api-integration/backend/java/authentication',
    content: 'Authentication patterns and implementations for Java Spring Boot backends. JWT, OAuth2, sessions',
    category: 'API Integration',
  },
  {
    title: 'JWT Authentication in Java',
    path: '/domains/api-integration/backend/java/authentication/jwt',
    content: 'JSON Web Token (JWT) authentication implementation for Java Spring Boot',
    category: 'API Integration',
  },
  {
    title: 'OAuth2 in Java',
    path: '/domains/api-integration/backend/java/authentication/oauth2',
    content: 'OAuth2 authentication implementation for Java Spring Boot',
    category: 'API Integration',
  },
  {
    title: 'Session Management in Java',
    path: '/domains/api-integration/backend/java/authentication/sessions',
    content: 'Session-based authentication for Java Spring Boot',
    category: 'API Integration',
  },
  {
    title: 'Error Handling in Java',
    path: '/domains/api-integration/backend/java/error-handling',
    content: 'Error handling patterns and best practices for Java Spring Boot APIs',
    category: 'API Integration',
  },
  {
    title: 'Data Transformation in Java',
    path: '/domains/api-integration/backend/java/data-transformation',
    content: 'Data transformation patterns for Java Spring Boot APIs',
    category: 'API Integration',
  },
  {
    title: 'Frontend API Integration',
    path: '/domains/api-integration/frontend',
    content: 'Frontend API integration patterns, best practices, and implementation guides for React',
    category: 'API Integration',
  },
  {
    title: 'React Frontend API Integration',
    path: '/domains/api-integration/frontend/react',
    content: 'React frontend API integration patterns and examples. REST APIs, authentication, error handling',
    category: 'API Integration',
  },
  {
    title: 'REST APIs in React',
    path: '/domains/api-integration/frontend/react/rest',
    content: 'REST API integration patterns using React and TypeScript. GET, POST, PUT, DELETE operations',
    category: 'API Integration',
  },
  {
    title: 'Authentication in React',
    path: '/domains/api-integration/frontend/react/authentication',
    content: 'Authentication patterns and implementations for React frontends. JWT, OAuth2, sessions',
    category: 'API Integration',
  },
  {
    title: 'JWT Authentication in React',
    path: '/domains/api-integration/frontend/react/authentication/jwt',
    content: 'JSON Web Token (JWT) authentication implementation for React applications',
    category: 'API Integration',
  },
  {
    title: 'OAuth2 in React',
    path: '/domains/api-integration/frontend/react/authentication/oauth2',
    content: 'OAuth2 authentication implementation for React applications',
    category: 'API Integration',
  },
  {
    title: 'Session Management in React',
    path: '/domains/api-integration/frontend/react/authentication/sessions',
    content: 'Session-based authentication for React applications',
    category: 'API Integration',
  },
  {
    title: 'Error Handling in React',
    path: '/domains/api-integration/frontend/react/error-handling',
    content: 'Error handling patterns and best practices for React API calls',
    category: 'API Integration',
  },
  {
    title: 'Data Transformation in React',
    path: '/domains/api-integration/frontend/react/data-transformation',
    content: 'Data transformation patterns for React frontends',
    category: 'API Integration',
  },
  {
    title: 'Database Notes',
    path: '/30-tooling/database',
    content: 'Database setup, configuration, and best practices. PostgreSQL, connection pooling, migrations',
    category: 'Tooling',
  },
  {
    title: 'Integration Services',
    path: '/domains/integration-services',
    content: 'Third-party integrations and services. Email, Payments, CI/CD tools',
    category: 'Domains',
  },
  {
    title: 'Email Services',
    path: '/domains/integration-services/implementation/email-services',
    content: 'Email integration with Resend. Transactional emails, templates, SMTP',
    category: 'Integration Services',
  },
  {
    title: 'Payment Services',
    path: '/domains/integration-services/implementation/payment-services',
    content: 'Payment processing with Stripe. Checkout sessions, subscriptions, webhooks',
    category: 'Integration Services',
  },
  {
    title: 'CI/CD Tools',
    path: '/domains/integration-services/implementation/ci-cd-tools',
    content: 'Continuous Integration and Deployment. Vercel, GitHub Actions, deployment strategies',
    category: 'Integration Services',
  },
  {
    title: 'Capabilities Matrix',
    path: '/domains/integration-services/implementation/capabilities-matrix',
    content: 'Build vs buy decisions. Integration capabilities and recommendations',
    category: 'Integration Services',
  },
  {
    title: 'Security Overview',
    path: '/domains/security',
    content: 'Security practices and procedures. Authentication, encryption, OWASP',
    category: 'Security',
  },
  {
    title: 'Security Architecture',
    path: '/domains/security/architecture/overview',
    content: 'Security architecture and design. System security, threat modeling',
    category: 'Security',
  },
  {
    title: 'Security Procedures',
    path: '/domains/security/implementation/security-procedures',
    content: 'Security implementation procedures. Best practices, guidelines',
    category: 'Security',
  },
  {
    title: 'Product Security',
    path: '/domains/security/implementation/product-security',
    content: 'Product security practices. Secure development lifecycle',
    category: 'Security',
  },
  {
    title: 'Security Endpoints',
    path: '/domains/security/api/security-endpoints',
    content: 'API security endpoints. Authentication, authorization, secure APIs',
    category: 'Security',
  },
  {
    title: 'Platform Engineering',
    path: '/domains/platform-engineering',
    content: 'Infrastructure and deployment. Platform concerns, deployment strategies',
    category: 'Platform Engineering',
  },
  {
    title: 'Deployment Strategy',
    path: '/domains/platform-engineering/implementation/deployment-strategy',
    content: 'Deployment strategies and practices. CI/CD, infrastructure as code',
    category: 'Platform Engineering',
  },
  {
    title: 'Nexus Digital Agents',
    path: '/domains/nexus-agents',
    content: 'Nexus Digital Agents system for collaborative development. Product Owner, Architect, Frontend, Backend, QA, Security, DevOps',
    category: 'Team',
  },
  {
    title: 'Sprint 001: Dev Hub Improvements',
    path: '/domains/nexus-agents/sprints/SPRINT_001_DEV_HUB_IMPROVEMENTS',
    content: 'Sprint plan for improving Developer Hub. Led by Catalyst Product Owner. User experience, performance, accessibility improvements',
    category: 'Sprints',
  },
  {
    title: 'Sprint 001 Kickoff',
    path: '/domains/nexus-agents/sprints/SPRINT_KICKOFF',
    content: 'Sprint kickoff for Developer Hub improvements. Catalyst Product Owner leading the team. Mission, priorities, team assignments',
    category: 'Sprints',
  },
  {
    title: 'Catalyst - Product Owner',
    path: '/domains/nexus-agents/agents/Agent — Catalyst (Product Owner)',
    content: 'Catalyst Product Owner agent. Product vision, user research, feature prioritization, user stories, backlog management',
    category: 'Agents',
  },
]

// Configure Fuse.js for optimal search performance
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.5 }, // Increased weight for title matches
    { name: 'content', weight: 0.3 },
    { name: 'category', weight: 0.15 },
    { name: 'path', weight: 0.05 },
  ],
  threshold: 0.3, // Lower = more strict, higher = more fuzzy
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  findAllMatches: true,
  // Performance optimizations
  useExtendedSearch: false, // Disable for better performance
  shouldSort: true,
}

let fuseInstance: Fuse<SearchItem> | null = null

export function getSearchInstance(): Fuse<SearchItem> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(searchItems, fuseOptions)
  }
  return fuseInstance
}

export function search(query: string, limit: number = 10): SearchItem[] {
  if (!query || query.length < 2) {
    return []
  }

  const fuse = getSearchInstance()
  const results = fuse.search(query, { limit })
  return results.map((result) => result.item)
}

