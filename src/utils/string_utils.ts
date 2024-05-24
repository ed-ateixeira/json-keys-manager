function uncapitalize(string: string) {
  return string[0].toLowerCase() + string.substring(1);
}

export const StringUtils = { uncapitalize };
