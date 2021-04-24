export function joinClassNames(...classNames: string[]): string {
  return classNames.filter(className => className !== undefined).join(' ');
}
