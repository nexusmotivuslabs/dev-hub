# Integration Guide - Nexus Digital Agents Template

This guide explains how to integrate the Nexus Digital Agents system into your application project.

## Quick Start

### Step 1: Copy to Your Project

```bash
# From your project root
cp -r nexus-agents-template nexus-agents
```

### Step 2: Customize for Your Project

1. **Update `.cursorrules`**:
   - Replace project-specific technology stack
   - Update project structure paths
   - Add project-specific features

2. **Update Agent Specifications**:
   - Modify tech stack sections to match your project
   - Update project context references
   - Adjust examples to your domain

3. **Update README.md**:
   - Add your project name
   - Update directory structure to match your project
   - Add project-specific notes

### Step 3: Activate Agents

Agents are activated when you reference them in your work. The `.cursorrules` file provides orchestration guidelines.

## Customization Points

### Technology Stack
Update the tech stack in `.cursorrules` to match your project:
- Frontend framework (React, Vue, Angular, etc.)
- Backend framework (Node.js, Python, Java, etc.)
- Database (PostgreSQL, MongoDB, etc.)
- Build tools
- Testing frameworks

### Project Structure
Update directory structure in `.cursorrules` to match your project layout.

### Agent Priorities
Adjust which agents are "MVP", "Production-Ready", or "Enterprise" based on your project needs.

## Agent Selection

### For New Projects
Start with MVP agents:
- **Catalyst** (Product Owner) - Define what to build
- **Aura** (UX/UI Designer) - Design the experience
- **Architect** (Principal Engineer) - Build it right
- **Prism** (Frontend Engineer) - Implement UI
- **Sentinel** (QA Engineer) - Ensure quality

### For Existing Projects
Add agents based on gaps:
- Missing product direction? → Add **Catalyst**
- Poor UX? → Add **Aura**
- No data insights? → Add **Insight**
- Accessibility issues? → Add **Beacon**

## Best Practices

1. **Reference Dev Hub First**: All agents must reference the Dev Hub (`dev-hub/README.md`) before starting work
2. **Read Agent Specs First**: Before working as an agent, read their full specification
3. **Follow Orchestration Rules**: Check `.cursorrules` for coordination guidelines
4. **Maintain Consistency**: Keep agent personalities and communication styles consistent
5. **Update Regularly**: Keep agent specs updated as your project evolves

## Example Integration

```bash
# Your project structure after integration
your-project/
├── src/
├── docs/
├── nexus-agents/          # ← Copied from template
│   ├── README.md
│   ├── .cursorrules
│   └── agents/
└── package.json
```

## Troubleshooting

**Q: Agents seem generic, not specific to my project**
A: Update the tech stack and project context in `.cursorrules` and individual agent specs.

**Q: Too many agents, which ones do I need?**
A: Start with MVP agents (Catalyst, Aura, Architect, Prism, Sentinel). Add others as needed.

**Q: How do I add a custom agent?**
A: Copy an existing agent spec, rename it, and customize the role, personality, and responsibilities.

---

**Note**: This is a template. Customize it to fit your project's specific needs and technology stack.



