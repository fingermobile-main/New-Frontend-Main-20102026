const corporateGovernanceService = require('../../services/corporateGovernanceService');

describe('Corporate Governance Engine & 18 Executive Roles Unit Tests', () => {
  beforeEach(() => {
    corporateGovernanceService.resetForTesting();
  });

  test('should initialize all 18 core Executive Leadership Roles accurately', () => {
    const roles = corporateGovernanceService.getRoles();
    expect(roles).toHaveLength(18);

    // Verify Role 1: Group Company Secretary
    const role1 = corporateGovernanceService.getRoleById('ROLE-01');
    expect(role1).toBeDefined();
    expect(role1.title).toBe('Group Company Secretary');
    expect(role1.designatedOfficer).toBe('Dr. A. E. Okoye');
    expect(role1.subOffices).toHaveLength(3);
    expect(role1.subOffices[0].name).toBe('Board Secretariat & Governance Office');

    // Verify Role 3: Group CFO & Fiscal Policy (Root Protected for Mrs. Mbah Eunice Emonena)
    const role3 = corporateGovernanceService.getRoleById('ROLE-03');
    expect(role3).toBeDefined();
    expect(role3.title).toBe('Group Chief Finance Officer and Fiscal Policy');
    expect(role3.isRootProtected).toBe(true);
    expect(role3.designatedOfficer).toContain('Mrs. Mbah Eunice Emonena');

    // Verify Role 18: Executive Director, Blockchain & Infinity Coin
    const role18 = corporateGovernanceService.getRoleById('ROLE-18');
    expect(role18).toBeDefined();
    expect(role18.title).toBe('Executive Director, Blockchain and Infinity Coin');
    expect(role18.raciCode).toBe('R18');
  });

  test('should prevent deletion of core blueprint roles and root-protected roles', () => {
    // Attempt deleting Role 3 (Root Protected)
    expect(() => {
      corporateGovernanceService.deleteRole('ROLE-03');
    }).toThrow(/Cannot delete protected Root Authority Role/);

    // Attempt deleting Role 1 (Core Statutory Blueprint Role)
    expect(() => {
      corporateGovernanceService.deleteRole('ROLE-01');
    }).toThrow(/Cannot delete core statutory blueprint Role/);
  });

  test('should allow creating, updating, and deleting custom corporate roles', () => {
    const customRole = corporateGovernanceService.createRole({
      title: 'Group Head, Artificial General Intelligence Labs',
      department: 'Sentient Research & Neural Enclaves',
      designatedOfficer: 'Dr. Ada Lovelace',
      clearanceLevel: 'Tier 3 (ED / Group Head)',
      primaryMandate: 'Directs autonomous AGI research and heuristic policy alignment.'
    });

    expect(customRole.id).toBeDefined();
    expect(customRole.roleNumber).toBe(19);
    expect(corporateGovernanceService.getRoles()).toHaveLength(19);

    // Update custom role
    const updated = corporateGovernanceService.updateRole(customRole.id, {
      designatedOfficer: 'Dr. Alan Turing'
    });
    expect(updated.designatedOfficer).toBe('Dr. Alan Turing');

    // Delete custom role
    const deleteResult = corporateGovernanceService.deleteRole(customRole.id);
    expect(deleteResult.success).toBe(true);
    expect(corporateGovernanceService.getRoles()).toHaveLength(18);
  });

  test('should manage sub-offices and functional units with allocated resources', () => {
    const subOffice = corporateGovernanceService.addSubOffice('ROLE-02', {
      name: 'Anti-Fraud & Synthetic Identity Recovery Unit',
      unitType: 'Functional Unit',
      rolesAndResponsibilities: 'Forensic telemetry tracking on credit line defaults.',
      resources: {
        humanTalent: 'Fraud detection engineers',
        techTools: 'Biometric AI matchers',
        capitalBudget: '$150,000 investigative reserve'
      }
    });

    expect(subOffice.id).toBeDefined();
    const role2 = corporateGovernanceService.getRoleById('ROLE-02');
    expect(role2.subOffices).toHaveLength(4);

    // Update sub-office
    const updatedUnit = corporateGovernanceService.updateSubOffice('ROLE-02', subOffice.id, {
      name: 'Anti-Fraud & Synthetic Identity Recovery Desk'
    });
    expect(updatedUnit.name).toBe('Anti-Fraud & Synthetic Identity Recovery Desk');

    // Delete sub-office
    corporateGovernanceService.deleteSubOffice('ROLE-02', subOffice.id);
    expect(corporateGovernanceService.getRoleById('ROLE-02').subOffices).toHaveLength(3);
  });

  test('should provide complete Technical DoA, RACI Matrix, and SoD Safeguards', () => {
    const doa = corporateGovernanceService.getDoaMatrix();
    expect(doa.length).toBeGreaterThanOrEqual(19);
    const budgetCapex = doa.find(d => d.operationalAction === 'Budgeted Capital Expenditure');
    expect(budgetCapex.tier4MaxUsd).toBe(25000);
    expect(budgetCapex.tier3MaxUsd).toBe(250000);
    expect(budgetCapex.tier2MaxUsd).toBe(1000000);

    const raci = corporateGovernanceService.getRaciMatrix();
    expect(raci.length).toBe(12);
    const budgetCreation = raci.find(r => r.activityName.includes('Annual Operating'));
    expect(budgetCreation.assignments['R3']).toBe('A'); // CFO is Accountable
    expect(budgetCreation.assignments['R12']).toBe('R'); // Ops/PMO is Responsible

    const sod = corporateGovernanceService.getSodSafeguards();
    expect(sod).toHaveLength(4);
    expect(sod[0].title).toBe('Internal Audit Independence Rule');
    expect(sod[1].title).toContain('Dual-Key Digital Asset Authorization');
  });

  test('should strictly enforce RBAC portfolio assignment permissions to SuperAdmin & Co-Founder only', () => {
    // Unauthorized attempt by non-root user
    expect(() => {
      corporateGovernanceService.assignMemberToRole(
        'mem-099',
        'ROLE-13',
        'U-13-A',
        'unauthorized_random_staff'
      );
    }).toThrow(/UNAUTHORIZED_ACTION: Only SuperAdmin Founder/);

    // Authorized assignment by SuperAdmin Founder Mr. Mbah Israel Obinna
    const assignmentFounder = corporateGovernanceService.assignMemberToRole(
      'mem-101',
      'ROLE-13',
      'U-13-A',
      'owner_mbah_israel_obinna',
      { name: 'Dr. Emeka Nnamdi', email: 'emeka.treasury@fingermobileprotocol.com' }
    );

    expect(assignmentFounder.appointmentCredentialId).toBeDefined();
    expect(assignmentFounder.roleTitle).toBe('Executive Director, International Treasury');
    expect(assignmentFounder.subOfficeName).toBe('FX Hedging & Structured Derivatives Desk');
    expect(assignmentFounder.assignedBy).toBe('owner_mbah_israel_obinna');

    // Authorized assignment by Co-Founder Mrs. Mbah Eunice Emonena
    const assignmentCoFounder = corporateGovernanceService.assignMemberToRole(
      'mem-102',
      'ROLE-06',
      'U-06-B',
      'eunicembah@gmail.com',
      { name: 'Amina Yusuf', email: 'amina.compliance@fingermobileprotocol.com' }
    );

    expect(assignmentCoFounder.appointmentCredentialId).toBeDefined();
    expect(assignmentCoFounder.roleTitle).toBe('Group Chief, Policy Compliance Officer');
    expect(assignmentCoFounder.assignedBy).toBe('eunicembah@gmail.com');

    // Verify member assignments registry
    const allAssignments = corporateGovernanceService.getMemberAssignments();
    expect(allAssignments).toHaveLength(2);

    // Verify WORM audit logs
    const auditLogs = corporateGovernanceService.getAuditLogs();
    expect(auditLogs.length).toBeGreaterThanOrEqual(2);
    expect(auditLogs[0].action).toBe('ASSIGN_MEMBER_PORTFOLIO');
  });
});
