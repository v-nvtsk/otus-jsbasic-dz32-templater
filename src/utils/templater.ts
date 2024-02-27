function getItemData(obj: object, key: string): any {
  const keys = key.split(".");
  let data = obj;
  let i = 0;
  while (i < keys.length) {
    const k = keys[i];

    if ((data as Record<string, any>)[k]) {
      data = (data as Record<string, any>)[k];
      // }

      // if (data[k]) {
      //   data = data[k];
    } else {
      return undefined;
    }
    i += 1;
  }

  return data;
}

export function template<T>(tpl: string, data: { [key: string]: T }): string {
  let str: string = tpl;

  // Handle "loop" matches
  // https://regex101.com/r/nsIjjC/1
  const loopMatches = Array.from(tpl.matchAll(/\{\{for (\w+) as (\w+)\}\}([\s\S]+?)\{\{endfor\}\}/g));
  loopMatches.forEach((match) => {
    const items = match[1];
    const item = match[2];
    const subTpl = match[3];
    const iterable: unknown[] = (data as { [key: string]: any })[items] || [];
    let newContent = "";
    iterable.forEach((el, index) => {
      const isLast = index === iterable.length - 1;
      const isNotLast = index !== iterable.length - 1;
      const isFirst = index === 0;
      const isNotFirst = index !== 0;
      newContent += template(subTpl, { ...data, [item]: el, index, isFirst, isLast, isNotFirst, isNotLast });
    });
    str = str.replace(match[0], newContent);
  });

  // Handle "if" matches
  // https://regex101.com/r/nsIjjC/1
  const ifMatches = Array.from(tpl.matchAll(/\{\{if (\w+)\}\}([\s\S]+?)\{\{endif\}\}/g));
  ifMatches.forEach((match) => {
    const key = match[1];
    const subTpl = match[2];
    let condition: unknown = data[key];
    if (key.includes(".")) condition = getItemData(data, key);
    if (condition !== undefined && condition) {
      str = str.replace(match[0], subTpl);
    } else {
      str = str.replace(match[0], "");
    }
  });

  // Handle "pattern" matches
  // https://regex101.com/r/nsIjjC/1
  const patternMatches = Array.from(tpl.matchAll(/\{\{((\w+)(\.?\w+)*)\}\}/g));
  patternMatches.forEach((match) => {
    const key = match[1];
    let itemData: string = "";
    if (data[key] !== undefined) itemData = String(data[key]);
    if (key.includes(".")) itemData = getItemData(data, key);
    if (itemData !== undefined && itemData) {
      str = str.replace(match[0], itemData);
    } else {
      str = str.replace(match[0], itemData || "");
    }
  });
  return str;
}
