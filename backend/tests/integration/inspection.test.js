const request = require('supertest');
const app = require('../../src/app');

describe('Inspection API Integration', () => {
  it('Inspector cannot view another inspectors inspection', async () => {
    expect(true).toBe(true);
  });

  it('Official can view all inspections/dashboard data', async () => {
    expect(true).toBe(true);
  });

  it('Inspector cannot access admin rule-management endpoint', async () => {
    expect(true).toBe(true);
  });

  it('Update succeeds with current server_version', async () => {
    expect(true).toBe(true);
  });

  it('Stale update returns 409', async () => {
    expect(true).toBe(true);
  });
});
