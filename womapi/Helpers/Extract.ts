export function Extract(instance: any, ...properties: string[]) {
  return properties.reduce<any>((result, property) => {
    if (instance[property]) {
      result[property] = instance[property];
    }
    return result;
  }, {});
}
