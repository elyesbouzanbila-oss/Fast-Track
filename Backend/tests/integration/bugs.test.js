/**
 * Bug report integration tests.
 */

const request = require('supertest');

describe('Bug Reports', () => {
  let app;

  beforeAll(async () => {
    const module = require('../../src/app');
    app = module.app;
    await module.init();
  });

  it('returns the bug table payload', async () => {
    const res = await request(app).get('/api/bugs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('requires auth to create a bug report', async () => {
    const res = await request(app).post('/api/bugs').send({
      category: 'routing',
      impact: 'medium',
      title: 'Example bug',
      steps: '1. Open page\n2. Click button',
      expected_behavior: 'It should work',
      actual_behavior: 'It does not work',
    });

    expect(res.status).toBe(401);
  });

  it('creates and lists a bug report', async () => {
    const email = `bug-${Date.now()}@example.com`;
    const signup = await request(app).post('/api/auth/register').send({
      name: 'Bug Tester',
      email,
      password: 'ValidPass123!',
    });

    expect(signup.status).toBe(201);
    const { token } = signup.body.data;

    const create = await request(app)
      .post('/api/bugs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: 'map display',
        impact: 'high',
        title: 'Bug table test entry',
        steps: '1. Open the map\n2. Trigger the bug',
        expected_behavior: 'Bug should not happen',
        actual_behavior: 'Bug happens',
        extra_details: 'Created from automated test',
        source_page: '/pages/reclamation.html',
      });

    expect(create.status).toBe(201);
    expect(create.body.data.title).toBe('Bug table test entry');

    const list = await request(app).get('/api/bugs');
    expect(list.status).toBe(200);
    expect(list.body.data.some((bug) => bug.title === 'Bug table test entry')).toBe(true);
  });
});