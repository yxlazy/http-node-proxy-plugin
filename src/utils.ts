export const isHttpProtocol = (protocol: string) => {
  return /^http[s]?\:$/.test(protocol);
};
