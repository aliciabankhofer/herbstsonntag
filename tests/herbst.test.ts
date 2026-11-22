import { expect, test } from 'claude-code/testing'

test('/herbst gives a three-line plan in German, and English on request', async $ => {
  const de = await $.command.run({ command: 'herbst', args: '' } as never)
  expect(de.text).toContain('Dein Herbstsonntag')
  expect(de.text?.split('\n').filter(l => l.startsWith('• ')).length).toBe(3)
  const en = await $.command.run({ command: 'herbst', args: 'en' } as never)
  expect(en.text).toContain('Your autumn Sunday')
})
