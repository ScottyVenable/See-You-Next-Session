# Security Policy

> **Last Updated:** December 17, 2025  
> **Version:** 0.2.0

---

## Supported Versions

Currently supported versions for security updates:

| Version | Supported |
| ------- | --------- |
| 0.2.x   | Yes       |
| 0.1.x   | No        |

---

## Reporting a Vulnerability

### How to Report

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers directly at: [Add email when available]
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity (see below)

### Severity Levels

| Level | Response Time | Examples |
|-------|---------------|----------|
| **Critical** | 24-48 hours | Remote code execution, data breach |
| **High** | 3-7 days | Authentication bypass, XSS |
| **Medium** | 1-2 weeks | CSRF, information disclosure |
| **Low** | Best effort | Minor information leaks |

---

## Security Assessment

### Current Status

This is an early-stage game project (v0.2.0) focused on achieving MVP. Security is important, but the project currently:

- Does NOT handle user authentication
- Does NOT store personal information on servers
- Does NOT process payments
- Does NOT collect analytics without consent
- Uses local storage only for game saves

### Assessed Risks

#### Low Risk Areas
- **Local Game Saves** - Stored in browser localStorage, no sensitive data
- **Static Assets** - Images, fonts, sounds - publicly accessible by design
- **Game Content** - Dialogue, disorders, symptoms - intentionally public
- **No Backend** - Currently a client-side only application

#### Medium Risk Areas
- **Firebase Hosting** - Used for web deployment
  - Risk: Misconfiguration could expose development files
  - Mitigation: `.gitignore` prevents sensitive files from being deployed
  
- **Dependencies** - Third-party npm packages
  - Risk: Known vulnerabilities in dependencies
  - Mitigation: Regular `npm audit` checks and updates
  
- **Content Injection** - User-generated content in future features
  - Risk: XSS if implementing user-submitted content
  - Mitigation: Currently no user input beyond game interactions

#### Areas Requiring Future Attention

1. **User Authentication** (if added)
   - Will need secure token management
   - Password hashing (if storing credentials)
   - Session management

2. **User-Generated Content** (if added)
   - Input sanitization
   - XSS prevention
   - Content moderation

3. **Multiplayer Features** (if added)
   - Network security
   - Anti-cheat measures
   - Data validation

4. **Payment Processing** (if monetized)
   - PCI DSS compliance
   - Secure payment gateway integration

---

## Security Best Practices for Contributors

### Code Review Checklist

When reviewing code, check for:

- [ ] **No hardcoded secrets** - API keys, tokens, passwords
- [ ] **Input validation** - Sanitize any user input
- [ ] **No eval() usage** - Avoid dynamic code execution
- [ ] **Safe dependencies** - Check npm audit results
- [ ] **HTTPS only** - No mixed content
- [ ] **Content Security Policy** - Proper CSP headers
- [ ] **No sensitive data in logs** - Avoid logging user data

### Common Vulnerabilities to Avoid

#### Cross-Site Scripting (XSS)
```jsx
// BAD - Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// GOOD - React auto-escapes
<div>{userInput}</div>

// GOOD - Sanitize if HTML is needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

#### Local Storage
```javascript
// BAD - Storing sensitive data
localStorage.setItem('apiKey', key);

// GOOD - Only store non-sensitive game state
localStorage.setItem('gameProgress', JSON.stringify(safeData));
```

#### Dependencies
```bash
# Check for known vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Review high/critical issues
npm audit --only=prod
```

---

## Dependency Management

### Current Dependencies

**Production Dependencies:**
- `react` - UI framework
- `react-dom` - React DOM renderer
- `motion` - Animation library
- `styled-components` - CSS-in-JS
- `@phosphor-icons/react` - Icon library

**Development Dependencies:**
- `vite` - Build tool
- `@tauri-apps/cli` - Desktop build
- `eslint` - Code linting

### Update Policy

1. **Review dependencies monthly**
2. **Check for security advisories**
3. **Test thoroughly after updates**
4. **Document breaking changes**

### Adding New Dependencies

Before adding a new dependency:

1. **Check necessity** - Is it really needed?
2. **Review popularity** - Is it well-maintained?
3. **Check security** - Any known vulnerabilities?
4. **Review license** - Compatible with MIT?
5. **Check bundle size** - Will it bloat the build?

---

## Data Privacy

### What We Collect

Currently, the game collects:
- **Local game saves** - Stored in browser localStorage
- **No analytics** - No tracking or telemetry (yet)
- **No personal information** - No names, emails, or identifiable data

### Future Considerations

If analytics are added:
- Will be opt-in only
- Will anonymize data
- Will document clearly
- Will comply with GDPR/CCPA

---

## Deployment Security

### Firebase Hosting

Current deployment setup:
- Static file hosting only
- HTTPS enforced
- No server-side code
- No database access

### Security Headers

Recommended headers for deployment:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Incident Response Plan

If a security incident occurs:

### Immediate Actions (0-24 hours)
1. Assess the severity
2. Contain the issue (take offline if needed)
3. Notify maintainers
4. Begin investigation

### Short Term (24-72 hours)
1. Develop and test fix
2. Prepare disclosure
3. Notify affected users (if any)
4. Deploy fix

### Long Term (1-2 weeks)
1. Post-mortem analysis
2. Update security practices
3. Document lessons learned
4. Update this document

---

## Compliance

### Current Compliance Status

- **GDPR** - Minimal compliance needed (no user data collected)
- **CCPA** - Minimal compliance needed (no user data collected)
- **COPPA** - Not collecting data from children
- **Accessibility** - Working towards WCAG 2.1 Level AA

### Mental Health Content

Special considerations:
- Game includes mental health disorder information
- Content is for educational/entertainment purposes only
- Includes disclaimers about seeking professional help
- Avoids stigmatizing language
- Based on DSM-5 diagnostic criteria

---

## Security Roadmap

### Near Term (v0.3-0.5)
- [ ] Implement Content Security Policy
- [ ] Add security headers to deployment
- [ ] Regular dependency audits
- [ ] Code security scanning

### Medium Term (v0.6-1.0)
- [ ] Security testing before MVP release
- [ ] Third-party security audit (if budget allows)
- [ ] Implement rate limiting (if backend added)
- [ ] Add integrity checks for game files

### Long Term (Post-MVP)
- [ ] Bug bounty program
- [ ] Regular penetration testing
- [ ] Security training for contributors
- [ ] Automated security scanning in CI/CD

---

## Resources

### Security Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency vulnerability scanning
- [Snyk](https://snyk.io/) - Security scanning
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Common vulnerabilities

### Guidelines
- [React Security Best Practices](https://react.dev/reference/react-dom/components/common#security-considerations)
- [Vite Security](https://vitejs.dev/guide/build.html#advanced-base-options)
- [Tauri Security](https://tauri.app/v1/guides/security/)

---

## Questions?

For security-related questions:
- Open a GitHub Discussion (for general questions)
- Email maintainers (for vulnerability reports)
- Review this document for common issues

---

**Remember:** Security is everyone's responsibility. When in doubt, ask!
