import { blockedPatterns } from '../lib/blocked-domains';

describe('blockedPatterns', () => {
  it('contains known malicious domains', () => {
    expect(blockedPatterns.domains).toEqual(
      expect.arrayContaining(['malicious-site.com', 'spam-domain.com'])
    );
  });

  it('contains phishing domains', () => {
    expect(blockedPatterns.domains).toEqual(
      expect.arrayContaining(['phishing-example.com'])
    );
  });

  it('includes blocked keywords', () => {
    expect(blockedPatterns.keywords).toEqual(
      expect.arrayContaining(['porn', 'xxx', 'hack'])
    );
  });

  it('lists blocked TLDs', () => {
    expect(blockedPatterns.tlds).toEqual(
      expect.arrayContaining(['.xxx', '.sex', '.adult'])
    );
  });
});
