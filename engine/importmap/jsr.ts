const JSR_PARSE_REGEX = /^jsr:(\/?\@[^/]+\/[^@/]+|\/?[^@/]+)(?:\@([^/]+))?(.*)/;
const parseSpecifier = (url: string) => {
  return {
    name() {
      const [, name] = url.match(JSR_PARSE_REGEX)!;
      return name;
    },
    version() {
      const [, , version] = url.match(JSR_PARSE_REGEX)!;
      if (version === null) {
        throw Error(`Unable to find version in ${url}`);
      }
      return version.startsWith("^") ? version.slice(1) : version;
    },
    files(): string {
      const [, _, __, files] = url.match(JSR_PARSE_REGEX)!;
      return `.${files ?? ""}`;
    },
  };
};
export interface PackageMeta {
  exports: Record<string, string>;
}
const cachedJsrMeta = new Map<string, Promise<PackageMeta>>();
const fetchMetaExports = (
  packg: string,
  version: string,
): Promise<PackageMeta> => {
  const key = `${packg}/${version}`;
  if (cachedJsrMeta.has(key)) {
    return cachedJsrMeta.get(key)!;
  }
  const packageMetaPromise = fetch(
    `https://jsr.io/${packg}/${version}_meta.json`,
  ).then(
    (meta) => meta.json() as Promise<PackageMeta>,
    // there are other fields that doesn't need to be cached as they are very large.
  ).then(({ exports }) => {
    return { exports };
  });
  cachedJsrMeta.set(key, packageMetaPromise);
  packageMetaPromise.catch((_err) => {
    cachedJsrMeta.delete(key);
  });
  return packageMetaPromise;
};
export const resolveJsrSpecifier = async (specifier: string) => {
  if (!specifier.startsWith("jsr:")) {
    return specifier;
  }
  const jsr = parseSpecifier(specifier);

  const [
    name,
    version,
    files,
  ] = [jsr.name(), jsr.version(), jsr.files()];
  const { exports } = await fetchMetaExports(name, version);
  return `https://jsr.io/${name}/${version}${exports[files]?.slice(1) ?? ""}`;
};
