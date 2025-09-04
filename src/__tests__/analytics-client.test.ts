import { trackFrontendEvent } from '../lib/analytics/client';

describe('trackFrontendEvent', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.NODE_ENV = 'development';
  });

  it('sends event to /api/analytics with correct payload', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    const event = { type: 'test_event', value: 123 };

    await trackFrontendEvent(event);

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/analytics',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
    );
  });

  it('logs a warning on non-ok response in development', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500, text: async () => 'error' });
    console.warn = jest.fn();

    await trackFrontendEvent({ type: 'err' });

    expect(console.warn).toHaveBeenCalledWith('Analytics event failed:', 500, 'error');
  });

  it('catches fetch errors and logs in development', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network')); 
    console.error = jest.fn();

  await expect(trackFrontendEvent({ type: 'fail' })).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('Analytics tracking error:', expect.any(Error));
  });
});
