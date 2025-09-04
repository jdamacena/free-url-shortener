import { cn } from '../lib/utils';

describe('cn utility', () => {
  it('merges multiple class names into one string', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('p-2 p-4', 'm-1 m-3')).toBe('p-4 m-3');
  });

  it('handles falsy values gracefully', () => {
    expect(cn('foo', false && 'bar', undefined, 'baz')).toBe('foo baz');
  });
});
